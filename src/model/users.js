const bcrypt = require('bcrypt');
const Groups = require('./groups');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: 'user id',
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        comment: 'user firstname',
        set(val) {
          this.setDataValue(
            'firstName',
            val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
          );
        }
      },
      lastName: {
        type: DataTypes.STRING,
        comment: 'user lastname',
        set(val) {
          this.setDataValue(
            'lastName',
            val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
          );
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'user email',
        validate: {
          isEmail: true
        }
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Hash for the user password',
        set(val) {
          const hash = bcrypt.hashSync(val, 12);
          this.setDataValue('hash', hash);
        }
      }
    }, {
      paranoid: true,
      indexes: [{
        unique: true,
        fields: ['email']
      }]
    }
  );

  Users.excludeAttributes = ['hash'];

  /* eslint func-names:off */
  Users.prototype.comparePassword = function (password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.hash, (err, res) => {
        if (err || !res) {
          return reject(new Error('INVALID CREDENTIALS'));
        }
        return resolve();
      });
    });
  };

  Users.associate = models => {
    Users.belongsToMany(models.Groups, {
      through: 'userGroup'
    });
    Users.hasOne(models.Groups, {
      as: 'owner'
    });
  };

  return Users;
};