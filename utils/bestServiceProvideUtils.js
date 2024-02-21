import User from '../models/userModel.js'; 
import { Op } from 'sequelize';

// Helper function to get all service providers for each service type
export const getAllServiceProviders = async () => {
    return User.findAll({
      attributes: ['UserID', 'ServiceType', 'Rating'], 
      where: {
        UserType: 'ServiceProvider',
        Rating: { [Op.not]: null }, // Exclude records where Rating is null
      },
      order: [['Rating', 'DESC']],
    });
  };
  
  // Helper function to get the top service providers for a given service type
  export const getTopServiceProvidersForType = async (serviceType, allServiceProviders) => {
    const providersForType = allServiceProviders.filter(provider => provider.ServiceType === serviceType);
  
    let highestRating = -1;
    let topProvidersForType = [];
  
    for (const provider of providersForType) {
      if (provider.Rating > highestRating) {
        highestRating = provider.Rating;
        topProvidersForType = [provider];
      } else if (provider.Rating === highestRating) {
        topProvidersForType.push(provider);
      }
    }
  
    const providerIds = topProvidersForType.map(provider => provider.UserID);
  
    return User.findAll({
      attributes: ['UserID','Username', 'UserPicture', 'ServiceType', 'Rating', 'Price'],
      where: {
        UserID: providerIds,
        Rating: { [Op.not]: null }, // Exclude records where Rating is null
      },
      order: [['Rating', 'DESC']],
    });
  };