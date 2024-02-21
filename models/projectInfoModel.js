import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ProjectsInformation = sequelize.define('ProjectsInformation', {
    InformationID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    BuildingArea: {
        type: DataTypes.DOUBLE,
    },
    NumberOfRooms: {
        type: DataTypes.INTEGER,
    },
    NumberOfFloors: {
        type: DataTypes.INTEGER,
    },
    SurveyDocument:{
        type: DataTypes.TEXT,
    },
    PermitsDocument:{
        type: DataTypes.TEXT,
    },
    SoilDocument:{
        type: DataTypes.TEXT,
    },
    DesignDocument:{
        type: DataTypes.TEXT,
    },
    FoundationDocument:{
        type: DataTypes.TEXT,
    },
    PlumbingDocument:{
        type: DataTypes.TEXT,
    },
    ElectricalDocument:{
        type: DataTypes.TEXT,
    },
    InsulationAndHVACDocument:{
        type: DataTypes.TEXT,
    },
    ApprovalsDocument:{
        type: DataTypes.TEXT,
    },
    MaterialProvider:{
        type: DataTypes.TEXT,
    },
    BedroomDoor: {
        type: DataTypes.INTEGER,
    },
    BathroomDoor: {
        type: DataTypes.INTEGER,
    },
    LivingroomDoor: {
        type: DataTypes.INTEGER,
    },
    GuestroomDoor: {
        type: DataTypes.INTEGER,
    },
    BathroomTile: {
        type: DataTypes.INTEGER,
    },
    HouseTile: {
        type: DataTypes.INTEGER,
    },
    WindowDesign: {
        type: DataTypes.INTEGER,
    },
    DoorDesign: {
        type: DataTypes.INTEGER,
    },
    BedroomPaint: {
        type: DataTypes.INTEGER,
    },
    BathroomPaint: {
        type: DataTypes.INTEGER,
    },
    LivingroomPaint: {
        type: DataTypes.INTEGER,
    },
    GuestroomPaint: {
        type: DataTypes.INTEGER,
    },
    KitchenPaint: {
        type: DataTypes.INTEGER,
    },
    ProjectID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Projects',
          key: 'ProjectID',
        },
      },
    },
    {
      timestamps: false, 
    }
  );

// Synchronize the model with the database
ProjectsInformation.sync()
    .then(() => console.log('ProjectsInformation model synchronized with the database'))
    .catch((err) => console.error('ProjectsInformation model synchronization failed:', err));

export default ProjectsInformation;
