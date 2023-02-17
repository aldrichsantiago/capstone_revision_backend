import db from "../config/db.js";

import Dean from "./Dean.js";
import Student from "./Student.js";
import Admin from "./Admin.js";
import Announcement from "./announcement.js";
import ScholarshipInfo from "./scholarshipInfo.js";
import Application from "./ScholarshipApplication.js";


Student.hasMany(Application);

db.sync({alter: true}).then(() => {
    console.log('associations on scholarship applications is working');
}).catch(err => console.log(err));