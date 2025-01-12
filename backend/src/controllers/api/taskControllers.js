const BaseController = require('../../controllers/api/apiBaseController');
const { taskValidation } = require('../../validations/api/taskValidation');
const Project = require('../../models/Project');
const User = require('../../models/User');
const Task = require('../../models/Task');

class TaskController extends BaseController {

    /**
     * Get a list of all non-deleted tasks.
     */
    index = async (req, res) => {
        try {
            const tasks = await Task.findNonDeleted();
            return this.sendResponse(res, { tasks }, 'Tasks fetched successfully');
        } catch (error) {
            return this.sendError(res, 'Error fetching tasks', 500, error.message);
        }
    };

    /**
     * Create a new task.
     */
    create = async (req, res) => {
        try {
        
            return this.sendResponse(res, {}, 'Create task page (or initialization)');
        } catch (error) {
            return this.sendError(res, 'Error initializing task creation', 500, error.message);
        }
    };

    /**
     * Store a new task.
     */
    store = async (req, res) => {
        try {
            const validationErrors = await taskValidation(req);
            if (validationErrors) {
                return this.sendError(res, 'Validation failed', 400, validationErrors);
            }
            const { title, description, status, assignedTo, project } = req.body;

            const user = await User.findById(assignedTo);
            if (!user || user.isDeleted) {
                return this.sendError(res, 'Assigned user not found or is deleted', 404);
            }

            const projectExists = await Project.findById(project);
            if (!projectExists || projectExists.isDeleted) {
                return this.sendError(res, 'Project not found or is deleted', 404);
            }

            const newTask = new Task({
                title,
                description,
                status,
                assignedTo,
                project,
            });

            await newTask.save();
            return this.sendResponse(res, { task: newTask }, 'Task created successfully', 201);
        } catch (error) {
            return this.sendError(res, 'Error creating task', 500, error.message);
        }
    };

    /**
     * Get a single task by ID.
     */
    show = async (req, res) => {
        try {
            const { id } = req.params;
            const task = await Task.findById(id);
            if (!task || task.isDeleted) {
                return this.sendError(res, 'Task not found', 404);
            }

            return this.sendResponse(res, { task }, 'Task details fetched successfully');
        } catch (error) {
            return this.sendError(res, 'Error fetching task', 500, error.message);
        }
    };

    /**
     * Get a task by ID for editing.
     */
    edit = async (req, res) => {
        try {
            const { id } = req.params;
            const task = await Task.findById(id);
            if (!task || task.isDeleted) {
                return this.sendError(res, 'Task not found', 404);
            }

            return this.sendResponse(res, { task }, 'Task details fetched successfully');
        } catch (error) {
            return this.sendError(res, 'Error fetching task', 500, error.message);
        }
    };

    /**
     * Update an existing task.
     */
    update = async (req, res) => {
        try {
            const { id } = req.params;
            
            const validationErrors = await taskValidation(req);
            if (validationErrors) {
                return this.sendError(res, 'Validation failed', 400, validationErrors);
            }
            const { title, description, status, assignedTo, project } = req.body;

            const task = await Task.findById(id);
            if (!task || task.isDeleted) {
                return this.sendError(res, 'Task not found or is deleted', 404);
            }

            task.title = title || task.title;
            task.description = description || task.description;
            task.status = status || task.status;
            task.assignedTo = assignedTo || task.assignedTo;
            task.project = project || task.project;

            await task.save();
            return this.sendResponse(res, { task }, 'Task updated successfully');
        } catch (error) {
            return this.sendError(res, 'Error updating task', 500, error.message);
        }
    };

    /**
     * Soft delete a task (mark as deleted).
     */
    destroy = async (req, res) => {
        try {
            const { id } = req.params;

            const task = await Task.findById(id);
            if (!task || task.isDeleted) {
                return this.sendError(res, 'Task not found or already deleted', 404);
            }
            
            await task.softDelete();
            return this.sendResponse(res, null, 'Task soft deleted successfully');
        } catch (error) {
            return this.sendError(res, 'Error deleting task', 500, error.message);
        }
    };
}

module.exports = new TaskController();
