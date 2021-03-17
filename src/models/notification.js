const notNode = require('not-node');
const log = require('not-log')(module, 'notification:model');
const {notError} = require('not-error');
const initFields = require('not-node').Fields.initFields;

const MODEL_NAME = 'Notification';
const FIELDS = [
	['title', { default: ''}, 'title'],
	[
		'text',
		{
			default: '',
			placeholder: 'Сообщение',
			label: 'Сообщение'
		},
		'description'
	],
	['owner', { required: true } ],
	['ownerModel', { required: true } ],
	[
		'new',
		{
			label: 'Новое',
			default: true
		},
		'active'
	],
	['createdAt', { sortable: true } ],
];

exports.enrich = {
	versioning: true,
	increment: false
};

exports.thisModelName = MODEL_NAME;
exports.thisSchema = initFields(FIELDS, 'model');

exports.thisStatics = {
	async notify(message, owner, ownerModel){
		try{
			return await this.add({
				title: 		message.title,
				text: 		message.text,
				owner,
				ownerModel,
				createdAt: new Date()
			});
		}catch(e){
			log.error(e);
			notNode.Application.report(new notError('notification.notify', {owner, ownerModel}, e));
		}
	},
	async inbox(skip, size, owner, ownerModel){
		try{
			return await this.listAndCount(skip, size, {createdAt: -1 }, {owner, ownerModel}).exec();
		}catch(e){
			log.error(e);
			notNode.Application.report(new notError('notification.inbox', {owner, ownerModel}, e));
		}
	},
	async countNew(owner, ownerModel){
		try{
			return await this.countWithFilter({owner, ownerModel, new: true });
		}catch(e){
			log.error(e);
			notNode.Application.report(new notError('notification.countNew', {owner, ownerModel}, e));
		}
	},
	async markAsRead(_id, owner, ownerModel){
		try{
			let notify = await this.makeQuery('findOne', {_id, owner, ownerModel}).exec();
			if(notify){
				notify.new = false;
				await notify.save();
			}
		}catch(e){
			log.error(e);
			notNode.Application.report(new notError('notification.markAsRead', {owner, ownerModel}, e));
		}
	}
};
