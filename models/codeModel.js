import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Code = sequelize.define('Code', 
{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  codeHash: {
    type: DataTypes.STRING,
  },
  expiresAt: {
    type: DataTypes.DATE,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
}, 
{
  timestamps: false,
});

// Synchronize the model with the database
Code.sync()
  .then(() => console.log('Code model synchronized with the database'))
  .catch((err) => console.error('Code model synchronization failed:', err));

export default Code;
