const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Crop Scheduler backend is healthy"
  });
};

module.exports = { getHealth };
