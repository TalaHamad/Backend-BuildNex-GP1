import WorkExperience from '../models/workExperienceModel.js';

export const getWorkExperiences = async (req, res) => {
  try {
    const serviceProviderId = req.user; 

    const workExperiences = await WorkExperience.findAll({
      where: {
        ServiceProviderID: serviceProviderId,
      },
      attributes: ['WorkID','WorkImage', 'WorkName','WorkDescription'],
    });

    res.status(200).json(workExperiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch work experiences' });
  }
};

export const addWorkExperience = async (req, res) => {
  try {
    const serviceProviderId = req.user;

    const { workImage, workName, workDescription } = req.body;


    if (!workImage || !workName || !workDescription) {
      return res.status(400).json( 'All Fields are required');
    }

    const newWorkExperience = await WorkExperience.create({
      ServiceProviderID: serviceProviderId,
      WorkImage: workImage,
      WorkName: workName,
      WorkDescription: workDescription,
    });

    res.status(200).json(newWorkExperience.WorkID);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add work experience' });
  }
};

export const getWorkExpDetails = async (req, res) => {
  try {
    const { workExpId } = req.params;

    const workExpDetails = await WorkExperience.findByPk(workExpId);

    if (!workExpDetails) {
      return res.status(404).json({ error: 'Work experience not found' });
    }

    res.status(200).json(workExpDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch work experience details' });
  }
};

export const editWorkExp = async (req, res) => {
  try {
    const { workExpId } = req.params;
    const { workName, workDescription } = req.body;

    const existingWorkExp = await WorkExperience.findByPk(workExpId);

    if (!existingWorkExp) {
      return res.status(404).json({ error: 'Work experience not found' });
    }

    // Update the work experience details conditionally
    existingWorkExp.WorkName = workName || existingWorkExp.WorkName;
    existingWorkExp.WorkDescription = workDescription || existingWorkExp.WorkDescription;

    await existingWorkExp.save();

    res.status(200).json('Work experience updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to edit work experience' });
  }
};

export const editWorkExpImage = async (req, res) => {
  try {
    const { workExpId } = req.params;
    const { workImage} = req.body;

    const existingWorkExp = await WorkExperience.findByPk(workExpId);

    if (!existingWorkExp) {
      return res.status(404).json({ error: 'Work experience not found' });
    }

    existingWorkExp.WorkImage = workImage || existingWorkExp.WorkImage;
   
    await existingWorkExp.save();

    res.status(200).json('Work experience Image updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to edit work experience Image' });
  }
};
