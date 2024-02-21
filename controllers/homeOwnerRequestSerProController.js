import Request from '../models/requestModel.js';
import Notification from '../models/notificationModel.js'; 
import User from '../models/userModel.js'; 

export const requestServiceProvider = async (req, res) => {
  try {
 
    const homeOwnerId = req.user; 
    const { serviceProviderId, taskId } = req.params;;
    const {reqTaskDate}	= req.body;

    const existingRequest = await Request.findOne({
      where: {
        TaskID: taskId,
      },
    });
  
    if (existingRequest) {
       if (existingRequest.Status != 'Declined') {
        res.status(400).json('Request for the specified task already sent');}
    }

    else{
        // Create a new request
    const newRequest = await Request.create({
      Status: 'Pending',
      HomeownerID: homeOwnerId,
      ServiceProviderID: serviceProviderId,
      TaskID: taskId,
      ReqTaskDate:reqTaskDate
    });

    const user = await User.findByPk(homeOwnerId);

    if (newRequest) {
      const notificationMessage = `You have received a new task request from Homeowner ${user.Username}`;
      const type = 'Task Request';

      await Notification.create({
        ReceiverId: serviceProviderId,
        SenderId: homeOwnerId,
        SenderName:user.Username,
        SenderPic:user.UserPicture,
        Type: type,
        Content: notificationMessage,
        IsRead: false
      });
    }

    res.status(200).json('Request submitted successfully');

    }

  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
};

export const checkrequestServiceProvider = async (req, res) => {
  try {
 
    const homeOwnerId = req.user; 
    const { serviceProviderId, taskId } = req.params;;

    const existingRequest = await Request.findOne({
      where: {
        TaskID: taskId,
      },
    });
  
    if (existingRequest) {
       if (existingRequest.Status != 'Declined') {
        res.status(400).json('Request for the specified task already sent');}
    }

    else{
    res.status(200).json('You can send a Request');
    }

  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
};