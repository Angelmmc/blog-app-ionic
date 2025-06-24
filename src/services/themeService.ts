import { Preferences } from '@capacitor/preferences';

const THEME_KEY = 'app-theme';

export default {
  async getTheme() {
    const { value } = await Preferences.get({ key: THEME_KEY });
    return value || 'dark'; // 'dark' es el predeterminado, 'light' es el alternativo
  },

  async toggleTheme() {
    const isLight = document.documentElement.classList.contains('light');
    
    if (isLight) {
      document.documentElement.classList.remove('light');
      await Preferences.set({ key: THEME_KEY, value: 'dark' });
    } else {
      document.documentElement.classList.add('light');
      await Preferences.set({ key: THEME_KEY, value: 'light' });
    }
    
    return !isLight;
  },

  async applyTheme(theme: string) {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  },

  async initTheme() {
    const theme = await this.getTheme();
    await this.applyTheme(theme);
  }
};