import { Sequelize } from 'sequelize';
import db from '../config/db.js';

const { DataTypes } = Sequelize;

const Announcement = db.define('announcement', {
  // Model attributes are defined here
  // allowNull defaults to true
  announcement_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
  },
  body: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.TEXT('medium'),
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  // Other model options go here
  freezeTableName:true
});

(async () => {
  await db.sync();
})();

export default Announcement;