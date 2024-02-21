import User from '../models/userModel.js';
import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';

User.hasMany(Project, { foreignKey: 'HomeOwnerID', as: 'ProjectsAdimn' });
Project.belongsTo(User, { foreignKey: 'HomeOwnerID', as: 'HomeOwnerAdmin' });

Task.belongsTo(Project, { foreignKey: 'ProjectID', as: 'ProjectAdmin' });
Project.hasMany(Task, { foreignKey: 'ProjectID', as: 'TasksAdmin' });

Task.belongsTo(User, { foreignKey: 'ServiceProviderID', as: 'ServiceProviderAdmin' });
User.hasMany(Task, { foreignKey: 'ServiceProviderID', as: 'tasksAdmin' });


export { User, Project, Task };
