//app/(root)/product/[id]/page.tsx
import { Container, ProductForm } from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params: { id } }: { params: { id: string } }) {
    const product = await prisma.product.findFirst({
        where: { id: Number(id) },
        include: {
            ingredients: true,
            category: {
                include: {
                    products: {
                        include: {
                            items: true,
                        },
                    },
                },
            },
            items: true,
        },
    });

    if (!product) {
        return notFound();
    }

    return (
        <Container className="flex flex-col my-6 sm:my-8 lg:my-10 px-0 sm:px-4">
            <div className="min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-160px)]"> {/* Учитываем высоту header */}
                <ProductForm product={product} className="min-h-full" />
            </div>
        </Container>
    );
}