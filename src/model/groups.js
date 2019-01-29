const Users = require('./users');

module.exports = (sequelize, DataTypes) => {
    const Groups = sequelize.define(
        'Groups', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                comment: 'group id',
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                comment: "group title",
                set(val) {
                    this.setDataValue('title', val);
                }
            },
            description: {
                type: DataTypes.STRING,
                comment: "group description",
                set(val) {
                    this.setDataValue('description', val);
                }
            },
            metadatas: {
                type: DataTypes.JSON,
                comment: "group metadatas",
                set(val) {
                    this.setDataValue('metadatas', val);
                }
            },
        }
    );
    Groups.associate = models => {
        Groups.belongsToMany(models.Users, {
            through: 'userGroup'
        });
    };

    return Groups;
};