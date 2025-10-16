import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('perealtors');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Initialize authentication if user is logged in
if (typeof window !== 'undefined') {
  const initAuth = async () => {
    try {
      await account.getSession('current');
    } catch {
      // No active session found - this is normal for unauthenticated users
      console.log('No active session found');
    }
  };
  initAuth();
}

export const DATABASE_ID = 'propertiesDB';
export const COLLECTION_ID = 'propertiesTable';
export const BUCKET_ID = 'property_photos';

export { client };
