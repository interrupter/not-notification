import Validators from '../lib/validators.js';
import UIListOfUrls from '../lib/list.of.urls.svelte';
import {
	ncCRUD,
	Form
} from 'not-bulma';


const MODULE_NAME = '';
const MODEL_NAME = 'Key';

const LABELS = {
	plural: 'Ключи',
	single: 'Ключ',
};

Form.addComponent('UIListOfUrls', UIListOfUrls);

class ncKey extends ncCRUD {
	constructor(app, params) {
		super(app, `${MODULE_NAME}.${MODEL_NAME}`);
		this.setModuleName(MODULE_NAME.toLowerCase());
		this.setModelName(MODEL_NAME.toLowerCase());
		this.setOptions('names', LABELS);
		this.setOptions('Validators', Validators);
		this.setOptions('params', params);
		this.setOptions('list', {
			interface: {
				combined: true,
				factory: this.make.key
			},
			endless: false,
			preload: {},
			sorter: {
				id: -1
			},
			actions: [{
				title: 'Создать',
				action: this.goCreate.bind(this)
			}],
			showSearch: true,
			idField: '_id',
			fields: [{
				path: ':keyID',
				title: 'ID',
				searchable: true,
				sortable: true
			}, {
				path: ':title',
				title: 'Название',
				searchable: true,
				sortable: true
			}, {
				path: ':key',
				title: 'Ключ',
				searchable: true,
				sortable: true
			}, {
				path: ':expiredAt',
				title: 'Истекает',
				sortable: true,
				searchable: true
			}, {
				path: ':_id',
				title: 'Действия',
				type: 'button',
				preprocessor: (value) => {
					return [{
						action: this.goDetails.bind(this, value),
						title: 'Подробнее',
						size: 'small'
					},
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

	createDefault() {
		let t = new Date();
		t.setMonth(t.getMonth() + 1);
		let newRecord = this.make[this.getModelName()]({
			'_id': null,
			key: '',
			title: LABELS.single,
			expiredAt: t.toISOString(),
			crate: JSON.stringify({})
		});
		return newRecord;
	}

}

export default ncKey;
