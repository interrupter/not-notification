import {
	Table, ncCRUD
} from 'not-bulma';
import UINotification from './notification.svelte';


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
				factory: 				this.getInterface(this.getModelName())
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
				searchable: true,
				preprocessor: (value)=>{
					return UICommon.formatTimestamp(new Date(value).getTime());
				}
			},{
				path: ':new',
				title: 'Новый',
				type: 'boolean',
				sortable: true,
				searchable: true,
				preprocessor(value){return [{value}];}
			}, {
				path: ':_id',
				title: 'Действия',
				type: 'button',
				preprocessor: (value) => {
					return [
						{
							action: this.goDetails.bind(this, value),
							title: 'Подробнее',
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

	route(params = []) {
		if (params.length == 1) {
			if(params[0] === 'inbox'){
				return this.runInbox();
			}else {
				return this.runDetails(params);
			}
		} else if (params.length > 1) {
			if (params[1] === 'delete') {
				return this.runDelete(params);
			} else if (params[1] === 'update') {
				return this.runUpdate(params);
			} else {
				let routeRunnerName = 'run' + notCommon.capitalizeFirstLetter(params[1]);
				if (this[routeRunnerName] && typeof this[routeRunnerName] === 'function') {
					return this[routeRunnerName](params);
				}
			}
		}
		return this.runInbox(params);
	}

	runInbox(){

	}

	goInbox() {
		this.app.getWorking('router').navigate(this.getModelActionURL(false, 'inbox'));
	}

	goMarkAsRead(value) {
		this.app.getWorking('router').navigate(this.getModelActionURL(value, 'markAsRead'));
	}

	async runDetails(params) {
		await this.preloadVariants('details');
		this.setBreadcrumbs([{
			title: 'Просмотр',
			url: this.getModelActionURL(params[0], false)
		}]);

		if (this.ui.details) {
			return;
		} else {
			this.$destroyUI();
		}
		let model = this.getModel();
		let mod = model({_id: params[0]});
		this.log(typeof mod.$get);
		mod.$get()
			.then((res) => {
				if (res.status === 'ok') {
					let title = this.getItemTitle(res.result);
					this.setBreadcrumbs([{
						title: `Просмотр "${title}"`,
						url: this.getModelActionURL(params[0], false)
					}]);
					this.ui.details = new UINotification({
						target: this.els.main,
						props: res.result
					});
					this.updateNotifications();
					this.emit('after:render:details');
					this.ui.details.$on('reject', this.goList.bind(this));
				} else {
					this.showErrorMessage(res);
				}
			})
			.catch(this.error.bind(this));
	}

	updateNotifications(){
		this.app.getWorking('services.nsNotification').update();
	}

}

export default ncNotification;
