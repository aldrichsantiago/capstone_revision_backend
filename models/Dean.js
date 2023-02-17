import { Sequelize } from 'sequelize';
import db from '../config/db.js';
import Department from './Department.js';

const { DataTypes } = Sequelize;

const Dean = db.define('dean', {
  // Model attributes are defined here
  // allowNull defaults to true

  dean_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  middle_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_no: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  refresh_token:{
    type: DataTypes.TEXT,
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  // Other model options go here
  freezeTableName:true
});

// (async () => {
//     await db.sync();
//   })();

Department.hasOne(Dean, {
  foreignKey: 'dept_id',
});
Dean.belongsTo(Department, {
  foreignKey: 'dept_id',
});


db.sync({alter: true}).then(() => {
  console.log('dean and department associations is working');
}).catch(err => console.log(err));

export default Dean;