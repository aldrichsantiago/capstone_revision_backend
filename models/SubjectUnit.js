import { Sequelize, UUIDV4 } from "sequelize";
import db from "../config/db.js";
import Application from "./ScholarshipApplication.js";
import Subject from "./Subject.js";
 
const { DataTypes } = Sequelize;
 
const SubjectAndUnit = db.define('subject_unit',{
    subject_unit_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    subject_1:{
        type: DataTypes.STRING
    },
    subject_2:{
        type: DataTypes.STRING
    },
    subject_3:{
        type: DataTypes.STRING
    },
    subject_4:{
        type: DataTypes.STRING
    },
    subject_5:{
        type: DataTypes.STRING
    },
    subject_6:{
        type: DataTypes.STRING
    },
    subject_7:{
        type: DataTypes.STRING
    },
    subject_8:{
        type: DataTypes.STRING
    },
    subject_9:{
        type: DataTypes.STRING
    },
    subject_10:{
        type: DataTypes.STRING
    },
    subject_11:{
        type: DataTypes.STRING
    },
    subject_12:{
        type: DataTypes.STRING
    },
    unit_1:{
        type: DataTypes.INTEGER
    },
    unit_2:{
        type: DataTypes.INTEGER
    },
    unit_3:{
        type: DataTypes.INTEGER
    },
    unit_4:{
        type: DataTypes.INTEGER
    },
    unit_5:{
        type: DataTypes.INTEGER
    },
    unit_6:{
        type: DataTypes.INTEGER
    },
    unit_7:{
        type: DataTypes.INTEGER
    },
    unit_8:{
        type: DataTypes.INTEGER
    },
    unit_9:{
        type: DataTypes.INTEGER
    },
    unit_10:{
        type: DataTypes.INTEGER
    },
    unit_11:{
        type: DataTypes.INTEGER
    },
    unit_12:{
        type: DataTypes.INTEGER
    },
},{
    freezeTableName:true
});




db.sync({alter: true}).then(() => {
console.log('associations on application and subject-unit is working');
}).catch(err => console.log(err));
 
export default SubjectAndUnit;