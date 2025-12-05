// app/actions.ts
'use server';

import { prisma } from '@/prisma/prisma-client';
import { CheckoutFormValues } from '@/shared/constants';
import { sendTelegramMessage as sendTelegram } from '@/shared/lib/send-telegram-message';
import { getUserSession } from '@/shared/lib/get-user-session';
import { OrderStatus } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { cookies } from 'next/headers';

export async function createOrder(data: CheckoutFormValues & { cityName?: string }) {
    console.log('🔵 ========== НАЧАЛО СОЗДАНИЯ ЗАКАЗА ==========');

    try {
        // 1. Получаем cookies
        const cookieStore = await cookies();
        const cartToken = cookieStore.get('cartToken')?.value || undefined;

        console.log('📦 Данные заказа:', JSON.stringify(data, null, 2));
        console.log('🔑 Cart Token:', cartToken || 'НЕ НАЙДЕН');

        if (!cartToken) {
            throw new Error('Cart token not found');
        }

        // 2. Находим корзину
        console.log('🔍 Поиск корзины...');
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

        console.log('🛒 Корзина найдена:', userCart ? `✅ (${userCart.items.length} товаров)` : '❌ НЕ НАЙДЕНА');
        console.log('💰 Сумма корзины:', userCart?.totalAmount || 0);

        if (!userCart) {
            throw new Error('Cart not found');
        }

        if (userCart.totalAmount === 0) {
            throw new Error('Cart is empty');
        }

        // 3. Получаем название города
        let cityName = data.cityName || undefined;
        if (!cityName) {
            const city = await getCityNameById(data.city);
            cityName = city || undefined;
        }

        console.log('🏙️ Название города:', cityName || 'Не указано');

        // 4. Создаем заказ
        // В функции createOrder обновите создание заказа:
        const orderData = {
            token: cartToken,
            fullName: data.firstName,
            email: null,
            phone: data.phone,
            address: data.address || '',
            city: data.city,
            cityName: cityName || null, // Используем новое поле
            comment: data.comment || null,
            deliveryType: data.deliveryType,
            paymentMethod: data.paymentMethod,
            totalAmount: userCart.totalAmount,
            status: OrderStatus.SUCCEEDED,
            items: JSON.stringify(userCart.items),
        };

        const order = await prisma.order.create({
            data: orderData,
        });

        console.log('✅ Заказ создан в БД, ID:', order.id);

        // 5. Очищаем корзину
        console.log('🧹 Очистка корзины...');
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

        console.log('✅ Корзина очищена');

        // 6. Отправляем в Telegram
        console.log('📤 Отправка уведомления в Telegram...');
        await sendOrderToTelegram(order, userCart.items, data, cityName || '', sendTelegram);

        console.log('🎉 ========== ЗАКАЗ УСПЕШНО ОФОРМЛЕН ==========');
        console.log(`📋 Номер заказа: #${order.id}`);
        console.log(`🏙️ Город: ${cityName || data.city}`);
        console.log(`🚚 Тип: ${data.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}`);
        console.log(`💳 Оплата: ${data.paymentMethod === 'cash' ? 'Наличные' : 'Онлайн'}`);
        console.log(`💰 Сумма: ${order.totalAmount} ₽`);

        return {
            orderId: order.id,
            success: true,
            redirectUrl: '/'
        };

    } catch (err) {
        console.error('❌ ========== ОШИБКА ПРИ СОЗДАНИИ ЗАКАЗА ==========');
        console.error('Error details:', err);
        throw err;
    }
}

// Вспомогательная функция для получения названия города по ID
async function getCityNameById(cityId: string): Promise<string | null> {
    try {
        const cities = [
            { id: "5a5963df-4e9a-45d2-aa7b-2e2a1a5e704d", name: "Гикалова", code: "3" },
            { id: "8740e9b6-ff6e-481e-b694-dc020cdf7bc4", name: "Парковая", code: "2" },
            { id: "8e57e25d-8c9c-486d-b41d-ac96a2c1f4cc", name: "Сибирский тракт", code: "1" }
        ];

        const city = cities.find(c => c.id === cityId);
        return city ? city.name : null;
    } catch (error) {
        console.error('Ошибка при получении названия города:', error);
        return null;
    }
}

// Функция для отправки уведомления в Telegram
async function sendOrderToTelegram(
    order: any,
    cartItems: any[],
    formData: CheckoutFormValues,
    cityName: string, // Теперь строка, не может быть null/undefined
    sendTelegramFunction: (message: string) => Promise<any>
) {
    try {
        console.log('📝 Формирование сообщения для Telegram...');

        // Форматируем товары
        const itemsText = cartItems.map((item, index) => {
            const productName = item.productItem?.product?.name || 'Товар';
            const size = item.productItem?.size;

            // Определяем тип мяса по размеру
            const meatMapping: { [key: number]: string } = {
                20: "Свинина",
                30: "Курица",
                40: "Сосиски"
            };
            const meat = meatMapping[size] || '';
            const meatInfo = meat ? ` (${meat})` : '';

            const ingredients = item.ingredients?.length > 0
                ? `\n   🧂 Допы: ${item.ingredients.map((ing: any) => ing.name).join(', ')}`
                : '';

            return `${index + 1}. ${productName}${meatInfo} - ${item.quantity}шт.${ingredients}`;
        }).join('\n');

        // Информация о доставке
        const deliveryText = formData.deliveryType === 'delivery'
            ? `🚚 <b>ДОСТАВКА</b>\n📍 <b>Адрес:</b> ${formData.address || 'Не указан'}\n`
            : `🏪 <b>САМОВЫВОЗ</b>\n`;

        // Информация об оплате
        const paymentText = formData.paymentMethod === 'cash'
            ? '💵 <b>ОПЛАТА ПРИ ПОЛУЧЕНИИ</b>\n'
            : '💳 <b>ОНЛАЙН ОПЛАТА</b>\n';

        // Комментарий
        const commentText = formData.comment
            ? `💬 <b>Комментарий:</b>\n${formData.comment}\n`
            : '💬 <b>Комментарий:</b> Нет\n';

        // Создаем сообщение
        const message = `
🆕 <b>НОВЫЙ ЗАКАЗ #${order.id}</b>

👤 <b>КЛИЕНТ:</b> ${formData.firstName}
📞 <b>ТЕЛЕФОН:</b> <code>${formData.phone}</code>
🏙️ <b>ФИЛИАЛ:</b> ${cityName || 'Не указан'}

${deliveryText}${paymentText}${commentText}
🛒 <b>СОСТАВ ЗАКАЗА:</b>
${itemsText}

💰 <b>ИТОГО:</b> <b>${order.totalAmount} ₽</b>
⏰ <b>ВРЕМЯ:</b> ${new Date().toLocaleString('ru-RU')}
----------------------------
<b>ID заказа:</b> ${order.id}
<b>ID города:</b> ${formData.city}
<b>Тип:</b> ${formData.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}
<b>Оплата:</b> ${formData.paymentMethod === 'cash' ? 'Наличные' : 'Онлайн'}
        `.trim();

        console.log('📄 Сообщение для Telegram (первые 500 символов):');
        console.log(message.substring(0, 500) + (message.length > 500 ? '...' : ''));

        // Отправляем в Telegram
        console.log('📤 Вызов функции sendTelegram...');
        const telegramResult = await sendTelegramFunction(message);

        if (telegramResult) {
            console.log('✅ Уведомление успешно отправлено в Telegram');
            console.log('📨 Ответ Telegram:', telegramResult);
        } else {
            console.warn('⚠️ Функция sendTelegram вернула null/undefined');
        }

    } catch (error) {
        console.error('❌ Ошибка при формировании/отправке сообщения в Telegram:', error);
        // Не прерываем создание заказа из-за ошибки Telegram
    }
}

// Остальные функции остаются без изменений
export async function updateUserInfo(body: {
    fullName?: string;
    phone?: string;
    password?: string;
}) {
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

        if (!findUser) {
            throw new Error('Пользователь не найден');
        }

        // Проверяем, не занят ли телефон другим пользователем
        if (body.phone && body.phone !== findUser.phone) {
            const phoneExists = await prisma.user.findFirst({
                where: {
                    phone: body.phone,
                    NOT: {
                        id: Number(currentUser.id),
                    },
                },
            });

            if (phoneExists) {
                throw new Error('Этот телефон уже используется другим пользователем');
            }
        }

        const updateData: any = {
            fullName: body.fullName || findUser.fullName,
            phone: body.phone || findUser.phone,
        };

        // Обновляем пароль только если он предоставлен
        if (body.password) {
            updateData.password = hashSync(body.password, 10);
        }

        await prisma.user.update({
            where: {
                id: Number(currentUser.id),
            },
            data: updateData,
        });

        return { success: true };

    } catch (err) {
        console.log('Error [UPDATE_USER]', err);
        throw err;
    }
}

export async function registerUser(body: {
    phone: string;
    fullName: string;
    password: string;
}) {
    try {
        // Проверяем существование пользователя по телефону
        const user = await prisma.user.findFirst({
            where: {
                phone: body.phone,
            },
        });

        if (user) {
            if (!user.verified) {
                throw new Error('Телефон не подтвержден');
            }

            throw new Error('Пользователь с таким телефоном уже существует');
        }

        // Создаем пользователя
        const createdUser = await prisma.user.create({
            data: {
                fullName: body.fullName,
                email: null,
                phone: body.phone,
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

        console.log(`Код подтверждения для ${createdUser.phone}: ${code}`);

    } catch (err) {
        console.log('Error [CREATE_USER]', err);
        throw err;
    }
}