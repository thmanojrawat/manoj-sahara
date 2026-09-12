import User from "../models/User.js";

export const authUser = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.json({
        success: false,
        message: "Not Authorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "Not Authorized",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;