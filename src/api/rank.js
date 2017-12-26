import axios from 'axios'
import {commonParams} from './config'

const page = commonParams.page;

export function joke(type,page) {
  const url = `http://route.showapi.com/341-${type}?showapi_appid=52881&showapi_sign=549c66f8ce284abd897e4cd2855cb83b&page=${page}&maxResult=${commonParams.maxResult}`;

  /*const data = Object.assign({},{
    my_appId:52881,

  })*/

   return axios.get(url).then(res=>{
     return Promise.resolve(res.data);
  })


}
