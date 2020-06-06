import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser'; // for text, json, form
import koaBody from 'koa-body';          // for files
//import multer from '@koa/multer';
import koaStatic from 'koa-static';
import path from 'path';
import fs from 'fs';

import cors from '@koa/cors';
import controller from './controllers';
import authorization from './auth';
import { saveFiles, formatOutput } from './utils';

const app = new Koa();
app.use(koaBody({ multipart: true }));
const router = new Router();

app.use(cors());
app.use(koaStatic('src/upload')); // Read static file directories
/* check credentials */
app.use((ctx, next) => authorization(ctx, next));
app.use(router.routes());

//app.use(bodyParser());





/* router */
router
  .get('/api', (ctx, next) => {
    ctx.body = controller.v1.getListApi();
  })
  .get('/api/v1/ref/:ref*', async (ctx, next) => {
    ctx.body = formatOutput({
      data: await controller.v1.getDataByRef(ctx.params.ref),
    });
  })
  .post('/api/v1/save', async (ctx, next) => {
    const body = ctx.request.body;
    const { ref, type, data } = body;

    if (type !== 'set' && type !== 'update' && type !== 'push') {
      ctx.throw(400, 'available types: set, update, push');
    }

    const res = await controller.v1.saveDataByParam({
      ref: ref,
      type: type,
      data: data
    });
    ctx.body = formatOutput({
      data: res,
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

      ctx.body = formatOutput({
        data: res,
      });

    } catch (err) {
      ctx.throw(400, 'Ошибка при загрузке файлов', err);
    }
  })
  .get('/upload', async (ctx, next) => {
    ctx.type = 'text/html; charset=utf-8';
    ctx.body = fs.readFileSync(path.resolve('./src/upload', 'upload.html'));
  })
  .get('/files', async (ctx, next) => {
    ctx.body = fs.readdirSync('src/upload/files');
  })
  .get('/files/preview', async (ctx, next) => {
    const files = fs.readdirSync('src/upload/files');
    if (files.length) {
      let res = '';
      files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if(ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif'){
          res += `<div style='width: 24vw;height: 24vw;padding: 1vh;box-sizing: border-box; border: 1px solid #eaeaea;'>
          <img src='/files/${file}' style='max-width: 100%;max-height: 100%;'/>
          </div>`
        }
      })
      ctx.body = `<div style="display:flex;flex-direction: row;flex-wrap: wrap;align-content: center;">${res}</div>`;
    } else {
      ctx.body = 'нет файлов';
    }
  })
  .all('/:a*', (ctx, next) => {
    ctx.body = formatOutput({
      status: 'error',
      data: 'API not found',
    });
  });

app.on('error', (err, ctx) => {
  console.log('\nServer ERROR:\n\n', err);
  ctx.body = formatOutput({
    status: 'error',
    data: err,
  });
});


app.listen(3000);
