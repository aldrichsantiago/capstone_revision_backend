import { Sequelize } from 'sequelize';
import db from '../config/db.js';
import Department from './Department.js';
import Course from './Course.js';
import Application from './ScholarshipApplication.js';

const { DataTypes } = Sequelize;

const Student = db.define('student', {
  // Model attributes are defined here
  // allowNull defaults to true

  student_id: {
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
  year: {
    type: DataTypes.INTEGER,
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
  is_deleted:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  // Other model options go here
  freezeTableName:true
});

// (async () => {
//   await db.sync();
// })();


Department.hasMany(Student, {
  foreignKey: 'dept_id',
});
Student.belongsTo(Department, {
  foreignKey: 'dept_id',
});


Course.hasMany(Student, {
  foreignKey: 'course_id',
});
Student.belongsTo(Course, {
  foreignKey: 'course_id',
});


Student.hasMany(Application, {
  foreignKey: 'student_id',
});
Application.belongsTo(Student, {
  foreignKey: 'student_id',
});

db.sync({alter: true}).then(() => {
  console.log('associations is working');
}).catch(err => console.log(err));

export default Student;