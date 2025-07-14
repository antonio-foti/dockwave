
import { Star, Download, Clock, Shield, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { dockerApi } from '@/services/api';

interface ImageCardProps {
  image: {
    name: string;
    description: string;
    star_count?: number;
    pull_count?: number;
    is_official?: boolean;
    is_automated?: boolean;
  };
}

export const ImageCard = ({ image }: ImageCardProps) => {
  const { toast } = useToast();

  const handlePull = async () => {
    try {
      toast({
        title: "Pulling image...",
        description: `Starting pull for ${image.name}`,
      });
      
      console.log('Attempting to pull image:', image.name);
      await dockerApi.pullImage(image.name, 'latest');
      
      toast({
        title: "Image pulled successfully",
        description: `${image.name} is now available locally`,
      });
    } catch (error) {
      console.error('Pull image error:', error);
      toast({
        title: "Pull failed",
        description: `Failed to pull ${image.name}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{image.name}</CardTitle>
          <div className="flex gap-1">
            {image.is_official && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Official
              </Badge>
            )}
            {image.is_automated && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Auto
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {image.description || 'No description available'}
        </p>

        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {formatNumber(image.star_count || 0)}
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {formatNumber(image.pull_count || 0)}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handlePull} className="flex-1">
            Pull Image
          </Button>
          <Button variant="outline" size="icon">
            <Tag className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
