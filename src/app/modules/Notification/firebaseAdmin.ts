import admin, { ServiceAccount } from 'firebase-admin';
import {serviceAccount} from './firebaseService';

try {

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });

  console.log(admin.apps.length) // should print 1

  console.log('Firebase Admin SDK initialized successfully!');
} catch (error: any) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
}

export default admin;