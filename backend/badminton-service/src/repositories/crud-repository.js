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

    async getAll(filter = {}, options = {}) {
        const page = options.page > 0 ? options.page : 1;
        const limit = options.limit > 0 ? options.limit : 6;
        const skip = (page - 1) * limit;

        const [results, total] = await Promise.all([
            this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            this.model.countDocuments(filter),
        ]);

        return {
            results,
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
