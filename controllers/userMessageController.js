import {User , Message, Project, Task } from '../models/associationMessage.js';
import { Op, Sequelize } from 'sequelize';
import {getHumanReadableTimeDifference} from '../utils/humanReadableTimeDifferenceUtils.js'
import Notification from '../models/notificationModel.js'

import { encrypt, decrypt } from '../utils/encryptionMessageUtils.js'; 

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user; 

    const { receiverId } = req.params;
    const { content } = req.body;

    const encryptedContent = encrypt(content);

    const message = await Message.create({
      senderId,
      receiverId,
      content: encryptedContent,
      isRead: false,
    });

    const user = await User.findByPk(senderId);

    const notificationMessage = `You have received a new message from ${user.Username}`;
    const type = 'New Message';

    await Notification.create({
      ReceiverId: receiverId,
      SenderId: senderId,
      SenderName:user.Username,
      SenderPic:user.UserPicture,
      Type: type,
      Content: notificationMessage,
      isRead: false
    });

    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending message' });
  }
};

export const getInbox = async (req, res) => {
  try {
    const userId = req.user; 
    const sequelize = User.sequelize; 

    const subQuery = await sequelize.query(
      `
      SELECT MAX(messageId) AS messageId
      FROM Messages
      WHERE senderId = :userId OR receiverId = :userId
      GROUP BY CASE
        WHEN senderId = :userId THEN receiverId
        WHEN receiverId = :userId THEN senderId
      END
      `,
      {
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const messageIds = subQuery.map((row) => row.messageId);

    const messages = await Message.findAll({
      where: {
        messageId: {
          [Op.in]: messageIds,
        },
      },
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['UserID', 'Username', 'Email','UserPicture', 'lastActive'],
        },
        {
          model: User,
          as: 'Receiver',
          attributes: ['UserID', 'Username', 'Email','UserPicture', 'lastActive'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const conversations = {};
    messages.forEach((message) => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      const decryptedLastMessage = decrypt(message.content);
      const partner = message.senderId === userId ? message.Receiver : message.Sender;


      if (!conversations[partnerId]) {
        const currentTime = new Date();
        const timeDifference = (currentTime - partner.lastActive) / (1000 * 60);


         conversations[partnerId] = {
          UserID: partner.UserID,
          Username: partner.Username,
          Email: partner.Email,
          UserPicture: partner.UserPicture,
          lastMessage: decryptedLastMessage,
          lastMessageHowlong: getHumanReadableTimeDifference(message.createdAt),
          OnlineStatus: timeDifference <= 10 ? 'true' : 'false',
          LastActive: timeDifference <= 10 ? 'a moment ago' : getHumanReadableTimeDifference(partner.lastActive),
        };
      }
    });


   const inbox = Object.values(conversations);

   res.status(200).json(inbox);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Error retrieving inbox' });
 }
};

export const getConversation = async (req, res) => {
    try {
      const userId = req.user;
      const { receiverId } = req.params; 
  
      const conversation = await Message.findAll({
        where: {
          [Op.or]: [
            { [Op.and]: [{ senderId: userId }, { receiverId }] },
            { [Op.and]: [{ senderId: receiverId }, { receiverId: userId }] }
          ]
        },
        attributes: ['messageId', 'senderId', 'receiverId', 'content', 'createdAt'],
        order: [['createdAt', 'ASC']]
      });

      const unreadMessageIds = conversation
      .filter(Message => Message.receiverId === userId && !Message.IsRead)
      .map(Message => Message.messageId);

      if (unreadMessageIds.length > 0) {
        await Message.update({ IsRead: true }, {
          where: {
            messageId: {
              [Op.in]: unreadMessageIds
            }
          }
        });
      }
  
      const formattedConversation = conversation.map(message => {
        return {
          messageId: message.id,
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: decrypt(message.content),
          howLong: getHumanReadableTimeDifference(message.createdAt)
        };
      });
  
      res.status(200).json(formattedConversation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving conversation' });
    }
};

export const getServiceProvidersForHomeowner = async (req, res) => {
  try {
    const homeownerId = req.user; 

    const projects = await Project.findAll({
      where: { HomeOwnerID: homeownerId },
      include: [{
        model: Task,
        as: 'TasksProject',
        include: [{
          model: User,
          as: 'ServiceProviderAssigned',
          attributes: ['UserID', 'Username', 'Email', 'UserPicture', 'lastActive'],
        }]
      }]
    });

    let serviceProviders = {};

    projects.forEach(project => {
      project.TasksProject.forEach(task => {
        if (task.ServiceProviderAssigned) {
          const serviceProvider = task.ServiceProviderAssigned;
          const currentTime = new Date();
          const timeDifference = (currentTime - new Date(serviceProvider.lastActive)) / (1000 * 60);

          if (!serviceProviders[serviceProvider.UserID]) {
            serviceProviders[serviceProvider.UserID] = {
              UserID: serviceProvider.UserID,
              Username: serviceProvider.Username,
              Email: serviceProvider.Email,
              UserPicture: serviceProvider.UserPicture,
              OnlineStatus: timeDifference <= 10 ? 'true' : 'false',
              LastActive: timeDifference <= 10 ? 'a moment ago' : getHumanReadableTimeDifference(serviceProvider.lastActive),
            };
          }
        }
      });
    });

    let count = 0;

    for (const key in serviceProviders) {
      const serviceProvider = serviceProviders[key];
    
      const lastMessageInConversation = await Message.findOne({
        where: {
          [Op.or]: [
            { senderId: homeownerId, receiverId: serviceProvider.UserID },
            { senderId: serviceProvider.UserID, receiverId: homeownerId }
          ]
        },
        order: [['createdAt', 'DESC']],
        attributes: ['senderId', 'IsRead']
      });
    
      if (lastMessageInConversation) {
        if (lastMessageInConversation.senderId === homeownerId) {
          serviceProvider.conversationStatus = 'read';
        } else if (lastMessageInConversation.senderId === serviceProvider.UserID) {
          if (!lastMessageInConversation.IsRead) {
            count++;
            serviceProvider.conversationStatus = 'unread';
          } else {
            serviceProvider.conversationStatus = 'read';
          }
        }
      } else {
        serviceProvider.conversationStatus = 'Default';
      }
    }
    
    const uniqueServiceProviders = Object.values(serviceProviders);
    res.status(200).json({ uniqueServiceProviders, unreadConversationsCount: count });
    
  } catch (error) {
    console.error('Error fetching service providers:', error);
    res.status(500).json({ error: 'Error fetching service providers' });
  }
};

export const getHomeOwnersForServiceProvider = async (req, res) => {
  try {
    const serviceProviderId = req.user;

    const tasks = await Task.findAll({
      where: { ServiceProviderID: serviceProviderId },
      include: [{
        model: Project,
        as: 'ProjectTask',
        include: [{
          model: User,
          as: 'HomeOwnerProject',
          attributes: ['UserID', 'Username', 'Email', 'UserPicture', 'lastActive'],
        }]
      }]
    });

    let homeowners = {};

    tasks.forEach(task => {
      if (task.ProjectTask && task.ProjectTask.HomeOwnerProject) {
        const homeowner = task.ProjectTask.HomeOwnerProject;
        const currentTime = new Date();
        const timeDifference = (currentTime - new Date(homeowner.lastActive)) / (1000 * 60);

        if (!homeowners[homeowner.UserID]) {
          homeowners[homeowner.UserID] = {
            UserID: homeowner.UserID,
            Username: homeowner.Username,
            Email: homeowner.Email,
            UserPicture: homeowner.UserPicture,
            OnlineStatus: timeDifference <= 10 ? 'true' : 'false',
            LastActive: timeDifference <= 10 ? 'a moment ago' : getHumanReadableTimeDifference(homeowner.lastActive),
          };
        }
      }
    });

    let count = 0;

    for (const key in homeowners) {
      const homeowner = homeowners[key];
    
      const lastMessageInConversation = await Message.findOne({
        where: {
          [Op.or]: [
            { senderId: serviceProviderId, receiverId: homeowner.UserID },
            { senderId: homeowner.UserID, receiverId: serviceProviderId }
          ]
        },
        order: [['createdAt', 'DESC']],
        attributes: ['senderId', 'IsRead']
      });
    
      if (lastMessageInConversation) {
        if (lastMessageInConversation.senderId === serviceProviderId) {
          homeowner.conversationStatus = 'read';
        } else if (lastMessageInConversation.senderId === homeowner.UserID) {
          if (!lastMessageInConversation.IsRead) {
            count++;
            homeowner.conversationStatus = 'unread';
          } else {
            homeowner.conversationStatus = 'read';
          }
        }
      } else {
        homeowner.conversationStatus = 'Default';
      }
    }
    
    const uniqueHomeowners = Object.values(homeowners);
    res.status(200).json({ uniqueHomeowners, unreadConversationsCount: count });

  } catch (error) {
    console.error('Error fetching homeowners:', error);
    res.status(500).json({ error: 'Error fetching homeowners' });
  }
};