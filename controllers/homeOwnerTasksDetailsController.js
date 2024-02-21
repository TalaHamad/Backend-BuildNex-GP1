import { Task, User, Project, PropertySurvey,RegulatoryInformation,SoilInvestigation ,
  DesignPlanning, Approval } from '../models/associationhomeOwnerGetPropertySurveys.js'; 
import Review from '../models/reviewModel.js';
import ProjectsInformation from '../models/projectInfoModel.js';
import Catalog from '../models/catalogModel.js';

export const getSurveyDocumentfromProjectInfo = async (req, res)=> {
  try {
    const { projectId } = req.params; 
    const projectInfo = await ProjectsInformation.findOne({
      where: { ProjectID: projectId },
      attributes: ['SurveyDocument'],
    });
    res.status(200).json(projectInfo.SurveyDocument);

  } catch (error) {
    console.error('Failed to get SurveyDocument:', error);
    res.status(500).json({ error: 'Failed to fetch SurveyDocument' });
  }
    
};

export const getPermitsDocumentfromProjectInfo = async (req, res)=> {
  try {
    const { projectId } = req.params; 
    const projectInfo = await ProjectsInformation.findOne({
      where: { ProjectID: projectId },
      attributes: ['PermitsDocument'],
    });
    res.status(200).json(projectInfo.PermitsDocument);

  } catch (error) {
    console.error('Failed to get PermitsDocument:', error);
    res.status(500).json({ error: 'Failed to fetch PermitsDocument' });
  }
    
};

export const getSoilDocumentfromProjectInfo = async (req, res)=> {
  try {
    const { projectId } = req.params; 
    const projectInfo = await ProjectsInformation.findOne({
      where: { ProjectID: projectId },
      attributes: ['SoilDocument'],
    });
    res.status(200).json(projectInfo.SoilDocument);

  } catch (error) {
    console.error('Failed to get SoilDocument:', error);
    res.status(500).json({ error: 'Failed to fetch SoilDocument' });
  }
    
};

export const checkPreviousTaskStatus = async (req, res) => {
  try {
    const { projectId, taskNumber } = req.params; 

    const previousTask = await Task.findOne({
      where: {
        ProjectID: projectId,
        TaskNumber: taskNumber - 1, 
      },
      attributes: ['TaskStatus'], 
    });

    res.status(200).json( previousTask.TaskStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check the previous task status' });
  }
};

export const saveBuildingData = async (req, res) => {
  try {
    const { projectId } = req.params; 
    const{numRooms, numFloors, buildingArea}= req.body;

    const projectInfoData = await ProjectsInformation.findOne({
      where: {
        ProjectID: projectId,
      },
    });

    projectInfoData.NumberOfRooms = numRooms;
    projectInfoData.NumberOfFloors = numFloors;
    projectInfoData.BuildingArea = buildingArea;

    await projectInfoData.save();

    res.status(200).json( projectInfoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to saveBuildingData' });
  }
};

export const getProjectInfoData = async (req, res) => {
  try {
    const { projectId } = req.params; 

    const projectInfoData = await ProjectsInformation.findOne({
      where: {
        ProjectID: projectId,
      },
    });

    res.status(200).json( projectInfoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to getBuildingData' });
  }
};

export const saveMaterialProvider = async (req, res) => {
  try {
    const { projectId } = req.params; 
    const{materialProvider}= req.body;

    const projectInfoData = await ProjectsInformation.findOne({
      where: {
        ProjectID: projectId,
      },
    });

    projectInfoData.MaterialProvider = materialProvider;
  
    await projectInfoData.save();

    res.status(200).json(projectInfoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to saveMaterialProvider' });
  }
};

export const getServiceProviderCatalogItems = async (req, res) => {
  try {
    const { serviceProviderId } = req.params; 

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

export const getServiceProviderCatalogItemDetails = async (req, res) => {
  try {
    const { catalogId } = req.params;

    const itemDetails = await Catalog.findByPk(catalogId);

    if (!itemDetails) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(itemDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch item details' });
  }
};

// task1
export const getPropertySurvey = async (req, res) => {
  try {

    const { taskId } = req.params; 

    const task = await Task.findByPk(taskId, {
        attributes: ['TaskID', 'TaskName', 'TaskStatus','SerProNotes'],
        include: [
          {
            model: Project,
            as: 'PropertyProject',
            attributes: ['ProjectID','ProjectName','BasinNumber','PlotNumber'],
          },
          {
            model: User,
            as: 'ServiceProvider',
            attributes: ['UserID','UserPicture', 'Username', 'Email', 'Rating'],
          },
          {
            model: PropertySurvey,
            as: 'PropertySurveys',
            attributes: ['PropertySize', 'SurveyDocument'],
          }
        ],
      });
      
      const reviewCount = await Review.count({
        where: { ServiceProviderID: task.ServiceProvider.UserID },
      });
  
      const PropertyTask = {
        TaskID: task.TaskID,
        TaskName: task.TaskName,
        TaskStatus: task.TaskStatus,
        ProjectName: task.PropertyProject.ProjectName,
        BasinNumber: task.PropertyProject.BasinNumber,
        PlotNumber: task.PropertyProject.PlotNumber,
        UserPicture: task.ServiceProvider.UserPicture,
        Username: task.ServiceProvider.Username,
        Email: task.ServiceProvider.Email,
        Rating: task.ServiceProvider.Rating,
        UserID: task.ServiceProvider.UserID,
        ReviewCount: reviewCount,
        PropertySize: task.PropertySurveys[0]?.PropertySize,
        SurveyDocument: task.PropertySurveys[0]?.SurveyDocument,
        Notes: task.SerProNotes
      };
  
      res.status(200).json(PropertyTask);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch PropertySurveys for the specified TaskID' });
  }
};

// task2
export const getPermitsRegulatoryInfo = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId, {
      attributes: ['TaskID', 'TaskName', 'TaskStatus','SerProNotes'],
      include: [
        {
          model: Project,
          as: 'PropertyProject',
          attributes: ['ProjectName'],
        },
        {
          model: User,
          as: 'ServiceProvider',
          attributes: ['UserID', 'UserPicture', 'Username', 'Email', 'Rating'],
        },
        {
          model: RegulatoryInformation,
          as: 'RegulatoryInfo',
          attributes: ['PermitsDocument'],
        },
       
      ],
    });
    
    const reviewCount = await Review.count({
      where: { ServiceProviderID: task.ServiceProvider.UserID },
    });

    const PermitsRegulatoryInfoTask = {
      TaskID: task.TaskID,
      TaskName: task.TaskName,
      TaskStatus: task.TaskStatus,
      ProjectName: task.PropertyProject.ProjectName,
      UserID: task.ServiceProvider.UserID,
      UserPicture: task.ServiceProvider.UserPicture,
      Username: task.ServiceProvider.Username,
      Email: task.ServiceProvider.Email,
      Rating: task.ServiceProvider.Rating,
      ReviewCount: reviewCount,
      PermitsDocument: task.RegulatoryInfo[0]?.PermitsDocument,
      Notes: task.SerProNotes
    };

    res.status(200).json(PermitsRegulatoryInfoTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Permits & Regulatory Information for the specified TaskID' });
  }
};

// task3
export const getSoilInvestigation = async (req, res) => {
  try {
    const { taskId } = req.params; 

    const task = await Task.findByPk(taskId, {
      attributes: ['TaskID', 'TaskName', 'TaskStatus','SerProNotes'],
      include: [
        {
          model: Project,
          as: 'PropertyProject',
          attributes: ['ProjectName'],
        },
        {
          model: User,
          as: 'ServiceProvider',
          attributes: ['UserID', 'UserPicture', 'Username', 'Email', 'Rating'],
        },
        {
          model: SoilInvestigation,
          as: 'SoilInves',
          attributes: ['SoilDocument'],
        },
       
      ],
    });
  
    const reviewCount = await Review.count({
      where: { ServiceProviderID: task.ServiceProvider.UserID },
    });

    const SoilInvestigationTask = {
      TaskID: task.TaskID,
      TaskName: task.TaskName,
      TaskStatus: task.TaskStatus,
      ProjectName: task.PropertyProject.ProjectName,
      UserID: task.ServiceProvider.UserID,
      UserPicture: task.ServiceProvider.UserPicture,
      Username: task.ServiceProvider.Username,
      Email: task.ServiceProvider.Email,
      Rating: task.ServiceProvider.Rating,
      ReviewCount: reviewCount,
      SoilDocument: task.SoilInves[0]?.SoilDocument,
      Notes: task.SerProNotes
    };

    res.status(200).json(SoilInvestigationTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Soil Investigation for the specified TaskID' });
  }
};

// task4
export const getDesignAndPlanning = async (req, res) => {
  try {
    const { taskId } = req.params; 

    const task = await Task.findByPk(taskId, {
      attributes: ['TaskID', 'TaskName', 'TaskStatus','SerProNotes'],
      include: [
        {
          model: Project,
          as: 'PropertyProject',
          attributes: ['ProjectName'],
        },
        {
          model: User,
          as: 'ServiceProvider',
          attributes: ['UserID', 'UserPicture', 'Username', 'Email', 'Rating'],
        },
        {
          model: DesignPlanning,
          as: 'DesignPlan',
          attributes: ['DesignDocument','FoundationDocument','PlumbingDocument','ElectricalDocument','InsulationAndHVACDocument'],
        },
       
      ],
    });
  
    const reviewCount = await Review.count({
      where: { ServiceProviderID: task.ServiceProvider.UserID },
    });

    const DesignPlanningTask = {
      TaskID: task.TaskID,
      TaskName: task.TaskName,
      TaskStatus: task.TaskStatus,
      ProjectName: task.PropertyProject.ProjectName,
      UserID: task.ServiceProvider.UserID,
      UserPicture: task.ServiceProvider.UserPicture,
      Username: task.ServiceProvider.Username,
      Email: task.ServiceProvider.Email,
      Rating: task.ServiceProvider.Rating,
      ReviewCount: reviewCount,
      DesignDocument: task.DesignPlan[0]?.DesignDocument,
      FoundationDocument: task.DesignPlan[0]?.FoundationDocument,
      PlumbingDocument: task.DesignPlan[0]?.PlumbingDocument,
      ElectricalDocument: task.DesignPlan[0]?.ElectricalDocument,
      InsulationAndHVACDocument: task.DesignPlan[0]?.InsulationAndHVACDocument,
      Notes: task.SerProNotes
    };

    res.status(200).json(DesignPlanningTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch design and planning for the specified TaskID' });
  }
};

// task5
export const getApprovals = async (req, res) => {
  try {
    const { taskId } = req.params; 

    const task = await Task.findByPk(taskId, {
      attributes: ['TaskID', 'TaskName', 'TaskStatus','SerProNotes'],
      include: [
        {
          model: Project,
          as: 'PropertyProject',
          attributes: ['ProjectName'],
        },
        {
          model: User,
          as: 'ServiceProvider',
          attributes: ['UserID', 'UserPicture', 'Username', 'Email', 'Rating'],
        },
        {
          model: Approval,
          as: 'approvalTask5',
          attributes: ['ApprovalsDocument'],
        },
       
      ],
    });
  
    const reviewCount = await Review.count({
      where: { ServiceProviderID: task.ServiceProvider.UserID },
    });

    const ApprovalTask = {
      TaskID: task.TaskID,
      TaskName: task.TaskName,
      TaskStatus: task.TaskStatus,
      ProjectName: task.PropertyProject.ProjectName,
      UserID: task.ServiceProvider.UserID,
      UserPicture: task.ServiceProvider.UserPicture,
      Username: task.ServiceProvider.Username,
      Email: task.ServiceProvider.Email,
      Rating: task.ServiceProvider.Rating,
      ReviewCount: reviewCount,
      ApprovalsDocument: task.approvalTask5[0]?.ApprovalsDocument,
      Notes: task.SerProNotes
    };
    res.status(200).json(ApprovalTask);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Obtaining Approval from Engineering Association & licensing Authority for the specified TaskID' });
  }
};

// task 6,7,8,9,10,11,12,13,14,15
export const getTask6 = async (req, res) => {
  try {
    const { taskId } = req.params; 

    const task = await Task.findByPk(taskId, {
      attributes: ['TaskID', 'TaskName', 'TaskStatus','SerProNotes'],
      include: [
        {
          model: Project,
          as: 'PropertyProject',
          attributes: ['ProjectName'],
        },
        {
          model: User,
          as: 'ServiceProvider',
          attributes: ['UserID', 'UserPicture', 'Username', 'Email', 'Rating'],
        },
      ],
    });
  
    const reviewCount = await Review.count({
      where: { ServiceProviderID: task.ServiceProvider.UserID },
    });

    const task6 = {
      TaskID: task.TaskID,
      TaskName: task.TaskName,
      TaskStatus: task.TaskStatus,
      ProjectName: task.PropertyProject.ProjectName,
      UserID: task.ServiceProvider.UserID,
      UserPicture: task.ServiceProvider.UserPicture,
      Username: task.ServiceProvider.Username,
      Email: task.ServiceProvider.Email,
      Rating: task.ServiceProvider.Rating,
      ReviewCount: reviewCount,
      Notes: task.SerProNotes
  
    };
    res.status(200).json(task6);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch task6 for the specified TaskID' });
  }
};


// save Doors in projectInfo table
export const saveProjectInfoDoors = async (req, res) => {
  try {
    const { projectId } = req.params; 
    const{bedroomDoor, bathroomDoor, livingroomDoor, guestroomDoor}= req.body;

    const projectInfoData = await ProjectsInformation.findOne({
      where: {
        ProjectID: projectId,
      },
    });

    projectInfoData.BedroomDoor = bedroomDoor || projectInfoData.BedroomDoor;
    projectInfoData.BathroomDoor = bathroomDoor || projectInfoData.BathroomDoor ;
    projectInfoData.LivingroomDoor = livingroomDoor || projectInfoData.LivingroomDoor;
    projectInfoData.GuestroomDoor = guestroomDoor || projectInfoData.GuestroomDoor;

    await projectInfoData.save();

    res.status(200).json( projectInfoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to saveProjectInfoDoors' });
  }
};

// save Tiles in projectInfo Table
export const saveProjectInfoTiles = async (req, res) => {
  try {
    const { projectId } = req.params; 
    const{ bathroomTile, houseTile}= req.body;

    const projectInfoData = await ProjectsInformation.findOne({
      where: {
        ProjectID: projectId,
      },
    });

    projectInfoData.BathroomTile = bathroomTile || projectInfoData.BathroomTile;
    projectInfoData.HouseTile = houseTile || projectInfoData.HouseTile ;

    await projectInfoData.save();

    res.status(200).json( projectInfoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to saveProjectInfoTiles' });
  }
};

// save Window Design in projectInfo Table
export const saveProjectInfoWindowDesign = async (req, res) => {
  try {
    const { projectId } = req.params; 
    const{windowDesign}= req.body;

    const projectInfoData = await ProjectsInformation.findOne({
      where: {
        ProjectID: projectId,
      },
    });

    projectInfoData.WindowDesign = windowDesign || projectInfoData.WindowDesign;

    await projectInfoData.save();

    res.status(200).json( projectInfoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to saveProjectInfoWindow' });
  }
};

// save Door Design in projectInfo Table
export const saveProjectInfoDoorDesign = async (req, res) => {
  try {
    const { projectId } = req.params; 
    const{doorDesign}= req.body;

    const projectInfoData = await ProjectsInformation.findOne({
      where: {
        ProjectID: projectId,
      },
    });

    projectInfoData.DoorDesign = doorDesign || projectInfoData.DoorDesign;

    await projectInfoData.save();

    res.status(200).json( projectInfoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to saveProjectInfoDoorDesign' });
  }
};


// save Paints in projectInfo table
export const saveProjectInfoPaints = async (req, res) => {
  try {
    const { projectId } = req.params; 
    const{bedroomPaint, bathroomPaint, livingroomPaint, guestroomPaint, kitchenPaint}= req.body;

    const projectInfoData = await ProjectsInformation.findOne({
      where: {
        ProjectID: projectId,
      },
    });

    projectInfoData.BedroomPaint = bedroomPaint || projectInfoData.BedroomPaint;
    projectInfoData.BathroomPaint = bathroomPaint || projectInfoData.BathroomPaint ;
    projectInfoData.LivingroomPaint = livingroomPaint || projectInfoData.LivingroomPaint;
    projectInfoData.GuestroomPaint = guestroomPaint || projectInfoData.GuestroomPaint;
    projectInfoData.KitchenPaint = kitchenPaint || projectInfoData.KitchenPaint;

    await projectInfoData.save();

    res.status(200).json( projectInfoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to saveProjectInfoPaints' });
  }
};
