import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getApp, initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import {
  connectFirestoreEmulator,
  getFirestore,
  settings,
} from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyCk8EfNyqarIzBAQSCFgU8634o-e0iA_Os",
  appId: "1:440569980458:web:870c6bde68871e5fd78553",
  authDomain: "vent-with-strangers-2acc6.firebaseapp.com",
  databaseURL: "https://vent-with-strangers-2acc6.firebaseio.com",
  measurementId: "G-N5NTVEZHSN",
  messagingSenderId: "440569980458",
  projectId: "vent-with-strangers-2acc6",
  storageBucket: "vent-with-strangers-2acc6.appspot.com",
};

const createFirebaseApp = (config = {}) => {
  try {
    return getApp();
  } catch (e) {
    return initializeApp(config, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
};

const app = createFirebaseApp(firebaseConfig);

const db = getFirestore();
const db2 = getDatabase();

if (__DEV__) {
  connectFirestoreEmulator(db, "192.168.100.244", 8080);
  connectDatabaseEmulator(db2, "192.168.100.244", 9000);
  const auth = getAuth();
  connectAuthEmulator(auth, "http://192.168.100.244:9099");
}

export { db, db2 };

export default app;
