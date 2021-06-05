import {
	ncCRUD,
	Table,
	say,
	UICommon
} from 'not-bulma';
import UINotification from './notification.svelte';


const MODULE_NAME = '';
const MODEL_NAME = 'notification';

const LABELS = {
	plural: 'not-notification:labelPlural',
	single: 'not-notification:labelSingle',
};
class ncNotification extends ncCRUD {
	static MODULE_NAME = MODULE_NAME;
	static MODEL_NAME = MODEL_NAME;
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
				factory: 				this.getInterface()
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
				title: 'not-notification:fieldTitle',
				searchable: true,
				sortable: true
			}, {
				path: ':text',
				title: 'not-notification:fieldText',
				searchable: true,
				sortable: true,
				preprocessor:(val)=>{
					return val.slice(0, 100);
				}
			}, {
				path: ':owner',
				title: 'not-notification:fieldOwner',
				searchable: true,
				sortable: true
			}, {
				path: ':createdAt',
				title: 'not-notification:fieldCreatedAt',
				sortable: true,
				searchable: true,
				preprocessor: (value)=>{
					return UICommon.formatTimestamp(new Date(value).getTime());
				}
			},{
				path: ':new',
				title: 'not-notification:fieldNew',
				type: 'boolean',
				sortable: true,
				searchable: true,
				preprocessor(value){return [{value}];}
			}, {
				path: ':_id',
				title: 'not-notification:fieldAction',
				type: 'button',
				preprocessor: (value) => {
					return [
						{
							action: this.goDetails.bind(this, value),
							title: 'not-notification:actionDetails',
							size: 'small'
						},
						{
							action: this.goDelete.bind(this, value),
							color: 'danger',
							title: 'not-notification:actionDelete',
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
		return this.runList(params);
	}

	async runInbox() {
		await this.preloadVariants('list');
		this.setBreadcrumbs([{
			title: 'not-notification:list',
			url: this.getModelURL()
		}]);

		if (this.ui.list) {
			return;
		} else {
			this.$destroyUI();
		}
		const DEFAULT_OPTIONS_TABLE = {
			interface: {
				combined: true,
				combinedAction: 'inbox',
				factory: this.getModel()
			},
			preload: 			{},
			pager: 				{ size: 50, page: 0},
			filter: 			undefined,
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
				title: 'not-notification:fieldTitle',
				searchable: true,
				sortable: true
			}, {
				path: ':text',
				title: 'not-notification:fieldText',
				searchable: true,
				sortable: true,
				preprocessor:(val)=>{
					return val.slice(0, 100);
				}
			}, {
				path: ':createdAt',
				title: 'not-notification:fieldCreatedAt',
				sortable: true,
				searchable: true,
				preprocessor: (value)=>{
					return UICommon.formatTimestamp(new Date(value).getTime());
				}
			},{
				path: ':new',
				title: 'not-notification:fieldNew',
				type: 'boolean',
				sortable: true,
				searchable: true,
				preprocessor(value){return [{value}];}
			}, {
				path: ':_id',
				title: 'not-notification:fieldAction',
				type: 'button',
				preprocessor: (value) => {
					return [
						{
							action: this.goDetails.bind(this, value),
							title: 'not-notification:actionDetails',
							size: 'small'
						},
						{
							action: this.goDelete.bind(this, value),
							color: 'danger',
							title: 'not-notification:actionDelete',
							size: 'small',
							style: 'outlined'
						}
					];
				},
			}]
		};
		const TABLE_OPTIONS = {
			options: {
				targetEl: this.els.main,
				...DEFAULT_OPTIONS_TABLE
			}
		};
		this.ui.list = new Table(TABLE_OPTIONS);
		this.emit('after:render:inbox');
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
			title: 'not-notification:actionDetails',
			url: this.getModelActionURL(params[0], false)
		}]);

		if (this.ui.details) {
			return;
		} else {
			this.$destroyUI();
		}
		this.getModel({_id: params[0]}).$get()
			.then((res) => {
				if (res.status === 'ok') {
					let title = this.getItemTitle(res.result);
					this.setBreadcrumbs([{
						title: say(`not-notification:detailsOf`, {title}),
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
		this.app.getService('nsNotification').update();
	}

}

export default ncNotification;
