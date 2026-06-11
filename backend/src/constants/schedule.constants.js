const scheduleTemplates = {
  CHILLI: [
    {
      dayOffset: 0,
      category: "PREPARATION",
      title: "Seed Treatment",
      description: "Treat chilli seeds before sowing.",
      priority: "HIGH"
    },
    {
      dayOffset: 12,
      category: "MONITORING",
      title: "Germination Check",
      description: "Inspect germination percentage and patch gaps.",
      priority: "MEDIUM"
    },
    {
      dayOffset: 25,
      category: "NUTRITION",
      title: "First Fertilizer Application",
      description: "Apply the first recommended fertilizer dose.",
      priority: "HIGH"
    }
  ],
  COTTON: [
    {
      dayOffset: 0,
      category: "PREPARATION",
      title: "Seed Treatment",
      description: "Treat cotton seeds before sowing.",
      priority: "HIGH"
    },
    {
      dayOffset: 10,
      category: "MONITORING",
      title: "Germination Check",
      description: "Check field emergence and re-sowing needs.",
      priority: "MEDIUM"
    },
    {
      dayOffset: 20,
      category: "NUTRITION",
      title: "Fertilizer Application",
      description: "Apply the first fertilizer dose.",
      priority: "HIGH"
    },
    {
      dayOffset: 35,
      category: "IRRIGATION",
      title: "Irrigation",
      description: "Provide irrigation based on field moisture.",
      priority: "MEDIUM"
    },
    {
      dayOffset: 60,
      category: "PEST",
      title: "Whitefly Monitoring",
      description: "Inspect for whitefly incidence and leaf curling.",
      priority: "HIGH"
    }
  ]
};

module.exports = { scheduleTemplates };
