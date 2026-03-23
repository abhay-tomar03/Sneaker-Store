
'use client';

import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { SHOES } from "@/lib/mockShoes";
import { useFilterStore } from "@/lib/filterStore";

const brands = ["All", "Adidas", "Asics", "Jordan", "New Balance", "Nike", "Puma"];
const categories = ["All", "Running", "Basketball", "Casual", "Lifestyle", "Training"];

export default function ProductsPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { brand, category, search, priceRange, setBrand, setCategory, setSearch, setPriceRange, resetFilters } = useFilterStore();
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const filtered = SHOES.filter((p) =>
    (brand === "All" || p.brand === brand) &&
    (category === "All" || p.category === category) &&
    (p.price >= localPriceRange[0] && p.price <= localPriceRange[1]) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...localPriceRange] as [number, number];
    newRange[index] = value;
    
    if (index === 0 && value <= localPriceRange[1]) {
      setLocalPriceRange(newRange);
      setPriceRange(newRange);
    } else if (index === 1 && value >= localPriceRange[0]) {
      setLocalPriceRange(newRange);
      setPriceRange(newRange);
    }
  };

  if (!isHydrated) {
    return (
      <div className="bg-[#0f1621] min-h-screen flex items-center justify-center">
        <p className="text-white">Loading filters...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1621] min-h-screen">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden fixed top-20 left-4 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:from-purple-700 hover:to-pink-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM15 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 14a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM15 14a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" />
          </svg>
          Filters
        </button>

        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30 top-16"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Sidebar Filter */}
        <aside className={`fixed lg:static lg:w-80 top-0 left-0 h-full lg:h-auto w-64 z-40 p-6 bg-gradient-to-b from-[#181e2a] to-[#1a2535] border-r border-purple-500/20 flex flex-col gap-6 lg:min-h-screen shadow-xl overflow-y-auto transition-transform duration-300 ${
          showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Filters</h2>
              <div className="flex gap-2">
                <button 
                  className="text-xs text-blue-400 hover:text-blue-300 transition font-semibold" 
                  onClick={resetFilters}
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-white hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Search Filter */}
            <div className="mb-6">
              <label className="block text-sm text-[#bfc8e6] mb-3 font-semibold">Search</label>
              <input
                className="w-full rounded-lg bg-[#232a3a] text-white px-4 py-3 border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all shadow-md"
                placeholder="Search shoes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Price Range Slider */}
            <div className="mb-8 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <div className="text-sm text-[#bfc8e6] mb-4 font-semibold">Price Range</div>
              
              <div className="space-y-4">
                {/* Min Price */}
                <div>
                  <label className="text-xs text-[#7a8ba8] mb-2 block">Min: ₹{localPriceRange[0].toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={localPriceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${(localPriceRange[0]/50000)*100}%, #374151 ${(localPriceRange[0]/50000)*100}%, #374151 100%)`
                    }}
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="text-xs text-[#7a8ba8] mb-2 block">Max: ₹{localPriceRange[1].toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={localPriceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${(localPriceRange[1]/50000)*100}%, #374151 ${(localPriceRange[1]/50000)*100}%, #374151 100%)`
                    }}
                  />
                </div>

                {/* Price Display */}
                <div className="bg-emerald-600/20 rounded px-3 py-2 border border-emerald-500/30 text-center">
                  <p className="text-white font-bold text-sm">₹{localPriceRange[0].toLocaleString()} - ₹{localPriceRange[1].toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-8 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-sm text-[#bfc8e6] mb-3 font-semibold">Brand</div>
              <div className="space-y-2">
                {brands.map(b => (
                  <label key={b} className="flex items-center cursor-pointer hover:opacity-80 transition">
                    <input
                      type="radio"
                      name="brand"
                      checked={brand === b}
                      onChange={() => setBrand(b)}
                      className="w-4 h-4 accent-purple-500 cursor-pointer"
                    />
                    <span className="text-[#e0e6f7] text-sm ml-3 font-medium hover:text-purple-400 transition">{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <div className="text-sm text-[#bfc8e6] mb-3 font-semibold">Category</div>
              <div className="space-y-2">
                {categories.map(c => (
                  <label key={c} className="flex items-center cursor-pointer hover:opacity-80 transition">
                    <input
                      type="radio"
                      name="category"
                      checked={category === c}
                      onChange={() => setCategory(c)}
                      className="w-4 h-4 accent-pink-500 cursor-pointer"
                    />
                    <span className="text-[#e0e6f7] text-sm ml-3 font-medium hover:text-pink-400 transition">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full mt-16 lg:mt-0">
          <div className="mb-6 sm:mb-8">
            <p className="text-[#7a8ba8] text-xs sm:text-sm mb-3 sm:mb-4">Discover premium sneakers from top brands</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-[#bfc8e6] text-xs sm:text-sm font-semibold">
                Showing <span className="text-purple-400 font-bold">{filtered.length}</span> of <span className="text-purple-400 font-bold">{SHOES.length}</span> sneakers
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {filtered.map((shoe) => (
                <ProductCard key={shoe.id} product={shoe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="text-5xl sm:text-6xl mb-4">👟</div>
              <p className="text-[#7a8ba8] text-base sm:text-lg mb-2">No sneakers found</p>
              <p className="text-[#5a6b88] text-xs sm:text-sm">Try adjusting your filters</p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #059669;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        input[type='range']::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #059669;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }
      `}</style>
    </div>
  );
}