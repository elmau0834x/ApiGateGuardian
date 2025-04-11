import usersDao from '../dao/users.dao.js';

const usersController = {};

usersController.createUser = (req, res) => {
    const user = req.body;
    console.log(user);
    usersDao.createUser(user).then((user) => {
        res.json({data:{
            data:user,
            message: 'User created successfully',
        }});
    });
}

usersController.getUsers = (req, res) => {
    usersDao.getUsers().then((users) => {
        res.json({data:{
            data:users,
            message: 'Users listed successfully',
        }});
    });
}

// En tu archivo users.controller.js

usersController.getUserByEmail = (req, res) => {
    const { email } = req.params; // El correo es el parámetro que se pasa en la URL
    usersDao.getOneByEmail(email).then((user) => {
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.json({ data: {
            data: user,
            message: 'User listed successfully',
        }});
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Error getting user by email', error: err });
    });
}

usersController.updateUser = (req, res) => {
    const { email } = req.params; // Cambiado de id a email
    const user = req.body;
    
    usersDao.updateUser(email, user).then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            data: {
                data: updatedUser,
                message: 'User updated successfully',
            }
        });
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Error updating user', error: err });
    });
};


usersController.deleteUser = (req, res) => {
    const { id } = req.params;
    usersDao.deleteUser(id).then((user) => {
        res.json({data:{
            data:user,
            message: 'User deleted successfully',
        }});
    });
}

usersController.validateUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        });
    }

    try {
        const user = await usersDao.validateUser(email, password);  // Usamos email para la validación

        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        res.status(200).json({
            data: {
                user,
                message: 'User validated successfully'
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
}



export default usersController;

