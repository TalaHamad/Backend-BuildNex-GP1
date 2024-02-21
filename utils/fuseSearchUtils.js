import Fuse from 'fuse.js';

// Function to search using a flexible algorithm
export const fuseSearch = (query, names, threshold) => {
  // Configure Fuse options
  const options = {
    includeScore: true, // Include search score in results
    threshold, // Adjust this threshold as needed
    keys: ['fullName'], // Search based on the 'fullName' key
  };

  // Transform names into objects with a 'fullName' key
  const nameObjects = names.map(fullName => ({ fullName }));

  // Create a Fuse instance with the configured options
  const fuse = new Fuse(nameObjects, options);

  // Search using the query
  const results = fuse.search(query);

  // Extract the fullName from the search results
  const matchedNames = results.map(result => result.item.fullName);

  return matchedNames;
};