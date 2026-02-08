import ncNotification from '../lib/ncNotificationRoot.js';
import nsNotification from '../lib/service.js';
import nsToast from '../lib/toast.js';
import main from '../lib/ws.client.main.js';

const services = { nsNotification, nsToast };

const wsc = {
	main
};

const manifest = {
	router: {
		manifest: [
			ncNotification.getRoutes()
		]
	},
	menu:{
		top:{
			sections:[
				{
					id: 'notification',
					href: '/notification',
					icon:  'envelope',
					tag: {
						padding: 	'small',
						bold: 		true,
						color: 		'warning',
						title: 		0
					},
					showOnTouch: true,
					place: 'end'
				}
			]
		},
		side: {
			items: [{
				id: 			'account.notification',
				section: 	'account',
				title: 		'not-notification:labelPlural',
				href: 			'/notification'
			}]
		}
	}
};

export {
	manifest,
	wsc,
	ncNotification,
	services
};
