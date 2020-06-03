import db from '../../firebase';

export default async function saveDataByParam(param) {
  const { type, ref, data } = param;
  return await db.ref(ref)[type](data);
}
