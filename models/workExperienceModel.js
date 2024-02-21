import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const WorkExperience = sequelize.define('WorkExperience',
  {
    WorkID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    WorkImage: {
      type: DataTypes.TEXT,
    },
    WorkName: {
      type: DataTypes.STRING(255),
    },

    WorkDescription: {
      type: DataTypes.TEXT,
    },
 
    ServiceProviderID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'UserID',
      },
    },
  },
  {
    timestamps: false, 
  }
);

// Synchronize the model with the database
WorkExperience.sync()
  .then(() => console.log('WorkExperience model synchronized with the database'))
  .catch((err) => console.error('WorkExperience model synchronization failed:', err));

export default WorkExperience;
