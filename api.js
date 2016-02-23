var Model = require('./model');
var Knex = require('./db');

var routes = require('./routes');

//zwraca wszystkich uzytkownikow
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

//zwraca wszystkie huby 
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

//zwraca wszystkie sensory
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

//zwraca wszystkie pomiary
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

//zwraca inforamacje o podanym uzytkowniku
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

//zwraca info o podanym hubie
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

//zwraca informacje o podanym sensorze
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

//zwraca jeden pomiar na podstawie podanego id
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

//wszystkie huby uzytkownika na podstawie podanego userID
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

//sensory na podstawie hubID
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

//sensory uzytkownika na podstawie userID
exports.sensorsUser = function (req, res) {
    Model.Sensors.forge()
        .query(function (qb) {
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

//adres:senorID:stan - w takiej formie wyswietla dane sensorow huba na podstawie hubID
exports.sensorsAddress = function (req, res) {
    Model.Sensors.forge()
        .query(function (qb) {
            qb.select('address', 'sensorID', 'state').from('sensors'),
            qb.where('sensors.hubID', req.params.id)
        })
        .fetch()
        .then(function (data) {
            var addr = data.toJSON();
            var all = '';
            for (var i in addr) {
                var state = addr[i].state;
                var adr = addr[i].address;
                var sensID = addr[i].sensorID;
                if (adr != null) {
                    all += adr + ':' + sensID + ':' + state + '\n';
                }
            }
            if (!data) {
                res.status(404).json({ error: true, data: {} });
            }
            else {
                res.format({
                    'text/plain': function () {
                        res.send(all);
                    }
                })
            }
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
};

//dodaje nowy pomiar na podstawie adresu
exports.addMeasureAddress = function (req, res) {
    Model.Measure.forge({
        address: req.body.address,
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
};

//pomiary sensora na podstawie sensorID
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

//dodaj nowego uzytkownika - nie uzywane 
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

//dodaj hub, wymagane hubid i userid
exports.addHub = function (req, res) {
    Model.Hub.forge(req.body)
        .save()
        .then(function (hub) {
            res.send({ msg: '' });
        })
        .catch(function (err) {
            res.send({ msg: err.message });
        });
}

//dodaj sensor, wymagany hubid i sensorid
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

//dodaj pomiar, wymagany sensorid
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

//dodaj pomiar jako zapytanie GET
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

//edytuj hub, wymagany parametr - hubID
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

//edytuj sensor, wymagany parametr - sensorID
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

//usun sensor i wszystkie pomiary, wymagany parametr - sensorID
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

//usuwa hub, wszystkie jego sensory i ich pomiary - OSTROZNIE
exports.deleteHub = function (req, res) {
    Model.Hub.forge({ hubID: req.params.id })
        .fetch({ require: true })
        .then(function (hub) {
            hub.destroy()
                .then(function () {
                    res.json({ error: false, data: { message: 'Hub successfully deleted' } });
                })
                .catch(function (err) {
                    res.status(500).json({ error: true, data: { message: err.message } });
                });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
}

//usuwa pomiary sensora
exports.deleteMeasure = function (req, res) {
    Model.Measure
        .query().whereIn('sensorID', [req.params.id]).del().then(function () {
            res.json({ error: false, data: { message: 'Sensor successfully deleted' } });
        })
        .catch(function (err) {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
}