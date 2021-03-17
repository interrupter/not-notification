const INTERVAL = 60;

class nsNotification{
  INTERVAL;

  constructor(app){
    this.app = app;
    this.interface = this.app.getWorking('interfaces.notification');
    this.init();
  }

  init(){
    this.updateCountOfNew();
    this.int = setInterval(this.updateCountOfNew.bind(this), INTERVAL * 1000);
    window.addEventListener('unload', () => {
      clearInterval(this.int);
      delete this.app;
      delete this.interface;
    });
  }

  updateCountOfNew(){
    this.interface({}).$countNew({})
      .then((res)=>{
        if(res && res.status === 'ok'){
          if(!isNaN(res.result)){
            this.app.emit('tag-notification:update', { title: res.result });
          }
        }
      })
      .catch(e =>{
        this.app.error(e);
      });
  }
}

export default nsNotification;
