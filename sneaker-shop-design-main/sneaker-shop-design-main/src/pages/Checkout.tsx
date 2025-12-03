import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from "@/data/mockProducts";

interface CartItem {
  product: typeof mockProducts[0];
  size: string;
  quantity: number;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get items from state or use default mock items
  const items: CartItem[] = location.state?.items || [
    { product: mockProducts[0], size: "270", quantity: 1 },
  ];

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    zipcode: "",
    address: "",
    addressDetail: "",
    memo: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast({
        title: "배송 정보를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/checkout/success", {
        state: {
          orderNumber: `ORD-${Date.now()}`,
          items,
          total,
          shippingInfo,
        },
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="font-display text-lg text-primary-foreground">S</span>
              </div>
              <span className="font-display text-xl text-foreground">SNEAKR</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              안전한 결제
            </div>
          </div>
        </div>
      </header>

      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            쇼핑 계속하기
          </Link>

          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-8">결제하기</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Information */}
                <section className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-display text-xl text-foreground">배송 정보</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">받는 분 *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="홍길동"
                        value={shippingInfo.name}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">연락처 *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="010-1234-5678"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipcode">우편번호 *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="zipcode"
                          name="zipcode"
                          placeholder="12345"
                          value={shippingInfo.zipcode}
                          onChange={handleInputChange}
                          className="h-12 bg-secondary border-border flex-1"
                        />
                        <Button type="button" variant="outline" className="h-12">
                          검색
                        </Button>
                      </div>
                    </div>
                    <div></div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">주소 *</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="서울시 강남구 테헤란로 123"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="addressDetail">상세주소</Label>
                      <Input
                        id="addressDetail"
                        name="addressDetail"
                        placeholder="101동 1001호"
                        value={shippingInfo.addressDetail}
                        onChange={handleInputChange}
                        className="h-12 bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="memo">배송 메모</Label>
                      <div className="relative">
                        <select
                          id="memo"
                          name="memo"
                          value={shippingInfo.memo}
                          onChange={handleInputChange}
                          className="w-full h-12 bg-secondary border border-border rounded-lg px-4 text-foreground appearance-none cursor-pointer"
                        >
                          <option value="">배송 메모를 선택해주세요</option>
                          <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                          <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                          <option value="배송 전 연락 부탁드립니다">배송 전 연락 부탁드립니다</option>
                          <option value="직접 입력">직접 입력</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment Method */}
                <section className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-display text-xl text-foreground">결제 수단</h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: "card", label: "신용카드" },
                      { id: "kakao", label: "카카오페이" },
                      { id: "naver", label: "네이버페이" },
                      { id: "bank", label: "무통장입금" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`h-14 rounded-lg border text-sm font-medium transition-all ${
                          paymentMethod === method.id
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-secondary hover:border-primary/50 text-muted-foreground'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>

                  {/* Payment Widget Container */}
                  <div className="mt-6 p-6 bg-secondary/50 rounded-xl border border-dashed border-border">
                    <p className="text-center text-muted-foreground text-sm">
                      {paymentMethod === "card" && "결제 위젯이 여기에 표시됩니다"}
                      {paymentMethod === "kakao" && "카카오페이 결제창이 연동됩니다"}
                      {paymentMethod === "naver" && "네이버페이 결제창이 연동됩니다"}
                      {paymentMethod === "bank" && "입금 계좌 정보가 표시됩니다"}
                    </p>
                  </div>
                </section>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                  <h2 className="font-display text-xl text-foreground mb-6">주문 상품</h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground uppercase">
                            {item.product.brand}
                          </p>
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            사이즈: {item.size} | 수량: {item.quantity}
                          </p>
                          <p className="text-sm font-display text-foreground mt-1">
                            ₩{formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">상품 금액</span>
                      <span className="text-foreground">₩{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">배송비</span>
                      <span className="text-foreground">
                        {shipping === 0 ? (
                          <span className="text-primary">무료</span>
                        ) : (
                          `₩${formatPrice(shipping)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="font-medium text-foreground">총 결제 금액</span>
                      <span className="font-display text-2xl text-foreground">
                        ₩{formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Agreement */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" required className="mt-1 rounded border-border" />
                      <span className="text-xs text-muted-foreground">
                        주문 내용을 확인하였으며, 결제에 동의합니다.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full mt-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "결제 처리 중..." : `₩${formatPrice(total)} 결제하기`}
                  </Button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4" />
                    SSL 암호화로 안전하게 보호됩니다
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
