import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Project = sequelize.define('Project', 
{
  ProjectID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ProjectName: {
    type: DataTypes.STRING(255),
  },
  ProjectEntryPoint: {
    type: DataTypes.STRING(50),
  },
  ProjectStatus: {
    type: DataTypes.STRING(50),
  },
  ProjectProgress: {
    type: DataTypes.DOUBLE,
  },
  ProjectCity: {
    type: DataTypes.STRING(255),
  },
  ProjectLocation: {
    type: DataTypes.STRING(255),
  },
  BasinNumber: {
    type: DataTypes.STRING(255),
  },
  PlotNumber: {
    type: DataTypes.STRING(255),
  },
  HomeOwnerID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'UserID',
    },
  },
},
{
    timestamps: false, 
});
  
// Synchronize the model with the database
Project.sync()
  .then(() => console.log('Project model synchronized with the database'))
  .catch((err) => console.error('Project model synchronization failed:', err));

export default Project;
