import {toast} from 'bulma-toast/dist/bulma-toast.esm.js';

function show(data){
	toast({
		...data,
		dismissible: true,
		animate: { in: "fadeIn",
			out: "fadeOut"
		},
		closeOnClick: true
	});
}

class nsToast {
	constructor(app) {
		this.app = app;
	}

	success(message){
		this.custom({
			type: 'is-success',
			message: `${message}`
		});
	}

	error(title, message){
		this.custom({
			type: 'is-danger',
			message: `${title}: ${message}`
		});
	}

	custom(data){
		show(data);
	}

	static show = show;
}

export default nsToast;
