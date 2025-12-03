import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "상품명은 2자 이상이어야 합니다").max(100),
  brand: z.string().min(1, "브랜드를 선택해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  price: z.string().min(1, "가격을 입력해주세요"),
  description: z.string().min(10, "상품 설명은 10자 이상이어야 합니다").max(1000),
  condition: z.string().min(1, "상품 상태를 선택해주세요"),
});

type ProductFormData = z.infer<typeof productSchema>;

const brands = [
  "Nike",
  "Adidas",
  "Jordan",
  "New Balance",
  "Converse",
  "Vans",
  "Puma",
  "Reebok",
  "Asics",
  "Other",
];

const categories = [
  "Running",
  "Basketball",
  "Lifestyle",
  "Skateboarding",
  "Training",
  "Soccer",
  "Tennis",
  "Other",
];

const conditions = [
  { value: "new", label: "새 상품 (미착용)" },
  { value: "like-new", label: "거의 새 것" },
  { value: "good", label: "상태 좋음" },
  { value: "fair", label: "보통" },
];

const sizes = ["US 5", "US 5.5", "US 6", "US 6.5", "US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5", "US 10", "US 10.5", "US 11", "US 11.5", "US 12", "US 13"];

const ProductRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brand: "",
      category: "",
      price: "",
      description: "",
      condition: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && images.length < 5) {
      const newImages = Array.from(files).slice(0, 5 - images.length).map(file => 
        URL.createObjectURL(file)
      );
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast({
        title: "이미지 필요",
        description: "최소 1개의 상품 이미지를 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (selectedSizes.length === 0) {
      toast({
        title: "사이즈 선택 필요",
        description: "최소 1개의 사이즈를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "상품 등록 완료",
      description: "상품이 성공적으로 등록되었습니다.",
    });
    
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              상품 등록
            </h1>
            <p className="text-muted-foreground">
              판매할 스니커즈 정보를 입력해주세요
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">
                  상품 이미지 <span className="text-primary">*</span>
                  <span className="text-muted-foreground font-normal ml-2">(최대 5장)</span>
                </label>
                
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border border-border bg-card"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          대표
                        </span>
                      )}
                    </div>
                  ))}
                  
                  {images.length < 5 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary bg-card hover:bg-card/80 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">업로드</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>상품명 <span className="text-primary">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="예: Nike Air Jordan 1 Retro High OG"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>브랜드 <span className="text-primary">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="브랜드 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands.map(brand => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리 <span className="text-primary">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>판매가격 <span className="text-primary">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                          <Input
                            type="number"
                            placeholder="0"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상품 상태 <span className="text-primary">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="상태 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {conditions.map(condition => (
                            <SelectItem key={condition.value} value={condition.value}>
                              {condition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Size Selection */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">
                  사이즈 <span className="text-primary">*</span>
                  <span className="text-muted-foreground font-normal ml-2">(보유 사이즈 선택)</span>
                </label>
                
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedSizes.includes(size)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상품 설명 <span className="text-primary">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="상품에 대한 상세 설명을 입력해주세요. (구매처, 구매일, 착용 횟수, 특이사항 등)"
                        className="min-h-[150px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      등록 중...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      상품 등록
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default ProductRegister;
