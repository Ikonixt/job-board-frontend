import { getDatabase} from "firebase/database";
import { initializeApp } from "firebase/app";
// Database service for querying a specific user account
const firebaseConfig = {
  apiKey: "AIzaSyBEppB0u-nwMgK1YkTN-tPbkMxxT457JR0",
  authDomain: "jobrecruitmentsite.firebaseapp.com",
  databaseURL:
    "https://jobrecruitmentsite-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jobrecruitmentsite",
  storageBucket: "jobrecruitmentsite.appspot.com",
  messagingSenderId: "619797105986",
  appId: "1:619797105986:web:065caa68c8b2cde87c8cdb",
  measurementId: "G-MQ6KW299SJ",
};
// Initialize Firebase
const dbApp = initializeApp(firebaseConfig);
const database = getDatabase(dbApp);
export { database };