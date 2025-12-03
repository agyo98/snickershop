import { useState } from "react";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import ProductCard from "@/components/product/ProductCard";
import { mockProducts } from "@/data/mockProducts";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "농구화", "러닝화", "라이프스타일", "콜라보", "클래식"];

  const filteredProducts = selectedCategory === "전체" 
    ? mockProducts 
    : mockProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={() => setIsLoggedIn(false)}
        cartItemCount={3}
      />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Products Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
                  NEW ARRIVALS
                </h2>
                <p className="text-muted-foreground">
                  최신 입고 상품을 만나보세요
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  필터
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    brand={product.brand}
                    price={product.price}
                    image={product.image}
                    isNew={product.isNew}
                  />
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-12">
              <Button variant="outline" size="lg">
                더 보기
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-display text-xl text-foreground mb-4">SNEAKR</h3>
                <p className="text-sm text-muted-foreground">
                  프리미엄 스니커즈 마켓플레이스
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">쇼핑</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>전체 상품</li>
                  <li>신상품</li>
                  <li>브랜드</li>
                  <li>카테고리</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">고객센터</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>자주 묻는 질문</li>
                  <li>배송 안내</li>
                  <li>반품/교환</li>
                  <li>정품 인증</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">회사</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>회사 소개</li>
                  <li>이용약관</li>
                  <li>개인정보처리방침</li>
                  <li>제휴 문의</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              © 2024 SNEAKR. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
