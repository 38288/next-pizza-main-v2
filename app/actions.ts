// app/actions.ts
'use server';

import { prisma } from '@/prisma/prisma-client';
import { CheckoutFormValues } from '@/shared/constants';
import { sendTelegramMessage as sendTelegram } from '@/shared/lib/send-telegram-message';
import { getUserSession } from '@/shared/lib/get-user-session';
import { OrderStatus, User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { cookies } from 'next/headers';

interface OrderItem {
    productItem?: {
        product?: {
            name: string;
        };
        size: number | null; // Изменено: может быть null
    };
    quantity: number;
    ingredients?: Array<{ name: string }>;
}

interface TelegramOrder {
    id: number;
    totalAmount: number;
}

const ORGANIZATIONS_FALLBACK = [
    { externalId: "5a5963df-4e9a-45d2-aa7b-2e2a1a5e704d", name: "Гикалова", code: "3" },
    { externalId: "8740e9b6-ff6e-481e-b694-dc020cdf7bc4", name: "Парковая", code: "2" },
    { externalId: "8e57e25d-8c9c-486d-b41d-ac96a2c1f4cc", name: "Сибирский тракт", code: "1" }
] as const;

const MEAT_MAPPING: Record<number, string> = {
    20: "Свинина",
    30: "Курица",
    40: "Сосиски"
};

export async function createOrder(data: CheckoutFormValues & { cityName?: string }) {
    try {
        const cookieStore = await cookies();
        const cartToken = cookieStore.get('cartToken')?.value;

        if (!cartToken) {
            throw new Error('Cart token not found');
        }

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

        if (userCart.totalAmount === 0) {
            throw new Error('Cart is empty');
        }

        let organizationName = data.cityName || '';

        if (!organizationName) {
            try {
                const organization = await prisma.organization.findUnique({
                    where: { externalId: data.city }
                });
                organizationName = organization?.name || data.city;
            } catch (error) {
                console.log('Failed to fetch organization from DB, using fallback');

                const foundOrganization = ORGANIZATIONS_FALLBACK.find(org => org.externalId === data.city);
                organizationName = foundOrganization ? foundOrganization.name : data.city;
            }
        }

        const orderData = {
            token: cartToken,
            fullName: data.firstName.trim(),
            email: null,
            phone: data.phone.trim(),
            address: data.address?.trim() || '',
            city: data.city,
            cityName: organizationName,
            comment: data.comment?.trim() || null,
            deliveryType: data.deliveryType,
            paymentMethod: data.paymentMethod,
            totalAmount: userCart.totalAmount,
            status: OrderStatus.SUCCEEDED,
            items: JSON.stringify(userCart.items),
        };

        let order;
        try {
            order = await prisma.order.create({
                data: orderData,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isInvalidFieldError = errorMessage.includes('cityName') ||
                errorMessage.includes('does not exist') ||
                errorMessage.includes('Unknown arg');

            if (isInvalidFieldError) {
                const { cityName, ...fallbackOrderData } = orderData;

                console.log('Using fallback order data without cityName field');
                order = await prisma.order.create({
                    data: fallbackOrderData,
                });
            } else {
                throw error;
            }
        }

        await prisma.$transaction([
            prisma.cart.update({
                where: { id: userCart.id },
                data: { totalAmount: 0 },
            }),
            prisma.cartItem.deleteMany({
                where: { cartId: userCart.id },
            }),
        ]);

        await sendOrderToTelegram(order, userCart.items, data, organizationName, sendTelegram);

        return {
            orderId: order.id,
            success: true,
            redirectUrl: '/'
        };

    } catch (error) {
        console.error('Order creation error:', error);

        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
        }

        throw error;
    }
}

async function sendOrderToTelegram(
    order: TelegramOrder,
    cartItems: OrderItem[],
    formData: CheckoutFormValues,
    organizationName: string,
    sendTelegramFunction: (message: string) => Promise<any>
) {
    try {
        const itemsText = cartItems.map((item, index) => {
            const productName = item.productItem?.product?.name || 'Товар';
            const size = item.productItem?.size || 0; // size может быть null, используем 0 по умолчанию
            const meat = MEAT_MAPPING[size] || '';
            const meatInfo = meat ? ` (${meat})` : '';

            const ingredients = item.ingredients && item.ingredients.length > 0
                ? `\n   🧂 Допы: ${item.ingredients.map(ing => ing.name).join(', ')}`
                : '';

            return `${index + 1}. ${productName}${meatInfo} - ${item.quantity}шт.${ingredients}`;
        }).join('\n');

        const isDelivery = formData.deliveryType === 'delivery';
        const isCashPayment = formData.paymentMethod === 'cash';

        const deliveryText = isDelivery
            ? `🚚 <b>ДОСТАВКА</b>\n📍 <b>Адрес:</b> ${formData.address || 'Не указан'}\n`
            : `🏪 <b>САМОВЫВОЗ</b>\n`;

        const paymentText = isCashPayment
            ? '💵 <b>ОПЛАТА ПРИ ПОЛУЧЕНИИ</b>\n'
            : '💳 <b>ОНЛАЙН ОПЛАТА</b>\n';

        const deliveryTypeText = isDelivery ? 'Доставка' : 'Самовывоз';
        const paymentMethodText = isCashPayment ? 'Наличные' : 'Онлайн';

        const commentText = formData.comment
            ? `💬 <b>Комментарий:</b>\n${formData.comment}\n`
            : '💬 <b>Комментарий:</b> Нет\n';

        const now = new Date();
        const moscowTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));

        const message = `
🆕 <b>НОВЫЙ ЗАКАЗ #${order.id}</b>

👤 <b>КЛИЕНТ:</b> ${formData.firstName}
📞 <b>ТЕЛЕФОН:</b> <code>${formData.phone}</code>
🏙️ <b>ФИЛИАЛ:</b> ${organizationName || 'Не указан'}

${deliveryText}${paymentText}${commentText}
🛒 <b>СОСТАВ ЗАКАЗА:</b>
${itemsText}

💰 <b>ИТОГО:</b> <b>${order.totalAmount} ₽</b>
⏰ <b>ВРЕМЯ:</b> ${moscowTime.toLocaleString('ru-RU')}
----------------------------
<b>ID заказа:</b> ${order.id}
<b>ID организации:</b> ${formData.city}
<b>Тип:</b> ${deliveryTypeText}
<b>Оплата:</b> ${paymentMethodText}
    `.trim();

        await sendTelegramFunction(message);
        console.log('✅ Уведомление успешно отправлено в Telegram');

    } catch (error) {
        console.error('Ошибка при отправке сообщения в Telegram:', error);
    }
}

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

        const updateData: Partial<User> = {
            fullName: body.fullName?.trim() || findUser.fullName,
            phone: body.phone?.trim() || findUser.phone,
        };

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
        console.error('Error [UPDATE_USER]', err);
        throw err;
    }
}

export async function registerUser(body: {
    phone: string;
    fullName: string;
    password: string;
}) {
    try {
        const phone = body.phone.trim();
        const fullName = body.fullName.trim();
        const password = body.password;

        const user = await prisma.user.findFirst({
            where: {
                phone: phone,
            },
        });

        if (user) {
            if (!user.verified) {
                throw new Error('Телефон не подтвержден');
            }
            throw new Error('Пользователь с таким телефоном уже существует');
        }

        const createdUser = await prisma.user.create({
            data: {
                fullName: fullName,
                email: null,
                phone: phone,
                password: hashSync(password, 10),
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

        return { success: true, userId: createdUser.id };

    } catch (err) {
        console.error('Error [CREATE_USER]', err);
        throw err;
    }
}