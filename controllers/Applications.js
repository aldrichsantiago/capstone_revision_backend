import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Department from "../models/Department.js";
import Subject from "../models/Subject.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, Sequelize, where } from "sequelize";
import Application from "../models/ScholarshipApplication.js";
import ScholarshipInfo from "../models/ScholarshipInfo.js";
import SubjectAndUnit from "../models/SubjectUnit.js";

export const getApplications = async(req, res) => {
    try {
        const application = await Application.findAll({
        });
        res.json(application);
    } catch (error) {
        console.log(error);
    }
}

export const GetApplicationStatus = async(req, res) => {
    try {
        const application = await Application.findOne({
            attributes: ['application_id', 'student_id', 'status', 'reason_for_rejection', 'rejected_by'],
            where:{
                student_id: req.params.id,
                is_deleted: 0,
            },
            order: [['createdAt', 'DESC']]
        })
        res.json(application);
    } catch (error) {
        res.json({ msg: error.message });
        console.log(error)
    }
}

export const IsScholarshipRejected = async(req, res) => {
    try {
        const application = await Application.findAll({
            attributes: ['application_id', 'student_id'],
            where:{
                student_id: req.params.id,
                is_deleted: 0,
                status: 'rejected'

            }
        })
        res.json(application);
    } catch (error) {
        res.json({ msg: error.message });
        console.log(error)
    }
}
export const IsScholarshipApproved = async(req, res) => {
    try {
        const application = await Application.findAll({
            attributes: ['application_id', 'student_id'],

            where:{
                student_id: req.params.id,
                is_deleted: 0,
                status: 'approved'

            }
        })
        res.json(application);
    } catch (error) {
        res.json({ msg: error.message });
        console.log(error)
    }
}
export const IsScholarshipUnderReview = async(req, res) => {
    try {
        const application = await Application.findAll({
            attributes: ['application_id', 'student_id'],

            where:{
                student_id: req.params.id,
                is_deleted: 0,
                status: 'review'

            }
        })
        res.json(application);
    } catch (error) {
        res.json({ msg: error.message });
        console.log(error)
    }
}
export const IsScholarshipSubmitted = async(req, res) => {
    try {
        const application = await Application.findAll({
            attributes: ['application_id', 'student_id'],

            where:{
                student_id: req.params.id,
                is_deleted: 0,
                status: 'submitted'

            }
        })
        res.json(application);
    } catch (error) {
        res.json({ msg: error.message });
        console.log(error)
    }
}

export const GetSubmittedApplications = async (req, res) => {
    try {
        const submitted_applications = await Application.findAll({
            include:[ {
                model: Student,
                required: true,
                attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'dept_id', 'course_id'],
                where:{
                    dept_id: req.params.id
                }
            },{
                model: ScholarshipInfo,
                required: true,
                attributes:['scholarship_id', 'scholarship_name'],
            },],
            attributes:['application_id'],
            where:{
                is_deleted: 0,
                status: 'submitted',
            }
        });
        res.json(submitted_applications);
    } catch (error) {
        console.log(error)
    }
}

export const DeanApplicationReview = async (req, res) => {
    const specific_application = await Application.findOne({
        include:[ {
            model: Student,
            required: true,
            include:[{
                model: Course,
                attributes: ['course_code', 'course_name']
            },{
                model: Department,
                attributes: ['dept_code', 'dept_name']

            }]
        }, {
            model: ScholarshipInfo,
            required: true,
            attributes: ['scholarship_name']
        }, {
            model: SubjectAndUnit,
            required:true
        }],
        where:{
            application_id: req.params.id
        }
    });
    res.json(specific_application);
}

export const GetFilteredSubmittedApplications = async (req, res) => {
    const submitted_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name'],
            include:[{
                model: Course,
                attributes: ['course_code', 'course_name'],
                
            },{
                model: Department,
                attributes: ['dept_code', 'dept_name']

            }],
            where: {
                course_id: req.params.id
            }
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name'],
        },],
        attributes:['application_id'],
        where:{
            is_deleted: 0,
            status: 'submitted',
        }
    });
    res.json(submitted_applications);
}

export const GetSearchedSubmittedApplications = async (req, res) => {
    const submitted_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name'],
            include:[{
                model: Course,
                attributes: ['course_code', 'course_name'],
            },{
                model: Department,
                attributes: ['dept_code', 'dept_name'],
                where: {
                    dept_id: req.params.dept
                }
            }],
            where: {
                is_deleted:0,
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
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name'],
        },],
        attributes: ['application_id'],
        where:{
            is_deleted: 0,
            status: 'submitted',
        }
    });
    res.json(submitted_applications);
}

export const GetNamedFilterSubmittedApplications = async (req, res) => {
    const submitted_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                course_id: req.params.course,
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
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name'],
        },],
        attributes: ['application_id'],
        where:{
            is_deleted: 0,
            status: 'submitted',
        }

    });
    res.json(submitted_applications);
}

export const CreateReviewApplication = async (req, res) => {
    const {dean_sign} = req.body;
    try {
        await Application.update(
            {
                status: 'review',
                dean_sign: dean_sign
            },
            {
                where: {
                    application_id: req.params.id
            }
        });
        res.json({msg: "Registration Successful"});
    } catch (error) {
        console.log(error);
    }
}

export const CreateDeanRejectedApplication = async (req, res) => {
    const { rejected_by, reason_for_rejection } = req.body;
    try {
        await Application.update({
            status: 'rejected',
            rejected_by: rejected_by,
            reason_for_rejection: reason_for_rejection
        },{
            where: {
                application_id: req.params.id
            }
        });
        res.json({msg: "Application has been Rejected"});
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const GetDeanApprovedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                dept_id: req.params.id
            }
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
            where: {
                is_deleted:0,
            }
        }],
        where:{
            is_deleted:0,
            status: 'review'
        }
    });
    res.json(reviewed_applications);
}

export const GetCourseFilteredReviewApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                course_id: req.params.id
            }
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
            where: {
                is_deleted:0,
            }
        }],
        attributes:['application_id','student_id'],
        where:{
            is_deleted:0,
            status: 'review'
        }
    });
    res.json(reviewed_applications);
}

export const GetSearchedReviewApplications = async (req, res) => {
    const review_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name'],
            include:[{
                model: Course,
                attributes: ['course_code', 'course_name'],
            },{
                model: Department,
                attributes: ['dept_code', 'dept_name'],
                where: {
                    dept_id: req.params.dept
                }
            }],
            where: {
                is_deleted:0,
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
            }},{
                model: ScholarshipInfo,
                required: true,
                attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
                where: {
                    is_deleted:0,
                }
            }],
        attributes: ['application_id'],
        where:{
            is_deleted: 0,
            status: 'review',
        }

    });
    res.json(review_applications);
}

export const GetNamedFilterReviewApplications = async (req, res) => {
    const submitted_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name'],
            include:[{
                model: Course,
                attributes: ['course_code', 'course_name'],
            },{
                model: Department,
                attributes: ['dept_code', 'dept_name']
            }],
            where: {
                is_deleted:0,
                course_id: req.params.course,
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
            }},{
                model: ScholarshipInfo,
                required: true,
                attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
                where: {
                    is_deleted:0,
                }
            }],
        attributes: ['application_id'],
        where:{
            is_deleted: 0,
            status: 'review',
        }
    });
    res.json(submitted_applications);
}


export const GetSpecificDeanApprovedApplication = async (req, res) => {
    const reviewed_applications = await Application.findOne({
        include:[ {
            model: Student,
            required: true,
            include:[{
                model: Course,
                attributes: ['course_code', 'course_name']
            },{
                model: Department,
                attributes: ['dept_code', 'dept_name']

            }]
        }, {
            model: ScholarshipInfo,
            required: true,
            attributes: ['scholarship_name']
        }, {
            model: SubjectAndUnit,
            required:true
        }],
        where:{
            application_id: req.params.id
        }
    });
    res.json(reviewed_applications);
}



// ADMIN FUNCTIONS
export const GetReviewedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'review'
        }
    });
    res.json(reviewed_applications);
}

export const GetReviewedSearchedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
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
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'review'
        }
    });
    res.json(reviewed_applications);
}

export const GetDepartmentFilteredReviewedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                dept_id: req.params.id
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'review'
        }
    });
    res.json(reviewed_applications);
}

export const GetCourseFilteredReviewedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                course_id: req.params.id
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'review'
        }
    });
    res.json(reviewed_applications);
}

export const GetNameDeptFilteredReviewedApplications = async (req, res) => {

    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                dept_id: req.params.dept,
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
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'review'
        }
    });
    res.json(reviewed_applications);
}

export const GetMultipleFilteredReviewedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                dept_id: req.params.dept,
                course_id: req.params.course,
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
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'review'
        }
    });
    res.json(reviewed_applications);
}


export const GetSpecificReviewedApplication = async (req, res) => {
    const specific_application = await Application.findOne({
        include:[ {
            model: Student,
            required: true,
            include:[{
                model: Course,
                attributes: ['course_code', 'course_name']
            },{
                model: Department,
                attributes: ['dept_code', 'dept_name']

            }]
        }, {
            model: ScholarshipInfo,
            required: true,
            attributes: ['scholarship_name']
        }, {
            model: SubjectAndUnit,
            required:true
        }],
        where:{
            application_id: req.params.id
        }
    });
    res.json(specific_application);
}

export const CreateApprovedApplication = async (req, res) => {
    const { admin_sign } = req.body;
    try {
        await Application.update({
            admin_sign: admin_sign,
            status: 'approved'
        },{
            where: {
                application_id: req.params.id
            }
        });
        res.json({msg: "Application has been Approved"});
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const AdminCreateRejectedApplication = async (req, res) => {
    const { rejected_by, reason_for_rejection } = req.body;
    try {
        await Application.update({
            status: 'rejected',
            rejected_by: rejected_by,
            reason_for_rejection: reason_for_rejection
        },{
            where:{
                application_id: req.params.id
            }
        });
        res.json({msg: "Application has been Rejected"});
    } catch (error) {
        res.json({ msg: error.message });
    }  
}





export const GetApprovedApplications = async (req, res) => {
    const approved_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        },{
            model: SubjectAndUnit,
            required: true,
        }],
        where:{
            is_deleted:0,
            status: 'approved'
        }
    });
    res.json(approved_applications);
}


export const GetApprovedSearchedApplications = async (req, res) => {
    const approved_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
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
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'approved'
        }
    });
    res.json(approved_applications);
}

export const GetDepartmentFilteredApprovedApplications = async (req, res) => {
    const approved_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                dept_id: req.params.id
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'approved'
        }
    });
    res.json(approved_applications);
}


export const GetCourseFilteredApprovedApplications = async (req, res) => {
    const approved_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                course_id: req.params.id
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'approved'
        }
    });
    res.json(approved_applications);
}


export const GetNameDeptFilteredApprovedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                dept_id: req.params.dept,
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
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'approved'
        }
    });
    res.json(reviewed_applications);
}

export const GetMultipleFilteredApprovedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                dept_id: req.params.dept,
                course_id: req.params.course,
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
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'approved'
        }
    });
    res.json(reviewed_applications);
}


export const GetSpecificApprovedApplication = async (req, res) => {
    const specific_application = await Application.findOne({
        include:[ {
            model: Student,
            required: true,
            include:[{
                model: Course,
                attributes: ['course_code', 'course_name']
            },{
                model: Department,
                attributes: ['dept_code', 'dept_name']

            }]
        }, {
            model: ScholarshipInfo,
            required: true,
            attributes: ['scholarship_name']
        }, {
            model: SubjectAndUnit,
            required:true
        }],
        where:{
            application_id: req.params.id
        }
    });
    res.json(specific_application);
}

export const DeleteApprovedApplication = async (req, res) => {
    try {
        await Application.update({
            is_deleted: 1
        },{
            where: {
                application_id: req.params.id
            }
        });
        res.json({
            msg: "Application Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}


export const GetRejectedApplications = async (req, res) => {
    const rejected_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id', 'rejected_by', 'reason_for_rejection'],
        where:{
            is_deleted:0,
            status: 'rejected'
        }
    });
    res.json(rejected_applications);
}

export const GetRejectedSearchedApplications = async (req, res) => {
    const rejected_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
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
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id', 'rejected_by', 'reason_for_rejection'],

        where:{
            is_deleted:0,
            status: 'rejected'
        }
    });
    res.json(rejected_applications);
}

export const GetDepartmentFilteredRejectedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                dept_id: req.params.id,
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id', 'rejected_by', 'reason_for_rejection'],
        where:{
            is_deleted:0,
            status: 'rejected'
        }
    });
    res.json(reviewed_applications);
}


export const GetNameDeptFilteredRejectedApplications = async (req, res) => {
    const rejected_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                dept_id: req.params.dept,
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
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id', 'rejected_by', 'reason_for_rejection'],
        where:{
            is_deleted:0,
            status: 'rejected'
        }
    });
    res.json(rejected_applications);
}


export const GetCourseFilteredRejectedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                course_id: req.params.id,
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id', 'rejected_by', 'reason_for_rejection'],
        where:{
            is_deleted:0,
            status: 'rejected'
        }
    });
    res.json(reviewed_applications);
}

export const GetMultipleFilteredrejectedApplications = async (req, res) => {
    const reviewed_applications = await Application.findAll({
        include:[ {
            model: Student,
            required: true,
            attributes:['id', 'student_id', 'first_name', 'last_name', 'middle_name', 'course_id'],
            where: {
                is_deleted:0,
                dept_id: req.params.dept,
                course_id: req.params.course,
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
            },
            include:[ {
                model: Department,
                required: true,
                attributes: ['dept_id', 'dept_code', 'dept_name'],
            }, {
                model: Course,
                required: true,
                attributes: ['course_id', 'course_code', 'course_name'],

            },]
        },{
            model: ScholarshipInfo,
            required: true,
            attributes:['scholarship_id', 'scholarship_name', 'description', 'requirements'],
        }],
        attributes: ['application_id', 'student_id'],
        where:{
            is_deleted:0,
            status: 'rejected'
        }
    });
    res.json(reviewed_applications);
}


export const DeleteRejectedApplication = async (req, res) => {
    try {
        await Application.update({
            is_deleted: 1,
        },{
            where: {
                application_id: req.params.id
            }
        });
        res.json({
            msg: "Application Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}