const { StatusCodes} = require('http-status-codes');
const { UserRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const  { Auth } = require('../utils/common');
const userRepository = new UserRepository();
const bcrypt = require('bcrypt');

async function create(data){
    try {
        data.password = await bcrypt.hash(data.password, 10);
        const user = await userRepository.create(data);
        return user;
    }
    catch (error) {
        throw new AppError('Error creating user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data){
    try{
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }
        const isPasswordValid = await Auth.checkPassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid password', StatusCodes.UNAUTHORIZED);
        }
        const token = Auth.createToken({ id: user._id, email: user.email });
        return token;
    }
    catch (error) {
        throw new AppError(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token) {
    try {
        const decoded = Auth.verifyToken(token);
        const user = await userRepository.get(decoded.id);
        return user;
    } catch (error) {
        throw new AppError('Authentication failed', StatusCodes.UNAUTHORIZED);
    }
}

async function isAdmin(email) {
    const user = await userRepository.getUserByEmail(email);
    return user.role === 'admin'; // it will return true if the user is an admin

}

module.exports = {
    create,
    isAuthenticated,
    isAdmin,
    signin
};