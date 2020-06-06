const listApi = `
/api            список всех API методов
/files          список всех файлов
/files/:file    конкретный файл
/files/preview  превью картинок
/upload         форма для загрузки файлов

- api/v1  (все последующие методы начинаются с /api/v1)

  [GET]   /ref/:ref    exmpl: /ref/nimbus/cards
  [POST]  /save
  {
    ref: nimbus/cards/10,
    type: set [set, update, push]
    data: {
      title: title example,
      content: content example
    }
  }
  {
    ref: nimbus/cards,
    type: update 
    data: {
      10: null
    }
  }
  {
    ref: nimbus/cards/10,
    type: update 
    data: {
      title: newTitle,
      content: newContent
    }
  }
  {
    ref: nimbus/cards,
    type: push
    data: {
      title: title example,
      content: content example
    }
  }
  [POST]  /upload
  {
    const files = e.target.files;
    let data = new FormData();

    for(let i = 0; i < files.length; i++){
      let file = files[i];
      data.append('file_\${i}', file);
    }
  }


- api/v2
  ...
`;

export default function getListApi() {
  return listApi;
}
