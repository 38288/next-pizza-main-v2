// app/actions.ts
'use server';

import { prisma } from '@/prisma/prisma-client';
import { CheckoutFormValues } from '@/shared/constants';
import { sendTelegramMessage } from '@/shared/lib/send-telegram-message';
import { getUserSession } from '@/shared/lib/get-user-session';
import { OrderStatus, Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { cookies } from 'next/headers';

export async function createOrder(data: CheckoutFormValues) {
    try {
        const cookieStore = cookies();
        const cartToken = cookieStore.get('cartToken')?.value;

        if (!cartToken) {
            throw new Error('Cart token not found');
        }

        /* Находим корзину по токену */
        const userCart = await prisma.cart.findFirst({
            include: {
                user: true,
                items: {
                    include: {
                        ingredients: true,
                        productItem: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
            where: {
                token: cartToken,
            },
        });

        if (!userCart) {
            throw new Error('Cart not found');
        }

        if (userCart?.totalAmount === 0) {
            throw new Error('Cart is empty');
        }

        /* Создаем заказ */
        const orderData: any = {
            token: cartToken,
            fullName: data.firstName,
            phone: data.phone,
            address: data.address || '',
            city: data.city,
            comment: data.comment,
            totalAmount: userCart.totalAmount,
            status: OrderStatus.SUCCEEDED,
            items: JSON.stringify(userCart.items),
        };

        // Добавляем опциональные поля если они есть в модели
        if (data.deliveryType) {
            orderData.deliveryType = data.deliveryType;
        }

        if (data.paymentMethod) {
            orderData.paymentMethod = data.paymentMethod;
        }

        const order = await prisma.order.create({
            data: orderData,
        });

        /* Очищаем корзину */
        await prisma.cart.update({
            where: {
                id: userCart.id,
            },
            data: {
                totalAmount: 0,
            },
        });

        await prisma.cartItem.deleteMany({
            where: {
                cartId: userCart.id,
            },
        });

        /* Отправляем уведомление в Telegram с обновленной информацией */
        await sendOrderToTelegram(order, userCart.items, data);

        console.log(`✅ Заказ #${order.id} создан для города: ${data.city}`);
        console.log(`📦 Тип доставки: ${data.deliveryType || 'не указан'}`);
        console.log(`💳 Способ оплаты: ${data.paymentMethod || 'не указан'}`);

        return {
            orderId: order.id,
            success: true,
            redirectUrl: '/'
        };

    } catch (err) {
        console.log('[CreateOrder] Server error', err);
        throw err;
    }
}

// Функция для форматирования сообщения в Telegram
async function sendOrderToTelegram(order: any, cartItems: any[], formData: CheckoutFormValues) {
    try {
        // Форматируем товары
        const itemsText = cartItems.map(item => {
            const productName = item.productItem?.product?.name || 'Товар';
            const size = item.productItem?.size;

            // Определяем тип мяса по размеру
            const meatMapping: { [key: number]: string } = {
                20: "Свинина",
                30: "Курица",
                40: "Сосиски"
            };
            const meat = meatMapping[size] || '';

            // Формируем строку с мясом
            const meatInfo = meat ? ` (${meat})` : '';

            const ingredients = item.ingredients?.length > 0
                ? `\n   🧂 Допы: ${item.ingredients.map((ing: any) => ing.name).join(', ')}`
                : '';

            return `• ${productName}${meatInfo} - ${item.quantity}шт.${ingredients}`;
        }).join('\n');

        // Добавляем информацию о доставке и оплате
        const deliveryInfo = formData.deliveryType ?
            `🚚 <b>Тип доставки:</b> ${formData.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}\n` : '';

        const paymentInfo = formData.paymentMethod ?
            `💳 <b>Способ оплаты:</b> ${formData.paymentMethod === 'cash' ? 'Наличные' : 'Онлайн'}\n` : '';

        // Создаем сообщение
        const message = `
🆕 <b>НОВЫЙ ЗАКАЗ #${order.id}</b>

👤 <b>Клиент:</b> ${formData.firstName}
📞 <b>Телефон:</b> ${formData.phone}
🏙️ <b>Город:</b> ${formData.city}
📍 <b>Адрес:</b> ${formData.address || 'Не указан'}
${deliveryInfo}${paymentInfo}💬 <b>Комментарий:</b> ${formData.comment || 'Нет'}

🛒 <b>Состав заказа:</b>
${itemsText}

💰 <b>Итого:</b> ${order.totalAmount} ₽
⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
        `.trim();

        // Отправляем в Telegram
        await sendTelegramMessage(message);

    } catch (error) {
        console.error('Error sending order to Telegram:', error);
    }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
    try {
        const currentUser = await getUserSession();

        if (!currentUser) {
            throw new Error('Пользователь не найден');
        }

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(currentUser.id),
            },
        });

        await prisma.user.update({
            where: {
                id: Number(currentUser.id),
            },
            data: {
                fullName: body.fullName,
                email: body.email,
                password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
            },
        });
    } catch (err) {
        console.log('Error [UPDATE_USER]', err);
        throw err;
    }
}

export async function registerUser(body: Prisma.UserCreateInput) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
            },
        });

        if (user) {
            if (!user.verified) {
                throw new Error('Почта не подтверждена');
            }

            throw new Error('Пользователь уже существует');
        }

        const createdUser = await prisma.user.create({
            data: {
                fullName: body.fullName,
                email: body.email,
                password: hashSync(body.password, 10),
            },
        });

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.verificationCode.create({
            data: {
                code,
                userId: createdUser.id,
            },
        });

        console.log(`Код подтверждения для ${createdUser.email}: ${code}`);

    } catch (err) {
        console.log('Error [CREATE_USER]', err);
        throw err;
    }
}