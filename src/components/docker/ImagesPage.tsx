
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Download, Trash2, Tag } from 'lucide-react';
import { dockerApi } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const ImagesPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images, isLoading, error } = useQuery({
    queryKey: ['images'],
    queryFn: dockerApi.getImages,
  });

  const handleRemoveImage = async (imageId: string, imageName: string) => {
    try {
      toast({
        title: "Removing image...",
        description: `Removing ${imageName}`,
      });

      await dockerApi.removeImage(imageId);
      
      toast({
        title: "Image removed successfully",
        description: `${imageName} has been removed`,
      });

      // Refresh the images list
      queryClient.invalidateQueries({ queryKey: ['images'] });
    } catch (error) {
      toast({
        title: "Failed to remove image",
        description: `Error removing ${imageName}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            <p>Failed to load images</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure Docker is running and the backend is accessible
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatSize = (size: number) => {
    const MB = size / (1024 * 1024);
    const GB = MB / 1024;
    return GB > 1 ? `${GB.toFixed(1)} GB` : `${MB.toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Images ({images?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!images || images.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No images found</p>
            <p className="text-sm">Pull an image from Docker Hub to see it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {images.map((image: any) => (
              <Card key={image.Id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">
                        {image.RepoTags?.[0] || image.Id.slice(7, 19)}
                      </h3>
                      {image.RepoTags?.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Size: {formatSize(image.Size)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(image.Created * 1000).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRemoveImage(image.Id, image.RepoTags?.[0] || image.Id.slice(7, 19))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
