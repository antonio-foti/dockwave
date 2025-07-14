
import { useState } from 'react';
import { Container, Image, Network, Volume, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContainersPage } from '@/components/docker/ContainersPage';
import { ImagesPage } from '@/components/docker/ImagesPage';
import { DockerHubPage } from '@/components/dockerhub/DockerHubPage';
import { NetworksPage } from '@/components/docker/NetworksPage';
import { VolumesPage } from '@/components/docker/VolumesPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('containers');

  const navigationItems = [
    { 
      id: 'containers', 
      label: 'Containers', 
      icon: Container,
      description: 'Manage running containers'
    },
    { 
      id: 'images', 
      label: 'Images', 
      icon: Image,
      description: 'Browse local images'
    },
    { 
      id: 'dockerhub', 
      label: 'Docker Hub', 
      icon: Search,
      description: 'Discover new images'
    },
    { 
      id: 'networks', 
      label: 'Networks', 
      icon: Network,
      description: 'Configure networking'
    },
    { 
      id: 'volumes', 
      label: 'Volumes', 
      icon: Volume,
      description: 'Manage data storage'
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'containers':
        return <ContainersPage />;
      case 'images':
        return <ImagesPage />;
      case 'dockerhub':
        return <DockerHubPage />;
      case 'networks':
        return <NetworksPage />;
      case 'volumes':
        return <VolumesPage />;
      default:
        return <ContainersPage />;
    }
  };

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
