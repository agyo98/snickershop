export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  sizes: string[];
  isNew?: boolean;
  category: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High OG 'Chicago'",
    brand: "Nike",
    price: 450000,
    originalPrice: 520000,
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80",
    ],
    description: "1985년 처음 출시된 에어 조던 1 시카고 컬러웨이의 복각 버전입니다. 흰색, 검은색, 빨간색의 클래식한 조합으로 농구 역사상 가장 아이코닉한 스니커즈 중 하나입니다.",
    sizes: ["250", "255", "260", "265", "270", "275", "280", "285", "290"],
    isNew: true,
    category: "농구화",
  },
  {
    id: "2",
    name: "Yeezy Boost 350 V2 'Zebra'",
    brand: "Adidas",
    price: 380000,
    image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&q=80",
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&q=80",
    ],
    description: "카니예 웨스트와 아디다스의 협업으로 탄생한 이지 부스트 350 V2 제브라. 독특한 화이트/블랙 프라임닛 패턴과 부스트 미드솔로 스타일과 편안함을 동시에 제공합니다.",
    sizes: ["255", "260", "265", "270", "275", "280"],
    isNew: true,
    category: "러닝화",
  },
  {
    id: "3",
    name: "New Balance 550 'White Green'",
    brand: "New Balance",
    price: 179000,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
    ],
    description: "90년대 농구화에서 영감을 받은 뉴발란스 550. 레트로한 디자인과 깔끔한 화이트/그린 컬러웨이로 어떤 스타일에도 매치하기 좋은 데일리 스니커즈입니다.",
    sizes: ["250", "255", "260", "265", "270", "275", "280", "285"],
    category: "라이프스타일",
  },
  {
    id: "4",
    name: "Nike Dunk Low 'Panda'",
    brand: "Nike",
    price: 159000,
    originalPrice: 199000,
    image: "https://images.unsplash.com/photo-1612902456551-333ac5afa26e?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1612902456551-333ac5afa26e?w=600&q=80",
    ],
    description: "클래식한 블랙 앤 화이트 컬러웨이의 나이키 덩크 로우. 심플하면서도 세련된 디자인으로 꾸준한 인기를 얻고 있는 베스트셀러 모델입니다.",
    sizes: ["245", "250", "255", "260", "265", "270", "275"],
    isNew: true,
    category: "라이프스타일",
  },
  {
    id: "5",
    name: "Travis Scott x Air Jordan 1 Low 'Reverse Mocha'",
    brand: "Nike",
    price: 890000,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    ],
    description: "트래비스 스캇과 나이키의 콜라보레이션으로 탄생한 리버스 모카. 독특한 역스우시 디자인과 프리미엄 소재로 제작된 한정판 스니커즈입니다.",
    sizes: ["260", "265", "270", "275", "280"],
    category: "콜라보",
  },
  {
    id: "6",
    name: "Converse Chuck Taylor All Star '70",
    brand: "Converse",
    price: 95000,
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80",
    ],
    description: "1970년대 빈티지 스타일을 재현한 컨버스 척 테일러 올스타 70. 두꺼운 러버 솔과 프리미엄 캔버스로 클래식한 매력을 선사합니다.",
    sizes: ["250", "255", "260", "265", "270", "275", "280", "285", "290"],
    category: "클래식",
  },
  {
    id: "7",
    name: "Asics Gel-Kayano 14 'Silver'",
    brand: "Asics",
    price: 189000,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    ],
    description: "2000년대 초반 러닝화의 아이콘인 아식스 젤-카야노 14. Y2K 트렌드와 함께 다시 주목받고 있는 테크웨어 스타일의 스니커즈입니다.",
    sizes: ["255", "260", "265", "270", "275", "280"],
    isNew: true,
    category: "러닝화",
  },
  {
    id: "8",
    name: "Nike Air Force 1 '07 'Triple White'",
    brand: "Nike",
    price: 139000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    ],
    description: "1982년 첫 출시 이후 변함없는 인기를 자랑하는 나이키 에어포스 1. 깔끔한 올화이트 컬러웨이로 스트리트 패션의 필수 아이템입니다.",
    sizes: ["250", "255", "260", "265", "270", "275", "280", "285", "290", "295", "300"],
    category: "클래식",
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};
