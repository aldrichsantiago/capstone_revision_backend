import ScholarshipInfo from '../models/ScholarshipInfo.js'
import { Op, Sequelize } from "sequelize";

// For Student (This Function Gets the Requirements of a Scholarship)
export const GetScholarship = async(req, res) => {
    try {
        const scholarships = await ScholarshipInfo.findOne({
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
            where:{
                scholarship_name: req.params.id
            }
        });
        res.json(scholarships).status(200)
    } catch (error) {
        console.log(error);
    }
}


export const GetScholarships = async(req, res) => {
    try {
        const scholarships = await ScholarshipInfo.findAll({
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
            where: {
                is_deleted: 0,
            }
        });
        res.json(scholarships).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const GetSearchedScholarships = async(req, res) => {
    try {
        const scholarships = await ScholarshipInfo.findAll({
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
            where:{
                is_deleted: 0,
                scholarship_name:{
                    [Op.like]: '%' + req.params.id + '%'
                } 
            }
        });
        res.json(scholarships).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const AddScholarship = async(req, res) => {
    const {scholarship_name, description, requirements} = req.body;
    try {
        await ScholarshipInfo.create({
            scholarship_name: scholarship_name,
            description: description,
            requirements: requirements,
            is_deleted: 0
        });
        res.json({msg: "Added an announcements"});
    } catch (error) {
        console.log(error);
    }
}

export const UpdateScholarship = async (req, res) => {
    try {
        await ScholarshipInfo.update(req.body, {
            where: {
                scholarship_id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const DeleteScholarship = async (req, res) => {
    try {
        await ScholarshipInfo.update({is_deleted: 1},{
            where: {
                scholarship_id: req.params.id
            }
        });
        res.json({
            msg: "Scholarship Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

