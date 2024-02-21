// Function to create a rating range based on user input
export const createRatingRange = (userRating) => {
    if (userRating == 5) {
      return [4.8, 5];
    } else if (userRating == 4) {
      return [3.8, 4.9];
    } else if (userRating == 3) {
      return [2.8, 3.9];
    } else if (userRating == 2) {
      return [1.8, 2.9];
    } else if (userRating == 1) {
      return [0.1, 1.9];
    } else {
      return [0, 0]; 
    }
  };