import Koa from 'koa';
import cors from '@koa/cors';
import db, { ref } from './firebase';

const app = new Koa();

app.use(cors());

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
