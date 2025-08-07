const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');


class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            return await this.model.create(data);
        } catch (error) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async get(id) {
        try {
            const record = await this.model.findById(id);
            if (!record) {
                throw new AppError(StatusCodes.NOT_FOUND, 'Record not found');
            }
            return record;
        } catch (error) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async getAll(filter = {}, { page = 1, limit = 6 } = {}) {
        const skip = (page - 1) * limit;
        const players = await this.model.find(filter)
            .sort({ createdAt: -1 }) // ✅ ensure newest first
            .skip(skip)
            .limit(limit);  
    
        const total = await this.model.countDocuments(filter);
        return {
            results: players,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }


    async update(id, data) {
        try {
            const updatedRecord = await this.model.findByIdAndUpdate(id, data, { new: true });
            if (!updatedRecord) {
                throw new AppError(StatusCodes.NOT_FOUND, 'Record not found');
            }
            return updatedRecord;
        } catch (error) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async destroy(id) {
        try {
            const deletedRecord = await this.model.findByIdAndDelete(id);
            if (!deletedRecord) {
                throw new AppError(StatusCodes.NOT_FOUND, 'Record not found');
            }
            return deletedRecord;
        } catch (error) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}

module.exports = CrudRepository;
