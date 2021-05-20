import ncNotification from '../lib/ncNotificationRoot.js';
import nsNotification from '../lib/service.js';
import main from './ws.client.main.js';


const services = { nsNotification };

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
        title: 		'Уведомления',
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
