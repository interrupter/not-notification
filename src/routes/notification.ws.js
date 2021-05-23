const notNode = require('not-node');

async function inbox(data, cred, conn){
	if(conn.identity && conn.identity._id){
		let list = await notNode.Application.getLogic('Notification').inbox({
			size:   data.size,
			skip:   data.skip,
			filter: data.filter,
			owner:  conn.identity._id
		});
		return { status: 'ok', result: {list} };
	}else{
		return { status: 'ok', result: {list:[]} };
	}
}


module.exports = {
	servers:{
		main:{
			request: {
				inbox
			}
		}
	}
};
