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
	['link', { required: false}, 'title'],
	['owner', { required: true } ],
	['ownerModel', { required: true } ],
	[
		'new',
		{
			label: 'Новое',
			searchable: true,
			sortable: true,
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

exports.thisMethods = {
	async markAsRead(){
		this.new = false;
		return await this.save();
	}
};

exports.thisStatics = {
	async ownNotification(_id, owner, ownerModel = 'User'){
		return this.makeQuery('findOne', { _id, owner, ownerModel }).exec();
	},
	async notify(message, owner, ownerModel){
		try{
			const data = {
				title: 		message.title,
				text: 		message.text,
				owner,
				ownerModel,
				createdAt: new Date()
			};
			if(message.link && message.link.length){
				data.link = message.link;
			}
			return await this.add(data);
		}catch(e){
			log.error(e);
			notNode.Application.report(new notError('notification.notify', {owner, ownerModel}, e));
		}
	},
	async inbox(skip, size, filter, owner, ownerModel){
		try{
			return await this.listAndCount(skip, size, {createdAt: -1 }, {...filter, owner, ownerModel});
		}catch(e){
			log.error(e);
			notNode.Application.report(new notError('notification.inbox', {filter, owner, ownerModel}, e));
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
			await this.update({_id, owner, ownerModel}, {new: false});
		}catch(e){
			log.error(e);
			notNode.Application.report(new notError('notification.markAsRead', {owner, ownerModel}, e));
		}
	},
	async markAllAsRead(owner, ownerModel){
		try{
			await this.update({owner, ownerModel}, { new: false });
		}catch(e){
			log.error(e);
			notNode.Application.report(new notError('notification.markAllAsRead', {owner, ownerModel}, e));
		}
	}
};
