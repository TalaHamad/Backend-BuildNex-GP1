import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Task = sequelize.define('Task', 
{
  TaskID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  TaskName: {
    type: DataTypes.STRING(255),
  },
  TaskDescription: {
    type: DataTypes.TEXT,
  },
  TaskStatus: {
    type: DataTypes.STRING(50),
  },
  TaskNumber: {
    type: DataTypes.INTEGER,
  },
  ProjectID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Projects',
      key: 'ProjectID',
    },
  },
  ServiceProviderID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'UserID',
    },
  },
  SerProNotes: {
    type: DataTypes.TEXT,
  },
  TaskDate: {
    type: DataTypes.STRING(255),
  },
},
{
  timestamps: false, 
});
  
  // Synchronize the model with the database
  Task.sync()
    .then(() => console.log('Task model synchronized with the database'))
    .catch((err) => console.error('Task model synchronization failed:', err));
  
  export default Task;
