import Announcement from '../models/Announcement.js'
import { Op, Sequelize } from "sequelize";


export const AddAnnouncement = async(req, res) => {
    const {title, body, image} = req.body;
    try {
        await Announcement.create({
            title: title,
            body: body,
            image: image,
            is_deleted: 0
        });
        res.json({msg: "Added an announcements"});
    } catch (error) {
        console.log(error);
    }
}

export const GetAnnouncements = async(req, res) => {
    try {
        const announcements = await Announcement.findAll({
            attributes:['announcement_id', 'title','body', 'image'],
            where: {
                is_deleted: 0
            }
        });
        res.json(announcements).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const UpdateAnnouncement = async (req, res) => {
    try {
        await Announcement.update(req.body, {
            where: {
                announcement_id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const DeleteAnnouncement = async (req, res) => {
    try {
        await Announcement.update({is_deleted: 1}, {
            where: {
                announcement_id: req.params.id
            }
        });
        res.json({
            "message": "Announcement Deleted"
        });
    } catch (error) {
        res.json({ msg: error.message });
    }  
}