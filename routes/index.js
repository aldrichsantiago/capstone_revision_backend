import express from 'express' 
import { getCourses, getDepartments, getDeptCourses } from '../controllers/DepartmentsAndCourses.js';
import { StudentRefreshToken } from '../controllers/StudentRefreshToken.js';
import { DeanRefreshToken } from '../controllers/DeanRefreshToken.js';
import { AdminRefreshToken } from '../controllers/AdminRefreshToken.js';

import { 
    AdminLogin,
    AdminLogout,
    AdminRegister,
    getAdmin,
} from '../controllers/Admins.js';

import { 
    ApproveDeanRegister,
    DeanChangePasswordAdmin,
    DeanDetailsChangePassword,
    DeanLogin,
    DeanLogout,
    DeanRegister,
    DeleteDean,
    EditDeanDetails,
    getApprovedDeans,
    getDeanDetails,
    getDeans,
    getPendingDeans,
    RejectPendingDean,
    UpdateDean,
} from '../controllers/Deans.js';


import { 
    StudentLogin, 
    StudentLogout, 
    StudentRegister,
    getApprovedStudents,
    getStudents,
    getStudentDetails,
    getPendingStudents,
    ApproveStudentRegister,
    RejectPendingStudent,
    getSearchedStudents,
    StudentChangePassword,
    EditStudentDetails,
    StudentChangePasswordAdmin,
    getStudentMinDetails,
    hasSubmitted,
    CreateScholarshipApplication,
    UpdateStudent,
    DeleteStudent, 
} from '../controllers/Students.js';

import { AddScholarship, DeleteScholarship, GetScholarship, GetScholarships, GetSearchedScholarships, UpdateScholarship } from '../controllers/Scholarships.js';
import { AddAnnouncement, DeleteAnnouncement, GetAnnouncements, UpdateAnnouncement } from '../controllers/Announcements.js';
import { getCourseSubjects, getSubjects } from '../controllers/Subjects.js';
import { AdminCreateRejectedApplication, CreateApprovedApplication, CreateDeanRejectedApplication, CreateReviewApplication, DeanApplicationReview, DeleteApprovedApplication, DeleteRejectedApplication, getApplications, GetApplicationStatus, GetApprovedApplications, GetApprovedSearchedApplications, GetCourseFilteredApprovedApplications, GetCourseFilteredRejectedApplications, GetCourseFilteredReviewApplications, GetCourseFilteredReviewedApplications, GetDeanApprovedApplications, GetDepartmentFilteredApprovedApplications, GetDepartmentFilteredRejectedApplications, GetDepartmentFilteredReviewedApplications, GetFilteredSubmittedApplications, GetMultipleFilteredApprovedApplications, GetMultipleFilteredrejectedApplications, GetMultipleFilteredReviewedApplications, GetNameDeptFilteredApprovedApplications, GetNameDeptFilteredRejectedApplications, GetNameDeptFilteredReviewedApplications, GetNamedFilterReviewApplications, GetNamedFilterSubmittedApplications, GetRejectedApplications, GetRejectedSearchedApplications, GetReviewedApplications, GetReviewedSearchedApplications, GetSearchedReviewApplications, GetSearchedSubmittedApplications, GetSpecificApprovedApplication, GetSpecificDeanApprovedApplication, GetSpecificReviewedApplication, GetSubmittedApplications, IsScholarshipApproved, IsScholarshipRejected, IsScholarshipSubmitted, IsScholarshipUnderReview } from '../controllers/Applications.js';
import { StudentVerifyToken } from '../middlewares/StudentVerify.js'
import { DeanVerifyToken } from '../middlewares/DeanVerify.js'
import { AdminVerifyToken } from '../middlewares/AdminVerify.js'



const router = express.Router();
router.get('/test', (req, res) => res.send("API IS WORKING") );

router.get('/get/departments', getDepartments);
router.get('/get/courses/:dept', getDeptCourses);
router.get('/get/all/courses', getCourses);


router.get('/students', getApprovedStudents);
router.get('/deans', getApprovedDeans);
router.get('/admin', getAdmin);


// Student API Endpoints
router.get('/student/token', StudentRefreshToken);
router.post('/register/student', StudentRegister);
router.post('/student', StudentLogin);
router.delete('/student/logout', StudentLogout);

router.get('/scholarships/search/:id', GetSearchedScholarships);
router.get('/scholarships/get/:id', GetScholarship);
router.get('/student/details/:id', StudentVerifyToken, getStudentDetails);
router.patch('/change/student/details/password', StudentVerifyToken, StudentChangePassword);
router.patch('/update/student/details/:id', StudentVerifyToken, EditStudentDetails);

router.get('/student/min/details/:id', StudentVerifyToken, getStudentMinDetails);
router.get('/subjects/get', getSubjects);
router.get('/subjects/get/:id', getCourseSubjects);
router.get('/has/submitted/:id', StudentVerifyToken, hasSubmitted);
router.post('/submit/student/application', StudentVerifyToken, CreateScholarshipApplication);

// Check status of scholarship
router.get('/student/application/status/:id', GetApplicationStatus);
router.get('/student/application/rejected/:id', IsScholarshipRejected);
router.get('/student/application/approved/:id', IsScholarshipApproved);
router.get('/student/application/review/:id', IsScholarshipUnderReview);
router.get('/student/application/submitted/:id', IsScholarshipSubmitted);




// Dean API Endpoints
router.get('/dean/token', DeanRefreshToken);
router.post('/register/dean', DeanRegister);
router.post('/dean', DeanLogin);
router.delete('/dean/logout', DeanLogout);
router.get('/dean/details/:id', DeanVerifyToken, getDeanDetails);
router.patch('/change/dean/details/password', DeanVerifyToken, DeanDetailsChangePassword);
router.patch('/update/dean/details/:id', DeanVerifyToken, EditDeanDetails);

router.get('/dean/view/applications/dept/:id', DeanVerifyToken, GetSubmittedApplications);
router.get('/dean/view/applications/course/:id', DeanVerifyToken, GetFilteredSubmittedApplications);
router.get('/dean/view/applications/dept/:dept/name/:id', DeanVerifyToken, GetSearchedSubmittedApplications);
router.get('/dean/view/applications/filter/:id/:course', DeanVerifyToken, GetNamedFilterSubmittedApplications);

router.patch('/create/review/application/:id', DeanVerifyToken, CreateReviewApplication);
router.patch('/create/rejected/application/:id', DeanVerifyToken, CreateDeanRejectedApplication);

router.get('/dean/view/approved/applications/dept/:id', DeanVerifyToken, GetDeanApprovedApplications);
router.get('/dean/view/approved/applications/course/:id', DeanVerifyToken, GetCourseFilteredReviewApplications);
router.get('/dean/view/applications/approved/dept/:dept/name/:id', DeanVerifyToken, GetSearchedReviewApplications);
router.get('/dean/view/applications/approved/filter/:id/:course', DeanVerifyToken, GetNamedFilterReviewApplications);

router.get('/dean/applications/review/:id', DeanVerifyToken, DeanApplicationReview);
router.get('/dean/view/approved/application/:id', DeanVerifyToken, GetSpecificDeanApprovedApplication);




// ADMIN API Endpoints
router.post('/register/admin', AdminRegister);
router.post('/admin', AdminLogin);
router.get('/admin/token', AdminRefreshToken);
router.delete('/admin/logout', AdminLogout);

// CRUD for Students 
router.get('/students/get', AdminVerifyToken, getStudents);
router.get('/students/get/:id', AdminVerifyToken, getSearchedStudents);
router.patch('/change/student/password', AdminVerifyToken, StudentChangePasswordAdmin);

router.get('/pendingstudents/get', AdminVerifyToken, getPendingStudents);
router.patch('/approve/registration/student', AdminVerifyToken, ApproveStudentRegister);
router.patch('/reject/registration/student/:id', AdminVerifyToken, RejectPendingStudent);

router.patch('/update/student/:id', AdminVerifyToken, UpdateStudent);
router.patch('/delete/student/:id', AdminVerifyToken, DeleteStudent);

// CRUD for Deans
router.get('/deans/get', AdminVerifyToken, getDeans);

router.get('/pendingdeans/get', AdminVerifyToken, getPendingDeans);
router.patch('/approve/registration/dean', AdminVerifyToken, ApproveDeanRegister);
router.patch('/reject/registration/dean/:id', RejectPendingDean);

router.patch('/change/dean/password/:id', AdminVerifyToken, DeanChangePasswordAdmin);
router.patch('/update/dean/:id', AdminVerifyToken, UpdateDean);
router.patch('/delete/dean/:id', AdminVerifyToken, DeleteDean);

// CRUD Scholarship Info
router.post('/scholarships/add', AdminVerifyToken, AddScholarship);
router.get('/scholarships/get', GetScholarships);
router.patch('/scholarships/update/:id', AdminVerifyToken, UpdateScholarship);
router.patch('/scholarships/delete/:id', DeleteScholarship);

// CRUD Announcements
router.post('/announcements/add', AdminVerifyToken, AddAnnouncement);
router.get('/announcements/get', GetAnnouncements);
router.patch('/announcements/update/:id', AdminVerifyToken, UpdateAnnouncement);
router.delete('/announcements/delete/:id', AdminVerifyToken, DeleteAnnouncement);

//For Scholarship Applications
router.get('/admin/view/applications', AdminVerifyToken, GetReviewedApplications);
router.get('/admin/search/applications/:id', AdminVerifyToken, GetReviewedSearchedApplications);
router.get('/admin/view/applications/department/:id', AdminVerifyToken, GetDepartmentFilteredReviewedApplications);
router.get('/admin/view/applications/course/:id', AdminVerifyToken, GetCourseFilteredReviewedApplications);
router.get('/admin/name/dept/filter/:id/:dept', AdminVerifyToken, GetNameDeptFilteredReviewedApplications);
router.get('/admin/view/applications/:id/:dept/:course', AdminVerifyToken, GetMultipleFilteredReviewedApplications);
router.get('/admin/view/application/:id', AdminVerifyToken, GetSpecificReviewedApplication);

router.patch('/admin/approve/application/:id', AdminVerifyToken, CreateApprovedApplication);
router.patch('/admin/reject/application/:id', AdminVerifyToken, AdminCreateRejectedApplication);

router.get('/admin/view/approved/applications', AdminVerifyToken, GetApprovedApplications);
router.get('/admin/search/approved/applications/:id', AdminVerifyToken, GetApprovedSearchedApplications);
router.get('/admin/view/approved/applications/department/:id', AdminVerifyToken, GetDepartmentFilteredApprovedApplications);
router.get('/admin/view/approved/applications/course/:id', AdminVerifyToken,  GetCourseFilteredApprovedApplications);
router.get('/admin/name/dept/filter/approved/:id/:dept', AdminVerifyToken, GetNameDeptFilteredApprovedApplications);
router.get('/admin/view/applications/approved/:id/:dept/:course', AdminVerifyToken, GetMultipleFilteredApprovedApplications);
router.get('/admin/view/approved/application/:id', AdminVerifyToken,  GetSpecificApprovedApplication);
router.patch('/admin/delete/approved/application/:id',  DeleteApprovedApplication);

router.get('/admin/view/rejected/applications', AdminVerifyToken, GetRejectedApplications);
router.get('/admin/search/rejected/applications/:id', AdminVerifyToken,  GetRejectedSearchedApplications);
router.get('/admin/view/rejected/applications/department/:id', AdminVerifyToken, GetDepartmentFilteredRejectedApplications);
router.get('/admin/name/dept/rejected/applications/:id/:dept', AdminVerifyToken,  GetNameDeptFilteredRejectedApplications);
router.get('/admin/view/rejected/applications/course/:id', AdminVerifyToken, GetCourseFilteredRejectedApplications);
router.get('/admin/filter/rejected/applications/:id/:dept/:course', AdminVerifyToken,  GetMultipleFilteredrejectedApplications);

router.patch('/admin/delete/rejected/application/:id', DeleteRejectedApplication);










export default router;