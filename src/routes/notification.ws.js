const notNode = require('not-node');
const {HttpExceptionUnauthorized} = require('not-node/src/exceptions/http');

async function inbox({data, client}){
	if(client.identity && client.identity._id){
		let result = await notNode.Application.getLogic('Notification').inbox({
			size:   data.size,
			skip:   data.skip,
			filter: data.filter,
			owner:  client.identity._id
		});
		return result;
	}else{
		throw new HttpExceptionUnauthorized();
	}
}

async function markAsRead({data, client}){
	if(client.identity && client.identity._id){
		let result = await notNode.Application.getLogic('Notification').markAsRead({
			_id:   				data._id,
			owner:  			client.identity._id,
			ownerModel: 	'User'
		});
		return result;
	}else{
		throw new HttpExceptionUnauthorized();
	}
}

async function markAllAsRead({client}){
	if(client.identity && client.identity._id){
		let result = await notNode.Application.getLogic('Notification').markAllAsRead({
			owner:  			client.identity._id,
			ownerModel: 	'User'
		});
		return result;
	}else{
		throw new HttpExceptionUnauthorized();
	}
}

module.exports = {
	servers:{
		main:{
			request: {
				inbox,
				markAsRead,
				markAllAsRead
			}
		}
	}
};
