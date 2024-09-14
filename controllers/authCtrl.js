import jwt from "jsonwebtoken";
import { Users } from "../models/user.js";
import argon2 from "argon2";

const authCtrl = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // kiểm tra email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.json({ success: false, message: "Email không hợp lệ" });
      }

      let newUserName = username.replace(/ /g, "");

      const user_name = await Users.findOne({ username: newUserName });
      if (user_name)
        return res.json({
          success: false,
          message: "Tên đăng nhập đã tồn tại",
        });

      const user_email = await Users.findOne({ email });
      if (user_email)
        return res.json({ success: false, message: "Email đã được đăng ký" });

      if (password.length <= 8)
        return res.json({
          success: false,
          message: "Mật khẩu phải trên 8 ký tự",
        });

      const hashedPassword = await argon2.hash(password);

      const newUser = new Users({
        ...req.body,
        password: hashedPassword,
        role: "user",
        active: true,
      });
      await newUser.save();

      const access_token = createAccessToken({
        id: newUser._id,
      });

      return res.json({
        success: true,
        message: "Người dùng được tạo thành công.",
        access_token,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi tạo người dùng.", error });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username });

      if (!user || !user.active)
        return res.status(400).json({
          success: false,
          message: "Username hoặc mật khẩu không đúng.",
        });
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch)
        return res.status(400).json({
          success: false,
          message: "Username hoặc mật khẩu không đúng.",
        });

      const access_token = createAccessToken({
        id: user._id,
        username: user.username,
      });
      return res.json({
        message: "Đăng nhập thành công",
        token: access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  adminLogin: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await Users.findOne({ username });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Username hoặc mật khẩu không đúng." });
      }

      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền truy cập vào trang quản trị." });
      }

      const isPasswordValid = await argon2.verify(user.password, password);

      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Username hoặc mật khẩu không đúng." });
      }

      const access_token = createAccessToken({
        id: user._id,
        username: user.username,
      });

      return res.json({
        success: true,
        message: "Đăng nhập thành công",
        token: access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
export default authCtrl;
