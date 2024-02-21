import {  User, Project,Task } from '../models/associationAdmin.js';
import { Sequelize, Op } from 'sequelize';

export const getProjectCountByCity = async (req, res)  => {
    try {
      const projectCount = await Project.findAll({
        attributes: ['ProjectCity', [Sequelize.fn('COUNT', Sequelize.col('ProjectCity')), 'projectCount']],
        group: 'ProjectCity'
      });
      res.status(200).json(projectCount);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};

  // Get number of projects by completion rate
export const getProjectCountByCompletion = async (req, res) => {
    try {
        const completionRates = [
            { upperBound: 25 },
            { lowerBound: 26, upperBound: 50 },
            { lowerBound: 51, upperBound: 75 },
            { lowerBound: 76, upperBound: 100  }
        ];

        const projectCounts = await Promise.all(completionRates.map(async rate => {
            let whereCondition = rate.lowerBound ? 
                                { ProjectProgress: { [Op.between]: [rate.lowerBound, rate.upperBound] } } :
                                { ProjectProgress: { [Op.lte]: rate.upperBound } };
            const count = await Project.count({ where: whereCondition });
            return { [`projects_${rate.lowerBound || 0}_to_${rate.upperBound || 'up'}`]: count };
        }));

        res.status(200).json(projectCounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  // Get number of projects by status for each city
export const getProjectCountByStatusForCity = async (req, res) => {
    try {
      const {input} = req.body;

      const statuses = ['Not Started', 'In Progress', 'Completed'];
  
      let projectCounts;
  
      if (input.toLowerCase() === 'general') {
        projectCounts = await Promise.all(statuses.map(async status => {
          const count = await Project.count({ where: { ProjectStatus: status } });
          return { [status]: count };
        }));
      } else {
        
        projectCounts = await Promise.all(statuses.map(async status => {
          const count = await Project.count({
            where: { 
              ProjectStatus: status,
              ProjectCity: input 
            }
          });
          return { [status]: count };
        }));
      }
  
      res.status(200).json(Object.assign({}, ...projectCounts));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // count Homeowners per City
export const getHomeownerCountByCity = async (req, res) => {
    try {
        const homeownerCounts = await User.findAll({
            where: { UserType: 'HomeOwner' },
            attributes: ['UserCity', [Sequelize.fn('COUNT', Sequelize.col('UserCity')), 'homeownerCount']],
            group: 'UserCity'
        });

        res.status(200).json(homeownerCounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  // count Service Providers per City
export const getServiceProviderCountByCity = async (req, res) => {
    try {
        const serviceProviderCounts = await User.findAll({
            where: { UserType: 'ServiceProvider' },
            attributes: ['UserCity', [Sequelize.fn('COUNT', Sequelize.col('UserCity')), 'serviceProviderCount']],
            group: 'UserCity'
        });

        res.status(200).json(serviceProviderCounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  // Get number of service providers by rating
export const getServiceProviderCountByRating = async (req, res) => {
    try {
      const { input } = req.body;
      const ratings = [1, 2, 3, 4, 5];
      let serviceProviderCounts;
  
      if (input.toLowerCase() === 'general') {
        serviceProviderCounts = await calculateServiceProviderCounts(ratings);
      } else {
        serviceProviderCounts = await calculateServiceProviderCounts(ratings, input);
      }
  
      res.status(200).json(Object.assign({}, ...serviceProviderCounts));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  async function calculateServiceProviderCounts(ratings, city = null) {
    return Promise.all(ratings.map(async rating => {
        let lowerBound, upperBound;
        switch(rating) {
            case 1:
                lowerBound = 0.0;
                upperBound = 1.4;
                break;
            case 2:
                lowerBound = 1.5;
                upperBound = 2.4;
                break;
            case 3:
                lowerBound = 2.5;
                upperBound = 3.4;
                break;
            case 4:
                lowerBound = 3.5;
                upperBound = 4.4;
                break;
            case 5:
                lowerBound = 4.5;
                upperBound = 5.0;
                break;
        }

        let whereCondition = {
            userType: 'ServiceProvider',
            Rating: { [Op.gte]: lowerBound, [Op.lte]: upperBound }
        };

        if (city) {
            whereCondition.UserCity = city; 
        }

        const count = await User.count({ where: whereCondition });
        return { [`rating_${rating}`]: count };
    }));
}

  // Get number of completed tasks by ServiceType
export const getTaskCountByServiceType = async(req, res) => {
    try {
        const taskCount = await Task.findAll({
            include: [{
                model: User,
                as: 'ServiceProviderAdmin',
                attributes: [],
                where: {
                    UserType: 'ServiceProvider'
                }
            }],
            where: {
                TaskStatus: 'Completed' 
            },
            attributes: [
                [Sequelize.col('ServiceProviderAdmin.ServiceType'), 'serviceType'],
                [Sequelize.fn('COUNT', Sequelize.col('Task.TaskID')), 'taskCount']
            ],
            group: ['ServiceProviderAdmin.ServiceType'],
            raw: true
        });

        res.status(200).json(taskCount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  // Get number of tasks by Status For City
export const getTaskCountByStatusForCity = async (req, res) => {
    try {
        const { input } = req.body;

        const allStatuses = await Task.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('TaskStatus')), 'TaskStatus']],
            raw: true
        });

        let results = await Promise.all(allStatuses.map(async statusObj => {
            let whereCondition = { TaskStatus: statusObj.TaskStatus };
            
            if (input && input.toLowerCase() !== 'general') {
                whereCondition['$ProjectAdmin.ProjectCity$'] = input; 
            }

            const count = await Task.count({
                where: whereCondition,
                include: input && input.toLowerCase() !== 'general' ? [{
                    model: Project,
                    as: 'ProjectAdmin',
                    attributes: []
                }] : [],
                raw: true
            });

            return {
                TaskStatus: statusObj.TaskStatus,
                taskCount: count,
                ProjectCity: input && input.toLowerCase() !== 'general' ? input : 'general'
            };
        }));

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addMatirealProvider = async (req, res) => {
    try {
        const { name, userType, profilepicture, city, serviceType, bio, phoneNumber } = req.body;
       
        const user = await User.create({   
            Username: name,  
            UserType: userType,
            UserProfileInfo:  bio,
            UserPicture: profilepicture !== "" ? profilepicture : 'images/profilePic96.png' ,
            ServiceType :serviceType,
            UserCity: city,
            UserPhoneNumber: phoneNumber,
          });
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};