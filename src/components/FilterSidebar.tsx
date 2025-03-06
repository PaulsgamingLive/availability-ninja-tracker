
import { categories, brands, countries } from "@/data/mockProducts";
import { ProductFilter } from "@/types/product";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FilterX, SlidersHorizontal, Globe } from "lucide-react";

interface FilterSidebarProps {
  filter: ProductFilter;
  onChange: (filter: ProductFilter) => void;
}

const FilterSidebar = ({ filter, onChange }: FilterSidebarProps) => {
  const handleCategoryChange = (category: string | null) => {
    onChange({ ...filter, category });
  };

  const handleBrandChange = (brand: string | null) => {
    onChange({ ...filter, brand });
  };

  const handleInStockOnlyChange = (checked: boolean) => {
    onChange({ ...filter, inStockOnly: checked });
  };

  const handleCountryChange = (country: 'US' | 'UK') => {
    onChange({ ...filter, country });
  };

  const resetFilters = () => {
    onChange({
      search: filter.search,
      category: null,
      brand: null,
      inStockOnly: false,
      country: filter.country
    });
  };

  return (
    <aside className="w-full lg:w-64 bg-secondary/30 rounded-lg p-4 h-fit sticky top-[5.5rem]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filter Products
        </h3>
        {(filter.category || filter.brand || filter.inStockOnly) && (
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 px-2 text-xs gap-1"
            onClick={resetFilters}
          >
            <FilterX className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>
      <Separator className="mb-4" />
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Region
          </h4>
          <RadioGroup
            value={filter.country}
            onValueChange={(value) => handleCountryChange(value as 'US' | 'UK')}
            className="space-y-1"
          >
            {countries.map((country) => (
              <div key={country.code} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={country.code} 
                  id={`country-${country.code}`}
                />
                <Label htmlFor={`country-${country.code}`} className="text-sm">
                  {country.name} ({country.currency})
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">Availability</h4>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="in-stock" 
              checked={filter.inStockOnly}
              onCheckedChange={(checked) => handleInStockOnlyChange(checked as boolean)}
            />
            <Label htmlFor="in-stock" className="text-sm">In Stock Only</Label>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">Categories</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="category-all" 
                checked={filter.category === null}
                onCheckedChange={() => handleCategoryChange(null)}
              />
              <Label htmlFor="category-all" className="text-sm">All Categories</Label>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category}`} 
                  checked={filter.category === category}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm">{category}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">Brands</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="brand-all" 
                checked={filter.brand === null}
                onCheckedChange={() => handleBrandChange(null)}
              />
              <Label htmlFor="brand-all" className="text-sm">All Brands</Label>
            </div>
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox 
                  id={`brand-${brand}`} 
                  checked={filter.brand === brand}
                  onCheckedChange={() => handleBrandChange(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm">{brand}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
