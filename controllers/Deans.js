import Dean from "../models/Dean.js";
import Department from "../models/Department.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getApprovedDeans = async(req, res) => {
    try {
        const deans = await Dean.findAll({
            attributes:['id','dean_id','last_name','middle_name', 'first_name', 'email', 'contact_no', 'department', 'dept_id'],
            where:{
                is_approved: 1
            }
        });
        res.json(deans);
    } catch (error) {
        console.log(error);
    }
}


export const DeanRegister = async(req, res) => {
    const { last_name, first_name, middle_name, contact_no, email, department, dean_id, password, confPassword } = req.body;
    const isDeanUnique = await Dean.findOne({where: {dean_id: dean_id, is_deleted: 0}});
    if (isDeanUnique !== null) return res.status(400).json({msg: "Dean ID is already used"});
    if (dean_id.length < 5) return res.status(400).json({msg: "Enter a valid Dean ID"});
    if (last_name.length < 1) return res.status(400).json({msg: "Enter a valid last name"});
    if (first_name.length < 1) return res.status(400).json({msg: "Enter a valid first name"});
    if (middle_name.length < 1) return res.status(400).json({msg: "Enter a valid middle name"});
    if (contact_no.length < 11) return res.status(400).json({msg: "Enter a valid contact no"});
    if (!email.includes("@")) return res.status(400).json({msg: "Enter a valid email"});
    if (department.length < 1) return res.status(400).json({msg: "Enter a valid department"});
    
    if(password.length < 8) return res.status(400).json({msg: "Password must be at least 8 characters"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Dean.create({
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            contact_no: contact_no,
            email: email,
            dept_id: department,
            dean_id: dean_id,
            password: hashPassword,
            is_approved: 0,
            is_deleted: 0
        });
        res.json({msg: "Registration sent for Approval"});
    } catch (error) {
        console.log(error);
    }
}


export const DeanLogin = async(req, res) => {
    try {
        const dean = await Dean.findAll({
            where:{
                dean_id: req.body.dean_id
            }
        });
        const match = await bcrypt.compare(req.body.password, dean[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const deanId = dean[0].dean_id;
        const first_name = dean[0].first_name;
        const last_name = dean[0].last_name;
        const email = dean[0].email;
        const id = dean[0].id;
        const dept_id = dean[0].dept_id;
        const accessToken = jwt.sign({deanId, first_name, last_name, email, id, dept_id}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({deanId, first_name, last_name, email, id, dept_id}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Dean.update({refresh_token: refreshToken},{
            where:{
                dean_id: deanId
            }
        });
        res.cookie('deanToken', refreshToken,{
            sameSite : "none",
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Dean ID not found"});
    }
}

export const DeanLogout = async(req, res) => {
    const refreshToken = req.cookies.deanToken;
    if(!refreshToken) return res.sendStatus(204);
    const dean = await Dean.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!dean[0]) return res.sendStatus(204);
    const deanId = dean[0].dean_id;
    await Dean.update({refresh_token: null},{
        where:{
            dean_id: deanId
        }
    });
    res.clearCookie('deanToken');
    return res.sendStatus(200);
}

export const getDeanDetails = async(req, res) => {
    try {
        
        const dean = await Dean.findOne({ 
            include:{
                model: Department,
                required: true,
                attributes: ['dept_code'],
            },
            attributes:['id', 'dean_id','last_name','first_name','middle_name', 'contact_no', 'email', 'dept_id'],
            where: {dean_id : req.params.id}
        });
        res.json(dean);
    } catch (error) {
        console.log(error);
    }
}

export const DeanDetailsChangePassword = async (req, res) => {
    const {password, confPassword, dean_id} = req.body
    if(password < 8) return res.status(400).json({msg: "Password should be more than 8 characters"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Dean.update({password: hashPassword}, {
            where: {
                dean_id: dean_id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const EditDeanDetails = async (req, res) => {
    const {dean_id} = req.body;
    const isDeanUnique = await Dean.findAll({where: {dean_id: dean_id}});
    if (isDeanUnique.length !== 1) return res.status(400).json({msg: "Dean ID is already used"});
    try {
        await Dean.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}



export const getDeans = async(req, res) => {
    try {
        const dean = await Dean.findAll({
            include:{
                model: Department,
                required: true,
                attributes: ['dept_code'],
            },
            where: {
                is_approved: 1,
                is_deleted: 0
            },
            attributes:['id','dean_id','last_name','middle_name', 'first_name', 'email', 'contact_no', 'dept_id']
        });
        res.json(dean);
    } catch (error) {
        console.log(error);
    }
}

export const getPendingDeans = async(req, res) => {
    try {
        const student = await Dean.findAll({
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_code'],
            }],
            attributes:['id', 'dean_id','last_name','first_name','middle_name', 'contact_no', 'email', 'password', 'dept_id'],
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

export const ApproveDeanRegister = async(req, res) => {
    const {dean_id} = req.body;
    try {
        await Dean.update(
            {is_approved: 1},
            {
                where: {
                    dean_id: dean_id
            }
        });
        res.json({msg: "Registration Successful"});
    } catch (error) {
        console.log(error);
    }
}

export const RejectPendingDean = async (req, res) => {
    try {
        await Dean.update({is_deleted: 1},{
            where: {
                id: req.params.id
            }
        });
        res.json({
            msg: "Pending Dean Rejected"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const DeanChangePasswordAdmin = async (req, res) => {
    const {id, password, confPassword} = req.body
    if(password < 8) return res.status(400).json({msg: "Password should be more than 8 characters"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Dean.update({password: hashPassword}, {
            where: {
                id: id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}


export const UpdateDean = async (req, res) => {
    try {
        await Dean.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const DeleteDean = async (req, res) => {
    try {
        await Dean.update({
            is_deleted: 1
        },{
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Dean Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}