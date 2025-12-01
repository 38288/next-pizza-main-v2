// types/next-auth.d.ts
import NextAuth from 'next-auth';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
    interface User {
        id: string;
        role: UserRole;
        phone?: string;
    }

    interface Session {
        user: {
            id: string;
            role: UserRole;
            phone?: string;
            email?: string;
            name?: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: UserRole;
        phone?: string;
    }
}
