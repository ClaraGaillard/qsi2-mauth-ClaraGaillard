const api = require('./api');
const db = require('./model');
const logger = require('./logger');

const port = process.env.PORT || 8080;
const ip = process.env.IP || '0.0.0.0';
db.sequelize
    .sync()
    .then(() =>
        api.listen(port, ip, err =>
            err ?
                logger.error(`🔥  Failed to start API : ${err.stack}`) :
                logger.info(`🌎  API is listening on port ${port}`)
        )
    )
    .catch(err => logger.error(`🔥  Failed to connect database : ${err.stack}`));