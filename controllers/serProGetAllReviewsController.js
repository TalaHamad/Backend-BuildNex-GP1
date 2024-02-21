import { User, Review } from '../models/associationserProGetAllReviews.js';

export const getAllReviews = async (req, res) => {
  try {
      
      const  serviceProviderId = req.user;

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
    res.status(500).json({ error: 'Failed to fetch reviews for the service provider' });
  }
};