import express from 'express';

import { 
    getProjects,
    getProjectDetails
   } from '../controllers/serProProjectsController.js';

import { 
    getAllRequests,
    acceptRequest, 
    declineRequest
   } from '../controllers/serProRequestsController.js';

import { 
    getCatalogItems,
    addItemToCatalog,
    getItemDetails,
    editItem,
    editItemImage
   } from '../controllers/serProCatalogController.js';   

import { 
    getAllReviews
   } from '../controllers/serProGetAllReviewsController.js';

import { 
    getWorkExperiences,
    addWorkExperience,
    getWorkExpDetails,
    editWorkExp,
    editWorkExpImage
   } from '../controllers/serProWorkExperienceController.js';   

import { 
    getTask1Data,
    setTask1Data,

    getTask2Data,
    setTask2Data,

    getTask3Data,
    setTask3Data,
    
    getTask4Data,
    setTask4Data,

    getTask5Data,
    setTask5Data,

    getTask6Data,
    setTask6Data
   } from '../controllers/serviceProviderTasksDetailsController.js';


   
import authMiddleware  from '../middleware/auth.js'; 
import updateLastActive from '../middleware/updateLastActive.js';

// Create an instance of the express router
const serviceProviderRouter = express.Router();

// Service Provider get the projects that he works on it (works on task on the project)
serviceProviderRouter.get('/projects', authMiddleware,  updateLastActive ,getProjects);

//------------------------------------------------------------------------------//

// Service Provider get all requests from HomeOwners
serviceProviderRouter.get('/requests', authMiddleware,  updateLastActive ,getAllRequests);

// Service Provider accept a request from HomeOwners
serviceProviderRouter.post('/requests/:requestId/accept', authMiddleware,  updateLastActive ,acceptRequest);

// Service Provider decline a request from HomeOwners
serviceProviderRouter.post('/requests/:requestId/decline', authMiddleware,  updateLastActive ,declineRequest);

serviceProviderRouter.get('/projectDetails/:projectId/:taskId', authMiddleware,  updateLastActive , getProjectDetails);

//------------------------------------------------------------------------------//

// Service Provider get his catalog items 
serviceProviderRouter.get('/catalog/items', authMiddleware,  updateLastActive , getCatalogItems);

// Service Provider add an item to his catalog
serviceProviderRouter.post('/catalog/addItem', authMiddleware,  updateLastActive , addItemToCatalog);

// Service Provider get Item Details
serviceProviderRouter.get('/catalog/:catalogId', authMiddleware, updateLastActive , getItemDetails);

// Service Provider edit Item Details
serviceProviderRouter.put('/catalog/:catalogId/editItem', authMiddleware,  updateLastActive ,editItem);

// Service Provider edit Item Image Details
serviceProviderRouter.put('/catalog/:catalogId/editItemImage', authMiddleware, updateLastActive , editItemImage);

//------------------------------------------------------------------------------//

// Service Provider get all reviews that written for him by HomeOwners
serviceProviderRouter.get('/reviews', authMiddleware,  updateLastActive ,getAllReviews);

//------------------------------------------------------------------------------//

// Service Provider get his Work Experiences  
serviceProviderRouter.get('/workExperiences', authMiddleware,  updateLastActive ,getWorkExperiences);

// Service Provider add Work Experience
serviceProviderRouter.post('/addworkExperience', authMiddleware,  updateLastActive ,addWorkExperience);

// Service Provider get work experience details by WorkID
serviceProviderRouter.get('/workExperiences/:workExpId', authMiddleware,  updateLastActive ,getWorkExpDetails);

// Service Provider edit work experience by WorkID
serviceProviderRouter.put('/workExperiences/:workExpId/edit', authMiddleware, updateLastActive , editWorkExp);

// Service Provider edit work experience Image by WorkID
serviceProviderRouter.put('/workExperiences/:workExpId/editImage', authMiddleware,  updateLastActive ,editWorkExpImage);

//------------------------------------------------------------------------------//

serviceProviderRouter.get('/getTask1/:taskId', authMiddleware, getTask1Data); 
serviceProviderRouter.post('/setTask1/:taskId/:projectId', authMiddleware,  updateLastActive ,setTask1Data); 


serviceProviderRouter.get('/getTask2/:taskId/:projectId', authMiddleware,  updateLastActive ,getTask2Data); 
serviceProviderRouter.post('/setTask2/:taskId/:projectId', authMiddleware,  updateLastActive ,setTask2Data); 


serviceProviderRouter.get('/getTask3/:taskId', authMiddleware, updateLastActive , getTask3Data); 
serviceProviderRouter.post('/setTask3/:taskId/:projectId', authMiddleware,  updateLastActive ,setTask3Data); 

serviceProviderRouter.get('/getTask4/:taskId/:projectId', authMiddleware, updateLastActive , getTask4Data); 
serviceProviderRouter.post('/setTask4/:taskId/:projectId', authMiddleware,  updateLastActive ,setTask4Data); 

serviceProviderRouter.get('/getTask5/:taskId/:projectId', authMiddleware, updateLastActive , getTask5Data); 
serviceProviderRouter.post('/setTask5/:taskId/:projectId', authMiddleware, updateLastActive , setTask5Data); 

serviceProviderRouter.get('/getTask6/:taskId/:projectId', authMiddleware, updateLastActive , getTask6Data); 
serviceProviderRouter.post('/setTask6/:taskId/:projectId', authMiddleware,  updateLastActive ,setTask6Data); 

// Export the router for use in other files
export default serviceProviderRouter;