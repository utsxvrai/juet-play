const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');


/**
 * Sign up a new user
 * POST : /signup
 * req-body: {name, email, password , role}
 */
async function signup(req, res){
    try {
        const user = await UserService.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        });
        SuccessResponse.data = user;
        return res.status(StatusCodes.CREATED)
        .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function signin(req, res) {
    try {
        const token = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = { token };
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function verifyAdmin(req,res,next){
    try{
        const isAdmin = await UserService.isAdmin({
            email: req.body.email,
        });
        if (!isAdmin) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized' });
        }
        next();
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

module.exports = {
    signup,
    signin,
    verifyAdmin
};