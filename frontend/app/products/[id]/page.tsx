// 'use client';

// import { useState, use } from 'react';
// import Navigation from '@/app/components/Navigation';
// import ReviewForm from '@/app/components/ReviewForm';
// import ReviewsList from '@/app/components/ReviewsList';
// import { SHOES } from '@/lib/mockShoes';
// import { useStore } from '@/lib/store';
// import Link from 'next/link';

// interface Review {
//   id: string;
//   rating: number;
//   title: string;
//   body: string;
//   author: string;
//   date: string;
// }

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

// export default function ProductDetailPage({ params }: PageProps) {
//   const { id } = use(params);
//   const addToCart = useStore((state) => state.addToCart);
  
//   const product = SHOES.find((shoe) => shoe.id === id);
  
//   const [selectedSize, setSelectedSize] = useState<number | null>(null);
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [reviews, setReviews] = useState<Review[]>([
//     {
//       id: '1',
//       rating: 3,
//       title: 'amazing',
//       body: 'good product',
//       author: 'Anonymous',
//       date: '22 Feb 2026',
//     },
//   ]);

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-[#0f1621]">
//         <Navigation />
//         <div className="max-w-6xl mx-auto px-4 py-16 text-center">
//           <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
//           <Link href="/products" className="text-blue-500 hover:text-blue-400">
//             ← Back to Products
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const handleAddToCart = () => {
//     if (!selectedSize) {
//       alert('Please select a size');
//       return;
//     }

//     addToCart({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       quantity,
//       size: selectedSize,
//       color: selectedColor || product.colors[0],
//       image: product.image,
//     });

//     alert('Added to cart!');
//   };

//   const handleReviewSubmitted = (newReview: { rating: number; title: string; body: string }) => {
//     const review: Review = {
//       id: String(reviews.length + 1),
//       ...newReview,
//       author: 'You',
//       date: new Date().toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//       }),
//     };

//     setReviews([review, ...reviews]);
//     alert('Review submitted successfully!');
//   };

//   const handleDeleteReview = (reviewId: string) => {
//     setReviews(reviews.filter((r) => r.id !== reviewId));
//   };

//   return (
//     <div className="min-h-screen bg-[#0f1621] flex flex-col">
//       <Navigation />

//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           <Link href="/products" className="text-blue-500 hover:text-blue-400 text-sm mb-3 inline-block">
//             ← Back to Products
//           </Link>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
//             <div className="bg-[#181e2a] rounded-lg p-4 flex items-center justify-center">
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full max-w-md h-auto object-contain"
//               />
//             </div>

//             <div>
//               <p className="text-[#7a8ba8] text-sm mb-1">{product.brand}</p>
//               <h1 className="text-4xl font-bold text-white mb-3">{product.name}</h1>

//               <div className="flex items-center gap-3 mb-4">
//                 <div className="flex gap-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <span
//                       key={star}
//                       className={`text-xl ${
//                         star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-[#3d4f62]'
//                       }`}
//                     >
//                       ★
//                     </span>
//                   ))}
//                 </div>
//                 <span className="text-[#bfc8e6]">({product.reviews} reviews)</span>
//               </div>

//               <div className="mb-4">
//                 <p className="text-[#7a8ba8] line-through text-sm mb-1">
//                   ₹{product.originalPrice.toLocaleString()}
//                 </p>
//                 <p className="text-4xl font-bold text-white">₹{product.price.toLocaleString()}</p>
//                 <p className="text-green-500 font-semibold mt-2">
//                   Save ₹{(product.originalPrice - product.price).toLocaleString()} (
//                   {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
//                 </p>
//               </div>

//               <p className="text-[#bfc8e6] mb-4">{product.description}</p>

//               <div className="mb-4">
//                 <p className={`font-semibold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
//                   {product.stock > 0 ? '✓ In Stock' : '✕ Out of Stock'} ({product.stock} available)
//                 </p>
//               </div>

//               {product.colors.length > 0 && (
//                 <div className="mb-4">
//                   <label className="block text-white font-semibold mb-2">Color</label>
//                   <div className="flex gap-3 flex-wrap">
//                     {product.colors.map((color: string) => (
//                       <button
//                         key={color}
//                         onClick={() => setSelectedColor(color)}
//                         className={`px-4 py-2 rounded-lg font-medium transition ${
//                           selectedColor === color
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-[#181e2a] text-[#bfc8e6] border border-[#2d3f52] hover:border-[#3d4f62]'
//                         }`}
//                       >
//                         {color}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="mb-4">
//                 <label className="block text-white font-semibold mb-2">Size (US)</label>
//                 <div className="grid grid-cols-4 gap-2">
//                   {product.sizes.map((size: number) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`py-3 rounded-lg font-medium transition ${
//                         selectedSize === size
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-[#181e2a] text-[#bfc8e6] border border-[#2d3f52] hover:border-[#3d4f62]'
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-white font-semibold mb-2">Quantity</label>
//                 <div className="flex items-center gap-3 max-w-xs">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="bg-[#181e2a] hover:bg-[#2d3f52] text-white w-10 h-10 rounded-lg transition"
//                   >
//                     −
//                   </button>
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
//                     className="flex-1 bg-[#181e2a] border border-[#2d3f52] text-white text-center py-2 rounded-lg"
//                   />
//                   <button
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="bg-[#181e2a] hover:bg-[#2d3f52] text-white w-10 h-10 rounded-lg transition"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               <button
//                 onClick={handleAddToCart}
//                 disabled={!product.stock}
//                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg transition disabled:opacity-50"
//               >
//                 🛒 Add to Cart
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//             <div className="lg:col-span-2">
//               <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
//             </div>

//             <div className="lg:col-span-3">
//               <ReviewsList reviews={reviews} onDeleteReview={handleDeleteReview} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, use, useEffect } from 'react';
import ReviewForm from '@/app/components/ReviewForm';
import ReviewsList from '@/app/components/ReviewsList';
import SizeChart from '@/app/components/SizeChart';
import { SHOES } from '@/lib/mockShoes';
import { useStore } from '@/lib/store';
import { useWishlistStore } from '@/lib/wishlistStore';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  date: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const addToCart = useStore((state) => state.addToCart);
  
  // Wishlist hooks
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  
  const product = SHOES.find((shoe) => shoe.id === id);
  
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      rating: 3,
      title: 'amazing',
      body: 'good product',
      author: 'Anonymous',
      date: '22 Feb 2026',
    },
  ]);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0f1621]">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
          <Link href="/products" className="text-blue-500 hover:text-blue-400">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // ✅ VALIDATION: Check BOTH color AND size are selected
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      const missing = [];
      if (!selectedColor) missing.push('color');
      if (!selectedSize) missing.push('size');
      toast.error(`❌ Please select ${missing.join(' and ')} before adding to cart!`, { autoClose: 2500 });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.image,
    });

    toast.success(`✅ Added ${quantity}x ${product.name} to cart!`, { autoClose: 2000 });
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`❤️ Removed from wishlist`, { autoClose: 1500 });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        stock: product.stock,
      });
      toast.success(`✅ Added to wishlist!`, { autoClose: 1500 });
    }
  };

  const handleReviewSubmitted = (newReview: { rating: number; title: string; body: string }) => {
    const review: Review = {
      id: String(reviews.length + 1),
      ...newReview,
      author: 'You',
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    setReviews([review, ...reviews]);
    toast.success('⭐ Review submitted successfully!', { autoClose: 2000 });
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter((r) => r.id !== reviewId));
    toast.info('🗑️ Review deleted', { autoClose: 1500 });
  };

  return (
    <div className="min-h-screen bg-[#0f1621] flex flex-col text-white">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <Link href="/products" className="text-gray-400 hover:text-white text-xs sm:text-sm mb-6 inline-flex items-center gap-2 transition-colors">
            ← Back to Shop
          </Link>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start mb-12 lg:mb-16">
            
            {/* LEFT: Image Container */}
            <div className="relative aspect-square bg-gradient-to-tr from-[#181e2a] to-[#0f172a] rounded-xl sm:rounded-2xl lg:rounded-3xl border border-purple-500/20 flex items-center justify-center p-6 sm:p-8 lg:p-12 shadow-xl">
              <div className="absolute inset-0 bg-purple-500/5 rounded-xl sm:rounded-2xl lg:rounded-3xl blur-3xl" />
              
              <img
                src={product.image}
                alt={product.name}
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* RIGHT: Product Info */}
            <div className="flex flex-col">
              <p className="text-purple-400 font-bold uppercase tracking-wide text-[10px] sm:text-xs mb-2">{product.brand}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 tracking-tight">{product.name}</h1>

              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="flex text-yellow-400 text-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= Math.round(product.rating) ? "text-yellow-400" : "text-gray-700"}>★</span>
                  ))}
                </div>
                <span className="text-gray-500 text-xs sm:text-sm font-medium">({product.reviews} reviews)</span>
              </div>

              <div className="bg-gray-900/50 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-purple-500/20 mb-6 sm:mb-8">
                <div className="flex items-baseline gap-2 sm:gap-3 lg:gap-4 mb-2">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black">₹{product.price.toLocaleString()}</span>
                  <span className="text-gray-500 line-through text-lg sm:text-xl">₹{product.originalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-xs sm:text-sm">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                  </span>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">{product.description}</p>

              {/* Status */}
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className={`h-2 w-2 rounded-full animate-pulse ${product.stock > 0 ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-red-500'}`} />
                <span className={`text-xs sm:text-sm font-bold uppercase ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'} — {product.stock} units
                </span>
              </div>

              {/* Options Section */}
              <div className="space-y-5 sm:space-y-6 mb-6 sm:mb-8">
                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div>
                    <label className="block text-gray-500 text-[10px] sm:text-xs uppercase font-black tracking-widest mb-2 sm:mb-3">
                      Color {selectedColor && `(${selectedColor})`}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all border ${
                            selectedColor === color 
                              ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/50' 
                              : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-purple-600 hover:text-white'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <label className="block text-gray-500 text-[10px] sm:text-xs uppercase font-black tracking-widest">
                      Size (US) {selectedSize && `(${selectedSize})`}
                    </label>
                    <button
                      onClick={() => setSizeChartOpen(true)}
                      className="text-purple-400 hover:text-purple-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      📏 Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1 sm:gap-2">
                    {product.sizes.map((size: number) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-bold transition-all border ${
                          selectedSize === size 
                            ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/50' 
                            : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-purple-600 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-gray-500 text-[10px] sm:text-xs uppercase font-black tracking-widest mb-2 sm:mb-3">Quantity</label>
                  <div className="flex items-center justify-between bg-gray-900 border border-purple-500/30 rounded-lg p-1 max-w-fit">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center hover:bg-gray-800 rounded transition-colors text-lg"
                    >
                      −
                    </button>
                    <span className="font-bold text-sm sm:text-base px-3 sm:px-4">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center hover:bg-gray-800 rounded transition-colors text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className={`flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-all uppercase tracking-wide ${
                    !product.stock
                      ? 'bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/20'
                  }`}
                >
                  🛒 Add to Cart
                </button>
                {mounted && (
                  <button
                    onClick={handleWishlistToggle}
                    className={`w-12 sm:w-14 h-12 sm:h-14 rounded-lg sm:rounded-xl border-2 transition-all flex items-center justify-center text-xl sm:text-2xl hover:scale-110 active:scale-95 ${
                      isInWishlist(product.id)
                        ? 'bg-red-600/20 border-red-600 text-red-500'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-red-600 hover:text-red-500'
                    }`}
                  >
                    ❤️
                  </button>
                )}
              </div>

              {/* Info Message */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg text-xs sm:text-sm text-purple-200">
                ⚠️ Please select BOTH color and size to add to cart
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 border-t border-purple-500/20 pt-12 lg:pt-16">
            <div className="lg:col-span-2">
              <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
            </div>

            <div className="lg:col-span-3">
              <ReviewsList reviews={reviews} onDeleteReview={handleDeleteReview} />
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChart isOpen={sizeChartOpen} onClose={() => setSizeChartOpen(false)} />
    </div>
  );
}