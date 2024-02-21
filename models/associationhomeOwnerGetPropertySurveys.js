import Task from '../models/taskModel.js';
import PropertySurvey from '../models/propertyModel.js';
import User from '../models/userModel.js';
import Project from '../models/projectModel.js';
import RegulatoryInformation from '../models/regInfoModel.js';
import SoilInvestigation from '../models/soilModel.js';
import DesignPlanning  from '../models/designPlanningModel.js';
import Approval  from '../models/approvalModel.js';

Task.hasMany(PropertySurvey, { foreignKey: 'TaskID', as: 'PropertySurveys' });
PropertySurvey.belongsTo(Task, { foreignKey: 'TaskID', as: 'Task' });

Task.belongsTo(User, { foreignKey: 'ServiceProviderID', as: 'ServiceProvider' });
User.hasMany(Task, { foreignKey: 'ServiceProviderID', as: 'ServiceTasks' });

Task.belongsTo(Project, { foreignKey: 'ProjectID', as: 'PropertyProject' });
Project.hasMany(Task, { foreignKey: 'ProjectID', as: 'PropertyTask' });

Task.hasMany(RegulatoryInformation, { foreignKey: 'TaskID', as: 'RegulatoryInfo' });
RegulatoryInformation.belongsTo(Task, { foreignKey: 'TaskID', as: 'Task' });

Task.hasMany(SoilInvestigation, { foreignKey: 'TaskID', as: 'SoilInves' });
SoilInvestigation.belongsTo(Task, { foreignKey: 'TaskID', as: 'Task' });

Task.hasMany(DesignPlanning, { foreignKey: 'TaskID', as: 'DesignPlan' });
DesignPlanning.belongsTo(Task, { foreignKey: 'TaskID', as: 'Task' });

Task.hasMany(Approval, { foreignKey: 'TaskID', as: 'approvalTask5' });
Approval.belongsTo(Task, { foreignKey: 'TaskID', as: 'Task' });

export { Task, User, Project , PropertySurvey, RegulatoryInformation, SoilInvestigation, DesignPlanning, Approval};