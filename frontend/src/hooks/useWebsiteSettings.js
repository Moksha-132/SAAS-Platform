import { useState, useEffect } from 'react';

export const useWebsiteSettings = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('syncsaas_website_settings');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('syncsaas_website_settings');
        setSettings(stored ? JSON.parse(stored) : null);
      } catch (e) {
        setSettings(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('syncsaas_settings_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('syncsaas_settings_updated', handleStorageChange);
    };
  }, []);

  return settings;
};
