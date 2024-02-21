import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const User = sequelize.define('User', 
{
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserType: {
    type: DataTypes.STRING,
  },
  Username: {
    type: DataTypes.STRING,
  },
  Email: {
    type: DataTypes.STRING,
    unique: true,
  },
  Password: {
    type: DataTypes.STRING,
  },
  UserProfileInfo: {
    type: DataTypes.TEXT,
  },
  UserPicture: {
    type: DataTypes.TEXT,
  },
  Rating: {
    type: DataTypes.FLOAT,
  },
  Price: {
    type: DataTypes.INTEGER,
  },
  UserPhoneNumber: {
    type: DataTypes.STRING,
  },
  ServiceType: {
    type: DataTypes.STRING,
  },
  UserCity: {
    type: DataTypes.STRING,
  },
  lastActive: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  
}, {
  timestamps: false, 
});

// Synchronize the model with the database
User.sync()
  .then(() => console.log('User model synchronized with the database'))
  .catch((err) => console.error('User model synchronization failed:', err));

export default User;