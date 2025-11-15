import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from 'lucide-react';

const LanguageSwitcher = ({ isScrolled, isMenuOpen }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`${isScrolled || isMenuOpen ? 'header-light-text header-light-text-hover' : 'text-foreground hover:text-accent hover:text-shadow'}`}>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-md border-primary/20">
        <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer focus:bg-primary/20">
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('es')} className="cursor-pointer focus:bg-primary/20">
          Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;