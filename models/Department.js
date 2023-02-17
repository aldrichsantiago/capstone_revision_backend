import { Sequelize } from 'sequelize';
import db from '../config/db.js';

const { DataTypes } = Sequelize;

const Department = db.define('department', {
  // Model attributes are defined here
  // allowNull defaults to true
  dept_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dept_code: {
    type: DataTypes.STRING,
  },
  dept_name: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
  freezeTableName:true
});


(async () => {
  await db.sync();
})();

export default Department;