const Log = require('not-log')(module, 'Key:Model');
try {
  const notNode = require('not-node');
  const uuidv4 = require('uuid').v4;
  const origin = require('original');
  const ERR_INVALID_KEY = 'Invalid key';
  const ERR_EMPTY_REPORT_OR_TYPE = 'Empty report or type fields';
  const ERR_EMPTY_KEY_NO_CONSUMERS = 'Key is empty, no consumers';
  const ERR_EMPTY_KEY = 'Key is empty';
  const ERR_NO_KEY = 'No key';
  const ERR_NO_ORIGIN = 'No origin info in headers';
  const ERR_INVALID_ORIGIN = 'Invalid origin of request';
  const ERR_INVALID_KEY_OR_ORIGIN = 'Invalid key or origin of request';
  const ERR_NO_COLLECTOR_MODEL = 'Collector model not exists';
  const ERRS = [
    ERR_INVALID_KEY,
    ERR_EMPTY_REPORT_OR_TYPE,
    ERR_EMPTY_KEY_NO_CONSUMERS,
    ERR_EMPTY_KEY,
    ERR_NO_KEY,
    ERR_NO_ORIGIN,
    ERR_INVALID_ORIGIN,
    ERR_INVALID_KEY_OR_ORIGIN,
    ERR_NO_COLLECTOR_MODEL
  ];

  const
    UserActions = [],
    AdminActions = [
      'create',
      'get',
      'getById',
      'listAndCount',
      'delete'
    ],
    MODEL_NAME = 'Key',
    MODEL_OPTIONS = {
      MODEL_NAME,
      MODEL_TITLE: 'Ключ',
      RESPONSE: {
        full: ['get', 'getRaw', 'create']
      },
      before: {
        create(args) {
          return new Promise((resolve, reject) => {
            try {
              let {
                req
              } = args;
              if (typeof req.body.crate !== 'undefined' && req.body.crate !== null && req.body.crate.length > 1) {
                req.body.crate = JSON.parse(req.body.crate);
              } else {
                req.body.crate = {};
              }
              if (typeof req.body.origins !== 'undefined' && req.body.origins !== null && req.body.origins.length > 1) {
                req.body.origins = req.body.origins.split("\n");
              } else {
                delete req.body.origins;
              }
              if (!(typeof req.body.key !== 'undefined' && req.body.key !== null && req.body.key.length > 10)) {
                req.body.key = uuidv4();
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          });
        }
      }
    },
    modMeta = require('not-meta');


  module.exports = {
    _getRaw(req, res) {
      const App = notNode.Application;
      let id = req.params._id,
        thisModel = App.getModel(MODEL_NAME);
      thisModel.getOneRaw(id)
        .then((item) => {
          item = item.toObject();
          item.crate = JSON.stringify(item.crate);
          if(item.origins){
            item.origins = item.origins.join("\n");
          }
          if (item.expiredAt instanceof Date) {
            if (item.expiredAt.toISOString) {
              let exp = item.expiredAt.toISOString();
              item.expiredAt = exp.split('T')[0];
            }
          }
          res.status(200).json({
            status: 'ok',
            result: item
          });
        })
        .catch((err) => {
          App.report(err);
          res.status(500).json({});
        });
    },
    _update(req, res) {
      const App = notNode.Application;
      let id = req.params._id,
        thisModel = App.getModel(MODEL_NAME);
      if (typeof req.body.crate !== 'undefined' && req.body.crate !== null && req.body.crate.length > 1) {
        req.body.crate = JSON.parse(req.body.crate);
      } else {
        req.body.crate = {};
      }
      if (typeof req.body.origins !== 'undefined' && req.body.origins !== null && req.body.origins.length > 1) {
        req.body.origins = req.body.origins.split("\n");
      } else {
        delete req.body.origins;
      }
      thisModel.updateOne({
          _id: id
        },
        req.body
      ).exec()
        .then((item) => {
          if (item.n === 1) {
            res.status(200).json({
              status: 'ok'
            });
          } else {
            throw new Error('No document to update');
          }
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    async collect(req, res) {
      const App = notNode.Application;
      let Key = App.getModel('Key');
      try {
        if (
          typeof req.body.report !== 'undefined' && req.body.report !== null &&
          typeof req.body.type !== 'undefined' && req.body.type !== null
        ) {
          let orgn = req.headers.origin?origin(req.headers.origin):false;
          let key = await Key.findActiveByKeyOrOrigin(req.body.key, orgn);
          if (!key) {
            throw new Error(ERR_INVALID_KEY_OR_ORIGIN);
          }
          if (key.crate && key.crate.consumers) {
            let list = [];
            for (let t in key.crate.consumers) {
              if (typeof t !== 'undefined') {
                let model = App.getModel(t);
                if (model) {
                  let statMethod = model[key.crate.consumers[t]];
                  list.push(statMethod(req.body.report, key, req.body.type));
                } else {
                  App.logger.error(new Error(ERR_NO_COLLECTOR_MODEL));
                  App.logger.error(t);
                }
              }
            }
            let results = await Promise.all(list);
            res.status(200).json({
              status: 'ok',
              results
            });
          } else {
            throw new Error(ERR_EMPTY_KEY_NO_CONSUMERS);
          }
        } else {
          throw new Error(ERR_EMPTY_REPORT_OR_TYPE);
        }
      } catch (err) {
        App.logger.error(err);
        if (ERRS.indexOf(err.message) > -1) {
          res.status(404).json({
            message: err.message
          });
        } else {
          res.status(500).json({});
        }
      }
    }
  };
  modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, '_');
  modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);

} catch (e) {
  Log.error(e);
}
