import { Link, useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CheckoutSuccess = () => {
  const location = useLocation();
  const { toast } = useToast();
  const orderData = location.state;

  // Redirect if no order data
  if (!orderData) {
    return <Navigate to="/" replace />;
  }

  const { orderNumber, items, total, shippingInfo } = orderData;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    toast({
      title: "주문번호가 복사되었습니다",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="font-display text-lg text-primary-foreground">S</span>
              </div>
              <span className="font-display text-xl text-foreground">SNEAKR</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon & Message */}
            <div className="text-center mb-10 animate-fade-up">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
                주문 완료!
              </h1>
              <p className="text-muted-foreground">
                주문이 성공적으로 완료되었습니다. 감사합니다!
              </p>
            </div>

            {/* Order Info Card */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {/* Order Number */}
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">주문번호</p>
                  <p className="font-display text-xl text-foreground">{orderNumber}</p>
                </div>
                <Button variant="outline" size="sm" onClick={copyOrderNumber} className="gap-2">
                  <Copy className="w-4 h-4" />
                  복사
                </Button>
              </div>

              {/* Order Items */}
              <div className="py-6 border-b border-border">
                <h3 className="font-medium text-foreground mb-4">주문 상품</h3>
                <div className="space-y-4">
                  {items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          사이즈: {item.size} | 수량: {item.quantity}
                        </p>
                      </div>
                      <p className="font-display text-foreground">
                        ₩{formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="py-6 border-b border-border">
                <h3 className="font-medium text-foreground mb-4">배송 정보</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-foreground">{shippingInfo.name}</p>
                  <p className="text-muted-foreground">{shippingInfo.phone}</p>
                  <p className="text-muted-foreground">
                    {shippingInfo.address} {shippingInfo.addressDetail}
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 flex justify-between items-center">
                <span className="font-medium text-foreground">총 결제 금액</span>
                <span className="font-display text-3xl text-foreground">
                  ₩{formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-secondary/50 rounded-xl p-6 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">배송 안내</h3>
                  <p className="text-sm text-muted-foreground">
                    주문하신 상품은 영업일 기준 1-3일 내에 발송됩니다.
                    <br />
                    배송 시작 시 알림을 보내드립니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/orders" className="flex-1">
                <Button variant="outline" size="lg" className="w-full gap-2">
                  주문 내역 보기
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button variant="hero" size="lg" className="w-full">
                  쇼핑 계속하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutSuccess;
