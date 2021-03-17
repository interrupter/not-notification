const initFields = require('not-node').Fields.initFields;

const MODEL_NAME = 'Key';
const FIELDS = [
	['title', { default: ''}, 'title'],
	'key',
	['origins', {}, 'listOfUrls'],
	'owner',
	'ownerModel',
	['crate', {}, 'requiredObject'],
	'createdAt',
	'expiredAt',
	'updatedAt'
];

exports.enrich = {
	versioning: false,
	increment: true
};

exports.thisModelName = MODEL_NAME;
exports.thisSchema = initFields(FIELDS, 'model');

exports.thisStatics = {
	async check(key){
		return this.find({key}).exec()
			.then((result)=>{
				if(result && result.length > 0){
					return true;
				}else{
					return false;
				}
			});
	},
	async findActiveByKeyOrOrigin(key, origin){
		const notExpired = [
			{
				'expiredAt':{
					$exists: true,
					$gt:	new Date()
				}
			},
			{
				'expiredAt':{
					$exists:false
				}
			}
		];
		if(key || origin){
			if(key){
				return this.findOne({
					//должен быть с ключом
					key,
					//и валидный or для соотвествия одному из двух правил
					//либо без ограничения по времени, либо с еще не истекшим
					$or: notExpired
				}).exec();
			}else if (origin && typeof origin === 'string'){
				origin = origin.trim();
				if (origin.length > 3){
					return this.findOne({
						//должен быть с сточником в списке разрешенных
						origins: origin,
						//и валидный or для соотвествия одному из двух правил
						//либо без ограничения по времени, либо с еще не истекшим
						$or: notExpired
					}).exec();
				}
			}
		}
		return false;
	},

	async getAllActive(){
		return this.find({
			$or: [
				{
					'expiredAt':{
						$exists: true,
						$gt:	new Date()
					}
				},
				{
					'expiredAt':{
						$exists:false
					}
				}
			]
		}).exec();
	}
};
