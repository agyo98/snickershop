import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductsGrid from '@/components/ProductsGrid';

export default async function Home() {
  let products = [];
  
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('products_sneaker')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50); // 필터링을 위해 더 많은 상품 로드

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      products = data || [];
    }
  } catch (error) {
    console.error('Error initializing Supabase client or fetching products:', error);
    // 에러가 발생해도 빈 배열로 계속 진행
    products = [];
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Products Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ProductsGrid products={products} />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-4">SNEAKR</h3>
                <p className="text-sm text-gray-600">
                  프리미엄 스니커즈 마켓플레이스
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">쇼핑</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>전체 상품</li>
                  <li>신상품</li>
                  <li>브랜드</li>
                  <li>카테고리</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">고객센터</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>자주 묻는 질문</li>
                  <li>배송 안내</li>
                  <li>반품/교환</li>
                  <li>정품 인증</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">회사</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>회사 소개</li>
                  <li>이용약관</li>
                  <li>개인정보처리방침</li>
                  <li>제휴 문의</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
              © 2024 SNEAKR. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
