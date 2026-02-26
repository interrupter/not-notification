const Log = require('not-log')(module, 'notification:route');

try {
	const FIELDS =
		[
			['_id', {}, '_id'],
			['link', 'not-node//title'],
			['text', 'not-node//title'],
			['new', 'not-node//active']
		];

	module.exports = {
		model: 'notification',
		url: '/api/:modelName',
		fields: FIELDS,
		actions: {
			listAndCount: {
				method: 'GET',
				isArray: false,
				postFix: '/:actionName',
				data: ['record', 'pager', 'sorter', 'filter', 'searcher', 'return'],
				fields: ['_id', 'title', 'text', 'owner', 'ownerModel', 'createdAt', 'new'],
				rules: [{
					auth: true,
					role: ['admin']
				}, {
					auth: true,
					root: true
				}]
			},
			markAsRead:{
				method: 'POST',
				isArray: false,
				postFix: '/:record[_id]/:actionName',
				data: ['record'],
				rules: [{
					auth: true
				}]
			},
			markAllAsRead:{
				ws: true,
				data: 		['record'],
				rules: [{
					auth: true
				}]
			},
			inbox: {
				ws: true,
				method: 'GET',
				isArray: false,
				postFix: '/:actionName',
				data: ['record', 'pager', 'return', 'filter'],
				fields: ['_id', 'title', 'text', 'createdAt', 'new'],
				rules: [{
					auth: true
				}]
			},
			countNew:{
				method: 'GET',
				isArray: false,
				postFix: '/:actionName',
				rules: [{
					auth: true
				}]
			},
			get:{
				method: 'GET',
				isArray: false,
				postFix: '/:record[_id]',
				data: ['record'],
				rules: [{
					root: true
				},{
					auth: true
				}]
			},
			delete: {
				method: 'DELETE',
				data: ['record'],
				postFix: '/:record[_id]',
				isArray: false,
				rules: [{
					auth: true
				}]
			}
		}
	};
} catch (e) {
	Log.error(e);
}
