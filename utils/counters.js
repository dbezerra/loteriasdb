const Counter = require('../models/counter');

async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true, includeResultMetadata: false }
    );
    return counter.seq;
}

module.exports = {
    getNextSequence
};
