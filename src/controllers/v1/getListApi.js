const listApi = `
/api   возвращает список всех API методов

- api/v1  (все последующие методы начинаются с /api/v1)

  [GET]   /ref/\${ref}    exmpl: /ref/nimbus/cards
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
    ref: nimbus/cards,
    type: push
    data: {
      title: title example,
      content: content example
    }
  }


- api/v2
  ...
`;

export default function getListApi() {
  return listApi;
}
