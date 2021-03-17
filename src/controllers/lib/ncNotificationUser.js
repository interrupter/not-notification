import {
	ncCRUD
} from 'not-bulma';


const MODULE_NAME = '';
const MODEL_NAME = 'notification';

const LABELS = {
	plural: 'Уведомления',
	single: 'Уведомление',
};

class ncNotification extends ncCRUD {
	constructor(app, params) {
		super(app, `${MODULE_NAME}.${MODEL_NAME}`);
		this.setModuleName(MODULE_NAME.toLowerCase());
		this.setModelName(MODEL_NAME.toLowerCase());
		this.setOptions('names', LABELS);
		this.setOptions('Validators', {});
		this.setOptions('params', params);
		this.setOptions('list', {
			interface: {
				combined: 			true,
				combinedAction: 'inbox',
				factory: 				this.getModel()
			},
			endless: false,
			preload: {},
			sorter: {
				createdAt: -1
			},
			actions: [],
			showSearch: true,
			idField: '_id',
			fields: [{
				path: ':title',
				title: 'Название',
				searchable: true,
				sortable: true
			}, {
				path: ':text',
				title: 'Текст',
				searchable: true,
				sortable: true
			}, {
				path: ':createdAt',
				title: 'Создано',
				sortable: true,
				searchable: true
			}, {
				path: ':_id',
				title: 'Действия',
				type: 'button',
				preprocessor: (value) => {
					return [
						{
							action: this.goUpdate.bind(this, value),
							title: 'Изменить',
							size: 'small'
						},
						{
							action: this.goDelete.bind(this, value),
							color: 'danger',
							title: 'Удалить',
							size: 'small',
							style: 'outlined'
						}
					];
				},
			}]
		});
		this.start();
		return this;
	}

	runInbox(){

	}

}

export default ncNotification;
