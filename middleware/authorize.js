import jwt from 'jsonwebtoken';
import { Users } from '../models/user.js';
const authorize = (allowedRoles  = [] ) => {
    return async (req, res, next) => {

        const token = req.header("Authorization").split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        try {

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await Users.findOne({ _id: decoded.id });



            if (user && (!allowedRoles.length || allowedRoles.includes(user.role))) {
                req.user = user;
                req.allowedRoles = allowedRoles
                return next();
            } else {
                return res.status(403).json({ msg: "You are not allow to do that." })
            }

        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}

export default authorize;



            // Log danh sách allowedRoles
            // console.log(`Allowed Roles: ${allowedRoles}`);
            // console.log(`User Role: ${user.role}`);