import { getApp } from '@react-native-firebase/app';
import { connectAuthEmulator, getAuth } from '@react-native-firebase/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
} from '@react-native-firebase/firestore';

import { env } from '@/config/env';
import { logger } from '@/utils/logger';

/**
 * Firebase native tarafta google-services dosyalarından otomatik başlar.
 * Burada sadece Firestore ayarlarını ve (dev'de) emülatör bağlantısını yapıyoruz.
 *
 * TASARRUF: Offline persistence açık => aynı doküman tekrar okunduğunda
 * önce cihaz önbelleği kullanılır, listener'lar yeniden bağlanınca sadece
 * değişen dokümanlar faturalanır.
 */
let initialized = false;

export function initFirebase() {
  if (initialized) return;
  initialized = true;

  const app = getApp();

  initializeFirestore(app, {
    persistence: true,
    cacheSizeBytes: 50 * 1024 * 1024, // 50 MB yerel önbellek
  });

  if (env.useEmulator) {
    const host = env.emulatorHost;
    connectAuthEmulator(getAuth(), `http://${host}:9099`);
    connectFirestoreEmulator(getFirestore(), host, 8080);
    logger.debug(`Firebase emülatörüne bağlanıldı: ${host}`);
  }
}

export const auth = () => getAuth();
export const db = () => getFirestore();
