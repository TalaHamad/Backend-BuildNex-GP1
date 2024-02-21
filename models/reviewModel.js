import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Review = sequelize.define('Review', {
  ReviewID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ReviewContent: {
    type: DataTypes.TEXT,
  },
  Rating: {
    type: DataTypes.FLOAT,
  },
  ReviewDate: {
  type: DataTypes.STRING(255),
  },
  ServiceProviderID: {
    type: DataTypes.INTEGER,
    references: {
        model: 'Users',
        key: 'UserID',
      },
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
  }
);

// Synchronize the model with the database
Review.sync()
  .then(() => console.log('Review model synchronized with the database'))
  .catch((err) => console.error('Review model synchronization failed:', err));


export default Review;
