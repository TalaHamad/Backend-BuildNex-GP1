import User from '../models/userModel.js'; 

const updateLastActive = async (req, res, next) => {
  if (req.user) {
    try {
      await User.update({ lastActive: new Date() }, { where: { UserID: req.user } });
    } catch (error) {
      console.error('Error updating last active time:', error);
    }
  }
  next();
};

export default updateLastActive;