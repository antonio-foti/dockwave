
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network } from 'lucide-react';
import { dockerApi } from '@/services/api';
import { Badge } from '@/components/ui/badge';

export const NetworksPage = () => {
  const { data: networks, isLoading, error } = useQuery({
    queryKey: ['networks'],
    queryFn: dockerApi.getNetworks,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Networks
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
            <Network className="h-5 w-5" />
            Networks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            <p>Failed to load networks</p>
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
          <Network className="h-5 w-5" />
          Networks ({networks?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!networks || networks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No networks found</p>
            <p className="text-sm">Create a network to see it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {networks.map((network: any) => (
              <Card key={network.Id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{network.Name}</h3>
                      <Badge variant="outline">{network.Driver}</Badge>
                      <Badge variant={network.Internal ? 'secondary' : 'default'}>
                        {network.Internal ? 'Internal' : 'External'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scope: {network.Scope}
                    </p>
                    {network.IPAM?.Config?.[0]?.Subnet && (
                      <p className="text-sm text-muted-foreground">
                        Subnet: {network.IPAM.Config[0].Subnet}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(network.Created).toLocaleString()}
                    </p>
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
