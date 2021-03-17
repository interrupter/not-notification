import ncNotification from '../lib/ncNotificationUser.js';
import nsNotification from '../lib/service.js';

let services = {nsNotification};

let manifest = {
	router: {
		manifest: [
			{
				paths: ['notification\/([^\/]+)\/([^\/]+)', 'notification\/([^\/]+)', 'notification'],
				controller: ncNotification
			},
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
				title: 		'Уведомления',
				url: 			'/notification'
			}]
		}
	}
};

export {
	manifest,
	ncNotification,
	services
};
