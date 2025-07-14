const API_BASE_URL = 'http://localhost:3001';

export const dockerApi = {
  // Docker container operations
  getContainers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/docker/containers`);
    if (!response.ok) throw new Error('Failed to fetch containers');
    return response.json();
  },

  startContainer: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/docker/containers/${id}/start`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to start container');
    return response.json();
  },

  stopContainer: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/docker/containers/${id}/stop`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to stop container');
    return response.json();
  },

  restartContainer: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/docker/containers/${id}/restart`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to restart container');
    return response.json();
  },

  removeContainer: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/docker/containers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove container');
    return response.json();
  },

  getImages: async () => {
    const response = await fetch(`${API_BASE_URL}/api/docker/images`);
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
  },

  removeImage: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/docker/images/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove image');
    return response.json();
  },

  getNetworks: async () => {
    const response = await fetch(`${API_BASE_URL}/api/docker/networks`);
    if (!response.ok) throw new Error('Failed to fetch networks');
    return response.json();
  },

  getVolumes: async () => {
    const response = await fetch(`${API_BASE_URL}/api/docker/volumes`);
    if (!response.ok) throw new Error('Failed to fetch volumes');
    return response.json();
  },

  pullImage: async (image: string, tag: string = 'latest') => {
    const response = await fetch(`${API_BASE_URL}/api/docker/images/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image, tag }),
    });
    if (!response.ok) throw new Error('Failed to pull image');
    return response.json();
  },
};

export const dockerHubApi = {
  searchImages: async (query: string, filters: any = {}) => {
    // Don't search if query is empty or just whitespace
    if (!query || query.trim().length === 0) {
      return { results: [], count: 0 };
    }

    const params = new URLSearchParams({
      q: query.trim(),
      page: '1',
      page_size: '20',
    });
    
    // Add filters to the search params
    if (filters.isOfficial) {
      params.append('is_official', 'true');
    }
    if (filters.isAutomated) {
      params.append('is_automated', 'true');
    }
    
    console.log('Searching Docker Hub with query:', query.trim());
    
    const response = await fetch(`${API_BASE_URL}/api/dockerhub/search?${params}`);
    if (!response.ok) {
      console.error('Docker Hub search failed:', response.status, response.statusText);
      throw new Error('Failed to search Docker Hub');
    }
    return response.json();
  },

  getPopularImages: async () => {
    console.log('Fetching popular Docker Hub images');
    const response = await fetch(`${API_BASE_URL}/api/dockerhub/popular`);
    if (!response.ok) {
      console.error('Failed to fetch popular images:', response.status, response.statusText);
      throw new Error('Failed to fetch popular images');
    }
    return response.json();
  },

  getRepository: async (namespace: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/api/dockerhub/repository/${namespace}/${name}`);
    if (!response.ok) throw new Error('Failed to fetch repository details');
    return response.json();
  },

  getRepositoryTags: async (namespace: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/api/dockerhub/repository/${namespace}/${name}/tags`);
    if (!response.ok) throw new Error('Failed to fetch repository tags');
    return response.json();
  },
};
