import User from '../models/userModel.js';
import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';

User.hasMany(Project, { foreignKey: 'HomeOwnerID', as: 'Projects' });
Project.belongsTo(User, { foreignKey: 'HomeOwnerID', as: 'HomeOwner' });

Task.belongsTo(Project, { foreignKey: 'ProjectID', as: 'Project' });
Project.hasMany(Task, { foreignKey: 'ProjectID', as: 'Tasks' });

export { User, Project, Task };
