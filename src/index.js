import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser'; // for text, json, form
import koaBody from 'koa-body';          // for files
//import multer from '@koa/multer';
import koaStatic from 'koa-static';

import cors from '@koa/cors';
import controller from './controllers';
import authorization from './auth';
import { getFileNameByPath, saveFiles } from './utils';


const app = new Koa();
app.use(koaBody({ multipart: true }));
const router = new Router();

app.use(cors());
app.use(koaStatic('src/upload')); // Read static file directories
app.use(router.routes());

//app.use(bodyParser());

/* check credentials */
//app.use((ctx, next) => authorization(ctx, next));



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
  .post('/api/v1/upload', async (ctx, next) => {
    try {
      const files = ctx.request.files;
      const listFiles = [];
      for (let key in files) {
        listFiles.push(files[key]);
      }
      const res = await saveFiles(listFiles);

      ctx.body = {
        files: res
      }

    } catch (err) {
      console.log('\n\n ******************** \n\n', err);
      ctx.body = {
        message: "Ошибка при загрузке файлов",
        errors: err
      };
    }
  })
  .all('/:a*', (ctx, next) => {
    ctx.status = 404;
    ctx.body = 'not found api';
  });

app.on('error', (err, ctx) => {
  console.log('\nServer ERROR:\n\n', err);
});


app.listen(3000);
