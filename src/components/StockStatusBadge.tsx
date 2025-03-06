
import { cn } from "@/lib/utils";
import { StockStatus } from "@/types/product";
import { getStockStatusColor, getStockStatusText } from "@/utils/stockUtils";

interface StockStatusBadgeProps {
  status: StockStatus;
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const StockStatusBadge = ({ 
  status, 
  className, 
  showText = true,
  size = "md"
}: StockStatusBadgeProps) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span 
        className={cn(
          "rounded-full animate-pulse-slow",
          sizeClasses[size],
          `bg-${getStockStatusColor(status)}`
        )}
      />
      {showText && (
        <span className={cn("font-medium", textSizeClasses[size])}>
          {getStockStatusText(status)}
        </span>
      )}
    </div>
  );
};

export default StockStatusBadge;
