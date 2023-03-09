import { DataTypes } from 'sequelize'
import { getSequelizeObj } from '../lib/main.js'

const sequelizeObj = getSequelizeObj()

const Leader = sequelizeObj.define('leader', {
  leaderId: {
    field: 'leader_id',
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'uniqueLeader'
  },
  name: {
    field: 'name',
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'uniqueLeader'
  },
  title: {
    field: 'title',
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'uniqueLeader'
  },
  photo: {
    field: 'photo',
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'uniqueLeader'
  }
}, {
  uniqueKeys: {
    uniqueLeader: {
      fields: [
        'name', 'title'
      ]
    }
  },
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'leader'
})

try {
  await sequelizeObj.sync({ alter: true })
} catch (e) {

}

export default Leader
