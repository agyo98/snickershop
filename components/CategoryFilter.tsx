'use client';

import { SlidersHorizontal } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = ['전체', '농구화', '러닝화', '라이프스타일', '콜라보', '클래식'];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
      <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4" />
        필터
      </button>
    </div>
  );
}

