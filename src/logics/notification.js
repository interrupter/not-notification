const notNode = require('not-node');
const {
  notError
} = require('not-error');

const MODEL_NAME = 'Notification';
exports.thisLogicName = MODEL_NAME;

class NotificationLogic {
  static async notify({
    ownerId,
    ownerModel = 'User',
    title,
    text
  }){
    try{
      const Notification = notNode.Application.getModel(MODEL_NAME);
      let result = await Notification.notify(
        {
          title,
          text
        },
        ownerId,
        ownerModel
      );
      return {
        status: 'ok',
        result
      };
    }catch(e){
      module.log.error(err);
      notNode.Application.report(
        new notError(
          `notification:route.notify`, {
            ownerId,
            ownerModel,
            title,
            text
          },
          err
        )
      );
      return {
        status: 'error',
        error:  e.message
      }
    }
  }

  static async inbox({
    size,
    skip,
    filter,
    ownerId,
    ownerModel = 'User'
  }) {
    try {
      const Notification = notNode.Application.getModel(MODEL_NAME);
      let result = await Notification.inbox(skip, size, filter, ownerId, ownerModel);
      let freshCount = await Notification.countNew(ownerId, ownerModel);
      result.freshCount = freshCount;
      return {
        status: 'ok',
        result
      };
    } catch (err) {
      module.log.error(err);
      notNode.Application.report(
        new notError(
          `notification:route.inbox`, {
            ownerId,
            ownerModel,
            size,
            skip,
            filter
          },
          err
        )
      );
      return {
        status: 'error'
      };
    }
  }
}

exports[MODEL_NAME] = NotificationLogic;
