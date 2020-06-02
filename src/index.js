import Koa from 'koa';
import cors from '@koa/cors';
import db, { ref } from './firebase';
import { b64decode } from './utils';

const app = new Koa();

app.use(cors());

/* check credentials */
app.use(async (ctx, next) => {
  const header = ctx.header;

  if ('authorization' in header) {
    const auth = header.authorization;
    const b64str = auth.split(' ')[1];
    const str = b64decode(b64str);
    const login = str.split(':')[0];
    const pass = str.split(':')[1];

    if (login === 'unsteelix' && pass === '12345678') {
      next();
    } else {
      ctx.throw(400, 'login/pass with error');
    }
    console.log(login, pass);
  } else {
    ctx.throw(400, 'miss authorization header');
  }
});

/* router */
app.use(async (ctx, next) => {
  switch (ctx.path) {
    case '/api':
      ctx.body = 'list api';
      break;

    case '/api/1':
      let items = await ref.items.once('value', (snapshot) => snapshot.val());
      ctx.body = items;
      break;

    case '/api/2':
      throw new Error('sdsd')
      break;

    default:
      ctx.status = 404;
      ctx.body = 'not found api';
      break;
  }
});

app.on('error', (err, ctx) => {
  console.log('\nServer ERROR:\n\n', err);
});


app.listen(3000);
