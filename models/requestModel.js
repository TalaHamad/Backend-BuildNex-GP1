import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Request = sequelize.define('Request',{
  Status: {
    type: DataTypes.STRING(255),
  },
    RequestID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    HomeownerID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'UserID',
      },
    },
    ServiceProviderID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'UserID',
      },
    },
    TaskID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tasks',
        key: 'TaskID',
      },
    },
    ReqTaskDate	: {
      type: DataTypes.STRING(255),
    },
    DeclineReason: {
      type: DataTypes.TEXT,
    },
  
  },
  {
    timestamps: false, 
  }
);

// Synchronize the model with the database
Request.sync()
  .then(() => console.log('Request model synchronized with the database'))
  .catch((err) => console.error('Request model synchronization failed:', err));

export default Request;
