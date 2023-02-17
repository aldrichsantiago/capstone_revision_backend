
import { Sequelize } from "sequelize";
import db from "../config/db.js";
import Course from "./Course.js";
 
const { DataTypes } = Sequelize;
 
const Subject = db.define('subject',{
    subject_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject_code:{
        type: DataTypes.STRING
    },
    subject_name:{
        type: DataTypes.STRING
    },
},{
    freezeTableName:true
});
 
Course.hasMany(Subject, {
    foreignKey: 'course_id',
});
Subject.belongsTo(Course,{
    foreignKey: 'course_id',
});


db.sync({alter: true}).then(() => {
console.log('associations on subject and courses is working');
}).catch(err => console.log(err));
 
export default Subject;