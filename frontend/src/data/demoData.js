const today = new Date();

const atHour = (hour) => {
  const date = new Date(today);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const demoFarms = [
  {
    _id: 'demo-farm-1',
    name: 'Green Field',
    area: 4.5,
    location: 'Nagpur, Maharashtra',
  },
  {
    _id: 'demo-farm-2',
    name: 'Canal Side Farm',
    area: 2,
    location: 'Wardha, Maharashtra',
  },
];

export const demoTasks = [
  {
    _id: 'demo-task-1',
    title: 'Vegetative stage irrigation',
    category: 'IRRIGATION',
    priority: 'HIGH',
    dueDate: atHour(8),
    isDone: false,
  },
  {
    _id: 'demo-task-2',
    title: 'Check crop for whitefly',
    category: 'PEST',
    priority: 'HIGH',
    dueDate: atHour(11),
    isDone: false,
  },
  {
    _id: 'demo-task-3',
    title: 'Apply basal fertilizer',
    category: 'FERTILIZER',
    priority: 'MEDIUM',
    dueDate: atHour(16),
    isDone: true,
  },
];
