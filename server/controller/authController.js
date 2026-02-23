import Jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const hashPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });
  res.status(201).json({
    message: "User created successfully",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid password");
  }
  res.status(200).json({
    message: "User logged in successfully",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

const generateToken = (id) => {
  return Jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const authController = {
  registerUser,
  loginUser,
  getMe,
};

export default authController;
