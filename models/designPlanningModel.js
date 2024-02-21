import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const DesignPlanning = sequelize.define('DesignPlanning', 
{
    DesignID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  DesignDocument: {
    type: DataTypes.TEXT,
  },
  FoundationDocument: {
    type: DataTypes.TEXT,
  },
  PlumbingDocument: {
    type: DataTypes.TEXT,
  },
  ElectricalDocument: {
    type: DataTypes.TEXT,
  },
  InsulationAndHVACDocument: {
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
  DesignPlanning.sync()
    .then(() => console.log('DesignPlanning model synchronized with the database'))
    .catch((err) => console.error('DesignPlanning model synchronization failed:', err));
  
  export default DesignPlanning;
