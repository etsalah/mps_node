import { DataTypes } from 'sequelize'
import { getSequelizeObj } from '../lib/main.js'


const sequelizeObj = getSequelizeObj();

const Member = sequelizeObj.define('member', {
    memberId: {
      field: 'member_id',
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    party: {
      type: DataTypes.STRING,
      allowNull: false
    },
    constituency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'member'
  }
)


export default Member
