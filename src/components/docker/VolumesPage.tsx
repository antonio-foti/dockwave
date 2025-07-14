
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume } from 'lucide-react';
import { dockerApi } from '@/services/api';
import { Badge } from '@/components/ui/badge';

export const VolumesPage = () => {
  const { data: volumeData, isLoading, error } = useQuery({
    queryKey: ['volumes'],
    queryFn: dockerApi.getVolumes,
  });

  const volumes = volumeData?.Volumes || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume className="h-5 w-5" />
            Volumes
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
            <Volume className="h-5 w-5" />
            Volumes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            <p>Failed to load volumes</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure Docker is running and the backend is accessible
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume className="h-5 w-5" />
          Volumes ({volumes?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!volumes || volumes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Volume className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No volumes found</p>
            <p className="text-sm">Create a volume to see it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {volumes.map((volume: any) => (
              <Card key={volume.Name} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{volume.Name}</h3>
                      <Badge variant="outline">{volume.Driver}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mountpoint: {volume.Mountpoint}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(volume.CreatedAt).toLocaleString()}
                    </p>
                    {volume.Labels && Object.keys(volume.Labels).length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">Labels:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(volume.Labels).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key}: {value as string}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
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
