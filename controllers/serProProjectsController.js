import { User, Project, Task }from '../models/associationserProGetProjects.js';
import Request from '../models/requestModel.js';

export const getProjects = async (req, res) => {
  try {
    const serviceProviderId = req.user; 

    const tasks = await Task.findAll({
      where: { ServiceProviderID: serviceProviderId },
      attributes: ['TaskID', 'TaskStatus','TaskNumber'],
      include: [
        {
          model: Project,
          as:'Project',
          attributes: ['ProjectID', 'ProjectName', 'HomeOwnerID'],
          include: [
            {
              model: User,
              as: 'HomeOwner',
              attributes: ['Username'],
            },
          ],
        },
      ],
    });

    const taskDetails = tasks.map((task) => ({
      TaskID: task.TaskID,
      TaskStatus: task.TaskStatus,
      TaskNumber: task.TaskNumber,
      ProjectName: task.Project.ProjectName,
      ProjectID: task.Project.ProjectID,
      HomeOwnerName: task.Project.HomeOwner.Username,
    }));

    res.status(200).json(taskDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve projects for the service provider' });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const project = await Project.findByPk(projectId);
    
    const user = await User.findByPk(project.HomeOwnerID);
    
    const task = await Task.findByPk(taskId);

    const request = await Request.findOne({
      where:{ TaskID: taskId, Status:'Pending',}});

          const projectWidgetData = {
          projectName: project.ProjectName,
          ownerUserName: user.Username ,
          projectCity: project.ProjectCity,
          projectLocation: project.ProjectLocation,
          taskName: task.TaskName,
          taskDescription: task.TaskDescription,
          taskDate: request.ReqTaskDate,
        };
        res.status(200).json(projectWidgetData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve project widget data' });
      }
};