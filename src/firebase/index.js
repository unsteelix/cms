import * as admin from 'firebase-admin';


// Fetch the service account key JSON file contents
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://headless-cms-666c8.firebaseio.com',
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();
//const items = db.ref('items');
//const test = db.ref('nimbus/cards/1/title')
/*
const ref = {
  items,
  test,
};
*/
//export { ref };
export default db;
