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

//__DEV__
if (false)
  firebaseConfig = {
    apiKey: "AIzaSyCk8EfNyqarIzBAQSCFgU8634o-e0iA_Os",
    appId: "1:440569980458:web:870c6bde68871e5fd78553",
    authDomain: "vent-with-strangers-2acc6.firebaseapp.com",
    databaseURL: "http://localhost:8080?ns=vent-with-strangers-2acc6",
    measurementId: "G-N5NTVEZHSN",
    messagingSenderId: "440569980458",
    projectId: "vent-with-strangers-2acc6",
    storageBucket: "vent-with-strangers-2acc6.appspot.com",
  };

const createFirebaseApp = (config = {}) => {
  try {
    return getApp();
  } catch (e) {
    return initializeApp(config);
  }
};

const app = createFirebaseApp(firebaseConfig);

const db = getFirestore();
const db2 = getDatabase();

if (false) {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectDatabaseEmulator(db2, "localhost", 9000);
  const auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { db, db2 };

export default app;