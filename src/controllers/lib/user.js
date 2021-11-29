import ncNotification from './ncNotificationUser.js';
import nsNotification from './service.js';
import nsToast from './toast.js';
import main from './ws.client.main.js';

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
					url: '/notification',
					icon: {
						font: 'envelope',
						size: 'medium',
						svg: '',
						src: '',
					},
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
				url: 			'/notification'
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
