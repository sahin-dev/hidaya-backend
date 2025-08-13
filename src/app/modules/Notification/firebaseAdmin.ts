import admin, { ServiceAccount } from 'firebase-admin';
import service from './serviceAccount.json'

try {

  admin.initializeApp({
    credential: admin.credential.cert(service as ServiceAccount),
  });

  console.log('Firebase Admin SDK initialized successfully!');
} catch (error: any) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
}

export default admin;