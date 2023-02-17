import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Department from "../models/Department.js";
import Subject from "../models/Subject.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, Sequelize } from "sequelize";

export const getSubjects = async(req, res) => {
    try {
        const subject = await Subject.findAll({
        });
        res.json(subject);
    } catch (error) {
        console.log(error);
    }
}

export const getCourseSubjects = async(req, res) => {
    try {
        const subject = await Subject.findAll({
            attributes: ['subject_code', 'subject_name'],
            where: {
                course_id: req.params.id
            }
        });
        res.json(subject);
    } catch (error) {
        console.log(error);
    }
}