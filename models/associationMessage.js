import User from '../models/userModel.js';
import Message from '../models/messageModel.js'; 
import Task from '../models/taskModel.js'; 
import Project from '../models/projectModel.js';

User.hasMany(Message, { as: 'SentMessages', foreignKey: 'senderId' });
User.hasMany(Message, { as: 'ReceivedMessages', foreignKey: 'receiverId' });

Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });


User.hasMany(Project, { as: 'OwnedProjects', foreignKey: 'HomeOwnerID' });
Project.belongsTo(User, { as: 'HomeOwnerProject', foreignKey: 'HomeOwnerID' });

Task.belongsTo(Project, { foreignKey: 'ProjectID', as: 'ProjectTask' });
Project.hasMany(Task, { foreignKey: 'ProjectID', as: 'TasksProject' });

User.hasMany(Task, { as: 'AssignedTasks', foreignKey: 'ServiceProviderID' });
Task.belongsTo(User, { as: 'ServiceProviderAssigned', foreignKey: 'ServiceProviderID' });

export { User, Message, Project, Task };
