import User from '../models/userModel.js'; 
import Code from '../models/codeModel.js'; 
import { sendResetPasswordEmail, generateUniqueCode } from '../utils/emailUtils.js';
import { generateToken } from '../utils/tokenUtils.js';

import bcrypt from 'bcrypt';

// User Register 
export const userRegister = async (req, res) => {
    try 
    {
      const { firstname, lastname, userType, email, password, confirmPassword, 
        profilepicture, phonenumber, city, serviceType, bio } = req.body;
     
      if (!firstname || !lastname  || !userType || !email || !password || !confirmPassword 
        || !phonenumber || !city || !serviceType) {
        return res.status(400).json('Please fill in all the required fields')
      }
  
       const userExist = await User.findOne({ where: {Email : email} });
       if (userExist) {
           return res.status(400).json('User already exist with the given Email')
       }
  
      if (password !== confirmPassword) {
        return res.status(400).json('Password and Confirm Password does not match' );
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt); 

      const user = await User.create({   
      Username: `${firstname} ${''}${lastname}`,  
      UserType: userType ,
      Email: email,   
      Password: hashedPassword, 
      UserProfileInfo: bio !== "" ? bio : 'Define yourself in a few lines! Use this space to express your essence, interests, or anything you would like the world to know.',
      UserPicture: profilepicture !== "" ? profilepicture : 'images/profilePic96.png' ,
      UserPhoneNumber: phonenumber,
      ServiceType :serviceType,
      UserCity:city,
      Rating:0.0,
      Price:0,
    });

      const token = generateToken(user.UserID);

      res.status(200).json({
        userID: user.UserID,
        userType: user.UserType,
        token: token
      });
    
    } catch (error) {
      console.error('User Registration Error:', error);
  
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: 'Validation error. Please provide valid data' });
      }
  
      res.status(500).json({ error: 'User Registration Failed' });
    }
  };

// User Login
export const userLogin = async (req, res) => {
    try 
  {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json('Please enter all the details');
    }

    const user = await User.findOne({ where: {Email : email} });

    if (!user) {
      return res.status(400).json('Invalid Email');
    }

    const passwordMatch = await bcrypt.compare(password,user.Password);

    if (!passwordMatch) {
      return res.status(400).json('Invalid Password');
    }

    const token = generateToken(user.UserID);
    user.lastActive= new Date();
    await user.save();
    
    res.status(200).json({
      userID: user.UserID,
        userType: user.UserType,
        token: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'User login failed' });
  }
  };

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;
    
          const user = await User.findOne({ where: { Email: email } });
    
          if (!user) {
            return res.status(400).json('No User found with this Email');
          }
    
          const resetCode = generateUniqueCode(10);
          const codeHash = await bcrypt.hash(resetCode, 10);
          console.log(resetCode);
          await sendResetPasswordEmail(email, resetCode);
    
          const code = await Code.create({
            userId: user.UserID,
            codeHash: codeHash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
            createdAt: new Date(),
          });
    
          res.status(200).json({
            message: 'Password reset email sent',
            userId: user.UserID, 
          });

      } catch (error) {
        console.error(error);
        res.status(500).json('Password reset request failed');
      }
  };

// Verify Code
export const verifyCode = async (req, res) => {
    try {

      const { userId } = req.params; 
    
        const { providedCode } = req.body;
    
          const code = await Code.findOne({
            where: {
              userId: userId,
            },
            order: [['createdAt', 'DESC']], 
          });
    
          if (!code) {
            return res.status(401).json({ error: 'Code not found' });
          }
          
            const codeMatch = await bcrypt.compare(providedCode, code.codeHash);
            console.log('CodeMatch: ' + codeMatch);

            if (!codeMatch) {
              return res.status(400).json('Invalid Code');
            }

            const now = new Date();
            if (code.expiresAt < now) {
              return res.status(400).json('Code has expired');
            }

            res.status(200).json('Verification Successful');
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Invalid Verification Code' });
      }
  };
  
// Reset Password
  export const resetPassword = async (req, res) => {
    try 
    {
      const {userId} =  req.params ; 
  
      const { newPassword, confirmPassword } = req.body;
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json('New Password and Confirm Password does not match');
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      const user = await User.findByPk(userId);

      user.Password = hashedPassword;
      await user.save();
      res.status(200).json('Password Reset Successful');
    
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Password Reset Failed' });
    }
  };
  
  
  