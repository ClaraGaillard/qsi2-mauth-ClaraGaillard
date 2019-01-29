const express = require('express');
const {
    createGroups,
    getAllGroups,
    joinGroups,
    dismissGroups
} = require('../controller/groups');
const logger = require('../logger');

const apiGroups = express.Router();
const apiGroupsProtected = express.Router();

apiGroupsProtected.post('/', (req, res) =>
    !req.body.title || !req.body.description || !req.body.metadatas || !req.body.id ?
        res.status(400).send({
            success: false,
            message: 'infos are required'
        }) :
        createGroups(req.body)
            .then(group => res.status(201).send({
                success: true,
                profile: group,
                message: 'Groups created'
            }))
            .catch(err => {
                logger.error(`💥 Failed to create groups : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
);


apiGroupsProtected.post('/addUser', (req, res) =>
    !req.body.idUser || !req.body.idGroup ?
        res.status(400).send({
            success: false,
            message: 'id user and group are required'
        }) :
        joinGroups(req.body)
            .then(() => res.status(201).send({
                success: true,
                message: 'groupMembers added'
            }))
            .catch(err => {
                logger.error(`💥 Failed to add user : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
);

apiGroupsProtected.delete('/deleteUser', (req, res) =>
    !req.body.idUser || !req.body.idGroup ?
        res.status(400).send({
            success: false,
            message: 'id user group are required'
        }) :
        dismissGroups(req.body)
            .then(() => res.status(201).send({
                success: true,
                message: 'members deleted'
            }))
            .catch(err => {
                logger.error(`💥 Failed to delete user : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
);


apiGroups.get('/', (req, res) =>
    getAllGroups()
        .then(groups => res.status(201).send({
            success: true,
            profile: groups,
            message: 'groups created'
        }))
        .catch(err => {
            logger.error(`💥 Failed to find group : ${err.stack}`);
            return res.status(500).send({
                success: false,
                message: `${err.name} : ${err.message}`
            });
        })
);

module.exports = {
    apiGroups,
    apiGroupsProtected
};