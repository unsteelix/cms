import fs from 'fs';
import path from 'path';
import promisePipe from 'promisepipe';


export const b64decode = (base64str) => {
  const buff = Buffer.from(base64str, 'base64');
  return buff.toString('utf-8');
};

export const getFileNameByPath = (filePath) => filePath.split('/').pop();

export const saveFile = async (file) => {
  const newName = `${Date.now()}.${file.name.split('.').pop()}`;
  const readStream = fs.createReadStream(file.path);
  const writeStream = fs.createWriteStream(path.join('src/upload/files', newName));

  return promisePipe(
    readStream.on('error', (err) => {
      throw new Error(err);
    }),
    writeStream.on('error', (err) => {
      throw new Error(err);
    }),
  );
};

export const saveFiles = async (files) => {
  const listPromises = [];
  files.forEach((file) => {
    listPromises.push(saveFile(file));
  });

  const res = [];
  await Promise.allSettled(listPromises).then((results) => {
    results.forEach((result) => {
      const status = result.status;
      if (status === 'fulfilled') {
        const filePath = result.value[1].path;
        const name = getFileNameByPath(filePath);
        res.push({
          status: status,
          newName: name,
        });
      } else {
        res.push({
          status: status,
          newName: null,
        });
      }
    });
  });

  return res;
};


export const formatOutput = (param) => {
  const { status, data } = param;

  const res = {
    status: status || 'success',
    data: data,
  };
  return res;
};
