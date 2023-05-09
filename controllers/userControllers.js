const User = require('../models/User');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    
    //Create user
    createUser(req, res) {
        User.create(req.body)
            .then((newUser) => res.json(newUser))
            .catch((err) => res.status(500).json(err));
    },
    
    
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email
                },
            },
            { new: true },
            (err, result) => {
                if (result) {
                    res.status(200).json('User updated');
                    console.log(`Updated: ${result}`);
                } else {
                    console.log('Unable to update');
                    res.status(500).json({ message: 'Unable to update' });
                }
            }
        )
    },

    
    deleteUser(req, res) {
        User.findOneAndDelete(
            { _id: req.params.userId }, (err, result) => {
                if (result) {
                    res.status(200).json(result);
                    console.log(`Deleted: ${result}`);
                } else {
                    console.log('Unable to delete');
                    res.status(500).json({ message: 'Unable to delete' });
                }
            });
    },
    
    
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true },
            (err, result) => {
                if (result) {
                    res.status(200).json(result);
                    console.log(`Friend ${result} added`);
                } else {
                    console.log('Unable to add friend');
                    res.status(500).json({ message: 'Unable to add friend' });
                }
            });
    },

    
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            (err, result) => {
                if (result) {
                    res.status(200).json(result);
                    console.log(`Deleted: ${result}`);
                } else {
                    console.log('Unable to delete');
                    res.status(500).json({ message: 'Unable to delete' });
                }
            });
    },
};


