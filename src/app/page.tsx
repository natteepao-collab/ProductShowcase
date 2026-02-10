"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  ShoppingBag,
  Layout,
  Share2,
  CheckCircle2,
  Camera,
  Edit,
  Save,
  Star,
  Flame,
  X,
  Edit3,
  AlertCircle
} from 'lucide-react';

// --- Types ---
interface Product {
  id: number;
  image: string;
  name: string;
  desc: string;
  price: string;
  shopeeUrl: string;
  lazadaUrl: string;
  tiktokUrl: string;
  sold?: string;
  rating?: string;
  reviews?: string;
}

// --- Components ---

const ProductCard = ({ product }: { product: Product }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?item=${product.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col h-full group">
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.image.startsWith('http') ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Share2 size={16} className="text-gray-600" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2 h-8">
          {product.desc}
        </p>

        <div className="mt-auto">
          <p className="text-[#4ade80] font-bold text-xl mb-3">
            {product.price} บาท
          </p>

          <div className={`grid gap-1 ${[product.shopeeUrl, product.lazadaUrl, product.tiktokUrl].filter(Boolean).length === 3
            ? 'grid-cols-3'
            : [product.shopeeUrl, product.lazadaUrl, product.tiktokUrl].filter(Boolean).length === 2
              ? 'grid-cols-2'
              : 'grid-cols-1'
            }`}>
            {product.shopeeUrl && (
              <a
                href={product.shopeeUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#EE4D2D] text-white text-[8px] md:text-xs font-bold py-1.5 px-0.5 rounded-full text-center hover:opacity-90 transition-opacity shadow-sm"
              >
                Shopee
              </a>
            )}
            {product.lazadaUrl && (
              <a
                href={product.lazadaUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#101566] text-white text-[8px] md:text-xs font-bold py-1.5 px-0.5 rounded-full text-center hover:opacity-90 transition-opacity shadow-sm"
              >
                Lazada
              </a>
            )}
            {product.tiktokUrl && (
              <a
                href={product.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white text-[8px] md:text-xs font-bold py-1.5 px-0.5 rounded-full text-center hover:opacity-90 transition-opacity shadow-sm"
              >
                Tiktok
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for image upload (moved outside to avoid recreation)
const readFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

const App = () => {
  // --- State ---
  const [isEditMode, setIsEditMode] = useState(true);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Single Product State
  const [singleProduct, setSingleProduct] = useState<Product>({
    id: 999,
    image: 'https://images.unsplash.com/photo-1541781777631-fa9531908431?w=600&q=80',
    name: 'Single Product Showcase',
    desc: 'รายละเอียดสินค้าแบบเดี่ยว แนะนำสินค้าไฮไลท์',
    price: '990.00',
    shopeeUrl: 'https://shopee.co.th',
    lazadaUrl: 'https://lazada.co.th',
    tiktokUrl: 'https://tiktok.com'
  });

  // 2. Group Products State
  const [groupProducts, setGroupProducts] = useState<Product[]>([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80',
      name: 'Royal Canin Mini Adult 8+',
      desc: 'สำหรับสุนัขสูงวัยพันธุ์เล็ก 8 ปีขึ้นไป 8kg.',
      price: '1,760.00',
      shopeeUrl: 'https://shopee.co.th',
      lazadaUrl: 'https://lazada.co.th',
      tiktokUrl: 'https://tiktok.com',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
      name: 'Royal Canin Kitten',
      desc: 'อาหารเม็ดลูกแมว อายุ 4-12 เดือน 4 kg',
      price: '1,230.00',
      shopeeUrl: 'https://shopee.co.th',
      lazadaUrl: 'https://lazada.co.th',
      tiktokUrl: '',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80',
      name: 'SmartHeart Chicken',
      desc: 'อาหารสุนัข รสไก่และไข่ 3kg',
      price: '590.00',
      shopeeUrl: 'https://shopee.co.th',
      lazadaUrl: '',
      tiktokUrl: '',
    }
  ]);

  // --- Persistence & Initial Load ---
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedSingle = localStorage.getItem('singleProduct');
    const savedGroup = localStorage.getItem('groupProducts');
    if (savedSingle) setSingleProduct(JSON.parse(savedSingle));
    if (savedGroup) setGroupProducts(JSON.parse(savedGroup));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('singleProduct', JSON.stringify(singleProduct));
      localStorage.setItem('groupProducts', JSON.stringify(groupProducts));
    }
  }, [singleProduct, groupProducts, isLoaded]);


  // --- Form State for New Group Product ---
  const [newGroupProduct, setNewGroupProduct] = useState<Partial<Product>>({
    image: '', name: '', desc: '', price: '', shopeeUrl: '', lazadaUrl: '', tiktokUrl: ''
  });

  // --- Handlers ---

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, isSingle: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await readFile(file);
      if (isSingle) {
        setSingleProduct(prev => ({ ...prev, image: result }));
      } else {
        setNewGroupProduct(prev => ({ ...prev, image: result }));
      }
    }
  };

  const handleSingleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSingleProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleGroupInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGroupProduct(prev => ({ ...prev, [name]: value }));
  };

  const addGroupProduct = () => {
    if (!newGroupProduct.name || !newGroupProduct.price) {
      showToastMessage('กรุณากรอกชื่อและราคาให้ครบถ้วน');
      return;
    }

    if (editingProductId !== null) {
      // Update
      setGroupProducts(groupProducts.map(p =>
        p.id === editingProductId ? { ...p, ...newGroupProduct as Product } : p
      ));
      setEditingProductId(null);
      showToastMessage('อัปเดตข้อมูลสำเร็จ ✨');
    } else {
      // Create
      const item: Product = {
        ...newGroupProduct as Product,
        id: Date.now(),
        sold: '0',
        rating: '5/5',
        reviews: '0'
      };
      setGroupProducts([...groupProducts, item]);
      showToastMessage('เพิ่มสินค้าใหม่สำเร็จ ✨');
    }

    setNewGroupProduct({
      image: '', name: '', desc: '', price: '', shopeeUrl: '', lazadaUrl: '', tiktokUrl: ''
    });
  };

  const startEditing = (product: Product) => {
    setEditingProductId(product.id);
    setNewGroupProduct({ ...product });
    // Scroll to form for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingProductId(null);
    setNewGroupProduct({
      image: '', name: '', desc: '', price: '', shopeeUrl: '', lazadaUrl: '', tiktokUrl: ''
    });
  };

  const deleteGroupProduct = (id: number) => {
    setGroupProducts(groupProducts.filter(p => p.id !== id));
    showToastMessage('ลบสินค้าเรียบร้อย');
  };

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <ShoppingBag size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">Product<span className="text-red-600">Showcase</span></h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditMode(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isEditMode ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Layout size={18} /> จัดการ
            </button>
            <button
              onClick={() => setIsEditMode(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${!isEditMode ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Share2 size={18} /> หน้าพรีวิว
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {isEditMode ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* --- Left Column: Single Product Edit --- */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-3 text-red-600">
                  <Edit size={20} /> แก้ไขสินค้าแนะนำ (Product Single)
                </h2>

                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">รูปสินค้า</label>
                    <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden hover:border-red-400 transition-colors bg-gray-50 h-48 flex flex-col items-center justify-center">
                      <input type="file" onChange={(e) => handleImageUpload(e, true)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                      {singleProduct.image ? (
                        singleProduct.image.startsWith('data:') ? (
                          <img src={singleProduct.image} alt={singleProduct.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="relative w-full h-full">
                            <Image src={singleProduct.image} alt={singleProduct.name} fill className="object-cover" />
                          </div>
                        )
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center"><Camera size={24} /><span className="text-xs mt-1">อัปโหลดรูป</span></div>
                      )}
                    </div>
                  </div>

                  <input name="name" value={singleProduct.name} onChange={handleSingleInputChange} placeholder="ชื่อสินค้า" className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-red-500 outline-none" />
                  <textarea name="desc" value={singleProduct.desc} onChange={handleSingleInputChange} placeholder="รายละเอียด" className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-red-500 outline-none h-20 resize-none" />
                  <input name="price" value={singleProduct.price} onChange={handleSingleInputChange} placeholder="ราคา" className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-red-500 outline-none" />

                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">ลิ้งก์ร้านค้า</p>
                    <input name="shopeeUrl" value={singleProduct.shopeeUrl} onChange={handleSingleInputChange} placeholder="Shopee Link" className="w-full px-3 py-2 text-sm rounded-lg border border-orange-100 outline-none" />
                    <input name="lazadaUrl" value={singleProduct.lazadaUrl} onChange={handleSingleInputChange} placeholder="Lazada Link" className="w-full px-3 py-2 text-sm rounded-lg border border-blue-100 outline-none" />
                    <input name="tiktokUrl" value={singleProduct.tiktokUrl} onChange={handleSingleInputChange} placeholder="TikTok Link" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-100 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* --- Right Column: Group Product Manage --- */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-3 text-red-600">
                  <Plus size={20} /> เพิ่มสินค้ากลุ่ม (Group Product)
                </h2>

                <div className="space-y-4">
                  {/* Simple Add Form */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-24 h-24 flex-shrink-0 relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-red-400 transition-colors bg-gray-50 flex flex-col items-center justify-center">
                      <input type="file" onChange={(e) => handleImageUpload(e, false)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                      {newGroupProduct.image ? (
                        newGroupProduct.image.startsWith('data:') ? (
                          <img src={newGroupProduct.image} alt={newGroupProduct.name || 'New'} className="w-full h-full object-cover" />
                        ) : (
                          <div className="relative w-full h-full">
                            <Image src={newGroupProduct.image} alt={newGroupProduct.name || 'New'} fill className="object-cover" />
                          </div>
                        )
                      ) : (
                        <Camera size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input name="name" value={newGroupProduct.name} onChange={handleGroupInputChange} placeholder="ชื่อสินค้า" className="w-full px-3 py-2 rounded-lg border border-gray-100 text-sm" />
                      <input name="price" value={newGroupProduct.price} onChange={handleGroupInputChange} placeholder="ราคา" className="w-full px-3 py-2 rounded-lg border border-gray-100 text-sm" />
                      <div className="flex gap-2">
                        <input name="shopeeUrl" value={newGroupProduct.shopeeUrl} onChange={handleGroupInputChange} placeholder="Shopee" className="w-full px-2 py-1 text-xs rounded border border-gray-100" />
                        <input name="lazadaUrl" value={newGroupProduct.lazadaUrl} onChange={handleGroupInputChange} placeholder="Lazada" className="w-full px-2 py-1 text-xs rounded border border-gray-100" />
                        <input name="tiktokUrl" value={newGroupProduct.tiktokUrl} onChange={handleGroupInputChange} placeholder="TikTok" className="w-full px-2 py-1 text-xs rounded border border-gray-100" />
                      </div>
                    </div>
                  </div>
                  {editingProductId !== null ? (
                    <div className="flex gap-2">
                      <button onClick={addGroupProduct} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        <Save size={18} /> บันทึกการแก้ไข
                      </button>
                      <button onClick={cancelEditing} className="w-1/3 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                        <X size={18} /> ยกเลิก
                      </button>
                    </div>
                  ) : (
                    <button onClick={addGroupProduct} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                      <Plus size={18} /> เพิ่มสินค้าในกลุ่ม
                    </button>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase">รายการสินค้าในกลุ่ม ({groupProducts.length})</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {groupProducts.map(p => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          {p.image.startsWith('http') ? (
                            <Image src={p.image} alt={p.name} fill className="rounded-lg object-cover" />
                          ) : (
                            <img src={p.image} alt={p.name} className="w-full h-full rounded-lg object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{p.name}</h4>
                          <p className="text-red-500 text-xs">{p.price}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => startEditing(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="แก้ไข">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => deleteGroupProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="ลบ">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* --- PREVIEW MODE --- */
          <div className="space-y-12 pb-20">

            {/* 1. Single Product Section */}
            <section className="flex justify-center">
              <div className="w-full max-w-sm sm:max-w-md">
                <ProductCard product={singleProduct} />
              </div>
            </section>

            {/* Divider */}
            <div className="flex items-center gap-4 max-w-lg mx-auto">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-gray-400 text-sm font-medium">สินค้าอื่นๆ ที่แนะนำ</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* 2. Group Product Section (Grid/Scroll) */}
            <section>
              <div
                className="flex sm:grid overflow-x-auto sm:overflow-x-visible gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-6 sm:pb-0 snap-x snap-mandatory no-scrollbar px-4 sm:px-0"
              >
                {groupProducts.map(p => (
                  <div key={p.id} className="min-w-[45%] sm:min-w-0 snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -webkit-overflow-scrolling: touch; -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800">
            <CheckCircle2 size={20} className="text-green-400" />
            <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
