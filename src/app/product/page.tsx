"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Plus } from 'lucide-react';
import Link from 'next/link';

// Reuse types or define them locally for simplicity in this standalone page
interface Product {
    id: number;
    image: string;
    name: string;
    desc: string;
    price: string;
    shopeeUrl: string;
    lazadaUrl: string;
    tiktokUrl: string;
}

const ProductViewContent = () => {
    const searchParams = useSearchParams();
    const data = searchParams.get('data');

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">ไม่พบลิงก์สินค้า</h1>
                <Link href="/" className="text-red-600 font-bold hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} /> กลับไปหน้าหลักเพื่อสร้างลิงก์
                </Link>
            </div>
        );
    }

    let product: Product | null = null;
    try {
        // Decode Base64 data
        const decodedData = JSON.parse(atob(data));
        product = decodedData;
    } catch (e) {
        console.error('Failed to decode product data', e);
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">ข้อมูลสินค้าไม่ถูกต้อง</h1>
                <Link href="/" className="text-red-600 font-bold hover:underline">
                    กลับไปหน้าหลัก
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col group relative">
                    {/* Badge */}
                    <div className="absolute top-6 left-6 z-10 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        Highlight
                    </div>

                    {/* Image Area */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="px-6 pb-6 pt-4 flex flex-col">
                        <h3 className="font-black text-gray-900 text-[24px] leading-tight mb-2 line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-gray-500 text-[14px] mb-6 line-clamp-3 leading-snug">
                            {product.desc}
                        </p>

                        <div className="mt-auto space-y-5">
                            <div className="flex items-baseline gap-2">
                                <span className="text-green-600 font-black text-4xl leading-none">
                                    {product.price}
                                </span>
                                <span className="text-green-600 font-black text-xl">
                                    บาท
                                </span>
                            </div>

                            <div className="flex flex-col gap-2.5">
                                {product.shopeeUrl && (
                                    <a
                                        href={product.shopeeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-3.5 bg-[#EE4D2D] text-white rounded-full flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                                    >
                                        <span className="text-sm font-black italic">สั่งซื้อที่ Shopee</span>
                                    </a>
                                )}
                                {product.lazadaUrl && (
                                    <a
                                        href={product.lazadaUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-3.5 bg-[#101566] text-white rounded-full flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                                    >
                                        <span className="text-sm font-black italic">สั่งซื้อที่ Lazada</span>
                                    </a>
                                )}
                                {product.tiktokUrl && (
                                    <a
                                        href={product.tiktokUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-3.5 bg-black text-white rounded-full flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                                    >
                                        <span className="text-sm font-black italic">สั่งซื้อที่ TikTok</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-red-600 font-bold transition-colors text-sm"
                    >
                        <Plus size={16} /> Create Your Own Page
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ProductPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ProductViewContent />
        </Suspense>
    );
};

export default ProductPage;
