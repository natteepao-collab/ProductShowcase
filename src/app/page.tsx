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
  ChevronLeft
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
      <div className="relative aspect-square p-4 bg-white flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
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
      <div className="px-6 pb-6 pt-2 flex flex-col flex-1">
        <h3 className="font-black text-gray-900 text-xl leading-tight mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">
          {product.desc}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex flex-col">
            <span className="text-[#4ade80] font-black text-3xl leading-none">
              {product.price}
            </span>
            <span className="text-[#4ade80] font-bold text-xl mt-1">
              บาท
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.shopeeUrl && (
              <a
                href={product.shopeeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-[#EE4D2D] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                title="Shopee"
              >
                <span className="text-[10px] font-black italic">Shopee</span>
              </a>
            )}
            {product.lazadaUrl && (
              <a
                href={product.lazadaUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-[#101566] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                title="Lazada"
              >
                <span className="text-[10px] font-black italic">Laz</span>
              </a>
            )}
            {product.tiktokUrl && (
              <a
                href={product.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                title="Tiktok"
              >
                <span className="text-[10px] font-black italic">Tik</span>
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
  const [viewMode, setViewMode] = useState<'admin' | 'preview' | 'review'>('admin');
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [focusedProductId, setFocusedProductId] = useState<number | null>(null);
  const [reviewedProducts, setReviewedProducts] = useState<Product[]>([]);
  const [isEmbed, setIsEmbed] = useState(false);
  const [embedShow, setEmbedShow] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEmbed(params.get('embed') === 'true');
    setEmbedShow(params.get('show'));
  }, []);

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
    const savedReviewed = localStorage.getItem('reviewedProducts');
    if (savedSingle) setSingleProduct(JSON.parse(savedSingle));
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
      localStorage.setItem('singleProduct', JSON.stringify(singleProduct));
      localStorage.setItem('groupProducts', JSON.stringify(groupProducts));
      localStorage.setItem('reviewedProducts', JSON.stringify(reviewedProducts));
    }
  }, [singleProduct, groupProducts, reviewedProducts, isLoaded]);


  const saveSingleProduct = () => {
    // Append to reviewed products
    const newReviewedItem: Product = {
      ...singleProduct,
      id: Date.now(),
    };
    setReviewedProducts(prev => [newReviewedItem, ...prev]);
    showToastMessage('บันทึกข้อมูลสินค้าแนะนำลงในหน้ารีวิวเรียบร้อย ✨');
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

  const copyEmbedCode = (section: 'all' | 'single' | 'group' | 'review' = 'all') => {
    const embedUrl = `${window.location.origin}${window.location.pathname}?embed=true${section !== 'all' ? `&show=${section}` : ''}`;
    const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${section === 'single' ? '450' : '650'}" frameborder="0" style="border:none; overflow:hidden;" scrolling="no"></iframe>`;
    navigator.clipboard.writeText(iframeCode).then(() => {
      const sectionName = section === 'single' ? 'เฉพาะสินค้าไฮไลท์' : section === 'group' ? 'เฉพาะกลุ่มสินค้า' : section === 'review' ? 'เฉพาะหน้ารีวิว' : 'ทั้งหมด';
      showToastMessage(`คัดลอก Embed Code (${sectionName}) เรียบร้อย 🚀`);
    });
  };

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
      {!isEmbed && (
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
                onClick={() => setViewMode('admin')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'admin' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Layout size={18} /> จัดการ
              </button>
              <button
                onClick={() => setViewMode('review')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'review' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Star size={18} /> หน้ารีวิว
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'preview' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Share2 size={18} /> หน้าพรีวิว
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
                  <h2 className="text-lg font-bold flex items-center gap-2 text-red-600">
                    <Edit size={20} /> แก้ไขสินค้าแนะนำ (Single)
                  </h2>
                  <button
                    onClick={() => copyEmbedCode('single')}
                    className="text-[10px] font-bold bg-gray-900 text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black transition-all"
                  >
                    <Share2 size={12} /> คัดลอก Embed เฉพาะส่วนนี้
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">รูปสินค้า</label>
                    <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden hover:border-red-400 transition-colors bg-gray-50 h-48 flex flex-col items-center justify-center">
                      <input type="file" onChange={(e) => handleImageUpload(e, true)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                      {singleProduct.image ? (
                        <div className="relative w-full h-full">
                          {singleProduct.image.startsWith('data:') ? (
                            <img src={singleProduct.image} alt={singleProduct.name} className="w-full h-full object-cover" />
                          ) : (
                            <Image src={singleProduct.image} alt={singleProduct.name} fill className="object-cover" />
                          )}
                        </div>
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

                  <button
                    onClick={saveSingleProduct}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-95"
                  >
                    <Save size={18} /> บันทึกข้อมูลสินค้าแนะนำ
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Group Product Manage */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-red-600">
                    <Plus size={20} /> เพิ่มสินค้ากลุ่ม (Group)
                  </h2>
                  <button
                    onClick={() => copyEmbedCode('group')}
                    className="text-[10px] font-bold bg-gray-900 text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black transition-all"
                  >
                    <Share2 size={12} /> คัดลอก Embed เฉพาะส่วนนี้
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-24 h-24 flex-shrink-0 relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-red-400 transition-colors bg-gray-50 flex flex-col items-center justify-center">
                      <input type="file" onChange={(e) => handleImageUpload(e, false)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
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
                          <p className="text-red-500 text-xs">{p.price} บาท</p>
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
        ) : viewMode === 'review' ? (
          /* --- REVIEW MODE --- */
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2 relative">
              <h2 className="text-3xl font-black text-gray-900">หน้ารีวิวสินค้า</h2>
              <p className="text-gray-500">รวมสินค้าแนะนำที่บันทึกไว้ทั้งหมด</p>
              {!isEmbed && (
                <button
                  onClick={() => copyEmbedCode('review')}
                  className="absolute top-0 right-0 text-[10px] font-bold bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-1 hover:bg-black transition-all shadow-md"
                >
                  <Share2 size={14} /> คัดลอก Embed หน้ารีวิว
                </button>
              )}
            </div>

            {reviewedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {reviewedProducts.map((p, index) => (
                  <div key={p.id} className="relative group">
                    <ProductCard product={p} onCopy={showToastMessage} />
                    <button
                      onClick={() => {
                        const newReviewed = reviewedProducts.filter((_, i) => i !== index);
                        setReviewedProducts(newReviewed);
                        showToastMessage('ลบสินค้าออกจากรีวิวแล้ว');
                      }}
                      className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 p-1.5 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 border border-dashed border-gray-200 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <Star size={32} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900">ยังไม่มีสินค้าในรีวิว</p>
                  <p className="text-sm text-gray-500">กดปุ่ม "บันทึกข้อมูลสินค้าแนะนำ" ในหน้าจัดการเพื่อเพิ่มสินค้า</p>
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
              {singleProduct.id === focusedProductId ? (
                <ProductCard product={singleProduct} onCopy={showToastMessage} />
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
            {/* 1. Single Product Section */}
            {(!embedShow || embedShow === 'single') && (
              <section className="flex justify-center px-4 sm:px-0">
                <div className="w-full max-w-sm sm:max-w-md">
                  <ProductCard product={singleProduct} onCopy={showToastMessage} />
                </div>
              </section>
            )}

            {/* Divider */}
            {(!embedShow) && (
              <div className="flex items-center gap-4 max-w-lg mx-auto px-4 sm:px-0">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest px-2 text-center">สินค้าแนะนำอื่นๆ</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
            )}

            {/* 2. Group Product Section */}
            {(!embedShow || embedShow === 'group') && (
              <section>
                <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-8 sm:pb-0 snap-x snap-mandatory no-scrollbar px-4 sm:px-0">
                  {groupProducts.map(p => (
                    <div key={p.id} className="min-w-[45%] sm:min-w-0 snap-start">
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
