const express = require('express');
const jwt = require('jwt-simple');
const {
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser
} = require('../controller/users');
const logger = require('../logger');

const apiUsers = express.Router();

apiUsers.post('/', (req, res) =>
  !req.body.email || !req.body.password ?
    res.status(400).send({
      success: false,
      message: 'email and password required'
    }) :
    createUser(req.body)
      .then(user => {
        const token = jwt.encode({
          id: user[0].id
        }, process.env.JWT_SECRET);
        return res.status(201).send({
          success: true,
          token: `JWT ${token}`,
          profile: user,
          message: 'user created'
        });
      })
      .catch(err => {
        logger.error(`💥 Failed to create user : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`
        });
      })
);

apiUsers.post('/login', (req, res) =>
  !req.body.email || !req.body.password ?
    res.status(400).send({
      success: false,
      message: 'email and password required'
    }) :
    loginUser(req.body)
      .then(user => {
        const token = jwt.encode({
          id: user.id
        }, process.env.JWT_SECRET);
        return res.status(200).send({
          success: true,
          token: `JWT ${token}`,
          profile: user,
          message: 'user logged in'
        });
      })
      .catch(err => {
        logger.error(`💥 Failed to login user : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`
        });
      })
);

const apiUsersProtected = express.Router();


apiUsersProtected.get('/', (req, res) => {
  const id = req.param('id');
  logger.info(id);
  getUser({
    id
  })
    .then(user => res.status(200).send({
      success: true,
      profile: user,
      message: 'user logged in'
    }))
});

apiUsersProtected.put('/', (req, res) => {
  updateUser(req.body.user)
    .then(() => res.status(200).send({
      success: true,
      message: 'update user logged in'
    }))
    .catch(err => {
      logger.error(`💥 Failed to update user : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`
      });
    })
});

apiUsersProtected.delete('/', (req, res) => {
  deleteUser(req.body.user)
    .then(() => res.status(200).send({
      success: true,
      message: 'delete OK user logged'
    }))
    .catch(err => {
      logger.error(`💥 Failed to update user : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`
      });
    })
});

module.exports = {
  apiUsers,
  apiUsersProtected
};