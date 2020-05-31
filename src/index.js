import Koa from 'koa';
import cors from '@koa/cors';
import db, { ref } from './firebase';

const app = new Koa();

app.use(cors());


app.use(async ctx => {
  ctx.body = 'Hello World';
  const path = ctx.request.path;
  console.log(path);

  ref.items.once("value", function(snapshot) {
    console.log(snapshot.val());
  });

});

app.on('error', (err, ctx) => {
  console.log('\nServer ERROR: ', err);
});


app.listen(3000);
