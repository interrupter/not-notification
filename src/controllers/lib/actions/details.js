
import UINotification from '../notification.svelte';
import { mount } from "svelte";

const ACTION = 'details';
const MODEL_ACTION = 'get';

export default class NotificationActionDetails {
	static async run(controller, params) {
		try{
			await controller.preloadVariants(ACTION);

			const idField = controller.getOptions(`${ACTION}.idField`, '_id'),
				query = {[idField]: params[0]};

			controller.setBreadcrumbs([{
				title: 'not-notification:actionDetails',
				url: controller.getModelActionURL(params[0], false)
			}]);

			if (controller.ui[ACTION]) {
				return;
			} else {
				controller.$destroyUI();
			}

			const detailsActionName = controller.getOptions(`${ACTION}.actionName`, MODEL_ACTION);

			let res = await controller.getModel(query)[`$${detailsActionName}`]();
			if (res.status !== 'ok') {
				controller.showErrorMessage(res);
			}

			const title = controller.getItemTitle(res.result);
			controller.setBreadcrumbs([{
				title: `Просмотр "${title}"`,
				url: controller.getModelActionURL(params[0], false)
			}]);

			controller.ui[ACTION] = mount(UINotification, {
            				target: controller.getContainerInnerElement(),
            				props: res.result
            			});

			controller.updateNotifications();

			controller.emit(`after:render:${ACTION}`);
			controller.ui[ACTION].$on('reject', controller.goList.bind(controller));
		}catch(e){
			controller.report(e);
			controller.showErrorMessage(e);
		}
	}
}
