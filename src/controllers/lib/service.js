import {
  TopMenu
} from 'not-bulma';

const INTERVAL = 360;
const SECTION_ID = 'notification';
const SHORT_LIST_SIZE = 5;
const INIT_UPDATE_DELAY = 5;

class nsNotification {
  INTERVAL;
  SHORT_LIST_SIZE;
  INIT_UPDATE_DELAY;

  constructor(app) {
    this.app = app;
    this.interface = this.app.getInterface('notification');
    this.init();
  }

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
    return items;
  }

  createMenuItem(item) {
    let time = this.getTimeDiff(item);
    return {
      id: `${SECTION_ID}.${item._id}`,
      section: SECTION_ID,
      title: `${item.title} - ${time}`,
      url: `/notification/${item._id}`
    };
  }

  createShowAllMenuItem(count) {
    return {
      break: true,
      id: `${SECTION_ID}.all`,
      section: SECTION_ID,
      title: `Показать все (${count})`,
      url: '/notification/inbox'
    };
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
      unit = this.declOfNum(sec, ['секунду', 'секунды', 'секунд']);
      return `${sec} ${unit} назад`;
    } else if (sec < 3600) {
      let min = Math.floor(sec / 60);
      unit = this.declOfNum(min, ['минуту', 'минуты', 'минут']);
      return `${min} ${unit} назад`;
    } else {
      let hours = Math.floor(sec / (60 * 60));
      unit = this.declOfNum(hours, ['час', 'часа', 'часов']);
      return `${hours} ${unit} назад`;
    }
  }

}

export default nsNotification;
