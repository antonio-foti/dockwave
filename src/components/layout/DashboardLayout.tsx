
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Header } from './Header';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navigationItems: NavigationItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardLayout = ({
  children,
  navigationItems,
  activeTab,
  onTabChange,
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72">
            <Card className="p-6 shadow-lg border-0 bg-card/50 backdrop-blur">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground mb-2">Navigation</h2>
                <p className="text-sm text-muted-foreground">Manage your Docker environment</p>
              </div>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start h-auto p-4 text-left transition-all duration-200',
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-md transform scale-[1.02]' 
                          : 'hover:bg-muted/80 hover:transform hover:scale-[1.01]'
                      )}
                      onClick={() => onTabChange(item.id)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <Icon className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive ? "text-primary-foreground" : "text-muted-foreground"
                        )} />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{item.label}</span>
                          {item.description && (
                            <span className={cn(
                              "text-xs mt-0.5",
                              isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                            )}>
                              {item.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </nav>
            </Card>
          </aside>

          <main className="flex-1 min-h-[calc(100vh-8rem)]">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
