// shared/lib/get-stop-list.ts
import { prisma } from '@/prisma/prisma-client';

export async function getStopList() {
    return prisma.stopList.findMany();
}