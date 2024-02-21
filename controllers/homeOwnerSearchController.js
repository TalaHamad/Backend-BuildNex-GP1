import User from '../models/userModel.js';
import { fuseSearch } from '../utils/fuseSearchUtils.js';
import { Op } from 'sequelize';
import _ from 'lodash';
const { shuffle } = _;
import { getAllServiceProviders , getTopServiceProvidersForType } from '../utils/bestServiceProvideUtils.js';
import { createRatingRange } from '../utils/createRatingRangeUtils.js';

export const getSuggestionNames = async (req, res) => {
  try {
    const usernamesInDatabase = await User.findAll({
      attributes: ['Username'],
      where: {
        UserType: 'ServiceProvider',
      },
    });

    const shuffledUsernames = shuffle(usernamesInDatabase.map(user => user.Username));
    const randomUsernames = shuffledUsernames.slice(0, 20);

    const suggestions = randomUsernames.map(username => ({
      Username: username || null,
    }));

    res.status(200).json( suggestions );

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
};

export const searchServiceProviders = async (req, res) => {
try {
  const { searchTerm } = req.body;

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const similarityThreshold = 0.3; 

  const namesInDatabase = await User.findAll({
    attributes: ['UserID','Username', 'UserPicture', 'ServiceType', 'Rating', 'Price'],
    where: {
      UserType: 'ServiceProvider',
    },
    order: [['Rating', 'DESC']], 
  });

  const matches = fuseSearch(searchTerm, namesInDatabase.map(User => User.Username), similarityThreshold);
  const matchedUsers = namesInDatabase.filter(User => matches.includes(User.Username));
   
    const results = matchedUsers.map(User => ({
      UserID:User.UserID || null, 
      Username: User.Username || null, 
      UserPicture: User.UserPicture || null,
      ServiceType: User.ServiceType || null,
      Rating: User.Rating || null,
      Price: User.Price || null,
    }));

    res.status(200).json({ results });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
};

export const getServiceProvidersByServiceType = async (req, res) => {
  try {
    const { serviceType } = req.params;

    const serviceProviders = await User.findAll({
      attributes: ['UserID','Username', 'UserPicture', 'ServiceType', 'Rating', 'Price'],
      where: {
        UserType: 'ServiceProvider', 
        ServiceType: serviceType,
      },
      order: [['Rating', 'DESC']], 
    });

    res.status(200).json( serviceProviders );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch service providers' });
  }
};

export const getBestServiceProviders = async (req, res) => {
  try {
      const allServiceProviders = await getAllServiceProviders();
  
      const uniqueServiceTypes = [...new Set(allServiceProviders.map(provider => provider.ServiceType))];
  
      const bestServiceProviders = await Promise.all(
        uniqueServiceTypes.map(async (serviceType) => {
          return await getTopServiceProvidersForType(serviceType, allServiceProviders);
        })
      );
  
      const flattenedBestServiceProviders = bestServiceProviders.flat();
  
      res.status(200).json( flattenedBestServiceProviders );
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch best service providers' });
  }
};

export const filterServiceProviders = async (req, res) => {
  try {
    const { rating, minPrice, maxPrice, city, serviceType } = req.body;

    const ratingRange = createRatingRange(rating);

    const serviceProviders = await User.findAll({
      attributes: ['UserID','Username', 'UserPicture', 'ServiceType', 'Rating', 'Price', 'UserCity'],
      where: {
        UserType: 'ServiceProvider',
        ServiceType: serviceType || { [Op.ne]: null }, 
        Rating: {
          [Op.gte]: ratingRange[0],
          [Op.lte]: ratingRange[1],
        },
        Price: {
          [Op.gte]: minPrice || 0,
          [Op.lte]: maxPrice || 999999,
        },
        UserCity: {
          [Op.like]: city ? `%${city}%` : '%', 
        },
      },
      order: [['Rating', 'DESC']], 

    });

    const results = serviceProviders.map(provider => ({
      UserID: provider.UserID,
      Username: provider.Username,
      UserPicture: provider.UserPicture,
      ServiceType: provider.ServiceType,
      Rating: provider.Rating,
      Price: provider.Price,
      UserCity: provider.UserCity,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
};
