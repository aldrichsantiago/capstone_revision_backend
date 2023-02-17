
import { Sequelize } from "sequelize";
import db from "../config/db.js";
import ScholarshipInfo from "./ScholarshipInfo.js";
import SubjectAndUnit from "./SubjectUnit.js";
import Student from "./Student.js";
 
const { DataTypes } = Sequelize;
 
const Application = db.define('scholarship_application',{
    application_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.ENUM,
        values: ['submitted', 'review', 'approved', 'rejected'],
        allowNull: false,
        defaultValue: 'submitted'
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    semester:{
        type: DataTypes.STRING,
        allowNull: false
    },
    school_year:{
        type: DataTypes.STRING,
        allowNull: false
    },
    rejected_by:{
        type: DataTypes.STRING,
    },
    reason_for_rejection:{
        type: DataTypes.STRING,
    },
    req_1:{
        type: DataTypes.TEXT('medium')
    },
    req_2:{
        type: DataTypes.TEXT('medium')
    },
    req_3:{
        type: DataTypes.TEXT('medium')
    },
    req_4:{
        type: DataTypes.TEXT('medium')
    },
    req_5:{
        type: DataTypes.TEXT('medium')
    },
    req_6:{
        type: DataTypes.TEXT('medium')
    },
    req_7:{
        type: DataTypes.TEXT('medium')
    },
    req_8:{
        type: DataTypes.TEXT('medium')
    },
    req_9:{
        type: DataTypes.TEXT('medium')
    },
    req_10:{
        type: DataTypes.TEXT('medium')
    },
    student_sign:{
        type: DataTypes.TEXT('medium')
    },
    dean_sign:{
        type: DataTypes.TEXT('medium')
    },
    admin_sign:{
        type: DataTypes.TEXT('medium')
    },
    
},{
    freezeTableName:true
});


ScholarshipInfo.hasOne(Application, {
    foreignKey: 'scholarship_id',
});
Application.belongsTo(ScholarshipInfo, {
    foreignKey: 'scholarship_id',
});

SubjectAndUnit.hasOne(Application, {
    foreignKey: 'subject_unit_id',
});
Application.belongsTo(SubjectAndUnit,{
    foreignKey: 'subject_unit_id',
});
  
db.sync({alter: true}).then(() => {
console.log('associations is working between scholarship and application');
}).catch(err => console.log(err));
 
export default Application;