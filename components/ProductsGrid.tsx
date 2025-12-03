'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  image?: string;
  category?: string;
  isNew?: boolean;
}

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === '전체') {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-2">
            NEW ARRIVALS
          </h2>
          <p className="text-gray-600">
            최신 입고 상품을 만나보세요
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Products Grid */}
      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {selectedCategory === '전체' 
              ? '상품이 없습니다.' 
              : `${selectedCategory} 카테고리에 상품이 없습니다.`}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {selectedCategory === '전체' 
              ? 'Supabase에 상품 데이터를 추가해주세요.'
              : '다른 카테고리를 선택해보세요.'}
          </p>
        </div>
      )}

      {/* Load More */}
      {filteredProducts && filteredProducts.length > 0 && (
        <div className="flex justify-center mt-12">
          <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors">
            더 보기
          </button>
        </div>
      )}
    </>
  );
}

