const express = require('express');

const hpp = require('hpp');
const helmet = require('helmet');
const enforce = require('express-sslify');

const {
    apiUsers,
    apiUsersProtected,
} = require('./users');
const {
    apiGroups,
    apiGroupsProtected
} = require('./groups');
const {
    isAuthenticated,
    initAuth
} = require('../controller/auth');

const api = express();
api.use(hpp());

api.use(helmet());

api.use(enforce.HTTPS({
    trustProtoHeader: true
}));
initAuth();

api.use(express.json({
    limit: '1mb'
}));

const apiRoutes = express.Router();
apiRoutes
    .get('/', (req, res) =>
        res.status(200).send({
            message: 'hello from my api'
        })
    )
    .use('/users', apiUsers)
    .use('/groups', apiGroups)
    .use(isAuthenticated)
    .use('/users', apiUsersProtected)
    .use('/groups', apiGroupsProtected)
    .use((err, req, res, next) => {
        res.status(403).send({
            success: false,
            message: `${err.name} : ${err.message}`,
        });
        next();
    });

api.use('/api/v1', apiRoutes);
module.exports = api;