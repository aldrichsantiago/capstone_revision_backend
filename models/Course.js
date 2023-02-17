import { Sequelize } from 'sequelize';
import db from '../config/db.js';
import Department from './Department.js';

const { DataTypes } = Sequelize;

const Course = db.define('course', {
  // Model attributes are defined here
  // allowNull defaults to true
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_code: {
    type: DataTypes.STRING,
  },
  course_name: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
  freezeTableName:true
});

Department.hasMany(Course, {
  foreignKey: 'dept_id',
});
Course.belongsTo(Department,{
  foreignKey: 'dept_id',
});
  
  
db.sync({alter: true}).then(() => {
  console.log('associations on dept and courses is working');
}).catch(err => console.log(err));

export default Course;