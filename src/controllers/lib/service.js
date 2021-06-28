import {
  TopMenu,
  say
} from 'not-bulma';

const INTERVAL = 360;
const SECTION_ID = 'notification';
const SHORT_LIST_SIZE = 5;
const INIT_UPDATE_DELAY = 5;

const MAX_TITLE_LENGTH = 50;

class nsNotification {
  INTERVAL;
  SHORT_LIST_SIZE;
  INIT_UPDATE_DELAY;

  constructor(app) {
    this.app = app;
    this.interface = this.app.getInterface('notification');
    if(this.interface){
      this.init();
    }else{
      app.error('no notification interface');
    }
  };

  init() {
    setTimeout(this.update.bind(this), INIT_UPDATE_DELAY * 100);
    this.int = setInterval(this.update.bind(this), INTERVAL * 1000);
    window.addEventListener('unload', () => {
      clearInterval(this.int);
      delete this.app;
      delete this.interface;
    });
  }

  update() {
    this.updateLatestShort();
  }

  updateLatestShort() {
    this.interface({}).setFilter({new: true}).setPageSize(SHORT_LIST_SIZE).$inbox({})
      .then((res) => {
        if (res && res.status === 'ok') {
          this.app.log(res.result);
          if (res.result) {
            let menuItems = this.createMenuItems(res.result);
            TopMenu.updateSectionItems('notification', () => {
              return menuItems;
            });
            setTimeout(()=>{
              this.app.emit(`tag-${SECTION_ID}:update`, {
                title: res.result.freshCount > 0 ? res.result.freshCount : false
              });
            }, 1000);
          }
        }
      })
      .catch(e => {
        this.app.error(e);
      });
  }

  createMenuItems({list, count}) {
    let items = list.map(this.createMenuItem.bind(this));
    items.push(this.createShowAllMenuItem(count));
    items.push(this.createMarkAllAsReadMenuItem());
    return items;
  }

  createMenuItem(item) {
    let time = this.getTimeDiff(item);
    let title = item.title;
    if(title.length > MAX_TITLE_LENGTH){
      title = title.substr(0, MAX_TITLE_LENGTH);
      title+='...';
    }
    return {
      id: `${SECTION_ID}.${item._id}`,
      section: SECTION_ID,
      title: `${title} - ${time}`,
      url: `/notification/${item._id}`
    };
  }

  createShowAllMenuItem(count) {
    return {
      break: true,
      id: `${SECTION_ID}.all`,
      section: SECTION_ID,
      title: say(`not-notification:showAll`, {count}),
      url: '/notification/inbox'
    };
  }

  createMarkAllAsReadMenuItem() {
    return {
      break: true,
      id: `${SECTION_ID}.markAllAsRead`,
      section: SECTION_ID,
      classes: 'is-clickable',
      title: `not-notification:markAllAsRead`,
      action:  this.markAllAsRead.bind(this)
    };
  }

  markAllAsRead(){
    this.interface({}).$markAllAsRead()
      .then(()=>{
        this.update();
      })
      .catch((e) => {
        this.app.error(e);
      });
  }

  declOfNum(n, text_forms) {
    n = Math.abs(n) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
  }

  getTimeDiff({
    createdAt
  }) {
    let currentTime = new Date().getTime(),
      date = new Date(createdAt).getTime();
    let sec = Math.round((currentTime - date) / 1000);
    let unit;
    if (sec < 60) {
      unit = this.declOfNum(
        sec,
        [
          'not-notification:second-1',
          'not-notification:second-2',
          'not-notification:second-3'
        ]
      );
      return say('not-notification:timeAgo', {time: sec, unit: say(unit)});
    } else if (sec < 3600) {
      let min = Math.floor(sec / 60);
      unit = this.declOfNum(
        min,
        [
        'not-notification:minute-1',
        'not-notification:minute-2',
        'not-notification:minute-3'
        ]
      );
      return say('not-notification:timeAgo', {time: min, unit: say(unit)});
    } else {
      let hours = Math.floor(sec / (60 * 60));
      unit = this.declOfNum(
        hours,
        [
          'not-notification:hour-1',
          'not-notification:hour-2',
          'not-notification:hour-3'
        ]
      );
      return say('not-notification:timeAgo', {time: hours, unit: say(unit)});
    }
  }

}

export default nsNotification;
