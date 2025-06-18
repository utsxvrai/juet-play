const CrudRepository = require('./crud-repository');
const User = require('../models/user');

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async getUserByEmail(email) {
        const user = await User.findOne({ email: email });
        return user;
    }
}

module.exports = UserRepository;
