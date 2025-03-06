
import { Product, ProductPrice, StockStatus } from "@/types/product";

export const getStockStatusText = (status: StockStatus): string => {
  switch (status) {
    case 'IN_STOCK':
      return 'In Stock';
    case 'OUT_OF_STOCK':
      return 'Out of Stock';
    case 'LIMITED_STOCK':
      return 'Limited Stock';
    case 'UNKNOWN':
    default:
      return 'Unknown';
  }
};

export const getStockStatusColor = (status: StockStatus): string => {
  switch (status) {
    case 'IN_STOCK':
      return 'stock-in';
    case 'OUT_OF_STOCK':
      return 'stock-out';
    case 'LIMITED_STOCK':
      return 'stock-limited';
    case 'UNKNOWN':
    default:
      return 'stock-unknown';
  }
};

export const getOverallStockStatus = (prices: ProductPrice[]): StockStatus => {
  if (prices.some(price => price.status === 'IN_STOCK')) {
    return 'IN_STOCK';
  }
  if (prices.some(price => price.status === 'LIMITED_STOCK')) {
    return 'LIMITED_STOCK';
  }
  if (prices.every(price => price.status === 'OUT_OF_STOCK')) {
    return 'OUT_OF_STOCK';
  }
  return 'UNKNOWN';
};

export const formatCurrency = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

export const getBestPrice = (prices: ProductPrice[]): ProductPrice | null => {
  const inStockPrices = prices.filter(
    price => price.status === 'IN_STOCK' || price.status === 'LIMITED_STOCK'
  );
  
  if (inStockPrices.length === 0) {
    return null;
  }
  
  return inStockPrices.reduce((lowest, current) => 
    current.price < lowest.price ? current : lowest
  );
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
};
