import { Storage } from '@ionic/storage';

const storage = new Storage();
(async () => {
  await storage.create();
})();

const storageService = {
  async setItem<T>(key: string, value : T) {
    await storage.set(key, value);
  },
  async getItem(key: string) {
    return await storage.get(key);
  },
  async removeItem(key: string) {
    await storage.remove(key);
  },
  async clear() {
    await storage.clear();
  },
};

export default storageService;
