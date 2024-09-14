import express from 'express'
import authCtrl from "../controllers/authCtrl.js";
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.post("/admin-login", authCtrl.adminLogin);

export default router