
var Model = require('../model');
var Knex = require('../db');

var routes = require('../routes');

exports.currentUser = function (req, res) {
    console.log(routes.currentUser.userid);
    Model.User.forge({ userid: routes.currentUser.userid })
        .fetch()
        .then(function (user) {
            if (!user) {
                res.status(404).json({ error: true, data: {} });
            }
            else {
                res.json({ data: user.toJSON() });
            }
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};


exports.users = function (req, res) {
    Model.Users.forge()
        .fetch()
        .then(function (collection) {
            res.json({ data: collection.toJSON() });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};


exports.hubs = function (req, res) {
    Model.Hubs.forge()
        .fetch()
        .then(function (collection) {
            res.json({ data: collection.toJSON() });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};

exports.sensors = function (req, res) {
    Model.Sensors.forge()
        .fetch()
        .then(function (collection) {
            res.json({ data: collection.toJSON() });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};

exports.measures = function (req, res) {
    Model.Measures.forge()
        .fetch()
        .then(function (collection) {
            res.json({ data: collection.toJSON() });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};

exports.user = function (req, res) {
    Model.User.forge({ userID: req.params.id })
        .fetch()
        .then(function (user) {
            if (!user) {
                res.status(404).json({ error: true, data: {} });
            }
            else {
                res.json({ data: user.toJSON() });
            }
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};

exports.hub = function (req, res) {
    Model.Hub.forge({ hubID: req.params.id })
        .fetch()
        .then(function (user) {
            if (!user) {
                res.status(404).json({ error: true, data: {} });
            }
            else {
                res.json({ data: user.toJSON() });
            }
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};

exports.sensor = function (req, res) {
    Model.Sensor.forge({ sensorID: req.params.id })
        .fetch()
        .then(function (user) {
            if (!user) {
                res.status(404).json({ error: true, data: {} });
            }
            else {
                res.json({ data: user.toJSON() });
            }
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
}

exports.measure = function (req, res) {
    Model.Measure.forge({ measureID: req.params.id })
        .fetch()
        .then(function (user) {
            if (!user) {
                res.status(404).json({ error: true, data: {} });
            }
            else {
                res.json({ data: user.toJSON() });
            }
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
}

exports.hubsUser = function (req, res) {
    Model.Hubs.forge()
        .query('where', { 'userID': req.params.id })
        .fetch()
        .then(function (user) {
            if (!user) {
                res.status(404).json({ error: true, data: {} });
            }
            else {
                res.json({ data: user.toJSON() });
            }
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};

exports.sensorsHub = function (req, res) {
    Model.Sensors.forge()
        .query('where', { 'hubID': req.params.id })
        .fetch()
        .then(function (user) {
            if (!user) {
                res.status(404).json({ error: true, data: {} });
            }
            else {
                res.json({ data: user.toJSON() });
            }
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};

exports.sensorsUser = function (req, res) {
    Model.Sensors.forge()
        .query('where', { 'hubID': req.params.id })
        .fetch()
        .then(function (user) {
            if (!user) {
                res.status(404).json({ error: true, data: {} });
            }
            else {
                res.json({ data: user.toJSON() });
            }
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};

exports.measuresSensor = function (req, res) {
    Model.Measures.forge()
        .query('where', { 'sensorID': req.params.id })
        .fetch()
        .then(function (user) {
            if (!user) {
                res.status(404).json({ error: true, data: {} });
            }
            else {
                res.json({ data: user.toJSON() });
            }
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};

exports.addUser = function (req, res) {
    var id = req.params.id;
    console.log(id);
    if (id >= 0) {
        Model.User().forge()
            .query('where', 'userID', '=', id)
            .fetch()
            .then(function (collection) {
                console.log('aa');
                console.log(collection.toJSON());
                res.json({ data: collection.toJSON() });
            })
            .catch(function (err) {
                res.status(500).json({ error: true, data: { message: err.message } });
            });
    } else {
        res.json(false);
    }
};


exports.addHub = function (req, res) {
    // Model.Hub.forge({
    //     hubID: req.body.hubid,
    //     userID: req.body.userid,
    //     desc: req.body.desc
    // })
    Model.Hub.forge(req.body)
        .save()
        .then(function (hub) {
            res.send({ msg: '' });
            //res.redirect('/profile/#');
        })
        .catch(function (err) {
            res.send({ msg: err.message  });
        });
}

exports.addSensor = function (req, res) {
    Model.Sensor.forge({
        sensorID: req.body.sensorid,
        hubID: req.body.hubid,
        desc: req.body.desc,
        state: req.body.state
    })
        .save()
        .then(function (user) {
            res.json({ error: false, data: { id: user.get('sensorID') } });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
}

exports.addMeasure = function (req, res) {
    Model.Measure.forge({
        sensorID: req.body.sensorid,
        value1: req.body.value1,
        value2: req.body.value2
    })
        .save()
        .then(function (measure) {
            res.json({ error: false, data: { measureID: measure.get('measureID') } });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
}

exports.editHub = function (req, res) {
    Model.User.forge({
        name: req.body.name,
        email: req.body.email
    })
        .save()
        .then(function (user) {
            res.json({ error: false, data: { id: user.get('id') } });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
}

exports.editSensor = function (req, res) {
    Model.User.forge({
        name: req.body.name,
        email: req.body.email
    })
        .save()
        .then(function (user) {
            res.json({ error: false, data: { id: user.get('id') } });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
}

// GET

exports.posts = function (req, res) {
    var posts = [];
    data.posts.forEach(function (post, i) {
        posts.push({
            id: i,
            title: post.title,
            text: post.text.substr(0, 50) + '...'
        });
    });
    res.json({
        posts: posts
    });
};

exports.post = function (req, res) {
    var id = req.params.id;
    if (id >= 0 && id < data.posts.length) {
        res.json({
            post: data.posts[id]
        });
    } else {
        res.json(false);
    }
};

// POST

exports.addPost = function (req, res) {
    data.posts.push(req.body);
    res.json(req.body);
};

// PUT

exports.editPost = function (req, res) {
    var id = req.params.id;

    if (id >= 0 && id < data.posts.length) {
        data.posts[id] = req.body;
        res.json(true);
    } else {
        res.json(false);
    }
};

// DELETE

exports.deletePost = function (req, res) {
    var id = req.params.id;

    if (id >= 0 && id < data.posts.length) {
        data.posts.splice(id, 1);
        res.json(true);
    } else {
        res.json(false);
    }
};