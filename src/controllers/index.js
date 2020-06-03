import getListApi from './v1/getListApi'
import getDataByRef from './v1/getDataByRef';
import saveDataByParam from './v1/saveDataByParam';

export default {
  v1: {
    getListApi: getListApi,
    getDataByRef: getDataByRef,
    saveDataByParam: saveDataByParam,
  }
}
