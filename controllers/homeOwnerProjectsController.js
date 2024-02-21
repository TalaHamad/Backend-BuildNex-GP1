import User from '../models/userModel.js';
import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';
import ProjectsInformation from '../models/projectInfoModel.js'; 
import {updateProjectProgress} from '../utils/updateProjectProgressUtils.js';

export const addProject = async (req, res) => {
    try 
    {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      const homeOwnerId = req.user; 
  
      const { projectName, projectCity, projectLocation, basinNumber, plotNumber ,projectEntryPoint } = req.body;

      if (!projectName || !projectCity  || !projectLocation || !basinNumber || !plotNumber || !projectEntryPoint) {
        return res.status(400).json('Please fill in all the required fields')
      }
      
      const project = await Project.create({
        ProjectName: projectName,
        ProjectCity:projectCity,
        ProjectLocation: projectLocation,
        ProjectEntryPoint: projectEntryPoint,
        BasinNumber:basinNumber,
        PlotNumber:plotNumber,
        HomeOwnerID: homeOwnerId, 
        ProjectStatus: 'Not Started',
        ProjectProgress: 0,
      });
      

       const projectId = project.get('ProjectID');

       const projectInfo = await ProjectsInformation.create({
        ProjectID: projectId,
      });


       const taskNames = [
        '1. Property Survey',
        '2. Obtaining Permits & Regulatory Information',
        '3. Soil Investigation',
        '4. Design and Planning',
        '5. Obtaining Approval from Engineering Association & licensing Authority',
        '6. Foundation Construction & Framing',
        '7. Rough Mechanical Work',
        '8. Rough Electrical Work',
        '9. Insulation Work',
        '10. Door Frame Installation',
        '11. Plastering Work',
        '12. Tile Work',
        '13. Aluminum Work',
        '14. Carpentry Work',
        '15. Painting Work',
        '16. Installing Fixtures and Finishing Up'
        ];
           
       const taskDescriptions =[
        "Land surveying is essential before building a home to define property boundaries accurately. It involves using specialized equipment and techniques to determine point positions, distances, and angles. Licensed surveyors with training in surveying principles and procedures conduct these surveys.",
        "Submit survey scheme to the Ministry of Tourism and Antiquities  and Land Authority, obtain required signatures, and secure the necessary permits, Then obtain regulatory information from the licensing authority.",
        "Soil investigation is a vital step in construction as it ensures the quality of the ground where your dream home will stand. This process examines the soil's chemical and physical composition to determine its bearing capacity, essential for withstanding the building's weight and ensuring structural stability.",
        "A building plan is a graphical representation of a building, encompassing various plans like site layout, floor design, structural details, cross-sections, elevations, electrical drawings, plumbing, and landscape. Construction follows these plans and is often called building drawings, architectural plans, or architectural drawings.",
        "The approval journey for architectural, civil, mechanical, and electrical design drawings involves a meticulous two-step process. Firstly, these drawings undergo scrutiny by the Engineering Association. Once endorsed. After that, the drawings advance to the Licensing Authority to validate legal compliance.",
        "With approved plans in hand, construction begins with the foundational elements. The meticulous execution of foundation construction and structural framing sets the groundwork for the entire structure, ensuring stability and durability according to architectural specifications.",
        "Precision and planning guide the Mechanical Work. Expert plumbers follow detailed blueprints to create a seamless water supply system. Shutting off the water main, careful measurements, and integration with existing pipelines are integral steps. Thorough testing and restoration complete this critical installation, aligning with architectural plans.",
        "A pivotal phase in construction, Electrical Work follows intricately crafted plans to power the home. The electrical route wiring, the switches, the outlets, and the lighting fixtures with precision. To emphasise safety, this phase ensures seamless integration with existing systems. It involves laying wires, connecting components, and thorough testing before restoring any alterations.",
        "Focused on comfort and energy efficiency, Insulation Work, if opted for, plays a vital role. Skilled professionals install insulation materials per plans, regulating temperature and reducing noise. Simultaneously, HVAC systems are set up for consistent heating and cooling, guided by architectural plans.",
        "A crucial step where skilled craftsmen meticulously install door frames according to architectural plans. This ensures doors fit seamlessly into living spaces, focusing on precise measurements, level, plumb, and secure placement, enhancing both structural integrity and overall aesthetics. Homeowners select the door design, color, and material during this stage.",
        "Elevating the aesthetics, plastering is an art that provides walls and ceilings with a smooth and flawless finish. Skilled craftsmen meticulously apply a layer of plaster, enhancing visual appeal and strengthening walls. This process follows architectural plans and results in a pristine canvas ready for the final touches.",
        "During Tile Work, every tile placement contributes to realising your vision. Skilful workers ensure precise alignment and secure each tile, ensuring a seamless, polished finish that reflects your chosen tile characteristics. Homeowners select the tile type, size, colour, and pattern that align with their unique style.",
        "Window installation is a pivotal phase offering homeowners the chance to enhance both aesthetics and functionality. This crucial step allows the selection of energy-efficient windows in various styles, frame materials, and colours, aligning with architectural preferences. The result is a brighter, more comfortable, and visually appealing living environment.",
        "The door installation phase is a key in bringing your home to life. Skilled craftsmen meticulously hang and secure each door, ensuring precision in measurements and seamless integration into the architectural design. This crucial step enhances the structural integrity and the visual appeal of the living spaces.",
        "It's a stage where your style preferences truly shine. The homeowners select paint colours, types, and finishes that resonate with their taste. Experienced painters apply the paint evenly, giving walls, ceilings, and surfaces a flawless finish following the chosen architectural plans.",
        "As you near the completion of your dream home, you've reached the final chapter. Here, as a homeowner, you play a pivotal role. You'll select fixtures like lighting, faucets, and cabinet hardware that resonate with your style and needs, shaping the ultimate ambience of your new living space. It's the last step in creating a home uniquely yours."]; 
  
       let startingIndex;

       if(projectEntryPoint === 'From Scratch')
       {
        startingIndex=0;
       }
       else if (projectEntryPoint === 'From Middle')
       {
        startingIndex=9;
       }
    

   
       for (let i = startingIndex; i < 16; i++) {
         const task = await Task.create({
           ProjectID: project.ProjectID, 
           TaskName: taskNames[i],
           TaskDescription: taskDescriptions[i],
           TaskStatus: 'Not Started',
           TaskNumber: i+1,
           ServiceProviderID: null, 
         });
       }
   
       res.status(200).json( projectId );
      } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Failed to add a project and tasks' });
     }
};

export const getProjects = async (req, res) => {
    try {
        if (!req.user) {
          return res.status(401).json({ error: 'User not authenticated' });
        }
        const homeOwnerId = req.user; 
    
        const projects = await Project.findAll({
          where: { HomeOwnerID: homeOwnerId },
        });
    
        const projectData = projects.map((project) => ({
            projectId: project.ProjectID, 
            projectName: project.ProjectName,
            projectStatus: project.ProjectStatus,
          }));
    
         res.status(200).json(projectData);
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve homeowner projects' });
      }
};

export const getProjectInformation = async (req, res) => {
    try {
  
        const { projectId } = req.params;
        const project = await Project.findByPk(projectId);
    
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
    
        const user = await User.findByPk(project.HomeOwnerID);
        const projectInfo = await ProjectsInformation.findOne({
          where: { ProjectID: projectId },
        });
    
        await updateProjectProgress(projectId);
    
        const projectWidgetData = {
          projectProgress: project.ProjectProgress,
          projectName: project.ProjectName,
          ownerUserName: user.Username ,
          projectStatus: project.ProjectStatus,
          projectCity: project.ProjectCity,
          projectLocation: project.ProjectLocation,
          BasinNumber: project.BasinNumber,
          PlotNumber: project.PlotNumber,
          buildingArea: projectInfo?.BuildingArea || null,
          numberOfRooms: projectInfo?.NumberOfRooms || null,
          numberOfFloors: projectInfo?.NumberOfFloors || null,
          designDocument: projectInfo?.DesignDocument || null,
        };
    
        res.status(200).json(projectWidgetData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve project widget data' });
      }
};

export const getProjectData = async (req, res) => {
  try {

      const { projectId } = req.params;
      const project = await Project.findByPk(projectId);

      res.status(200).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve project data' });
    }
};