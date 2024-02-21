import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const SoilInvestigation = sequelize.define('SoilInvestigation', 
{
  SoilID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  SoilDocument: {
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
  SoilInvestigation.sync()
    .then(() => console.log('SoilInvestigation model synchronized with the database'))
    .catch((err) => console.error('SoilInvestigation model synchronization failed:', err));
  
  export default SoilInvestigation;
