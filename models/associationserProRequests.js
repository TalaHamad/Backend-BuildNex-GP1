import Task from './taskModel.js';
import Project from './projectModel.js';
import User from './userModel.js';
import Request from './requestModel.js';

Task.belongsTo(Project, { foreignKey: 'ProjectID', as: 'ProjectRequest' });
Request.belongsTo(User, { foreignKey: 'HomeownerID', as: 'HomeOwner' });
Request.belongsTo(User, { foreignKey: 'ServiceProviderID', as: 'ServiceProvider' });
Request.belongsTo(Task, { foreignKey: 'TaskID', as: 'Task' });

export { Task, Project, User, Request };