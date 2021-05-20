import {notCommon} from 'not-bulma';

async function onUpdate(){
  try{
    notCommon.getApp().getService('nsNotification').update();
  }catch(e){
    notCommon.error(e);
  }
}

const main = {
  routes:{
    event: {
      'notification//update': onUpdate
    }
  },
  validators:{},
  messenger:{}
};

export default main;
