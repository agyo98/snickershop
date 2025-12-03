import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { getProductById, mockProducts } from "@/data/mockProducts";
import ProductCard from "@/components/product/ProductCard";
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Shield, 
  Truck, 
  RefreshCw,
  Minus,
  Plus,
  Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = getProductById(id || "");
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-foreground mb-4">상품을 찾을 수 없습니다</h1>
          <Link to="/">
            <Button variant="outline">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "사이즈를 선택해주세요",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "장바구니에 추가되었습니다",
      description: `${product.name} - ${selectedSize}`,
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({
        title: "사이즈를 선택해주세요",
        variant: "destructive",
      });
      return;
    }
    navigate("/checkout", { 
      state: { 
        items: [{ product, size: selectedSize, quantity }] 
      } 
    });
  };

  const relatedProducts = mockProducts
    .filter(p => p.id !== product.id && p.brand === product.brand)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={false} cartItemCount={3} />

      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 px-4 py-1.5 text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                    NEW
                  </span>
                )}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border hover:border-primary/50 transition-all"
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${isLiked ? 'fill-primary text-primary' : 'text-foreground'}`}
                  />
                </button>
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand & Name */}
              <div>
                <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
                  {product.brand}
                </p>
                <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl text-foreground">
                    ₩{formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₩{formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-medium">사이즈</Label>
                  <button className="text-sm text-primary hover:underline">
                    사이즈 가이드
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-secondary hover:border-primary/50 text-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <Label className="text-foreground font-medium">수량</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="xl"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  장바구니
                </Button>
                <Button
                  variant="hero"
                  size="xl"
                  className="flex-1"
                  onClick={handleBuyNow}
                >
                  바로 구매
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">정품 보장</p>
                  <p className="text-xs text-muted-foreground">100% 인증</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">무료 배송</p>
                  <p className="text-xs text-muted-foreground">5만원 이상</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2">
                    <RefreshCw className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">반품 가능</p>
                  <p className="text-xs text-muted-foreground">7일 이내</p>
                </div>
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-border">
                <h3 className="font-display text-xl text-foreground mb-3">상품 설명</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8">
                {product.brand}의 다른 상품
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard
                    key={relProduct.id}
                    id={relProduct.id}
                    name={relProduct.name}
                    brand={relProduct.brand}
                    price={relProduct.price}
                    image={relProduct.image}
                    isNew={relProduct.isNew}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

// Label component for this page
const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`block text-sm ${className}`}>{children}</span>
);

export default ProductDetail;
