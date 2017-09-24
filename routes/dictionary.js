const express = require('express');
const router = express.Router();
const loki = require('lokijs');
const db = new loki('dictionary.db');
const dictionary = db.addCollection('dictionary');

/* POST pair */
router.post('/:key/:value', function post(req, res, next) {
  const filterObj = { key: req.params.key };
  const item = dictionary.findOne(filterObj);

  if (item) {
    res.sendStatus(409);
  } else {
    dictionary.insert({
      key: req.params.key,
      value: req.params.value
    });
    res.sendStatus(201);
  }
});

/* GET items */
router.get('/', function (req, res, next) {
  res.send(dictionary.find());
});

/* GET item by key */
router.get('/:key', function (req, res, next) {
  const item = dictionary.findOne({
    key: req.params.key
  });

  if (!item) {
    res.sendStatus(404);
  } else {
    res.send(item);
  }
});

/* PUT item */
router.put('/:key/:value', function (req, res, next) {
  const filterObj = { key: req.params.key };
  const item = dictionary.findOne(filterObj);
  const updateFn = item => item.value = req.params.value;

  if (!item) {
    res.sendStatus(404);
  } else {
    dictionary.findAndUpdate(filterObj, updateFn);
    res.sendStatus(200);
  }
});

/* DELETE item */
router.delete('/:key', function (req, res, next) {
  const filterObj = { key: req.params.key };
  const item = dictionary.findOne(filterObj);

  if (!item) {
    res.sendStatus(404);
  } else {
    dictionary.findAndRemove(filterObj);
    res.sendStatus(200);
  }
});

module.exports = router;
