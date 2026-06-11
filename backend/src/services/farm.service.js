const Farm = require("../models/farm.model");

const createFarm = async (payload) => {
  return Farm.create(payload);
};

const getFarms = async () => {
  return Farm.find().sort({ createdAt: -1 });
};

module.exports = {
  createFarm,
  getFarms
};
