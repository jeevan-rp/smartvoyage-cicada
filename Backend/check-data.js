const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://smart-voyage-cicada.firebaseio.com'
});

const db = admin.database();

async function checkData() {
  const snapshot = await db.ref('vendors').once('value');
  console.log('Vendors count:', snapshot.numChildren());
  process.exit(0);
}

checkData().catch(err => {
  console.error(err);
  process.exit(1);
});
