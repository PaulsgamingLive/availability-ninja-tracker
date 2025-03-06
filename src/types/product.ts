
export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'LIMITED_STOCK' | 'UNKNOWN';

export type Retailer = {
  id: string;
  name: string;
  url: string;
  logo?: string;
};

export type ProductPrice = {
  retailerId: string;
  price: number;
  currency: string;
  status: StockStatus;
  lastUpdated: string;
  url: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  image: string;
  description: string;
  prices: ProductPrice[];
};

export type ProductFilter = {
  search: string;
  category: string | null;
  brand: string | null;
  inStockOnly: boolean;
};
