const pick = require('lodash.omit');

const {
    Groups
} = require('../model');

const createGroups = ({
    title,
    description,
    metadatas,
    id
}) =>
    Groups.create({
        title,
        description: description || '',
        metadatas,
        ownerId: id
    }).then(group =>
        pick(
            group.get({
                plain: true
            })
        )
    );

const getAllGroups = () =>
    Groups.findAll().then(groups =>
        groups && !groups.deletedAt ?
            groups :
            Promise.reject(new Error('No group created.'))
    );

const joinGroups = ({
    idGroup,
    idUser
}) =>
    Groups.findOne({
        where: {
            id: idGroup
        }
    }).then(groups =>
        groups && !groups.deletedAt ?
            groups.addUsers(idUser) :
            Promise.reject(new Error('Group doesn\'t exist.'))
    );

const dismissGroups = ({
    idGroup,
    idUser
}) =>
    Groups.findOne({
        where: {
            id: idGroup
        }
    }).then(groups =>
        groups.removeUsers(idUser)
    );

const updateGroups = ({
    id,
    title,
    description,
    metadatas
}) => {
    Groups.update({
        title,
        description,
        metadatas,
        updatedAt: new Date()
    }, {
            where: {
                id
            },
        })
}

const deleteGroups = ({
    id
}) => {
    Groups.update({
        deletedAt: new Date()
    }, {
            where: {
                id
            },
        })
}

module.exports = {
    createGroups,
    getAllGroups,
    updateGroups,
    deleteGroups,
    joinGroups,
    dismissGroups
};