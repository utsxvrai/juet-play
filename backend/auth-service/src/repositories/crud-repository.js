const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const response = await this.model.create(data);
            return response;
        } catch (error) {
            throw new AppError('Error creating resource', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async destroy(id) {
        const response = await this.model.findByIdAndDelete(id);
        if (!response) {
            throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async get(id) {
        const response = await this.model.findById(id);
        if (!response) {
            throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAll(filter = {}) {
        const response = await this.model.find(filter);
        return response;
    }

    async update(id, data) {
        const response = await this.model.findByIdAndUpdate(id, data, {
            new: true, // Return updated doc
            runValidators: true // Enforce schema
        });
        if (!response) {
            throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = CrudRepository;
