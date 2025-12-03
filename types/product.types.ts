// Product 타입 정의
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  image?: string;
  category?: string;
  description?: string | null;
  isNew?: boolean;
  created_at?: string;
}

// Cart Item 타입 정의
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  size?: string | null;
  created_at?: string;
  products_sneaker?: Product;
}

// Order 타입 정의
export interface Order {
  id: string;
  user_id: string;
  order_no: string;
  amount: number;
  status: 'READY' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';
  payment_key?: string | null;
  created_at: string;
}

// Profile 타입 정의
export interface Profile {
  id: string;
  nickname: string;
  status: 'valid' | 'deleted';
  created_at: string;
  deleted_at?: string | null;
}

