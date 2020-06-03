import db from '../../firebase';

export default async function getDataByRef(ref) {
  const data = await db.ref(ref).once('value').then(snapshot => snapshot.val());
  return data;
}