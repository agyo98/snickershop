import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, MessageCircle, ArrowLeft } from "lucide-react";

const CheckoutFail = () => {
  const location = useLocation();
  const errorMessage = location.state?.error || "결제 처리 중 오류가 발생했습니다.";

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
      <main className="flex-1 flex items-center justify-center py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6 animate-fade-up">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>

            {/* Error Message */}
            <h1 className="font-display text-4xl text-foreground mb-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              결제 실패
            </h1>
            <p className="text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              {errorMessage}
            </p>

            {/* Error Details Card */}
            <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-medium text-foreground mb-3">문제 해결 방법</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  카드 정보가 올바르게 입력되었는지 확인해주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  카드 한도를 확인해주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  브라우저를 새로고침한 후 다시 시도해주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  문제가 계속되면 고객센터로 문의해주세요.
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 animate-fade-up" style={{ animationDelay: '0.25s' }}>
              <Link to="/checkout" className="block">
                <Button variant="hero" size="lg" className="w-full gap-2">
                  <RefreshCw className="w-4 h-4" />
                  다시 시도하기
                </Button>
              </Link>
              <div className="flex gap-3">
                <Link to="/" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    홈으로
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="flex-1 gap-2">
                  <MessageCircle className="w-4 h-4" />
                  문의하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutFail;
