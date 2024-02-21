import { sequelize, User, Task } from '../models/associationhomeOwnerProjectsTasks.js';
import Project from '../models/projectModel.js';


export const getProjectTasks = async (req, res) => {
    try {

        const { projectId } = req.params;
    
        const tasks = await Task.findAll({
          where: { ProjectID: projectId },
          attributes: ['TaskID', 'TaskName', 'TaskStatus','TaskDescription' ,'TaskNumber','ServiceProviderID'],
          include: [{
            model: User,
            attributes: ['Username'],
            where: {
              UserID: sequelize.col('Task.ServiceProviderID'),
            },
            as: 'ServiceProviderName',
            required: false,
          }],
        });

       const  projectTasks = tasks.map(task => {
          return {
            TaskID: task.TaskID,
            TaskName: task.TaskName,
            TaskStatus: task.TaskStatus,
            TaskDescription: task.TaskDescription,
            TaskNumber:task.TaskNumber,
            ServiceProviderID: task.ServiceProviderID,
            ServiceProviderName: task.ServiceProviderName ? task.ServiceProviderName.Username : null
          };
        });
    
        res.status(200).json(projectTasks);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve project tasks' });
      }
};

export const getProjectTaskInformation = async (req, res) => {
 try {
      
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve task information' });
  }
};

export const getMaterialProviders = async (req, res) => {
  try {
    const { serviceType } = req.body;

    const materialProviders = await User.findAll({
      where: {
        UserType: 'MaterialProvider',
        ServiceType: serviceType,
      },
    });

    res.status(200).json(materialProviders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve material providers' });
  }

};


export const markTask16asDone = async (req, res) => {
  try {
    const { taskId, projectId } = req.params;

    const task = await Task.findByPk(taskId);
    task.TaskStatus = 'Completed';
    await task.save(); 

    const project = await Project.findByPk(projectId);
    project.ProjectStatus = 'Completed';
    await project.save(); 

    res.status(200).json(task);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve markTask16asDone' });
  }

};