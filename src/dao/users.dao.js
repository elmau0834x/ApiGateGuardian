import Users from "../models/Users.js";

const usersDao = {}

usersDao.getUsers = async () => {
    return await Users.find();
}

// En tu archivo users.dao.js
usersDao.getOneByEmail = async (email) => {
    return await Users.findOne({ email: email });  // Cambié a buscar por correo
}


usersDao.validateUser = async (email, password) => {
    return await Users.findOne({ email, password });
};

usersDao.createUser = async (user) => {
    return await Users.create(user);
}

usersDao.updateUser = async (email, user) => {
    return await Users.findOneAndUpdate({ email }, user, { new: true });
};

usersDao.deleteUser = async (id) => {
    return await Users.findByIdAndDelete(id);
}

export default usersDao;