import {Frame} from 'not-bulma';
const {notCommon} = Frame;

async function onUpdate(/*payload*/){
	try{
		notCommon.getApp().getService('nsNotification').update();
	}catch(e){
		notCommon.error(e);
	}
}

const main = {
	router:{
		routes:{
			event: {
				'notification//update': onUpdate
			}
		}
	}
};

export default main;
