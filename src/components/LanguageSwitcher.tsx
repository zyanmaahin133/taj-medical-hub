
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  // Add other languages here, e.g.:
  // { code: 'es', name: 'Español' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="icon">
        <Globe className="h-5 w-5" />
      </Button>
      {/* This is a basic implementation. A dropdown would be better. */}
      <div className="absolute top-full right-0 mt-2 bg-card border rounded-md shadow-lg z-10 hidden">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted ${
              i18n.language === lang.code ? 'font-bold' : ''
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
