/**
 * Firebase Realtime Database Configuration & Sync
 * Database URL: https://devis-815bc-default-rtdb.asia-southeast1.firebasedatabase.app/
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';

export const FIREBASE_DB_URL = 'https://devis-815bc-default-rtdb.asia-southeast1.firebasedatabase.app';

export const firebaseConfig = {
  apiKey: "AIzaSyAq-g2UtyKQ5z0atcqZSYMKe0hkD6kutaQ",
  authDomain: "devis-815bc.firebaseapp.com",
  databaseURL: "https://devis-815bc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "devis-815bc",
  storageBucket: "devis-815bc.firebasestorage.app",
  messagingSenderId: "953533722129",
  appId: "1:953533722129:web:d97a14ab72b7ff72188bb0",
  measurementId: "G-F3WTMY46Z3"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);

export interface FirebaseStatus {
  connected: boolean;
  permissionOk: boolean;
  lastChecked: number;
  error?: string | null;
}

type StatusListener = (status: FirebaseStatus) => void;

let currentStatus: FirebaseStatus = {
  connected: false,
  permissionOk: true, // Optimistic default
  lastChecked: Date.now(),
  error: null
};

const statusListeners = new Set<StatusListener>();

function notifyListeners() {
  statusListeners.forEach((listener) => {
    try {
      listener({ ...currentStatus });
    } catch {}
  });
}

// Global listener for socket connection state
try {
  const connectedRef = ref(rtdb, '.info/connected');
  onValue(connectedRef, (snap) => {
    currentStatus.connected = Boolean(snap.val());
    currentStatus.lastChecked = Date.now();
    notifyListeners();
  });
} catch {}

export const FirebaseService = {
  /**
   * Lấy trạng thái kết nối & quyền hiện tại
   */
  getStatus(): FirebaseStatus {
    return { ...currentStatus };
  },

  /**
   * Đăng ký lắng nghe thay đổi trạng thái Firebase (Online/Offline, Permission Denied, ...)
   */
  subscribeStatus(listener: StatusListener) {
    statusListeners.add(listener);
    listener({ ...currentStatus });
    return () => {
      statusListeners.delete(listener);
    };
  },

  /**
   * Theo dõi trạng thái kết nối socket Realtime với Firebase
   */
  onConnectionChange(callback: (connected: boolean) => void) {
    return this.subscribeStatus((st) => callback(st.connected));
  },

  /**
   * Kiểm tra quyền đọc/ghi thực tế lên Firebase RTDB
   */
  async checkHealth(): Promise<FirebaseStatus> {
    try {
      const testRef = ref(rtdb, '_health/ping');
      await set(testRef, { time: Date.now(), client: 'Devis ERP Web' });
      currentStatus.permissionOk = true;
      currentStatus.error = null;
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.toLowerCase().includes('permission') || errMsg.toLowerCase().includes('denied')) {
        currentStatus.permissionOk = false;
        currentStatus.error = 'PERMISSION_DENIED';
      } else {
        currentStatus.error = errMsg;
      }
    }
    currentStatus.lastChecked = Date.now();
    notifyListeners();
    return { ...currentStatus };
  },

  /**
   * Lưu dữ liệu lên một node trên Firebase RTDB
   */
  async syncNode<T = any>(path: string, data: T): Promise<boolean> {
    // 1. Luôn lưu vào localStorage ngay tức thì (Offline-first / Instant UI)
    try {
      localStorage.setItem(`fb_cache_${path}`, JSON.stringify(data));
    } catch {}

    // 2. Gửi đồng bộ lên Firebase RTDB
    try {
      const nodeRef = ref(rtdb, path);
      await set(nodeRef, data);
      if (!currentStatus.permissionOk) {
        currentStatus.permissionOk = true;
        currentStatus.error = null;
        notifyListeners();
      }
      return true;
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.toLowerCase().includes('permission') || errMsg.toLowerCase().includes('denied')) {
        if (currentStatus.permissionOk) {
          currentStatus.permissionOk = false;
          currentStatus.error = 'PERMISSION_DENIED';
          notifyListeners();
        }
      }
      console.warn(`[Firebase] Đồng bộ /${path} chưa thành công (${errMsg}). Đã lưu cache an toàn.`);
      return false;
    }
  },

  /**
   * Đọc dữ liệu từ Firebase RTDB (nếu không có thì fallback cache)
   */
  async getNode<T = any>(path: string): Promise<T | null> {
    try {
      const nodeRef = ref(rtdb, path);
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const val = snapshot.val();
        try {
          localStorage.setItem(`fb_cache_${path}`, JSON.stringify(val));
        } catch {}
        if (!currentStatus.permissionOk) {
          currentStatus.permissionOk = true;
          currentStatus.error = null;
          notifyListeners();
        }
        return val as T;
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.toLowerCase().includes('permission') || errMsg.toLowerCase().includes('denied')) {
        if (currentStatus.permissionOk) {
          currentStatus.permissionOk = false;
          currentStatus.error = 'PERMISSION_DENIED';
          notifyListeners();
        }
      }
      console.warn(`[Firebase] Đọc /${path} chưa thành công, đang dùng local cache.`);
    }

    // Fallback localStorage cache
    try {
      const cached = localStorage.getItem(`fb_cache_${path}`);
      if (cached) return JSON.parse(cached) as T;
    } catch {}

    return null;
  },

  /**
   * Lắng nghe cập nhật Realtime đa thiết bị
   */
  subscribeNode<T = any>(path: string, callback: (data: T) => void) {
    try {
      const nodeRef = ref(rtdb, path);
      return onValue(
        nodeRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            try {
              localStorage.setItem(`fb_cache_${path}`, JSON.stringify(val));
            } catch {}
            callback(val as T);
          }
        },
        (error) => {
          if (error.message?.toLowerCase().includes('permission')) {
            if (currentStatus.permissionOk) {
              currentStatus.permissionOk = false;
              currentStatus.error = 'PERMISSION_DENIED';
              notifyListeners();
            }
          }
        }
      );
    } catch (err) {
      return () => {};
    }
  }
};
