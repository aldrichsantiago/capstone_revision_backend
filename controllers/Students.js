import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Department from "../models/Department.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, Sequelize } from "sequelize";
import crypto from 'crypto'
import Application from "../models/ScholarshipApplication.js";
import SubjectAndUnit from "../models/SubjectUnit.js";

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

export const getApprovedStudents = async(req, res) => {
    try {
        const students = await Student.findAll({
            attributes:['id', 'student_id','last_name','first_name','middle_name', 'contact_no', 'email', 'department', 'course', 'year'],
            where: {
                is_approved: 1
            }
        });
        res.json(students);
    } catch (error) {
        console.log(error);
    }
}

export const StudentRegister = async(req, res) => {
    const { last_name, first_name, middle_name, contact_no, email, department, course, year, student_id, password, confPassword } = req.body;
    const isStudentUnique = await Student.findOne({where: {student_id: student_id, is_deleted: 0}});
    if (isStudentUnique !== null) return res.status(400).json({msg: "Student ID is already used"});
    if (student_id.length < 5 ) return res.status(400).json({msg: "Enter a valid Student ID"});
    if (last_name.length < 1) return res.status(400).json({msg: "Enter a valid last name"});
    if (first_name.length < 1) return res.status(400).json({msg: "Enter a valid first name"});
    if (middle_name.length < 1) return res.status(400).json({msg: "Enter a valid middle name"});
    if (contact_no.length < 11) return res.status(400).json({msg: "Enter a valid contact no"});
    if (!email.includes("@")) return res.status(400).json({msg: "Enter a valid email"});

    if (year.length < 1) return res.status(400).json({msg: "Enter a valid year"});
    if(password.length < 8) return res.status(400).json({msg: "Password must be at least 8 characters"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    
    try {
        await Student.create({
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            contact_no: contact_no,
            email: email,
            dept_id: department,
            course_id: course,
            year: year,
            student_id: student_id,
            password: hashPassword,
            is_approved: 0,
            is_deleted: 0
        });
        res.json({msg: "Registration sent for Approval"});
    } catch (error) {
        console.log(error);
    }
}

export const StudentLogin = async(req, res) => {
    try {
        const student = await Student.findAll({
            where:{
                is_approved: 1,
                is_deleted: 0,
                student_id: req.body.student_id
            }
        });
        const match = await bcrypt.compare(req.body.password, student[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const studentId = student[0].student_id;
        const first_name = student[0].first_name;
        const last_name = student[0].last_name;
        const email = student[0].email;
        const accessToken = jwt.sign({studentId, first_name, last_name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({studentId, first_name, last_name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Student.update({refresh_token: refreshToken},{
            where:{
                student_id: studentId
            }
        });
        res.cookie('studentToken', refreshToken,{
            sameSite : "none",
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Student ID not found"});
    }
}

export const StudentLogout = async(req, res) => {
    const refreshToken = req.cookies.studentToken;
    if(!refreshToken) return res.sendStatus(204);
    const student = await Student.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!student[0]) return res.sendStatus(204);
    const studentId = student[0].student_id;
    await Student.update({refresh_token: null},{
        where:{
            student_id: studentId
        }
    });
    res.clearCookie('studentToken');
    return res.sendStatus(200);
}

export const getStudentDetails = async(req, res) => {
    try {
        const student = await Student.findOne({ 
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            }],
            where: {
                student_id : req.params.id
            }
        });
        res.json(student);
    } catch (error) {
        console.log(error);
    }
}

export const getStudentMinDetails = async(req, res) => {
    try {
        const student = await Student.findOne({ 
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            }],
            attributes: ['id', 'student_id', 'first_name', 'last_name', 'course_id', 'dept_id' ],
            where: {
                student_id : req.params.id
            }
        });
        res.json(student);
    } catch (error) {
        console.log(error);
    }
}

export const StudentChangePassword = async (req, res) => {
    const {student_id, password, confPassword} = req.body
    if(password < 8) return res.status(400).json({msg: "Password should be more than 8 characters"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Student.update({password: hashPassword}, {
            where: {
                student_id: student_id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const EditStudentDetails = async (req, res) => {
    try {
        await Student.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}


export const getPendingStudents = async(req, res) => {
    try {
        const student = await Student.findAll({
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_code', 'dept_name', 'dept_id'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },],
            attributes:['id', 'student_id','last_name','first_name','middle_name', 'contact_no', 'email', 'year', 'password', 'course_id', 'dept_id'],
            where: {
                is_deleted: 0,
                is_approved: 0
            }
        });
        res.json(student);
    } catch (error) {
        console.log(error);
    }
}

export const ApproveStudentRegister = async(req, res) => {
    const {student_id} = req.body;
    try {
        await Student.update(
            {is_approved: 1},
            {
                where: {
                    student_id: student_id
            }
        });
        res.json({msg: "Registration Successful"});
    } catch (error) {
        console.log(error);
    }
}

export const RejectPendingStudent = async (req, res) => {
    try {
        await Student.update({is_deleted: 1},{
            where: {
                id: req.params.id
            }
        });
        res.json({
            msg: "Pending Student Rejected"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}


export const getStudents = async(req, res) => {
    try {
        const student = await Student.findAll({
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_code'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },],
            attributes:['id', 'student_id','last_name','first_name','middle_name', 'contact_no', 'email', 'dept_id', 'course_id', 'year'],
            where: {
                is_approved: 1,
                is_deleted: 0
            }
        });
        res.json(student);
    } catch (error) {
        console.log(error);
    }
}

export const getSearchedStudents = async(req, res) => {
    try {
        const student = await Student.findAll({
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },],
            attributes:['id', 'student_id','last_name','first_name','middle_name', 'contact_no', 'email', 'dept_id', 'course_id', 'year'],
            where:{
                is_approved: 1,
                is_deleted: 0,
                [Op.or]:[
                    {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                    {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                    {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                    Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                        [Op.like]: '%' + req.params.id + '%'
                    }),
                    Sequelize.where(Sequelize.fn('concat', Sequelize.col('last_name'), ' ', Sequelize.col('first_name')), {
                        [Op.like]: '%' + req.params.id + '%'
                    })
                ]
            }
        });
        res.json(student);
    } catch (error) {
        console.log(error);
    }
}

export const StudentChangePasswordAdmin = async (req, res) => {
    const {id, password, confPassword} = req.body
    if(password < 8) return res.status(400).json({msg: "Password should be more than 8 characters"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Student.update({password: hashPassword}, {
            where: {
                id: id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const hasSubmitted = async(req, res) => {
    const applications = await Application.findAll(
        {
            attributes:['student_id', 'application_id'],
            where: { 
                student_id: req.params.id,
                is_deleted: 0,
                [Op.or]: [
                    { status: 'submitted' },
                    { status: 'review' },
                    { status: 'approved' }
                ]
            } 
        });

    res.json(applications);
}

export const CreateScholarshipApplication = async (req, res) => {
    const uuid = uuidv4();
    console.log(uuid);
    const { 
        student_id,
        scholarship_id,
        semester, 
        school_year,
        student_sign,
        subject_code_1,
        subject_code_2,
        subject_code_3,
        subject_code_4,
        subject_code_5,
        subject_code_6,
        subject_code_7,
        subject_code_8,
        subject_code_9,
        subject_code_10,
        subject_code_11,
        subject_code_12,
        unit_1,
        unit_2,
        unit_3,
        unit_4,
        unit_5,
        unit_6,
        unit_7,
        unit_8,
        unit_9,
        unit_10,
        unit_11,
        unit_12,
        req_1,
        req_2,
        req_3,
        req_4,
        req_5,
        req_6,
        req_7,
        req_8,
        req_9,
        req_10
    } = req.body;

    try {
        await SubjectAndUnit.create({
            subject_unit_id: uuid,
            subject_1: subject_code_1,
            subject_2: subject_code_2,
            subject_3: subject_code_3,
            subject_4: subject_code_4,
            subject_5: subject_code_5,
            subject_6: subject_code_6,
            subject_7: subject_code_7,
            subject_8: subject_code_8,
            subject_9: subject_code_9,
            subject_10: subject_code_10,
            subject_11: subject_code_11,
            subject_12: subject_code_12, 
            unit_1: unit_1,
            unit_2: unit_2,
            unit_3: unit_3,
            unit_4: unit_4,
            unit_5: unit_5,
            unit_6: unit_6,
            unit_7: unit_7,
            unit_8: unit_8,
            unit_9: unit_9,
            unit_10: unit_10,
            unit_11: unit_11,
            unit_12: unit_12,
        });

        await Application.create({
            student_id: student_id,
            scholarship_id: scholarship_id,
            subject_unit_id: uuid,
            semester: semester,
            school_year: school_year,
            student_sign: student_sign,
            req_1: req_1,
            req_2: req_2,
            req_3: req_3,
            req_4: req_4,
            req_5: req_5,
            req_6: req_6,
            req_7: req_7,
            req_8: req_8,
            req_9: req_9,
            req_10: req_10,
            is_deleted: 0,
            status: 'submitted'
        });

        res.json({msg: "Application has been submitted"});
    } catch (error) {
        res.json({ msg: error.message });
    }  
}


export const UpdateStudent = async (req, res) => {
    try {
        await Student.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const DeleteStudent = async (req, res) => {
    try {
        await Student.update({
            is_deleted: 1
        },{
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Student Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}