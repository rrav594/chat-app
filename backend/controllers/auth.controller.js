import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { firstname, lastname, username, password, confirmPassword, gender } =
      req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Password and confirm password do not match.",
      });
    }
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "User already exists." });
    }
    const hashedPassword = await bcryptjs.hashSync(password, 10);

    const boy = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girl = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const newUser = new User({
      firstname,
      lastname,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender == "male" ? boy : girl,
    });
    if (newUser) {
      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);

      res.json({
        status: "success",
        data: {
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          username: newUser.username,
          gender: newUser.gender,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      res.staus(400).json({ status: "fail", error: "Invalid user data." });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error!",
    });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      status: "success",
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        profilepic: user.profilePic,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error!",
    });
  }
}

export function logout(req, res) {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res
      .status(200)
      .json({ status: "success", message: "loogged out succesfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error!",
    });
  }
}
