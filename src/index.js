import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import controller from './controllers';
import authorization from './auth';

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());

/* check credentials */
app.use((ctx, next) => authorization(ctx, next));

app.use(router.routes());

/* router */
router
  .get('/api', (ctx, next) => {
    ctx.body = controller.v1.getListApi();
  })
  .get('/api/v1/ref/:ref*', async (ctx, next) => {
    ctx.body = await controller.v1.getDataByRef(ctx.params.ref);
  })
  .post('/api/v1/save', async (ctx, next) => {
    const body = ctx.request.body;
    const { ref, type, data } = body;

    if (type !== 'set' && type !== 'update' && type !== 'push') {
      ctx.throw(400, 'available types: set, update, push');
    }

    ctx.body = await controller.v1.saveDataByParam({
      ref: ref,
      type: type,
      data: data
    });
  })
  .all('/:a*', (ctx, next) => {
    ctx.status = 404;
    ctx.body = 'not found api';
  });

app.on('error', (err, ctx) => {
  console.log('\nServer ERROR:\n\n', err);
});


app.listen(3000);
