const notNode = require('not-node');
const {
	notError
} = require('not-error');

const MODEL_NAME = 'Notification';
exports.thisLogicName = MODEL_NAME;

class NotificationLogic {
	static async notify({
		owner,
		ownerModel = 'User',
		title,
		text,
		link
	}){
		try{
			const Notification = notNode.Application.getModel(MODEL_NAME);
			let result = await Notification.notify(
				{
					title,
					text,
					link
				},
				owner,
				ownerModel
			);
			return {
				status: 'ok',
				result
			};
		}catch(err){
			module.log.error(err);
			notNode.Application.report(
				new notError(
					`notification:route.notify`, {
						owner,
						ownerModel,
						title,
						text,
						link
					},
					err
				)
			);
			return {
				status: 'error',
				error:  err.message
			};
		}
	}

	static async inbox({
		size,
		skip,
		filter,
		owner,
		ownerModel = 'User'
	}) {
		try {
			const Notification = notNode.Application.getModel(MODEL_NAME);
			let result = await Notification.inbox(skip, size, filter, owner, ownerModel);
			let freshCount = await Notification.countNew(owner, ownerModel);
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
						owner,
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
