const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "Người dùng được tạo thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo người dùng.", error });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username hoặc mật khẩu không đúng." });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username hoặc mật khẩu không đúng." });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({
    message: "Đăng nhập thành công",
    token: token,
    role: user.role,
  });
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username hoặc mật khẩu không đúng." });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username hoặc mật khẩu không đúng." });
  }

  if (user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền truy cập vào trang quản trị." });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({
    message: "Đăng nhập thành công",
    token: token,
    role: user.role,
  });
};
