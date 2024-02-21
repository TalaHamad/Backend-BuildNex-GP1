import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Approval = sequelize.define('Approval', 
{
  ApprovalID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ApprovalsDocument: {
    type: DataTypes.TEXT,
  },
  Notes: {
    type: DataTypes.TEXT,
  },
  TaskID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Tasks',
      key: 'TaskID',
    },
  },
},
{
  timestamps: false, 
});
  
  // Synchronize the model with the database
  Approval.sync()
    .then(() => console.log('Approval model synchronized with the database'))
    .catch((err) => console.error('Approval model synchronization failed:', err));
  
  export default Approval;
