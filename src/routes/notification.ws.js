const notNode = require('not-node');

async function inbox({data, conn}){
	if(conn.identity && conn.identity._id){
		let result = await notNode.Application.getLogic('Notification').inbox({
			size:   data.size,
			skip:   data.skip,
			filter: data.filter,
			owner:  conn.identity._id
		});
		return result;
	}else{
		return { status: 'ok', result: {list:[]} };
	}
}

async function markAsRead({data, conn}){
	if(conn.identity && conn.identity._id){
		let result = await notNode.Application.getLogic('Notification').markAsRead({
			_id:   				data._id,
			owner:  			conn.identity._id,
			ownerModel: 	'User'
		});
		return result;
	}else{
		return { status: 'error'};
	}
}

async function markAllAsRead({conn}){
	if(conn.identity && conn.identity._id){
		let result = await notNode.Application.getLogic('Notification').markAllAsRead({
			owner:  			conn.identity._id,
			ownerModel: 	'User'
		});
		return result;
	}else{
		return { status: 'error'};
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
