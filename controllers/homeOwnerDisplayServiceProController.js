import Catalog from '../models/catalogModel.js';
import WorkExperience from '../models/workExperienceModel.js';
import { User, Review } from '../models/associationserProGetAllReviews.js';
import Task from'../models/taskModel.js'; 

export const getServiceProData = async (req, res) => {
    try {
     
      const {serviceProviderId} = req.params;
  
      const completedTasksCount = await Task.count({
        where: {
          ServiceProviderID: serviceProviderId,
          TaskStatus: 'Completed',
        },
      });
      
      const reviewCount = await Review.count({
        where: { ServiceProviderID: serviceProviderId },
      });

    const ratingCounts = {
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0,
        rating5: 0,
      };

      const ratings = await Review.findAll({
        where: {
          ServiceProviderID: serviceProviderId,
        },
        attributes: ['Rating'],
      });
  
      ratings.forEach((rating) => {
        switch (rating.Rating) {
          case 1:
            ratingCounts.rating1++;
            break;
          case 2:
            ratingCounts.rating2++;
            break;
          case 3:
            ratingCounts.rating3++;
            break;
          case 4:
            ratingCounts.rating4++;
            break;
          case 5:
            ratingCounts.rating5++;
            break;
          default:
            break;
        }
      });

      const totalRatings = ratingCounts.rating1 + ratingCounts.rating2 + ratingCounts.rating3
     + ratingCounts.rating4 + ratingCounts.rating5;

    var percentageRating1 = 0 ;
    var percentageRating2 = 0 ;
    var percentageRating3 = 0 ;
    var percentageRating4 = 0 ;
    var percentageRating5 = 0 ;

    if(totalRatings != 0){
      percentageRating1 = ratingCounts.rating1 / totalRatings;
      percentageRating2 = ratingCounts.rating2 / totalRatings;
      percentageRating3 = ratingCounts.rating3 / totalRatings;
      percentageRating4 = ratingCounts.rating4 / totalRatings;
      percentageRating5 = ratingCounts.rating5 / totalRatings;
    }

    const ServiceProData = {
      CompletedTasks: completedTasksCount,
      ReviewsCount: reviewCount,
      PercentageRating1: percentageRating1.toFixed(2),
      PercentageRating2: percentageRating2.toFixed(2),
      PercentageRating3: percentageRating3.toFixed(2),
      PercentageRating4: percentageRating4.toFixed(2),
      PercentageRating5: percentageRating5.toFixed(2),
    };
    res.status(200).json(ServiceProData);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch getServiceProData' });
    }
  };

export const getServiceProCatalogItems = async (req, res) => {
  try {
   
    const {serviceProviderId} = req.params;

    const catalogItems = await Catalog.findAll({
      where: {
        ServiceProviderID: serviceProviderId,
      },
      attributes: ['CatalogID','ItemImage', 'ItemName','ItemPrice' ,'ItemRating'],
    });

    res.status(200).json(catalogItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch catalog items' });
  }
};

export const getServiceProWorkExperiences = async (req, res) => {
    try {
      const {serviceProviderId} = req.params; 
  
      const workExperiences = await WorkExperience.findAll({
        where: {
          ServiceProviderID: serviceProviderId,
        },
        attributes: ['WorkID','WorkImage', 'WorkName','WorkDescription'],
      });
  
      res.status(200).json(workExperiences);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch work experiences' });
    }
  };

export const getServiceProReviews = async (req, res) => {
  try {
      
      const {serviceProviderId} = req.params;

      const reviews = await Review.findAll({
        where: { ServiceProviderID: serviceProviderId },
        attributes: ['ReviewID', 'ReviewContent', 'Rating','ReviewDate'],
        include: [
          {
            model: User,
            as: 'HomeOwner',
            attributes: ['UserID', 'Username', 'UserPicture'],
          },
        ],
      });


      const flattenedReviews = reviews.map((review) => ({
        ReviewID: review.ReviewID,
        ReviewContent: review.ReviewContent,
        Rating: review.Rating,
        ReviewDate: review.ReviewDate,
        HomeOwnerID: review.HomeOwner.UserID,
        HomeOwnerName: review.HomeOwner.Username,
        HomeOwnerPicture: review.HomeOwner.UserPicture,
      }));

      res.status(200).json(flattenedReviews);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews for the service provider'});
 }
};