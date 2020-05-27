import Koa from 'koa';
import cors from '@koa/cors';

const app = new Koa();

app.use(cors());


app.use(async ctx => {
  ctx.body = 'Hello World';
  let path = ctx.request.path;
  console.log(path);
});

app.on('error', (err, ctx) => {
  console.log('\nServer ERROR: ', err);
});


app.listen(3000);
