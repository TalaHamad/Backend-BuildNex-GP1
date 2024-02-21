import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const RegulatoryInformation = sequelize.define('RegulatoryInformation', 
{
  RegInfoID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  PermitsDocument: {
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
  RegulatoryInformation.sync()
    .then(() => console.log('RegulatoryInformation model synchronized with the database'))
    .catch((err) => console.error('RegulatoryInformation model synchronization failed:', err));
  
  export default RegulatoryInformation;
