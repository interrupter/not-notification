const notNode = require('not-node');

async function inbox(data, cred, conn){

  return notNode.Application.getModel('Notification')
    .getAllAsObject(['image_ppi', 'image_size_min', 'image_size_max']);
}


module.exports = {
  servers:{
    main:{
      request: {
        inbox
      }
    }
  }
};
