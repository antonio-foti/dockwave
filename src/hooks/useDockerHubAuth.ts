
import { useState, useEffect } from 'react';

interface User {
  username: string;
  token: string;
}

export const useDockerHubAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored authentication on mount
    const storedUser = localStorage.getItem('dockerhub_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/dockerhub/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      const user = {
        username: data.user.username,
        token: data.token,
      };
      
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('dockerhub_user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Docker Hub login error:', error);
      throw new Error('Authentication failed');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('dockerhub_user');
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
};
