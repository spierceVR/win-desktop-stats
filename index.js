import { collection, addDoc, getFirestore, Timestamp } from 'firebase/firestore'; 
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: `${process.env.FB_API_KEY}`,
    authDomain: "desktop-stats.firebaseapp.com",
    projectId: "desktop-stats",
    storageBucket: "desktop-stats.appspot.com",
    messagingSenderId: "106820392764",
    appId: "1:106820392764:web:2627df31632f10c2e13039",
    measurementId: "G-CF004K6CP8"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

import activeWindow from 'active-win';

let lastWindow = "";

async function sendWindowInfo(){
  let options = {screenRecordingPermission : false};
  
  let windowInfo = await activeWindow(options);
  
  if(windowInfo.title == lastWindow){
    console.log("No change");
    return;
  } 

  lastWindow = windowInfo.title;
  try {
    const docRef = await addDoc(collection(db, "stats"), {
      time : Timestamp.now(),
      windowData : windowInfo,
    });
  
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}

setInterval(sendWindowInfo, 60 * 1000);