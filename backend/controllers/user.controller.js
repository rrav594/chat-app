import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json({ status: "success", data: { filteredUsers } });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error." });
  }
};
