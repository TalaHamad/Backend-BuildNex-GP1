import express from 'express';
import authMiddleware  from '../middleware/auth.js'; 
import updateLastActive from '../middleware/updateLastActive.js';

import { 
    getProjectCountByCity,
    getProjectCountByCompletion,
    getProjectCountByStatusForCity,
    getHomeownerCountByCity,
    getServiceProviderCountByCity,
    getServiceProviderCountByRating,
    getTaskCountByServiceType,
    getTaskCountByStatusForCity,
    addMatirealProvider,
   } from '../controllers/adminController.js';


const adminRouter = express.Router();

adminRouter.get('/getProjectCountByCity', authMiddleware, updateLastActive, getProjectCountByCity); 
adminRouter.get('/getProjectCountByCompletion', authMiddleware, updateLastActive, getProjectCountByCompletion); 
adminRouter.post('/getProjectCountByStatusForCity', authMiddleware, updateLastActive, getProjectCountByStatusForCity); 
adminRouter.get('/getHomeownerCountByCity', authMiddleware, updateLastActive, getHomeownerCountByCity); 
adminRouter.get('/getServiceProviderCountByCity', authMiddleware, updateLastActive, getServiceProviderCountByCity); 
adminRouter.post('/getServiceProviderCountByRating', authMiddleware, updateLastActive, getServiceProviderCountByRating); 
adminRouter.get('/getTaskCountByServiceType', authMiddleware, updateLastActive, getTaskCountByServiceType); 
adminRouter.post('/getTaskCountByStatusForCity', authMiddleware, updateLastActive, getTaskCountByStatusForCity); 
adminRouter.post('/addMatirealProvider', authMiddleware, updateLastActive, addMatirealProvider); 

export default adminRouter;
