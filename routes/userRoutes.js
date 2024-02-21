import express from 'express';
import {
  userRegister,
  userLogin,
  forgotPassword,
  verifyCode,
  resetPassword,
} from '../controllers/userRegController.js';
import { 
  getProfile,
  editProfile,
  editProfileImage,
  getProfilefromID
 } from '../controllers/userProfileController.js';

 import { 
  sendMessage,
  getInbox,
  getConversation,
  getServiceProvidersForHomeowner,
  getHomeOwnersForServiceProvider
 } from '../controllers/userMessageController.js';

 import{
  getNotifications,
  getNotificationCount,
  markAllNotificationsAsRead
 } from '../controllers/userNotificationController.js';


import authMiddleware  from '../middleware/auth.js'; 
import updateLastActive from '../middleware/updateLastActive.js';


const userRouter = express.Router();

// User Registration
userRouter.post('/register', userRegister); 

// User Login
userRouter.post('/login', userLogin); 

// User Forgot Password
userRouter.post('/forgotPassword', forgotPassword);

// User Verify Code
userRouter.post('/verifyCode/:userId', verifyCode); 

// User Reset Password
userRouter.post('/resetPassword/:userId', resetPassword); 

//------------------------------------------------------------------------------//

// User get Profile
userRouter.get('/profile', authMiddleware, updateLastActive ,getProfile); 

// User edit Profile
userRouter.put('/editProfile', authMiddleware, updateLastActive ,editProfile); 

// User edit Profile Image
userRouter.put('/editProfileImage', authMiddleware, updateLastActive ,editProfileImage); 

userRouter.get('/profilefromID/:userId', authMiddleware, updateLastActive ,getProfilefromID); 


//------------------------------------------------------------------------------//

userRouter.post('/sendMessage/:receiverId', authMiddleware, updateLastActive ,sendMessage); 

userRouter.get('/getInbox', authMiddleware, updateLastActive, getInbox);

userRouter.get('/getConversation/:receiverId', authMiddleware, updateLastActive , getConversation);

userRouter.get('/getServiceProviders', authMiddleware, updateLastActive, getServiceProvidersForHomeowner);

userRouter.get('/getHomeOwners', authMiddleware, updateLastActive, getHomeOwnersForServiceProvider);

//------------------------------------------------------------------------------//

userRouter.get('/getNotifications', authMiddleware, updateLastActive, getNotifications);
userRouter.get('/getNotificationCount', authMiddleware, updateLastActive, getNotificationCount);
userRouter.get('/markAllNotificationsAsRead', authMiddleware, updateLastActive, markAllNotificationsAsRead);

export default userRouter;
