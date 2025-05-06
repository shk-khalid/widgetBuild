// src/lib/cookieStorage.ts

export const cookieStorage = {
    getItem: (key: string): string | null => {
      const m = document.cookie.match('(^|;\\s*)' + key + '\\s*=\\s*([^;]+)');
      return m ? decodeURIComponent(m[2]) : null;
    },
    setItem: (key: string, value: string): void => {
      document.cookie = [
        `${key}=${encodeURIComponent(value)}`,
        'path=/',
        'SameSite=Lax',
        'Secure',
      ].join('; ');
    },
    removeItem: (key: string): void => {
      document.cookie = [
        `${key}=`,
        'Max-Age=0',
        'path=/',
        'SameSite=Lax',
        'Secure',
      ].join('; ');
    },
  
    setAccessToken: (token: string) => {
      cookieStorage.setItem('access_token', token);
    },
    getAccessToken: (): string | null => {
      return cookieStorage.getItem('access_token');
    },
    clearAccessToken: () => {
      cookieStorage.removeItem('access_token');
    },
  };
  