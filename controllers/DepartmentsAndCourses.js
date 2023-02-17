import Course from "../models/Course.js";
import Department from "../models/Department.js";

export const getDepartments = async(req, res) => {
    try {
        const dept = await Department.findAll({
            attributes: ['dept_id', 'dept_code', 'dept_name'],
        });
        res.json(dept);
    } catch (error) {
        console.log(error);
    }
}

export const getDeptCourses = async(req, res) => {
    try {
        const course = await Course.findAll({
            include: {
                model: Department,
                required: true,
                attributes: ['dept_code'],
                where: {
                    dept_id: req.params.dept
                }
            },
            attributes: ['course_id', 'course_code', 'course_name'],
            
        });
        res.json(course);
    } catch (error) {
        console.log(error);
    }
}

export const getCourses = async(req, res) => {
    try {
        const course = await Course.findAll({
            include: {
                model: Department,
                required: true,
                attributes: ['dept_code'],
            },
            attributes: ['course_id', 'course_code', 'course_name'],
            
        });
        res.json(course);
    } catch (error) {
        console.log(error);
    }
}

