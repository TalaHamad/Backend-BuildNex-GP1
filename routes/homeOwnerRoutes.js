import express from 'express';

import {
  getProjects,
  addProject,
  getProjectInformation,
  getProjectData,
} from '../controllers/homeOwnerProjectsController.js';

import {
  getProjectTasks,
  getProjectTaskInformation,
  getMaterialProviders,
  markTask16asDone,
} from '../controllers/homeOwnerProjectsTasksController.js';

import {
  getSuggestionNames,
  searchServiceProviders,
  getServiceProvidersByServiceType,
  getBestServiceProviders,
  filterServiceProviders,
} from '../controllers/homeOwnerSearchController.js'; 

import { 
  getHomeownerReviews,
  addOrUpdateReview,
  getReviewDetails,
  getReviewsInfo
} from '../controllers/homeOwnerReviewsController.js';

import { 
  requestServiceProvider,
  checkrequestServiceProvider
} from '../controllers/homeOwnerRequestSerProController.js';
  
import { 
  getServiceProData,
  getServiceProCatalogItems,
  getServiceProWorkExperiences,
  getServiceProReviews,
}from '../controllers/homeOwnerDisplayServiceProController.js';

import { 
  getSurveyDocumentfromProjectInfo,
  getPermitsDocumentfromProjectInfo,
  getSoilDocumentfromProjectInfo,
  checkPreviousTaskStatus,
  getProjectInfoData,
  saveBuildingData,
  saveMaterialProvider,
  saveProjectInfoDoors,
  saveProjectInfoTiles,
  saveProjectInfoWindowDesign,
  saveProjectInfoDoorDesign,
  saveProjectInfoPaints,

  getServiceProviderCatalogItems,
  getServiceProviderCatalogItemDetails,

  getPropertySurvey,
  getPermitsRegulatoryInfo,
  getSoilInvestigation,
  getDesignAndPlanning,
  getApprovals,
  getTask6
} from '../controllers/homeOwnerTasksDetailsController.js';
  

import authMiddleware  from '../middleware/auth.js'; 
import updateLastActive from '../middleware/updateLastActive.js';

const homeOwnerRouter = express.Router();

// Get HomeOwner's Projects
homeOwnerRouter.get('/projects', authMiddleware, updateLastActive , getProjects); 

// HomeOwner Add Project 
homeOwnerRouter.post('/addProject', authMiddleware,  updateLastActive ,addProject); 

// Get HomeOwner's Project Information
homeOwnerRouter.get('/projectInfo/:projectId', authMiddleware,  updateLastActive , getProjectInformation); 

//------------------------------------------------------------------------------//

// Get HomeOwner's Project Tasks
homeOwnerRouter.get('/projectTasks/:projectId', authMiddleware,  updateLastActive , getProjectTasks);

// Get HomeOwner's Project Task Information
homeOwnerRouter.get('/project/task-info/:taskId', authMiddleware,  updateLastActive , getProjectTaskInformation);

homeOwnerRouter.post('/project/task-info/materialProviders', authMiddleware,  updateLastActive , getMaterialProviders);
homeOwnerRouter.put('/project/task-info/markTask16asDone/:taskId/:projectId', authMiddleware,  updateLastActive , markTask16asDone);

// Get HomeOwner's Project Data
homeOwnerRouter.get('/project/:projectId', authMiddleware,  updateLastActive , getProjectData); 
//------------------------------------------------------------------------------//

// HomeOwner get random usernames for service providers as suggestions
homeOwnerRouter.get('/suggestionNames', authMiddleware, updateLastActive , getSuggestionNames); 

// HomeOwner search for service providers by name
homeOwnerRouter.post('/searchServiceProviders', authMiddleware, updateLastActive , searchServiceProviders); 

// HomeOwner get service providers for a specific service type
homeOwnerRouter.get('/serviceProviders/:serviceType', authMiddleware, updateLastActive , getServiceProvidersByServiceType);

// HomeOwner get the best service provider for each service type
homeOwnerRouter.get('/bestServiceProviders', authMiddleware, updateLastActive , getBestServiceProviders);

// HomeOwner filter and search for service providers based on rating, price, city
homeOwnerRouter.post('/filterServiceProviders', authMiddleware,updateLastActive ,  filterServiceProviders); 

//------------------------------------------------------------------------------//

// Get HomeOwner's Reviews "The reviews he wrote for the service provider" 
homeOwnerRouter.get('/reviews', authMiddleware, updateLastActive , getHomeownerReviews);  

// HomeOwner Add or Update Review for Service Provider
homeOwnerRouter.post('/addOrUpdateReview/:taskId', authMiddleware, updateLastActive , addOrUpdateReview);

homeOwnerRouter.get('/getReviewDetails/:taskId', authMiddleware, updateLastActive , getReviewDetails);

homeOwnerRouter.get('/getReviewsInfo/:taskId', authMiddleware, updateLastActive , getReviewsInfo);

//------------------------------------------------------------------------------//

// HomeOwner request Service Provider
homeOwnerRouter.post('/request/:serviceProviderId/:taskId', authMiddleware,updateLastActive ,  requestServiceProvider);
homeOwnerRouter.post('/checkRequest/:serviceProviderId/:taskId', authMiddleware,updateLastActive ,  checkrequestServiceProvider);

//------------------------------------------------------------------------------//

homeOwnerRouter.get('/serviceProData/:serviceProviderId', authMiddleware, updateLastActive , getServiceProData);
homeOwnerRouter.get('/serviceProCatalogItems/:serviceProviderId', authMiddleware,updateLastActive ,  getServiceProCatalogItems);
homeOwnerRouter.get('/serviceProWorkExperiences/:serviceProviderId', authMiddleware, updateLastActive , getServiceProWorkExperiences);
homeOwnerRouter.get('/serviceProReviews/:serviceProviderId', authMiddleware,updateLastActive ,  getServiceProReviews);

//------------------------------------------------------------------------------//

// getSurveyDocumentfromProjectInfo
homeOwnerRouter.get('/getSurveyDocument/:projectId', authMiddleware, updateLastActive , getSurveyDocumentfromProjectInfo);
// getPermitsDocumentfromProjectInfo
homeOwnerRouter.get('/getPermitsDocument/:projectId', authMiddleware, updateLastActive , getPermitsDocumentfromProjectInfo);
//getSoilDocumentfromProjectInfo
homeOwnerRouter.get('/getSoilDocument/:projectId', authMiddleware, updateLastActive ,  getSoilDocumentfromProjectInfo);

//------------------------------------------------------------------------------//

// check previous task status
homeOwnerRouter.get('/previousTaskStatus/:projectId/:taskNumber', authMiddleware, updateLastActive ,  checkPreviousTaskStatus);

// save building data in projectInfo table
homeOwnerRouter.post('/saveBuildingData/:projectId', authMiddleware, updateLastActive ,  saveBuildingData);

// save Material Provider in projectInfo table
homeOwnerRouter.post('/saveMaterialProvider/:projectId', authMiddleware, updateLastActive , saveMaterialProvider);


homeOwnerRouter.post('/saveProjectInfoDoors/:projectId', authMiddleware, updateLastActive , saveProjectInfoDoors);

homeOwnerRouter.post('/saveProjectInfoTiles/:projectId', authMiddleware, updateLastActive , saveProjectInfoTiles);

homeOwnerRouter.post('/saveProjectInfoWindowDesign/:projectId', authMiddleware, updateLastActive , saveProjectInfoWindowDesign);

homeOwnerRouter.post('/saveProjectInfoDoorDesign/:projectId', authMiddleware, updateLastActive , saveProjectInfoDoorDesign);

homeOwnerRouter.post('/saveProjectInfoPaints/:projectId', authMiddleware, updateLastActive , saveProjectInfoPaints);



// get ProjectInfo Data from projectInfo table
homeOwnerRouter.get('/getProjectInfoData/:projectId', authMiddleware, updateLastActive , getProjectInfoData);

// HomeOwner get Service Provider catalog items 
homeOwnerRouter.get('/catalogItems/:serviceProviderId', authMiddleware, updateLastActive , getServiceProviderCatalogItems);

// HomeOwner get Service Provider Item Details
homeOwnerRouter.get('/catalog/:catalogId', authMiddleware, updateLastActive , getServiceProviderCatalogItemDetails);

//------------------------------------------------------------------------------//

// HomeOwner getPropertySurvey // task1
homeOwnerRouter.get('/propertySurvey/:taskId', authMiddleware, updateLastActive , getPropertySurvey); 

//------------------------------------------------------------------------------//

// HomeOwner getPermitsRegulatoryInfo // task2 
homeOwnerRouter.get('/permitsRegulatoryInfo/:taskId', authMiddleware, updateLastActive , getPermitsRegulatoryInfo); 

//------------------------------------------------------------------------------//

// HomeOwner getSoilInvestigation // task3
homeOwnerRouter.get('/soilInvestigation/:taskId', authMiddleware,updateLastActive ,  getSoilInvestigation);

//------------------------------------------------------------------------------//

// HomeOwner getSoilInvestigation // task4
homeOwnerRouter.get('/designAndPlanning/:taskId', authMiddleware, updateLastActive , getDesignAndPlanning); 

//------------------------------------------------------------------------------//

// HomeOwner getApprovals // task5
homeOwnerRouter.get('/getApprovals/:taskId', authMiddleware, updateLastActive , getApprovals); 

// HomeOwner get task6
homeOwnerRouter.get('/getTask6/:taskId', authMiddleware, updateLastActive , getTask6);

export default homeOwnerRouter;