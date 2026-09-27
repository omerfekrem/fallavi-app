import {
  doc,
  getDoc,
  getDocFromCache,
  type FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { db } from './index';

/**
 * Önce cihaz önbelleğine bakar, yoksa sunucudan okur.
 * Sık değişmeyen veriler (profil, ayarlar, statik içerik) için idealdir:
 * önbellekten gelen okuma Firestore kotasından DÜŞMEZ.
 */
export async function getDocCacheFirst<T>(
  path: string,
  id: string,
): Promise<(T & { id: string }) | null> {
  const ref = doc(db(), path, id);
  let snap: FirebaseFirestoreTypes.DocumentSnapshot;
  try {
    snap = await getDocFromCache(ref);
    if (!snap.exists()) snap = await getDoc(ref);
  } catch {
    snap = await getDoc(ref);
  }
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as T) }) : null;
}

/** Listeleri her zaman sayfalı çek. Varsayılan limit kasıtlı olarak küçük. */
export const DEFAULT_PAGE_SIZE = 20;
