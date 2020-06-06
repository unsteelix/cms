import { b64decode, formatOutput } from './utils';

const login = 'unsteelix';
const pass = '12345678';

export default async function authorization(ctx, next) {
  const header = ctx.header;

  const firstPath = ctx.url.split('/')[1];
  const url = ctx.url;
  if (url === '/api/v1/upload') {
    return next();
  }
  if (url === '/upload') {
    return next();
  }
  if (firstPath === 'files') { // static
    return next();
  }
  if (url === '/api') {
    return next();
  }
  if (!('authorization' in header)) {
    ctx.body = formatOutput({
      status: 'error',
      data: 'miss authorization header',
    });
    return
  }
  const auth = header.authorization;
  const b64str = auth.split(' ')[1];
  const str = b64decode(b64str);
  const userLogin = str.split(':')[0];
  const userPass = str.split(':')[1];

  if (login === userLogin && pass === userPass) {
    return next();
  } else {
    ctx.body = formatOutput({
      status: 'error',
      data: 'login/pass with error',
    });
  }
}
