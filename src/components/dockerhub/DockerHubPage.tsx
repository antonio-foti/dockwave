
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Star, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageSearchForm } from './ImageSearchForm';
import { ImageCard } from './ImageCard';
import { AuthDialog } from './AuthDialog';
import { useDockerHubAuth } from '@/hooks/useDockerHubAuth';
import { dockerHubApi } from '@/services/api';

export const DockerHubPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    isOfficial: false,
    isAutomated: false,
    minStars: 0,
  });
  const { isAuthenticated } = useDockerHubAuth();

  const { data: searchResults, isLoading: isSearchLoading, error: searchError } = useQuery({
    queryKey: ['dockerhub-search', searchQuery, searchFilters],
    queryFn: () => dockerHubApi.searchImages(searchQuery, searchFilters),
    enabled: searchQuery.length > 0,
  });

  const { data: popularImages, isLoading: isPopularLoading, error: popularError } = useQuery({
    queryKey: ['dockerhub-popular'],
    queryFn: () => dockerHubApi.getPopularImages(),
    retry: 2,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Docker Hub</h2>
          <p className="text-muted-foreground">
            Search and pull images from Docker Hub
          </p>
        </div>
        <AuthDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Docker Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageSearchForm
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
          />
        </CardContent>
      </Card>

      {searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results for "{searchQuery}"</CardTitle>
          </CardHeader>
          <CardContent>
            {isSearchLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="ml-2 text-muted-foreground mt-2">Searching Docker Hub...</p>
              </div>
            ) : searchError ? (
              <div className="flex items-center justify-center py-8 text-destructive">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>Failed to search Docker Hub. Please try again.</p>
              </div>
            ) : searchResults?.results && searchResults.results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.results.map((image: any) => (
                  <ImageCard key={image.name} image={image} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No results found for "{searchQuery}"</p>
                <p className="text-sm mt-1">Try searching for popular images like "nginx", "ubuntu", or "node"</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Popular Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPopularLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground mt-2">Loading popular images...</p>
              </div>
            ) : popularError ? (
              <div className="flex items-center justify-center py-8 text-destructive">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>Failed to load popular images. Please try searching manually.</p>
              </div>
            ) : popularImages?.results && popularImages.results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularImages.results.map((image: any) => (
                  <ImageCard key={image.name} image={image} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No popular images found. Try searching for specific images.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
