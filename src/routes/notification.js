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

	async function inbox(req, res) {
		try {
			const {
				size,
				skip
			} = query.pager.process(req);
			const Notification = notNode.Application.getModel(MODEL_NAME);
			let result = await Notification.inbox(skip, size, req.user._id, 'User');
			res.status(200).json({
				status: 'ok',
				result
			});
		} catch (err) {
			Log.error(err);
			notNode.Application.report(
				new notError(
					`notification:route.inbox`, {
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
