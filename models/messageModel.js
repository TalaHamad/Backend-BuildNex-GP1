import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Message = sequelize.define('Message', 
{
   messageId : {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  senderId : {
    type: DataTypes.INTEGER,
    references: {
        model: 'Users',
        key: 'UserID',
      },
  },
  receiverId : {
    type: DataTypes.INTEGER,
    references: {
        model: 'Users',
        key: 'UserID',
      },
  },
  content : {
    type: DataTypes.TEXT,
  },
  IsRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, 
{
  timestamps: false,
});

// Synchronize the model with the database
Message.sync()
  .then(() => console.log('Message model synchronized with the database'))
  .catch((err) => console.error('Message model synchronization failed:', err));

export default Message;
