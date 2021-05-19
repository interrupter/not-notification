const Log = require('not-log')(module, 'notification:route');
try {
	const {notError} = require('not-error');
	const notNode = require('not-node');
	const query = require('not-filter');
	const
		UserActions = [
			'delete'
		],
		AdminActions = [
			'listAndCount',
			'delete'
		],
		MODEL_NAME = 'Notification',
		MODEL_OPTIONS = {
			MODEL_NAME,
			MODEL_TITLE: 'Сообщение',
			RESPONSE: {
				full: ['get', 'getRaw']
			}
		},
		modMeta = require('not-meta');

	async function get(req, res){
		try {
			let owner = req.user._id;
			let _id = req.params._id;
			const Notification = notNode.Application.getModel(MODEL_NAME);
			let result = await Notification.ownNotification(_id, owner);
			res.status(200).json({status: 'ok', result});
		}catch(e){
			Log.error(err);
			notNode.Application.report(
				new notError(
					`notification:route.get`, {
						_id: 					req.query._id,
						owner:        req.user._id,
						ownerModel:   'User'
					},
					err
				)
			);
			res.status(500).json({
				status: 'error'
			});
		}
	}

	async function _get(req, res){
		try {
			let _id = req.params._id;
			const Notification = notNode.Application.getModel(MODEL_NAME);
			let result = await Notification.getOne(_id);
			if(result){
				if(result.owner.toString() === req.user._id.toString()){
					if (result.new){
					 await Notification.markAsRead(req.params._id, result.owner, result.ownerModel);
					}
				}
			}
			res.status(200).json({status: 'ok', result});
		}catch(e){
			Log.error(err);
			notNode.Application.report(
				new notError(
					`notification:route._get`, {
						_id: 					req.query._id,
						owner:        req.user._id,
						ownerModel:   'User'
					},
					err
				)
			);
			res.status(500).json({
				status: 'error'
			});
		}
	}

	function returnResult(res, result){
		if(result.status === 'ok'){
			res.status(200).json(result);
		}else{
			if(result.status === 'error'){
				res.status(500).json(result);
			}else{
				res.status(500).json({
					status: 'error',
					error: 	result.message?result.message:result
				});
			}
		}
	}

	async function inbox(req, res) {
		try {
			const thisSchema = notNode.Application.getModelSchema(MODEL_NAME);
			const {
				size,
				skip
			} = query.pager.process(req);
			const filter = query.filter.process(req, thisSchema);
			const Notification = notNode.Application.getLogic(MODEL_NAME);
			const params = {
				size,
				skip,
				filter,
				owner: req.user._id
			};
			let result = await Notification.inbox(params);
			returnResult(res, result);
		}catch(err){
			Log.error(err);
			returnResult(res, err);
		}
	}

	async function markAsRead(req, res) {
		try {
			const _id = req.query._id;
			const Notification = notNode.Application.getModel(MODEL_NAME);
			let result = await Notification.markAsRead(_id, req.user._id, 'User');
			res.status(200).json({
				status: 'ok',
				result
			});
		} catch (err) {
			Log.error(err);
			notNode.Application.report(
				new notError(
					`notification:route.markAsRead`, {
						_id:          req.query._id,
						owner:        req.user._id,
						ownerModel:   'User'
					},
					err
				)
			);
			res.status(500).json({
				status: 'error'
			});
		}
	}

	async function countNew(req, res){
		try {
			const Notification = notNode.Application.getModel(MODEL_NAME);
			let result = await Notification.countNew(req.user._id, 'User');
			res.status(200).json({
				status: 'ok',
				result
			});
		} catch (err) {
			Log.error(err);
			notNode.Application.report(
				new notError(
					`notification:route.countNew`, {
						owner:        req.user._id,
						ownerModel:   'User'
					},
					err
				)
			);
			res.status(500).json({
				status: 'error'
			});
		}
	}

	module.exports = {
		get,
		_get,
		inbox,
		_inbox: inbox,
		markAsRead,
		_markAsRead: markAsRead,
		countNew,
		_countNew: countNew
	};

	modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, '_');
	modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);

} catch (e) {
	Log.error(e);
}
