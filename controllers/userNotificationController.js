import Notification from '../models/notificationModel.js'

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user; 

    const notifications = await Notification.findAll({
      where: { 
        ReceiverId: userId,
      },
      order: [['CreatedAt', 'DESC']]
    });
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error get Notifications' });
  }
};

export const getNotificationCount = async (req, res) => {
  try {
    const userId = req.user;
    const notificationCount = await Notification.count({
      where: {
        ReceiverId: userId,
        IsRead: false
      }
    });

    res.status(200).json(notificationCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting notification count' });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user; 

    const updated = await Notification.update(
      { IsRead: true },
      { where: { ReceiverId: userId } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating notifications' });
  }
};