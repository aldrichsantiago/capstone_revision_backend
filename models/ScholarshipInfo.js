
import { Sequelize } from "sequelize";
import db from "../config/db.js";
 
const { DataTypes } = Sequelize;
 
const ScholarshipInfo = db.define('scholarship',{
    scholarship_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    scholarship_name:{
        type: DataTypes.STRING
    },
    description:{
        type: DataTypes.TEXT
    },
    requirements:{
        type: DataTypes.TEXT
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default ScholarshipInfo;