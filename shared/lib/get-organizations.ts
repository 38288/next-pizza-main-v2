// shared/lib/get-organizations.ts
import { prisma } from '@/prisma/prisma-client';

export async function getOrganizations() {
    try {
        const organizations = await prisma.organization.findMany({
            orderBy: {
                code: 'asc'
            }
        });

        return organizations.map(org => ({
            id: org.id,
            externalId: org.externalId,
            name: org.name,
            code: org.code
        }));
    } catch (error) {
        console.error('Error fetching organizations:', error);
        return [];
    }
}