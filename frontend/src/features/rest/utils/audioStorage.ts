export interface LocalAudioRecord {
  id: string;
  name: string;
  artist: string;
  blob: Blob;
  type: string;
  addedAt: number;
}

const DB_NAME = 'TardisDenAudioDB';
const STORE_NAME = 'local_tracks';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveLocalTrack(file: File): Promise<LocalAudioRecord> {
  const db = await openDB();
  const id = `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const cleanName = file.name.replace(/\.[^/.]+$/, '');

  const record: LocalAudioRecord = {
    id,
    name: cleanName || 'Local Track',
    artist: 'Local Import',
    blob: file,
    type: file.type || 'audio/mpeg',
    addedAt: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);

    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllLocalTracks(): Promise<LocalAudioRecord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const results = req.result as LocalAudioRecord[];
        results.sort((a, b) => b.addedAt - a.addedAt);
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to load local tracks from IndexedDB:', err);
    return [];
  }
}

export async function deleteLocalTrack(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
