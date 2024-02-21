import { Task, User, Project, PropertySurvey,RegulatoryInformation,SoilInvestigation ,
  DesignPlanning, Approval } from '../models/associationhomeOwnerGetPropertySurveys.js'; 
import Review from '../models/reviewModel.js';
import ProjectsInformation from '../models/projectInfoModel.js';
import Notification from '../models/notificationModel.js'

// task1
export const getTask1Data = async (req, res) => {
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
    
        const task1Data = {
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
    
        res.status(200).json(task1Data);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch task1Data for the specified TaskID' });
    }
};

export const setTask1Data = async (req, res) => {
    try {
      const serviceProviderid = req.user; 

      const { taskId, projectId } = req.params;
      const { propertySize, surveyDocument, serProNotes, status } = req.body;
  
      let propertySurvey = await PropertySurvey.findOne({ where: { TaskID: taskId } });
  
      if (propertySurvey) { // if the task exists? update fields 
        propertySurvey.PropertySize = propertySize || propertySurvey.PropertySize;
        propertySurvey.SurveyDocument = surveyDocument || propertySurvey.SurveyDocument;
        await propertySurvey.save();
  
      } else {
        propertySurvey = await PropertySurvey.create({
          PropertySize: propertySize,
          SurveyDocument: surveyDocument,
          TaskID: taskId,
        });
        const project = await Project.findByPk(projectId);
        project.ProjectStatus = 'In Progress';
        await project.save(); 
      }

      const task = await Task.findByPk(taskId);
      task.SerProNotes = serProNotes||task.SerProNotes;
      
      if(status === 'Submit')
      {
        task.TaskStatus= 'Completed';
        const project = await Project.findByPk(projectId);
        const homeownerId = project.HomeOwnerID;
        const serviceprovider =  await User.findByPk(serviceProviderid);
        const type = 'Task Completed';

        await Notification.create({
          ReceiverId: homeownerId,
          SenderId:serviceProviderid,
          SenderName:serviceprovider.Username,
          SenderPic:serviceprovider.UserPicture,
          Type:type,
          Content: `Task ${task.TaskName} has been completed by the service provider ${serviceprovider.Username}.`,
          IsRead: false
        });
      
      }
      else{}

      await task.save(); 
  
      const projectInfo = await ProjectsInformation.findOne({
        where: { ProjectID: projectId },
      });
      projectInfo.SurveyDocument= surveyDocument||projectInfo.SurveyDocument;
      await projectInfo.save(); 
     
      res.status(200).json('Data updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update data in multiple tables' });
    }
};

//task2
export const getTask2Data = async (req, res) => {
  try {
    const { taskId, projectId } = req.params;

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

    const projectInfo = await ProjectsInformation.findOne({
      where: { ProjectID: projectId },
    });


    const task2Data = {
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
      SurveyDocument :projectInfo.SurveyDocument,
      PermitsDocument: task.RegulatoryInfo[0]?.PermitsDocument,
      Notes: task.SerProNotes
    };

    res.status(200).json(task2Data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Permits & Regulatory Information for the specified TaskID' });
  }
};

export const setTask2Data = async (req, res) => {
  try {
    const serviceProviderid = req.user; 
    const { taskId, projectId } = req.params;
    const { permitsDocument, serProNotes , status } = req.body;
    
    let regulatoryInformation = await RegulatoryInformation.findOne({ where: { TaskID: taskId } });

    if (regulatoryInformation) { // if the task exists? update fields
      regulatoryInformation.PermitsDocument = permitsDocument || regulatoryInformation.PermitsDocument;
      await regulatoryInformation.save();
    } 
    else {
      regulatoryInformation = await RegulatoryInformation.create({
          PermitsDocument: permitsDocument,
          TaskID: taskId,
      });
    }

    const task = await Task.findByPk(taskId);
    
    task.SerProNotes = serProNotes||task.SerProNotes;
    if(status === 'Submit')
    {
      task.TaskStatus= 'Completed';

      const project = await Project.findByPk(projectId);
      const homeownerId = project.HomeOwnerID;
      const serviceprovider =  await User.findByPk(serviceProviderid);
      const type = 'Task Completed';

      await Notification.create({
        ReceiverId: homeownerId,
        SenderId:serviceProviderid,
        SenderName:serviceprovider.Username,
        SenderPic:serviceprovider.UserPicture,
        Type:type,
        Content: `Task ${task.TaskName} has been completed by the service provider ${serviceprovider.Username}.`,
        IsRead: false
      });
    }
    else{}

    await task.save(); 

    const projectInfo = await ProjectsInformation.findOne({
      where: { ProjectID: projectId },
    });
    projectInfo.PermitsDocument= permitsDocument||projectInfo.PermitsDocument;
    await projectInfo.save(); 
   
    res.status(200).json('Data updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update data in multiple tables' });
  }

};

// task3
export const getTask3Data = async (req, res) => {
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

export const setTask3Data = async (req, res) => {
try {
  const serviceProviderid = req.user; 
  const { taskId, projectId } = req.params;
  const { soilDocument, serProNotes , status } = req.body;

  let soilInvestigation = await SoilInvestigation.findOne({ where: { TaskID: taskId } });
  if(soilInvestigation){
    soilInvestigation.SoilDocument = soilDocument || soilInvestigation.SoilDocument;
    await soilInvestigation.save() ;
  }
  else{
    soilInvestigation = await SoilInvestigation.create({
      SoilDocument: soilDocument,
      TaskID: taskId,
    });
  }

  const task = await Task.findByPk(taskId);

  task.SerProNotes = serProNotes||task.SerProNotes;
  if(status == 'Submit'){
    task.TaskStatus= 'Completed';

    const project = await Project.findByPk(projectId);
    const homeownerId = project.HomeOwnerID;
    const serviceprovider =  await User.findByPk(serviceProviderid);
    const type = 'Task Completed';

    await Notification.create({
      ReceiverId: homeownerId,
      SenderId:serviceProviderid,
      SenderName:serviceprovider.Username,
      SenderPic:serviceprovider.UserPicture,
      Type:type,
      Content: `Task ${task.TaskName} has been completed by the service provider ${serviceprovider.Username}.`,
      IsRead: false
    });
  }

  await task.save();

  const projectInfo = await ProjectsInformation.findOne({
    where: { ProjectID: projectId },
  });
  projectInfo.SoilDocument= soilDocument||projectInfo.SoilDocument;
  await projectInfo.save(); 

  res.status(200).json('Data updated successfully');
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update data in multiple tables' });
}
};

// task4
export const getTask4Data = async (req, res) => {
try {
  
  const { taskId, projectId } = req.params;

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

  const projectInfo = await ProjectsInformation.findOne({
    where: { ProjectID: projectId },
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

    BuildingArea:projectInfo.BuildingArea,
    NumberOfRooms:projectInfo.NumberOfRooms,
    NumberOfFloors:projectInfo.NumberOfFloors,

    PermitsDocument:projectInfo.PermitsDocument,
    SoilDocument:projectInfo.SoilDocument,

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

export const setTask4Data = async (req, res) => {
try {
  const serviceProviderid = req.user; 

  const { taskId, projectId } = req.params;
  const { designDocument, foundationDocument, plumbingDocument, electricalDocument, insulationAndHVACDocument, serProNotes , status } = req.body;

  let designPlanning = await DesignPlanning.findOne({ where: { TaskID: taskId } });
  if(designPlanning){
    designPlanning.DesignDocument = designDocument || designPlanning.DesignDocument ;
    designPlanning.FoundationDocument = foundationDocument || designPlanning.FoundationDocument ;
    designPlanning.PlumbingDocument = plumbingDocument || designPlanning.PlumbingDocument ;
    designPlanning.ElectricalDocument = electricalDocument || designPlanning.ElectricalDocument ;
    designPlanning.InsulationAndHVACDocument = insulationAndHVACDocument || designPlanning.InsulationAndHVACDocument ;
    await designPlanning.save();
  }
  else{
    designPlanning = await DesignPlanning.create({
    DesignDocument: designDocument,
    FoundationDocument: foundationDocument,
    PlumbingDocument: plumbingDocument,
    ElectricalDocument: electricalDocument,
    InsulationAndHVACDocument: insulationAndHVACDocument,
    TaskID: taskId,
    });
  }

  const task = await Task.findByPk(taskId);
  
  task.SerProNotes = serProNotes||task.SerProNotes;
  if(status == 'Submit'){
    task.TaskStatus= 'Completed';

    const project = await Project.findByPk(projectId);
    const homeownerId = project.HomeOwnerID;
    const serviceprovider =  await User.findByPk(serviceProviderid);
    const type = 'Task Completed';

    await Notification.create({
      ReceiverId: homeownerId,
      SenderId:serviceProviderid,
      SenderName:serviceprovider.Username,
      SenderPic:serviceprovider.UserPicture,
      Type:type,
      Content: `Task ${task.TaskName} has been completed by the service provider ${serviceprovider.Username}.`,
      IsRead: false
    });

  }

  await task.save(); 

  const projectInfo = await ProjectsInformation.findOne({
    where: { ProjectID: projectId },
  });
  projectInfo.DesignDocument= designDocument||projectInfo.DesignDocument;
  projectInfo.FoundationDocument= foundationDocument||projectInfo.FoundationDocument;
  projectInfo.PlumbingDocument= plumbingDocument||projectInfo.PlumbingDocument;
  projectInfo.ElectricalDocument= electricalDocument||projectInfo.ElectricalDocument;
  projectInfo.InsulationAndHVACDocument= insulationAndHVACDocument||projectInfo.InsulationAndHVACDocument;
  await projectInfo.save(); 

  res.status(200).json('Data updated successfully');
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update data in multiple tables' });
}
};

//task5
export const getTask5Data = async (req, res) => {
try {
  
  const { taskId, projectId } = req.params;
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

  const projectInfo = await ProjectsInformation.findOne({
    where: { ProjectID: projectId },
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

    DesignDocument:projectInfo.DesignDocument,

    ApprovalsDocument: task.approvalTask5[0]?.ApprovalsDocument,
    Notes: task.SerProNotes
  };
  res.status(200).json(ApprovalTask);

} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to fetch Obtaining Approval from Engineering Association & licensing Authority for the specified TaskID' });
}
};

export const setTask5Data = async (req, res) => {
try {
  const serviceProviderid = req.user; 

  const { taskId, projectId } = req.params;
  const { approvalsDocument, serProNotes , status } = req.body;
  
  let approval = await Approval.findOne({ where: { TaskID: taskId } });
  if(approval){
    approval.ApprovalsDocument = approvalsDocument || approval.ApprovalsDocument ;
    await approval.save();
  }
  else{
    approval = await Approval.create({
      ApprovalsDocument: approvalsDocument,
      TaskID: taskId,
    });
  }

  const task = await Task.findByPk(taskId);
  
  task.SerProNotes = serProNotes||task.SerProNotes;
  if(status == 'Submit'){
    task.TaskStatus= 'Completed';

    const project = await Project.findByPk(projectId);
    const homeownerId = project.HomeOwnerID;
    const serviceprovider =  await User.findByPk(serviceProviderid);
    const type = 'Task Completed';

    await Notification.create({
      ReceiverId: homeownerId,
      SenderId:serviceProviderid,
      SenderName:serviceprovider.Username,
      SenderPic:serviceprovider.UserPicture,
      Type:type,
      Content: `Task ${task.TaskName} has been completed by the service provider ${serviceprovider.Username}.`,
      IsRead: false
    });
  }
  await task.save(); 

  const projectInfo = await ProjectsInformation.findOne({
    where: { ProjectID: projectId },
  });
  projectInfo.ApprovalsDocument= approvalsDocument||projectInfo.ApprovalsDocument;
  await projectInfo.save(); 

  res.status(200).json('Data updated successfully');
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update data in multiple tables' });
}
};

// for task 6 and above
export const getTask6Data = async (req, res) => {
try {
  const { taskId, projectId } = req.params;

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

  
  const projectInfo = await ProjectsInformation.findOne({
    where: { ProjectID: projectId },
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

    MaterialProvider: projectInfo.MaterialProvider,

    FoundationDocument:projectInfo.FoundationDocument,
    PlumbingDocument:projectInfo.PlumbingDocument,
    ElectricalDocument:projectInfo.ElectricalDocument,
    InsulationAndHVACDocument:projectInfo.InsulationAndHVACDocument,

    BedroomDoor:projectInfo.BedroomDoor,
    BathroomDoor:projectInfo.BathroomDoor,
    LivingroomDoor:projectInfo.LivingroomDoor,
    GuestroomDoor:projectInfo.GuestroomDoor,

    BathroomTile:projectInfo.BathroomTile,
    HouseTile:projectInfo.HouseTile,

    WindowDesign:projectInfo.WindowDesign,

    DoorDesign:projectInfo.DoorDesign,

    BedroomPaint:projectInfo.BedroomPaint,
    BathroomPaint:projectInfo.BathroomPaint,
    LivingroomPaint:projectInfo.LivingroomPaint,
    GuestroomPaint:projectInfo.GuestroomPaint,
    KitchenPaint:projectInfo.KitchenPaint,

    Notes: task.SerProNotes
  };
  res.status(200).json(task6);

} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to fetch task6Data for the specified TaskID' });
}
};

export const setTask6Data = async (req, res) => {
try {
  const serviceProviderid = req.user; 

  const { taskId, projectId } = req.params;
  const {serProNotes , status } = req.body;

  const task = await Task.findByPk(taskId);
  
  task.SerProNotes = serProNotes||task.SerProNotes;
  if(status == 'Submit'){
    task.TaskStatus= 'Completed';

    const project = await Project.findByPk(projectId);
    const homeownerId = project.HomeOwnerID;
    const serviceprovider =  await User.findByPk(serviceProviderid);
    const type = 'Task Completed';

    await Notification.create({
      ReceiverId: homeownerId,
      SenderId:serviceProviderid,
      SenderName:serviceprovider.Username,
      SenderPic:serviceprovider.UserPicture,
      Type:type,
      Content: `Task ${task.TaskName} has been completed by the service provider ${serviceprovider.Username}.`,
      IsRead: false
    });
    // if(task.TaskNumber==15)
    // {
    //   const project = await Project.findByPk(projectId);
    //   project.ProjectStatus = 'Completed';
    //   await project.save(); 
    // }
  }
  await task.save(); 

  res.status(200).json('Data updated successfully');
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to update data in multiple tables' });
}
};


