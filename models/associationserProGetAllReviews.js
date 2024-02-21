import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';

User.hasMany(Review, { foreignKey: 'HomeOwnerID', as: 'HomeOwnerReviews' });
Review.belongsTo(User, { foreignKey: 'HomeOwnerID', as: 'HomeOwner' });

export { User, Review };