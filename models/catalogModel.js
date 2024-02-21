import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Catalog = sequelize.define('Catalog',
  {
    CatalogID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ItemImage: {
      type: DataTypes.TEXT,
    },
    ItemName: {
      type: DataTypes.STRING(255),
    },
    ItemPrice: {
      type: DataTypes.DOUBLE,
    },
    ItemRating: {
      type: DataTypes.FLOAT,
    },
    ItemDescription: {
      type: DataTypes.TEXT,
    },
    ItemColors: {
      type: DataTypes.JSON,
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
Catalog.sync()
  .then(() => console.log('Catalog model synchronized with the database'))
  .catch((err) => console.error('Catalog model synchronization failed:', err));

export default Catalog;
