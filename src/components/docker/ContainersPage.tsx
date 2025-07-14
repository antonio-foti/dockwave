
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container, Play, Square, RotateCcw, Trash2 } from 'lucide-react';
import { dockerApi } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const ContainersPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: containers, isLoading, error } = useQuery({
    queryKey: ['containers'],
    queryFn: dockerApi.getContainers,
  });

  const handleContainerAction = async (action: string, containerId: string, containerName: string) => {
    try {
      let actionFn;
      let actionText;
      
      switch (action) {
        case 'start':
          actionFn = () => dockerApi.startContainer(containerId);
          actionText = 'Starting';
          break;
        case 'stop':
          actionFn = () => dockerApi.stopContainer(containerId);
          actionText = 'Stopping';
          break;
        case 'restart':
          actionFn = () => dockerApi.restartContainer(containerId);
          actionText = 'Restarting';
          break;
        case 'remove':
          actionFn = () => dockerApi.removeContainer(containerId);
          actionText = 'Removing';
          break;
        default:
          throw new Error('Unknown action');
      }

      toast({
        title: `${actionText} container...`,
        description: `${actionText} ${containerName}`,
      });

      await actionFn();
      
      toast({
        title: `Container ${action}ed successfully`,
        description: `${containerName} has been ${action}ed`,
      });

      // Refresh the containers list
      queryClient.invalidateQueries({ queryKey: ['containers'] });
    } catch (error) {
      toast({
        title: `Failed to ${action} container`,
        description: `Error ${action}ing ${containerName}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Container className="h-5 w-5" />
            Containers
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
            <Container className="h-5 w-5" />
            Containers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            <p>Failed to load containers</p>
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
          <Container className="h-5 w-5" />
          Containers ({containers?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!containers || containers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Container className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No containers found</p>
            <p className="text-sm">Create or run a container to see it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {containers.map((container: any) => (
              <Card key={container.Id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">
                        {container.Names?.[0]?.replace('/', '') || container.Id.slice(0, 12)}
                      </h3>
                      <Badge variant={container.State === 'running' ? 'default' : 'secondary'}>
                        {container.State}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Image: {container.Image}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(container.Created * 1000).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleContainerAction('start', container.Id, container.Names?.[0]?.replace('/', '') || container.Id.slice(0, 12))}
                      disabled={container.State === 'running'}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleContainerAction('stop', container.Id, container.Names?.[0]?.replace('/', '') || container.Id.slice(0, 12))}
                      disabled={container.State !== 'running'}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleContainerAction('restart', container.Id, container.Names?.[0]?.replace('/', '') || container.Id.slice(0, 12))}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleContainerAction('remove', container.Id, container.Names?.[0]?.replace('/', '') || container.Id.slice(0, 12))}
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
