import { AuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '@/prisma/prisma-client';
import { compare, hashSync } from 'bcrypt';
import { UserRole } from '@prisma/client';

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: 'USER' as UserRole,
                };
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: 'USER' as UserRole,
                };
            },
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                phone: { label: 'Телефон', type: 'text' },
                password: { label: 'Пароль', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.password) {
                    throw new Error('Введите телефон и пароль');
                }

                const findUser = await prisma.user.findFirst({
                    where: {
                        phone: credentials.phone,
                    },
                });

                if (!findUser) {
                    throw new Error('Пользователь с таким телефоном не найден');
                }

                const isPasswordValid = await compare(credentials.password, findUser.password);

                if (!isPasswordValid) {
                    throw new Error('Неверный пароль');
                }

                if (!findUser.verified) {
                    throw new Error('Телефон не подтвержден');
                }

                return {
                    id: findUser.id.toString(),
                    email: findUser.email,
                    phone: findUser.phone,
                    name: findUser.fullName,
                    role: findUser.role,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account?.provider === 'credentials') {
                    return true;
                }

                // Для OAuth провайдеров (Google, GitHub) проверяем по email
                if (!user.email) {
                    return false;
                }

                const findUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { provider: account?.provider, providerId: account?.providerAccountId },
                            { email: user.email },
                        ],
                    },
                });

                if (findUser) {
                    // Обновляем информацию о провайдере если пользователь найден
                    await prisma.user.update({
                        where: {
                            id: findUser.id,
                        },
                        data: {
                            provider: account?.provider,
                            providerId: account?.providerAccountId,
                        },
                    });

                    return true;
                }

                // Создаем нового пользователя для OAuth
                await prisma.user.create({
                    data: {
                        email: user.email,
                        phone: '', // Генерируем временный телефон для OAuth пользователей
                        fullName: user.name || 'User #' + user.id,
                        password: hashSync(user.id.toString() + Date.now(), 10),
                        verified: new Date(),
                        provider: account?.provider,
                        providerId: account?.providerAccountId,
                    },
                });

                return true;
            } catch (error) {
                console.error('Error [SIGNIN]', error);
                return false;
            }
        },
        async jwt({ token, user }) {
            // Если это первый вход через credentials, у пользователя будет телефон
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    name: user.name,
                    role: user.role,
                };
            }

            // Для существующего токена ищем пользователя по email или phone
            if (token.email) {
                const findUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: token.email as string },
                            { phone: token.phone as string },
                        ],
                    },
                });

                if (findUser) {
                    token.id = String(findUser.id);
                    token.email = findUser.email;
                    token.phone = findUser.phone;
                    token.name = findUser.fullName;
                    token.role = findUser.role;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as UserRole;
                session.user.phone = token.phone as string;
                session.user.email = token.email as string;
            }

            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
    },
};
