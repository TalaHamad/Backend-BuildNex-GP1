import { Task, Project, User, Request} from '../models/associationserProRequests.js';
import Notification from '../models/notificationModel.js';

export const getAllRequests = async (req, res) => {
  try {
   
    const serviceProviderId = req.user;

    const requests = await Request.findAll({
    where: {
      ServiceProviderID: serviceProviderId,
      Status: 'Pending',
    },
    include: [
      {
        model: Task,
        as: 'Task',
        attributes: ['TaskID','TaskNumber'], 
        include: [
          {
            model: Project,
            as: 'ProjectRequest',
            attributes: ['ProjectID', 'ProjectName'], 
          },
        ],
      },
      {
        model: User,
        as: 'HomeOwner',
        attributes: ['UserID', 'Username'], 
      },
    ],
  });

  const responseData = requests.map(request => {
 
    const projectName = request.Task.ProjectRequest.ProjectName;
    const homeOwnerName = request.HomeOwner.Username;
    const projectId = request.Task.ProjectRequest.ProjectID;
    const homeOwnerId = request.HomeOwner.UserID;
    const requestId = request.RequestID;
    const taskId =  request.TaskID;
    const taskNumber =  request.Task.TaskNumber;

    return {
      projectName,
      homeOwnerName,
      projectId,
      homeOwnerId,
      requestId,
      taskId,
      taskNumber,
    };
  });
  console.log(responseData);

  res.status(200).json(responseData);

  } catch (error) {
    console.error('Error in getAllRequests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

export const acceptRequest = async (req, res) => {
  try {

    const serviceProviderId = req.user;

    const { requestId } = req.params; 

    const request = await Request.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.Status !== 'Pending') {
      return res.status(404).json('Request is not in pending status');
    }

    request.Status = 'Accepted';
    await request.save();

    const task = await Task.findByPk(request.TaskID);
    if (task) {
      task.ServiceProviderID = serviceProviderId;
      task.TaskDate= request.reqTaskDate;
      task.TaskStatus='In Progress';
      await task.save();
      if( task.TaskNumber == 1){
        const project = await  Project.findByPk (task.ProjectID);
        project.ProjectStatus='In Progress';
        await project.save();
      }
      if( task.TaskNumber == 10){
        const project = await  Project.findByPk (task.ProjectID);
        if(project.ProjectEntryPoint ==='From Middle'){
          project.ProjectStatus='In Progress';
        await project.save();
        }
      }
    }

    const serviceprovider =  await User.findByPk(serviceProviderId);
    const homeownerId = request.HomeownerID; 
    const notificationMessage = `Your request for Task ${task.TaskName} has been accepted by the service provider ${serviceprovider.Username}.`;
    const type = 'Accepted Request';

    await Notification.create({
      ReceiverId: homeownerId,
      SenderId: serviceProviderId,
      SenderName:serviceprovider.Username,
      SenderPic:serviceprovider.UserPicture,
      Type: type,
      Content: notificationMessage,
      IsRead: false
    });

    res.status(200).json('Request accepted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to accept request');
  }
};

export const declineRequest = async (req, res) => {
  try {
    const serviceProviderId = req.user;
    const { requestId } = req.params;
    const { declineReason } = req.body;

    const request = await Request.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.Status !== 'Pending') {
      return res.status(400).json({ error: 'Request is not in pending status' });
    }

    request.Status = 'Declined';
    request.DeclineReason = declineReason;
    await request.save();

    const task = await Task.findByPk(request.TaskID);
    const serviceprovider =  await User.findByPk(serviceProviderId);
    const homeownerId = request.HomeownerID;
    const notificationMessage = `Your request for Task ${task.TaskName} has been declined by the service provider ${serviceprovider.Username}. Reason: ${declineReason}`;
    const type = 'Declined Request';

    await Notification.create({
    ReceiverId: homeownerId,
    SenderId: serviceProviderId,
    SenderName:serviceprovider.Username,
    SenderPic:serviceprovider.UserPicture,
    Type: type,
    Content: notificationMessage,
    IsRead: false
    });
    
    res.status(200).json('Request declined successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to decline request' );
  }
};
