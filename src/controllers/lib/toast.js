import * as bulmaToast from 'bulma-toast';

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

	static custom(data){
		bulmaToast.toast({
			...data,
			dismissible: true,
			animate: { in: "fadeIn",
				out: "fadeOut"
			},
			closeOnClick: true
		});
	}
}

export default nsToast;
