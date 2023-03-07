import { DataTypes } from 'sequelize'
import { getSequelizeObj } from '../lib/main.js'

const sequelizeObj = getSequelizeObj()

const Leader = sequelizeObj.define('leader', {
  leaderId: {
    field: 'leader_id',
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    field: 'name',
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    field: 'title',
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    field: 'photo',
    type: DataTypes.STRING,
    allowNull: false
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
