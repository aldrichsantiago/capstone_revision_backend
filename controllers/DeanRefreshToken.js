import Dean from "../models/Dean.js";
import jwt from "jsonwebtoken";
 
export const DeanRefreshToken = async(req, res) => {
    try {
        const deanToken = req.cookies.deanToken;
        if(!deanToken) return res.sendStatus(401);
        const dean = await Dean.findAll({
            where:{
                refresh_token: deanToken
            }
        });
        if(!dean[0]) return res.sendStatus(403);
        jwt.verify(deanToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const deanId = dean[0].dean_id;
            const first_name = dean[0].first_name;
            const last_name = dean[0].last_name;
            const email = dean[0].email;
            const id = dean[0].id;
            const dept_id = dean[0].dept_id;
            const accessToken = jwt.sign({deanId, first_name, last_name, email, id, dept_id}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}