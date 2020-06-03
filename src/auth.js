import { b64decode } from './utils';

const login = 'unsteelix';
const pass = '12345678';

export default async function authorization(ctx, next) {
  const header = ctx.header;

  if ('authorization' in header) {
    const auth = header.authorization;
    const b64str = auth.split(' ')[1];
    const str = b64decode(b64str);
    const userLogin = str.split(':')[0];
    const userPass = str.split(':')[1];

    if (login === userLogin && pass === userPass) {
      await next();
    } else {
      ctx.throw(401, 'login/pass with error');
    }
  } else {
    ctx.throw(401, 'miss authorization header');
  }
}
