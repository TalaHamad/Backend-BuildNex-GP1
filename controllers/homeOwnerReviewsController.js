import Review from '../models/reviewModel.js';
import User from '../models/userModel.js';
import Task from '../models/taskModel.js'; 
import moment from 'moment';
import Notification from '../models/notificationModel.js';

export const getHomeownerReviews = async (req, res) => {
  try {
    const homeOwnerId = req.user; 

    const homeowner = await User.findByPk(homeOwnerId);

    if (!homeowner || homeowner.UserType !== 'HomeOwner') {
      return res.status(404).json({ error: 'Homeowner not found' });
    }

    const reviews = await Review.findAll({
      where: { HomeOwnerID: homeOwnerId },
    });

    res.status(200).json( reviews );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get homeowner reviews' });
  }
};

export const addOrUpdateReview = async (req, res) => {
  try {
    const homeOwnerId = req.user;
    const { taskId } = req.params;
    const { reviewContent, rating } = req.body;

    const task = await Task.findByPk(taskId, { attributes: ['ServiceProviderID'] });
    const serviceProviderId = task.ServiceProviderID;

    const existingReview = await Review.findOne({
      where: {
        HomeOwnerID: homeOwnerId,
        ServiceProviderID: serviceProviderId,
      },
    });

    let updatedReview;

    if (existingReview) {
      await existingReview.update({
        ReviewContent: reviewContent,
        Rating: rating,
        ReviewDate: moment().format('DD MMM, YYYY'),
      });
      await existingReview.save();

      updatedReview = existingReview;
    } else if (!existingReview) {
      // Create a new review
      const newReview = await Review.create({
        ReviewContent: reviewContent,
        Rating: rating,
        ReviewDate: moment().format('DD MMM, YYYY'),
        ServiceProviderID: serviceProviderId,
        HomeOwnerID: homeOwnerId,
      });

      updatedReview = newReview;
    }

    const reviews = await Review.findAll({
      where: { ServiceProviderID: serviceProviderId },
      attributes: ['Rating'],
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.Rating, 0) ;
    const averageRating = totalRating / (reviews.length);
    
    const serviceProvider = await User.findByPk(serviceProviderId);
    if (serviceProvider) {
      serviceProvider.update({ Rating: averageRating });
      await serviceProvider.save();
    }

    const user = await User.findByPk(homeOwnerId);
    const notificationMessage = existingReview
      ? `Homeowner ${user.Username} has updated their review.`
      : `Homeowner ${user.Username} has left a new review.`;

      const type = existingReview
      ? 'Update Review'
      : 'Add Review';

    await Notification.create({
      ReceiverId: serviceProviderId,
      SenderId: homeOwnerId,
      SenderName:user.Username,
      SenderPic:user.UserPicture,
      Type: type,
      Content: notificationMessage,
      IsRead: false,
    });

    const returnReview = {
      ReviewContent: updatedReview.ReviewContent,
      Rating: updatedReview.Rating,
      ReviewDate: updatedReview.ReviewDate,
      serviceProviderRating: serviceProvider.Rating,
      serviceProviderNumReviews: reviews.length,
    };

    res.status(200).json(returnReview);
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to add/update review for the service provider');
  }
};

export const getReviewDetails = async (req, res) => {
  try {
    const homeOwnerId = req.user;
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId, { attributes: ['ServiceProviderID'] });
    const serviceProviderId = task.ServiceProviderID;

    const existingReview = await Review.findOne({
      where: {
        HomeOwnerID: homeOwnerId,
        ServiceProviderID: serviceProviderId,
      },
    });
    
    if(existingReview)
    {
      res.status(200).json(existingReview);

    }
    else
    {
      const review = 
      {
        ReviewID: null,
        ReviewContent: null,
        Rating: null,
        ReviewDate:null,
        ServiceProviderID:null,
        HomeOwnerID:null,
      };
      res.status(200).json(review);

    }
      } catch (error) {
    console.error(error);
    res.status(500).json('Failed to getReviewDetails ');
  }
};

export const getReviewsInfo = async (req, res) => {
  try {
      const { taskId } = req.params;
      const task = await Task.findByPk(taskId, { attributes: ['ServiceProviderID'] });
      const serviceProviderId = task.ServiceProviderID;
      const serviceProvider = await User.findByPk(serviceProviderId);
    
      const reviews = await Review.findAll({
        where: { ServiceProviderID: serviceProviderId },
        attributes: ['Rating'],
      });

       const returnData = {
        serviceProviderRating: serviceProvider.Rating,
        serviceProviderNumReviews: reviews.length,
      };

       res.status(200).json(returnData);

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get reviews information' });
      }
    };
    
