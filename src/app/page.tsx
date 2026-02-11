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
  AlertCircle,
  ChevronLeft,
  Code,
  Layers
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

const ProductCard = ({ product, onCopy }: { product: Product, onCopy?: (msg: string) => void }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?item=${product.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      if (onCopy) onCopy('คัดลอกลิงก์สินค้าเรียบร้อย ✨');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      id={`product-${product.id}`}
      className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group hover:-translate-y-1"
    >
      {/* Image Area */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <div className="relative w-full h-full">
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
        </div>
        <button
          onClick={copyToClipboard}
          className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
        >
          {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Share2 size={16} className="text-gray-600" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="px-5 pb-5 pt-1 flex flex-col flex-1">
        <h3 className="font-black text-gray-900 text-[22px] leading-tight mb-1.5 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        <p className="text-gray-500 text-[13px] mb-4 line-clamp-2 h-9 leading-snug">
          {product.desc}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-[#4ade80] font-black text-3xl leading-none">
              {product.price}
            </span>
            <span className="text-[#4ade80] font-black text-xl">
              บาท
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.shopeeUrl && (
              <a
                href={product.shopeeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-[#EE4D2D] text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-sm min-w-[65px]"
                title="Shopee"
              >
                <span className="text-[11px] font-black italic">Shopee</span>
              </a>
            )}
            {product.lazadaUrl && (
              <a
                href={product.lazadaUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-[#101566] text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-sm min-w-[65px]"
                title="Lazada"
              >
                <span className="text-[11px] font-black italic">Lazada</span>
              </a>
            )}
            {product.tiktokUrl && (
              <a
                href={product.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-sm min-w-[65px]"
                title="Tiktok"
              >
                <span className="text-[11px] font-black italic">Tiktok</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
};

const App = () => {
  // --- State ---
  const [viewMode, setViewMode] = useState<'admin' | 'preview' | 'review'>('admin');
  const [reviewedProducts, setReviewedProducts] = useState<Product[]>([]);
  const [isEmbed, setIsEmbed] = useState(false);
  const [embedShow, setEmbedShow] = useState<string | null>(null);
  const [editingSingleId, setEditingSingleId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEmbed(params.get('embed') === 'true');
    setEmbedShow(params.get('show'));
  }, []);

  // 1. Single Product State (List)
  const [singleProducts, setSingleProducts] = useState<Product[]>([
    {
      id: 999,
      image: 'https://images.unsplash.com/photo-1541781777631-fa9531908431?w=600&q=80',
      name: 'Highlight Product Showcase',
      desc: 'รายละเอียดสินค้าแบบไฮไลท์ จัดการแยกเป็นรายการได้แล้ว',
      price: '990.00',
      shopeeUrl: 'https://shopee.co.th',
      lazadaUrl: 'https://lazada.co.th',
      tiktokUrl: 'https://tiktok.com'
    }
  ]);

  const [newSingleProduct, setNewSingleProduct] = useState<Partial<Product>>({
    image: '', name: '', desc: '', price: '', shopeeUrl: '', lazadaUrl: '', tiktokUrl: ''
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
    const savedSingle = localStorage.getItem('singleProducts');
    const savedGroup = localStorage.getItem('groupProducts');
    const savedReviewed = localStorage.getItem('reviewedProducts');
    if (savedSingle) setSingleProducts(JSON.parse(savedSingle));
    if (savedGroup) setGroupProducts(JSON.parse(savedGroup));
    if (savedReviewed) setReviewedProducts(JSON.parse(savedReviewed));

    // Check for deep-link on start - if exists, enter preview mode automatically
    const params = new URLSearchParams(window.location.search);
    if (params.get('item')) {
      setViewMode('preview');
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('singleProducts', JSON.stringify(singleProducts));
        localStorage.setItem('groupProducts', JSON.stringify(groupProducts));
        localStorage.setItem('reviewedProducts', JSON.stringify(reviewedProducts));
      } catch (e) {
        if (e instanceof Error && e.name === 'QuotaExceededError') {
          showToastMessage('🚨 พื้นที่จัดเก็บเต็ม! กรุณาลบบางรายการออกเพื่อให้บันทึกต่อได้');
        }
      }
    }
  }, [singleProducts, groupProducts, reviewedProducts, isLoaded]);


  const saveToReview = (product: Product) => {
    // Append to reviewed products
    const newReviewedItem: Product = {
      ...product,
      id: Date.now() + Math.random(), // Unique ID for review list
    };
    setReviewedProducts(prev => [newReviewedItem, ...prev]);
    showToastMessage('บันทึกข้อมูลสินค้าลงในหน้ารีวิวเรียบร้อย ✨');
  };

  // --- Form State for New Group Product ---
  const [newGroupProduct, setNewGroupProduct] = useState<Partial<Product>>({
    image: '', name: '', desc: '', price: '', shopeeUrl: '', lazadaUrl: '', tiktokUrl: ''
  });

  useEffect(() => {
    if (isLoaded) {
      const urlParams = new URLSearchParams(window.location.search);
      const itemId = urlParams.get('item');
      if (itemId && viewMode === 'preview') {
        const idNum = parseInt(itemId);
        if (!isNaN(idNum)) {
          setFocusedProductId(idNum);

          setTimeout(() => {
            const element = document.getElementById(`product-${itemId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.classList.add('ring-4', 'ring-red-500/20', 'scale-105');
              setTimeout(() => {
                element.classList.remove('ring-4', 'ring-red-500/20', 'scale-105');
              }, 3000);
            }
          }, 500);
        }
      } else if (!itemId) {
        setFocusedProductId(null);
      }
    }
  }, [isLoaded, viewMode]);



  const generateStandaloneCardHTML = (product: Product) => {
    return `
<div style="font-family: 'Inter', sans-serif; background: white; border-radius: 32px; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; display: flex; flex-direction: column; height: 100%; transition: transform 0.3s ease; max-width: 400px; margin: 0 auto;">
  <div style="position: relative; aspect-ratio: 1/1; padding: 24px; background: white; display: flex; align-items: center; justify-content: center; overflow: hidden;">
    <div style="position: relative; width: 100%; height: 100%; border-radius: 24px; overflow: hidden;">
      <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  </div>
  <div style="padding: 4px 20px 24px 20px; display: flex; flex-direction: column; flex: 1;">
    <h3 style="font-weight: 900; color: #111827; font-size: 22px; line-height: 1.25; margin: 0 0 6px 0; min-height: 2.5em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.name}</h3>
    <p style="color: #6b7280; font-size: 13px; line-height: 1.4; margin: 0 0 16px 0; height: 38px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.desc}</p>
    <div style="margin-top: auto; display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; align-items: baseline; gap: 6px;">
        <span style="color: #10b981; font-weight: 900; font-size: 30px; line-height: 1;">${product.price}</span>
        <span style="color: #10b981; font-weight: 900; font-size: 18px;">บาท</span>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${product.shopeeUrl && product.shopeeUrl.trim() !== '' ? `<a href="${product.shopeeUrl}" target="_blank" style="padding: 4px 12px; background: #EE4D2D; color: white; border-radius: 999px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 11px; font-weight: 900; font-style: italic; min-width: 65px;">Shopee</a>` : ''}
        ${product.lazadaUrl && product.lazadaUrl.trim() !== '' ? `<a href="${product.lazadaUrl}" target="_blank" style="padding: 4px 12px; background: #101566; color: white; border-radius: 999px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 11px; font-weight: 900; font-style: italic; min-width: 65px;">Lazada</a>` : ''}
        ${product.tiktokUrl && product.tiktokUrl.trim() !== '' ? `<a href="${product.tiktokUrl}" target="_blank" style="padding: 4px 12px; background: black; color: white; border-radius: 999px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 11px; font-weight: 900; font-style: italic; min-width: 65px;">Tiktok</a>` : ''}
      </div>
    </div>
  </div>
</div>
    `.trim();
  };

  const copyIndividualHTML = (product: Product) => {
    const html = generateStandaloneCardHTML(product);
    navigator.clipboard.writeText(html).then(() => {
      showToastMessage('คัดลอกโค้ด HTML สินค้าเรียบร้อย 🚀');
    });
  };

  const copyProductLink = (product: Product) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?item=${product.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToastMessage('คัดลอกลิงก์สินค้าเรียบร้อย ✨');
    });
  };

  const copyGroupHTML = () => {
    const cardsHTML = groupProducts.map(p => `
      <div style="flex: 1; min-width: 280px; max-width: 320px; margin-bottom: 24px;">
        ${generateStandaloneCardHTML(p)}
      </div>
    `).join('');

    const finalHTML = `
<!-- Standalone Product Showcase Grid -->
<div style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; padding: 32px 16px; background: #f9fafb; font-family: 'Inter', sans-serif;">
  ${cardsHTML}
</div>
    `.trim();

    navigator.clipboard.writeText(finalHTML).then(() => {
      showToastMessage('คัดลอก HTML ทั้งชุดเรียบร้อย 🚀');
    });
  };

  const handleSingleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSingleProduct(prev => ({ ...prev, [name]: value }));
  };

  const addSingleProduct = () => {
    if (!newSingleProduct.name || !newSingleProduct.price) {
      showToastMessage('กรุณากรอกชื่อและราคาให้ครบถ้วน');
      return;
    }

    if (editingSingleId !== null) {
      setSingleProducts(singleProducts.map(p =>
        p.id === editingSingleId ? { ...p, ...newSingleProduct as Product } : p
      ));
      setEditingSingleId(null);
      showToastMessage('อัปเดตสินค้าไฮไลท์สำเร็จ ✨');
    } else {
      const item: Product = {
        ...newSingleProduct as Product,
        id: Date.now(),
      };
      setSingleProducts([...singleProducts, item]);
      showToastMessage('เพิ่มสินค้าไฮไลท์สำเร็จ ✨');
    }

    setNewSingleProduct({
      image: '', name: '', desc: '', price: '', shopeeUrl: '', lazadaUrl: '', tiktokUrl: ''
    });
  };

  const startEditingSingle = (product: Product) => {
    setEditingSingleId(product.id);
    setNewSingleProduct({ ...product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteSingleProduct = (id: number) => {
    setSingleProducts(singleProducts.filter(p => p.id !== id));
    showToastMessage('ลบสินค้าไฮไลท์เรียบร้อย');
  };

  const handleGroupInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGroupProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, type: 'single' | 'group') => {
    const file = e.target.files?.[0];
    if (file) {
      const originalResult = await readFile(file);
      const compressedResult = await compressImage(originalResult);
      if (type === 'single') {
        setNewSingleProduct(prev => ({ ...prev, image: compressedResult }));
      } else {
        setNewGroupProduct(prev => ({ ...prev, image: compressedResult }));
      }
    }
  };

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [focusedProductId, setFocusedProductId] = useState<number | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);

  const addGroupProduct = () => {
    if (!newGroupProduct.name || !newGroupProduct.price) {
      showToastMessage('กรุณากรอกชื่อและราคาให้ครบถ้วน');
      return;
    }

    if (editingGroupId !== null) {
      // Update
      setGroupProducts(groupProducts.map(p =>
        p.id === editingGroupId ? { ...p, ...newGroupProduct as Product } : p
      ));
      setEditingGroupId(null);
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

  const startEditingGroup = (product: Product) => {
    setEditingGroupId(product.id);
    setNewGroupProduct({ ...product });
    // Scroll to form for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditingGroup = () => {
    setEditingGroupId(null);
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
      {!isEmbed && (
        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <ShoppingBag size={24} />
              </div>
              <h1 className="font-bold text-xl tracking-tight hidden sm:block">Product<span className="text-red-600">Showcase</span></h1>
            </div>

            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={() => setViewMode('admin')}
                className={`p-2 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'admin' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="จัดการ"
              >
                <Layout size={18} /> <span className="hidden xs:inline">จัดการ</span>
              </button>
              <button
                onClick={() => setViewMode('review')}
                className={`p-2 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'review' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="สินค้าเดี่ยว"
              >
                <Star size={18} /> <span className="hidden xs:inline">สินค้าเดี่ยว</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`p-2 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'preview' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="สินค้ากลุ่ม"
              >
                <Share2 size={18} /> <span className="hidden xs:inline">สินค้ากลุ่ม</span>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className={`max-w-6xl mx-auto px-4 ${isEmbed ? 'py-2' : 'py-8'}`}>
        {viewMode === 'admin' ? (
          /* --- ADMIN MODE --- */
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {/* Left Column: Single Product Edit */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                  <h2 className="text-lg font-bold text-blue-600">
                    {editingSingleId !== null ? 'แก้ไขสินค้าเดี่ยว' : '+ เพิ่มสินค้าเดี่ยว'}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">รูปสินค้า</label>
                    <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden hover:border-red-400 transition-colors bg-gray-50 h-32 flex flex-col items-center justify-center">
                      <input type="file" onChange={(e) => handleImageUpload(e, 'single')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                      {newSingleProduct.image ? (
                        <div className="relative w-full h-full">
                          {newSingleProduct.image.startsWith('data:') ? (
                            <img src={newSingleProduct.image} alt="Single" className="w-full h-full object-cover" />
                          ) : (
                            <Image src={newSingleProduct.image} alt="Single" fill className="object-cover" />
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center"><Camera size={20} /><span className="text-[10px] mt-1">อัปโหลดรูป</span></div>
                      )}
                    </div>
                  </div>
                  <input name="name" value={newSingleProduct.name || ''} onChange={handleSingleInputChange} placeholder="ชื่อสินค้า" className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                  <textarea name="desc" value={newSingleProduct.desc || ''} onChange={handleSingleInputChange} placeholder="รายละเอียด" className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-red-500 outline-none h-16 resize-none text-sm" />
                  <input name="price" value={newSingleProduct.price || ''} onChange={handleSingleInputChange} placeholder="ราคา" className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                  <div className="grid grid-cols-3 gap-2">
                    <input name="shopeeUrl" value={newSingleProduct.shopeeUrl || ''} onChange={handleSingleInputChange} placeholder="Shopee" className="w-full px-2 py-1.5 text-xs rounded-lg border border-orange-50 outline-none" />
                    <input name="lazadaUrl" value={newSingleProduct.lazadaUrl || ''} onChange={handleSingleInputChange} placeholder="Lazada" className="w-full px-2 py-1.5 text-xs rounded-lg border border-blue-50 outline-none" />
                    <input name="tiktokUrl" value={newSingleProduct.tiktokUrl || ''} onChange={handleSingleInputChange} placeholder="TikTok" className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-50 outline-none" />
                  </div>

                  {editingSingleId !== null ? (
                    <div className="flex gap-2">
                      <button onClick={addSingleProduct} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition-all text-sm flex items-center justify-center gap-2">
                        <Save size={16} /> บันทึกแก้ไข
                      </button>
                      <button onClick={() => { setEditingSingleId(null); setNewSingleProduct({ image: '', name: '', desc: '', price: '', shopeeUrl: '', lazadaUrl: '', tiktokUrl: '' }); }} className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all text-sm">
                        ยกเลิก
                      </button>
                    </div>
                  ) : (
                    <button onClick={addSingleProduct} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                      <Plus size={18} /> เพิ่มสินค้าเดี่ยว
                    </button>
                  )}
                </div>

                {/* Single Products List */}
                <div className="mt-8 space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">รายการสินค้าไฮไลท์ ({singleProducts.length})</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {singleProducts.map(p => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          {p.image.startsWith('http') ? (
                            <Image src={p.image} alt={p.name} fill className="rounded-lg object-cover" />
                          ) : (
                            <img src={p.image} alt={p.name} className="w-full h-full rounded-lg object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs truncate">{p.name}</h4>
                          <p className="text-[#10b981] font-black text-[10px]">{p.price} บาท</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => copyIndividualHTML(p)} className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="คัดลอก HTML">
                            <Code size={14} />
                          </button>
                          <button onClick={() => startEditingSingle(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => deleteSingleProduct(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Group Product Manage */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                  <h2 className="text-lg font-bold text-red-600">
                    {editingGroupId !== null ? 'แก้ไขสินค้ากลุ่ม (Group)' : '+ เพิ่มสินค้ากลุ่ม (Group)'}
                  </h2>

                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-24 h-24 flex-shrink-0 relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-red-400 transition-colors bg-gray-50 flex flex-col items-center justify-center">
                      <input type="file" onChange={(e) => handleImageUpload(e, 'group')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                      {newGroupProduct.image ? (
                        <div className="relative w-full h-full">
                          {newGroupProduct.image.startsWith('data:') ? (
                            <img src={newGroupProduct.image} alt="New" className="w-full h-full object-cover" />
                          ) : (
                            <Image src={newGroupProduct.image} alt="New" fill className="object-cover" />
                          )}
                        </div>
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
                  {editingGroupId !== null ? (
                    <div className="flex gap-2">
                      <button onClick={addGroupProduct} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        <Save size={18} /> บันทึกการแก้ไข
                      </button>
                      <button onClick={cancelEditingGroup} className="w-1/3 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                        <X size={18} /> ยกเลิก
                      </button>
                    </div>
                  ) : (
                    <button onClick={addGroupProduct} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                      <Plus size={18} /> เพิ่มสินค้าในกลุ่ม
                    </button>
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-white p-4 rounded-3xl border border-purple-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-sm">คัดลอกโค้ดทั้งชุด ({groupProducts.length} รายการ)</h4>
                        <p className="text-[10px] text-gray-500 font-medium">นำไปวางแล้วจะแสดงผลเรียงกันสวยงาม</p>
                      </div>
                    </div>
                    <button
                      onClick={copyGroupHTML}
                      className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <Code size={16} /> คัดลอก Embed Group
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider px-2">รายการสินค้าในกลุ่ม</h3>
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
                          <p className="text-red-500 text-xs">{p.price} บาท</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => copyIndividualHTML(p)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="คัดลอกโค้ด HTML">
                            <Code size={16} />
                          </button>
                          <button onClick={() => copyProductLink(p)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="คัดลอกลิงก์">
                            <Share2 size={16} />
                          </button>
                          <button onClick={() => startEditingGroup(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="แก้ไข">
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
        ) : viewMode === 'review' ? (
          /* --- REVIEW MODE --- */
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2 relative">
              <h2 className="text-3xl font-black text-gray-900">สินค้าเดี่ยว</h2>
              <p className="text-gray-500">รายการสินค้าที่คุณเลือกจากคลังสินค้าไฮไลท์</p>

            </div>

            {singleProducts.length > 0 ? (
              <div className="flex overflow-x-auto pb-10 gap-6 snap-x no-scrollbar px-6 sm:px-0 scroll-smooth -mx-5 sm:mx-0">
                {singleProducts.map((p) => (
                  <div key={p.id} className="min-w-[80%] sm:min-w-[320px] snap-center">
                    <ProductCard product={p} onCopy={showToastMessage} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 border border-dashed border-gray-200 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <Star size={32} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900">ยังไม่มีสินค้าเดี่ยว</p>
                  <p className="text-sm text-gray-500">เพิ่มสินค้าในหน้าจัดการเพื่อแสดงโชว์ที่นี่</p>
                </div>
                <button
                  onClick={() => setViewMode('admin')}
                  className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-red-700 transition-all"
                >
                  ไปหน้าจัดการ
                </button>
              </div>
            )}
          </div>
        ) : focusedProductId ? (
          /* --- FOCUSED MODE: Isolated Item --- */
          <div className="max-w-md mx-auto py-10 space-y-8 animate-in fade-in zoom-in duration-500">
            <button
              onClick={() => {
                window.history.pushState({}, '', window.location.pathname);
                setFocusedProductId(null);
              }}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-medium transition-colors mb-4"
            >
              <ChevronLeft size={20} /> ดูสินค้าทั้งหมด
            </button>
            <div className="shadow-2xl rounded-[20px] ring-1 ring-gray-100 overflow-hidden transform scale-105">
              {singleProducts.find(p => p.id === focusedProductId) ? (
                <ProductCard product={singleProducts.find(p => p.id === focusedProductId)!} onCopy={showToastMessage} />
              ) : (
                groupProducts.find(p => p.id === focusedProductId) ? (
                  <ProductCard product={groupProducts.find(p => p.id === focusedProductId)!} onCopy={showToastMessage} />
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 flex flex-col items-center">
                    <AlertCircle size={48} className="text-gray-200 mb-4" />
                    <p className="text-gray-500 font-medium">ไม่พบสินค้าที่ต้องการ</p>
                    <button onClick={() => setFocusedProductId(null)} className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-red-700 transition-all">กลับสู่หน้าหลัก</button>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          /* --- PREVIEW MODE: Full Showcase --- */
          <div className="space-y-12 pb-20 animate-in fade-in duration-500">
            <div className="text-center space-y-2 mb-10">
              <h2 className="text-3xl font-black text-gray-900">สินค้ากลุ่ม</h2>
              <p className="text-gray-500">แคตตาล็อกสินค้าทั้งหมดในระบบ</p>
            </div>
            {/* 1. Single Product Section (Highlight List) - Hidden from Preview by request, only shown if explicitly asked via embed URL */}
            {(embedShow === 'single') && (
              <section className="flex flex-col items-center gap-8 py-4">
                {singleProducts.map(p => (
                  <div key={p.id} className="w-full max-w-sm sm:max-w-md">
                    <ProductCard product={p} onCopy={showToastMessage} />
                  </div>
                ))}
              </section>
            )}

            {/* Divider (Only if showing all or specific mix, removed for default Group view) */}
            {(embedShow === 'all') && (
              <div className="flex items-center gap-4 max-w-lg mx-auto px-4 sm:px-0">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest px-2 text-center">สินค้าแนะนำอื่นๆ</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
            )}

            {/* 2. Group Product Section */}
            {(!embedShow || embedShow === 'group') && (
              <section className="px-5 sm:px-0">
                <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible gap-5 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-8 sm:pb-0 snap-x snap-mandatory no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
                  {groupProducts.map(p => (
                    <div key={p.id} className="min-w-[85%] sm:min-w-0 snap-center first:pl-0">
                      <ProductCard product={p} onCopy={showToastMessage} />
                    </div>
                  ))}
                </div>
              </section>
            )}
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
