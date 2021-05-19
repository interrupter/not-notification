async function onUpdate(){
  console.log(...arguments);
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
