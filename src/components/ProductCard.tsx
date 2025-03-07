
import { Product, ProductPrice, Retailer } from "@/types/product";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { retailers } from "@/data/retailers";
import { ExternalLink, Info } from "lucide-react";
import StockStatusBadge from "./StockStatusBadge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  formatCurrency, 
  formatRelativeTime, 
  getBestPrice, 
  getOverallStockStatus 
} from "@/utils/stockUtils";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const bestPrice = getBestPrice(product.prices);
  const overallStatus = getOverallStockStatus(product.prices);

  const getRetailerById = (id: string): Retailer | undefined => {
    return retailers.find(retailer => retailer.id === id);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-primary/10 h-full flex flex-col bg-card/60">
      <CardHeader className="p-0">
        <div className="relative h-48 bg-secondary/50 flex items-center justify-center overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-auto max-h-full w-auto max-w-full object-contain p-6"
          />
          <div className="absolute top-2 right-2">
            <StockStatusBadge status={overallStatus} showText={false} size="lg" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
              <h3 className="font-semibold line-clamp-2">{product.name}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <StockStatusBadge status={overallStatus} />
          </div>
          
          {bestPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(bestPrice.price, bestPrice.currency)}
              </span>
              <span className="text-xs text-muted-foreground">
                at {getRetailerById(bestPrice.retailerId)?.name}
              </span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              No in-stock prices available
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-6">
        <Button className="w-full gap-2" variant="outline" asChild>
          <Link to={`/product/${product.id}`} className="flex items-center">
            <span>View Details</span>
            <Info className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
