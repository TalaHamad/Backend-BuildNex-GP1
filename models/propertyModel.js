import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const PropertySurvey = sequelize.define('PropertySurvey', 
{
  SurveyID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  PropertySize: {
    type: DataTypes.STRING(50),
  },
  SurveyDocument: {
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
  PropertySurvey.sync()
    .then(() => console.log('PropertySurvey model synchronized with the database'))
    .catch((err) => console.error('PropertySurvey model synchronization failed:', err));
  
  export default PropertySurvey;
