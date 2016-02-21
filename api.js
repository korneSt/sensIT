
var Model = require('./model');
var Knex = require('./db');

var routes = require('./routes');

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

// select * from sensors inner join hubs
// on sensors.hubID = hubs.hubID
// inner join users 
// on hubs.userID = users.userID
// where hubs.userID = 251;
exports.sensorsUser = function (req, res) {
   Model.Sensors.forge()
        .query(function(qb) {
            qb.where('hubs.userID', req.params.id)
            qb.join('hubs', 'sensors.hubID', '=', 'hubs.hubID')
            qb.join('users', 'hubs.userID', '=', 'users.userID')
        })
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
            res.send({ msg: err.message });
        });
}

exports.addSensor = function (req, res) {
    Model.Sensor.forge(req.body)
        .save()
        .then(function (sensor) {
            res.json({ error: false, data: { id: sensor.get('desc') } });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        })
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

exports.addMeasureReal = function (req, res) {
    Model.Measure.forge({
        sensorID: req.params.id,
        value1: req.query.value1,
        value2: req.query.value2
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
    Model.Hub.forge({
        hubID: req.body.hubID
    }).save({
        desc: req.body.desc,
        userID: req.body.userID
    }).then(function (sensor) {
        res.json({ error: false, data: { id: sensor.get('desc') } });
    }).catch(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
    })
}
//  Model.Sensor.forge({ sensorID: req.params.id })
//         .fetch()
//         .then(function (user) {
//             if (!user) {
//                 res.status(404).json({ error: true, data: {} });
//             }
//             else {
//                 res.json({ data: user.toJSON() });
//             }
//         })
//         .catch(function (err) {
//             res.status(500).json({ error: true, data: { message: err.message } });
//         });
          
// exports.editSensor = function (req, res) {
//     Model.Sensor.forge({
//         sensorID: req.params.id
//     })
//         .fetch({require: true})
//         .then(function (sensor) {
//             sensor.save({ desc: req.body.desc, favourite: req.body.fav })
//                 .then(function () {
//                     res.json({ error: false, data: { id: sensor.get('desc') } });
//                 })
//         })
//         .catch(function (err) {
//             res.status(500).json({ error: true, data: { message: err.message } });
//         });
// }
exports.editSensor = function (req, res) {
    Model.Sensor.forge({
        sensorID: req.body.sensorID
    }).save({
        desc: req.body.desc,
        favourite: req.body.favourite,
        hubID: req.body.hubID,
        state: req.body.state
    }).then(function (sensor) {
        res.json({ error: false, data: { id: sensor.get('desc') } });
    }).catch(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
    })
}

exports.deleteSensor = function (req, res) {
    Model.Sensor.forge({ sensorID: req.params.id })
        .fetch({ require: true })
        .then(function (sensor) {
            sensor.destroy()
                .then(function () {
                    res.json({ error: false, data: { message: 'Sensor successfully deleted' } });
                })
                .catch(function (err) {
                    res.status(500).json({ error: true, data: { message: err.message } });
                });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
}


// GET
//Jako id podaj indeks hiba
exports.deleteMeasure = function (req, res) {
     Model.Measure
            .query().whereIn('sensorID', [req.params.id]).del().then(function () {
                    res.json({ error: false, data: { message: 'Sensor successfully deleted' } });
                })
                .catch(function (err) {
                    res.status(500).json({ error: true, data: { message: err.message } });
                });
}
