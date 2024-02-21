
// Import Models

import Project from '../models/projectModel.js'; // Import  Project model
import Task from '../models/taskModel.js'; // Import  Task model

// Function to calculate and update project progress
export const updateProjectProgress = async (projectId) => {
    try {
      // Find all tasks for the project
      const tasks = await Task.findAll({
        where: { ProjectID: projectId },
      });
  
      if (!tasks || tasks.length === 0) {
        console.error('No tasks found for the project');
        return;
      }
  
      // Calculate the number of completed tasks
      const completedTasks = tasks.filter((task) => task.TaskStatus === 'Completed');
      console.log(completedTasks.length);
      // Calculate the project progress
      const progress = ((completedTasks.length / tasks.length) * 100).toFixed(2);
  
      // Update the project progress in the Projects table
      await Project.update(
        { ProjectProgress: progress },
        { where: { ProjectID: projectId } }
      );
  
      console.log(`Project progress updated for project ${projectId}: ${progress}%`);
    } catch (error) {
      console.error('Failed to update project progress:', error);
    }
  };