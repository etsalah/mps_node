import { DataTypes } from 'sequelize'
import { getSequelizeObj } from '../lib/main.js'

const sequelizeObj = getSequelizeObj()

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
  uniqueKeys: {
    uniqueMembers: {
      fields: ['name', 'party', 'constituency', 'region']
    }
  },
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'member'
}
)

try {
  await sequelizeObj.sync({ alter: true })
} catch (e) {

}
export default Member
