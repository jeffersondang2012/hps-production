import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const exportData = async () => {
  const collections = [
    'productionLines',
    'transactions', 
    'expenses',
    'partners',
    'users'
  ];

  const data: Record<string, any[]> = {};

  for (const collectionName of collections) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    data[collectionName] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Tạo file JSON
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Download file
  const a = document.createElement('a');
  a.href = url;
  a.download = `hps-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 