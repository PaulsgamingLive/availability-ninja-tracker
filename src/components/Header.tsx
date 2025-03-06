
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-background/90 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Stock Checker
            </h1>
            <p className="text-xs text-muted-foreground">
              Real-Time Product Availability Tracker
            </p>
          </div>
        </div>
        
        <div className="w-full sm:w-auto flex-1 sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="w-full pl-9 bg-secondary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">Refresh All</Button>
          <Button size="sm">Add Product</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
