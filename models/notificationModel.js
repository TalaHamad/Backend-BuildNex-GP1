import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Notification = sequelize.define('Notification', {
    NotificationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ReceiverId : {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'UserID',
      },
    },
    SenderId : {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'UserID',
      },
    },
    SenderName : {
      type: DataTypes.STRING,
    },
    SenderPic : {
      type: DataTypes.TEXT,   
    },
    Type:{
      type: DataTypes.STRING,
    },
    Content : {
      type: DataTypes.TEXT,   
    },
    IsRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
}, 
{
  timestamps: false,
});

// Synchronize the model with the database
Notification.sync()
  .then(() => console.log('Notification model synchronized with the database'))
  .catch((err) => console.error('Notification model synchronization failed:', err));

export default Notification;
