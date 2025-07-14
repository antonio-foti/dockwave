import { Waves, Github, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Waves className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Dockwave
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Modern Docker Management</p>
            </div>
          </div>
          <Badge variant="secondary" className="ml-2 text-xs">
            v1.0
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <a
              href="https://github.com/antonio-foti/dockwave"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <a
              href="https://github.com/antonio-foti"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <Heart className="h-3 w-3 text-red-500" />
              <span className="text-xs">Made with Love</span>
            </a>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
