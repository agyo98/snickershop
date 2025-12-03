import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import ProductCard from '@/components/ProductCard';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  try {
    const supabase = await createClient();
    
    const { data: product, error } = await supabase
      .from('products_sneaker')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !product) {
      notFound();
    }

    // Get related products (same brand)
    const { data: relatedProducts } = await supabase
      .from('products_sneaker')
      .select('*')
      .eq('brand', product.brand)
      .neq('id', product.id)
      .limit(4);

    return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로가기
          </Link>

          <ProductDetailClient product={product} />

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <section className="mt-20">
              <h2 className="font-bold text-2xl md:text-3xl text-gray-900 mb-8">
                {product.brand}의 다른 상품
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}
