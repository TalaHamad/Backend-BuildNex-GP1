import User from '../models/userModel.js'; 

export const getProfile = async (req, res) => {
    try {
          if (!req.user) {
           return res.status(401).json({ error: 'User not authenticated' });
           }
           
          const userId = req.user; 
    
        
          const user = await User.findOne({
            where: { UserID: userId },
          });
      
          const userProfile = {
            UserPicture: user.UserPicture,
            Username: user.Username,
            UserType: user.UserType,
            PhoneNumber: user.UserPhoneNumber,
            Email: user.Email,
            UserProfileInfo: user.UserProfileInfo,
          };
      
          if (user.UserType === 'ServiceProvider') {
            userProfile.Rating = user.Rating;
            userProfile.Price = user.Price;
          }
    
          res.status(200).json(userProfile);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
      }
  };

  export const editProfile = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      const userId = req.user;
  
      const user = await User.findByPk(userId);
  
      const { UserPhoneNumber, Email, UserProfileInfo } = req.body;

      if ( Email !== user.Email) {
        const emailExist = await User.findOne({ where: { Email } });
        if (emailExist) {
          return res.status(400).json('Email already exists');
        }
      }
      
      user.UserPhoneNumber = UserPhoneNumber || user.UserPhoneNumber;
      user.Email = Email || user.Email;
      user.UserProfileInfo = UserProfileInfo || user.UserProfileInfo;

      if (user.UserType === 'ServiceProvider') {
      const { Price } = req.body;
      user.Price = Price || user.Price;
      }

      await user.save();
  
      res.status(200).json('Profile updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  };
  
 export const editProfileImage = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      const userId = req.user; 
  
      const user = await User.findByPk(userId);
  
      const {userImage } = req.body;
      
      user.UserPicture = userImage || user.UserPicture;
  
      await user.save();
  
      res.status(200).json('Profile Image updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update user Image' });
    }
  };

 export const getProfilefromID = async (req, res) => {
    try {
  
          const {userId}= req.params; 
    
          const user = await User.findOne({
            where: { UserID: userId },
          });
      
          const userProfile = {
            UserPicture: user.UserPicture,
            Username: user.Username,
            UserType: user.UserType,
            PhoneNumber: user.UserPhoneNumber,
            Email: user.Email,
            UserProfileInfo: user.UserProfileInfo,
          };
      
          if (user.UserType === 'ServiceProvider') {
            userProfile.Rating = user.Rating;
            userProfile.Price = user.Price;
          }
    
          res.status(200).json(userProfile);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
      }
  };  