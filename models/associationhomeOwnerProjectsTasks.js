import sequelize from '../db.js';
import User from '../models/userModel.js';
import Task from '../models/taskModel.js';

Task.belongsTo(User, { foreignKey: 'ServiceProviderID', as: 'ServiceProviderName' });
User.hasMany(Task, { foreignKey: 'ServiceProviderID', as: 'tasks' });

export { sequelize, User, Task };