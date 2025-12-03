import Navbar from '@/components/Navbar';
import CartClient from '@/components/CartClient';

export default function CartPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">장바구니</h1>
        <CartClient />
      </div>
    </div>
  );
}

