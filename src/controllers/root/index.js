import ncKey from './ncKey.js';

let manifest = {
	router: {
		manifest: [
			{
				paths: ['key\/([^\/]+)\/([^\/]+)', 'key\/([^\/]+)', 'key'],
				controller: ncKey
			},
		]
	},
	menu:{
		side: {
			items: [{
				id: 			'system.keys',
				section: 'system',
				title: 		'Ключи',
				url: 			'/key'
			}]
		}
	}
};

export {
	manifest,
	ncKey
};
