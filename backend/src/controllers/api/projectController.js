const Project = require('../../models/Project');
const User = require('../../models/User');
const BaseController = require('../../controllers/api/apiBaseController');
const { projectValidation } = require('../../validations/api/projectValidation');

class ProjectController extends BaseController {

    /**
     * Get a list of all non-deleted projects.
     */
    index = async (req, res) => {
        try {
            const projects = await Project.findNonDeleted();
            return this.sendResponse(res, { projects }, 'Projects fetched successfully');
        } catch (error) {
            return this.sendError(res, 'Error fetching projects', 500, error.message);
        }
    };
    /**
     * Create a new project.
     */
    create = async (req, res) => {
        try {

        } catch (error) {
            return this.sendError(res, 'Error creating project', 500, error.message);
        }
    };
    /**
     * Store a new project.
     */
    store = async (req, res) => {
        try {
            const validationErrors = await taskValidation(req);
            if (validationErrors) {
                return this.sendError(res, 'Validation failed', 400, validationErrors);
            }
            
            const { name, description, createdBy } = req.body;

            const user = await User.findById(createdBy);
            if (!user || user.isDeleted) {
                return this.sendError(res, 'User not found or is deleted', 404);
            }

            const newProject = new Project({
                name,
                description,
                createdBy,
            });

            await newProject.save();
            return this.sendResponse(res, { project: newProject }, 'Project created successfully', 201);
        } catch (error) {
            return this.sendError(res, 'Error creating project', 500, error.message);
        }
    };
    /**
     * Get a single project by ID.
     */
    show = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await Project.findById(id);
            if (!project || project.isDeleted) {
                return this.sendError(res, 'Project not found', 404);
            }

            return this.sendResponse(res, { project }, 'Project details fetched successfully');
        } catch (error) {
            return this.sendError(res, 'Error fetching project', 500, error.message);
        }
    };

    /**
     * Get a single project by ID.
     */
    edit = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await Project.findById(id);
            if (!project || project.isDeleted) {
                return this.sendError(res, 'Project not found', 404);
            }

            return this.sendResponse(res, { project }, 'Project details fetched successfully');
        } catch (error) {
            return this.sendError(res, 'Error fetching project', 500, error.message);
        }
    };

    /**
     * Update an existing project.
     */
    update = async (req, res) => {
        try {
            const { id } = req.params;
            
            const validationErrors = await taskValidation(req);
            if (validationErrors) {
                return this.sendError(res, 'Validation failed', 400, validationErrors);
            }

            const { name, description, status } = req.body;

            const project = await Project.findById(id);
            if (!project || project.isDeleted) {
                return this.sendError(res, 'Project not found or is deleted', 404);
            }
            project.name = name || project.name;
            project.description = description || project.description;
            project.status = status || project.status;

            await project.save();
            return this.sendResponse(res, { project }, 'Project updated successfully');
        } catch (error) {
            return this.sendError(res, 'Error updating project', 500, error.message);
        }
    };

    /**
     * Soft delete a project (mark as deleted).
     */
    destroy = async (req, res) => {
        try {
            const { id } = req.params;

            const project = await Project.findById(id);
            if (!project || project.isDeleted) {
                return this.sendError(res, 'Project not found or already deleted', 404);
            }

            await project.softDelete();
            return this.sendResponse(res, null, 'Project soft deleted successfully');
        } catch (error) {
            return this.sendError(res, 'Error deleting project', 500, error.message);
        }
    };
}

module.exports = new ProjectController();
