const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
    
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    
    createThought(req, res) {
        Thought.create(req.body)
            .then((newThought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: newThought._id } },
                    { new: true }
                );
            })
            .then((user) =>
                !user
                    ? res.status(404).json({
                        message: 'Thought created, but found no user with that ID',
                    })
                    : res.json('Thought created')
            )
            .catch((err) => res.status(500).json(err));

    },

    
    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought found with that id' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { new: true },
            (err, result) => {
                if (result) {
                    res.status(200).json({ message: `Thought updated` });
                    console.log(`Updated: ${result}`);
                } else {
                    console.log('Unable to update');
                    res.status(500).json({ message: 'Unable to update' });
                }
            });
    },

    
    deleteThought(req, res) {
        Thought.findOneAndDelete(
            { _id: req.params.thoughtId }, (err, result) => {
                if (result) {
                    res.status(200).json({ message: `Thought deleted` });
                    console.log(`Deleted: ${result}`);
                } else {
                    console.log('Unable to delete');
                    res.status(500).json({ message: 'Unable to delete' });
                }
            });
    },
    
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true },
            (err, result) => {
                if (result) {
                    res.status(200).json('Reaction added');
                    console.log(`Added reaction: ${result}`);
                } else {
                    console.log('Unable to add reaction');
                    res.status(500).json({message: 'Unable to add reaction'});
                }
            }
        );
    },
    
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true },
            (err, result) => {
                if (result) {
                    res.status(200).json('Reaction deleted');
                    console.log(`Reaction deleted: ${result}`);
                } else {
                    console.log('Unable to delete reaction');
                    res.status(500).json({message: 'Unable to delete reaction'});
                }
            }
        )
    },
};