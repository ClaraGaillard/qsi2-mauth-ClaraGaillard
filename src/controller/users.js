const omit = require('lodash.omit');
const {
  Users
} = require('../model');

const createUser = ({
  firstName,
  lastName,
  email,
  password
}) =>
  Users.create({
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password
  }).then(user =>
    omit(
      user.get({
        plain: true
      }),
      Users.excludeAttributes
    )
  );

const loginUser = ({
  email,
  password
}) =>
  Users.findOne({
    where: {
      email
    }
  }).then(user =>
    user && !user.deletedAt ?
      Promise.all([
        omit(
          user.get({
            plain: true
          }),
          Users.excludeAttributes
        ),
        user.comparePassword(password)
      ]) :
      Promise.reject(new Error('LOGIN :UNKOWN OR DELETED USER'))
  );

const getUser = ({
  id
}) =>
  Users.findOne({
    where: {
      id
    }
  }).then(user =>
    user && !user.deletedAt ?
      omit(
        user.get({
          plain: true
        }),
        Users.excludeAttributes
      ) :
      Promise.reject(new Error('GET USER: UNKOWN OR DELETED USER'))

  );

const updateUser = ({
  mail,
  password,
  firstname,
  lastname,
  id
}) => {
  Users.update({
    email: mail,
    hash: password,
    firstName: firstname,
    lastName: lastname,
    updatedAt: new Date()
  }, {
      where: {
        id
      },
    })
}

const deleteUser = ({
  id
}) => {
  Users.update({
    deletedAt: new Date()
  }, {
      where: {
        id
      },
    })
}

module.exports = {
  createUser,
  getUser,
  loginUser,
  updateUser,
  deleteUser
};