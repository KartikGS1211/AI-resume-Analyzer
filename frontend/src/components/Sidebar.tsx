import { Home, Upload, FileText, History, Shield, Moon, Sun, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';
import type { Page } from '../App';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Home', icon: Home },
  { id: 'upload' as Page, label: 'Upload Resume', icon: Upload },
  { id: 'feedback' as Page, label: 'Feedback', icon: FileText },
  { id: 'history' as Page, label: 'History', icon: History },
  { id: 'admin' as Page, label: 'Admin', icon: Shield },
];

export function Sidebar({ currentPage, onNavigate, isOpen, onClose }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <TooltipProvider delayDuration={300}>
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-card border-r border-border flex flex-col
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 lg:w-16 -translate-x-full lg:translate-x-0'}
      `}>
        <div className={`p-6 border-b border-border flex items-center justify-between overflow-hidden ${!isOpen && 'lg:p-3'}`}>
          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
            <h1 className="text-primary whitespace-nowrap">Resume Analyzer</h1>
            <p className="text-muted-foreground text-sm mt-1 whitespace-nowrap">AI-Powered Insights</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`lg:hidden ${!isOpen && 'hidden'}`}
            onClick={onClose}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            const button = (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full transition-all duration-300 ${
                  isOpen ? 'justify-start' : 'lg:justify-center lg:px-2'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isOpen ? 'mr-3' : 'lg:mr-0'}`} />
                <span className={`transition-opacity duration-300 whitespace-nowrap ${
                  isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'
                }`}>
                  {item.label}
                </span>
              </Button>
            );

            // Show tooltip only when sidebar is collapsed on desktop
            if (!isOpen) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild className="hidden lg:flex">
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </nav>

        <div className="p-4 border-t border-border overflow-hidden">
          {isOpen ? (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="mr-3 h-5 w-5" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="mr-3 h-5 w-5" />
                  Light Mode
                </>
              )}
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild className="hidden lg:flex">
                <Button
                  variant="outline"
                  className="w-full justify-center px-2"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}