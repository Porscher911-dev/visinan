/**
 * Firebase Realtime Database Configuration & Sync
 * Database URL: https://devis-815bc-default-rtdb.asia-southeast1.firebasedatabase.app/
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://devis-815bc-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'devis-815bc'
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);

export const FirebaseService = {
  /**
   * Đồng bộ một node lên Firebase RTDB
   */
  async syncNode(path: string, data: any) {
    try {
      const nodeRef = ref(rtdb, path);
      await set(nodeRef, data);
      return true;
    } catch (err) {
      console.warn(`[Firebase] Sync to /${path} failed:`, err);
      return false;
    }
  },

  /**
   * Đọc dữ liệu một lần từ Firebase RTDB
   */
  async getNode(path: string) {
    try {
      const nodeRef = ref(rtdb, path);
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (err) {
      console.warn(`[Firebase] Get /${path} failed:`, err);
      return null;
    }
  },

  /**
   * Lắng nghe thời gian thực (Realtime Listener)
   */
  subscribeNode(path: string, callback: (data: any) => void) {
    try {
      const nodeRef = ref(rtdb, path);
      return onValue(nodeRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        }
      }, (error) => {
        console.warn(`[Firebase] Listen /${path} error:`, error);
      });
    } catch (err) {
      console.warn(`[Firebase] Subscribe /${path} failed:`, err);
      return () => {};
    }
  }
};
