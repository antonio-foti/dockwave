
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface SearchFilters {
  isOfficial: boolean;
  isAutomated: boolean;
  minStars: number;
}

interface ImageSearchFormProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export const ImageSearchForm = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: ImageSearchFormProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Docker Hub images..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="official"
                  checked={filters.isOfficial}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, isOfficial: !!checked })
                  }
                />
                <Label htmlFor="official">Official Images</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="automated"
                  checked={filters.isAutomated}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, isAutomated: !!checked })
                  }
                />
                <Label htmlFor="automated">Automated Builds</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="minStars">Min Stars:</Label>
                <Input
                  id="minStars"
                  type="number"
                  value={filters.minStars}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, minStars: parseInt(e.target.value) || 0 })
                  }
                  className="w-20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
