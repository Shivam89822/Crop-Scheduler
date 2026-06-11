const { scheduleTemplates } = require("../../constants/schedule.constants");
const ApiError = require("../../utils/api-error");

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const generateScheduleTasks = (crop) => {
  const template = scheduleTemplates[crop.type];

  if (!template) {
    throw new ApiError(400, `No schedule template configured for crop type ${crop.type}`);
  }

  return template.map((item) => ({
    category: item.category,
    title: item.title,
    description: item.description,
    dueDate: addDays(crop.sowingDate, item.dayOffset),
    priority: item.priority,
    isDone: false
  }));
};

module.exports = generateScheduleTasks;
