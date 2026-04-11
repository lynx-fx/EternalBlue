const Report = require("../model/Report");
const User = require("../model/Users");

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  const { reportedUserId, messageContent } = req.body;

  try {
    const report = await Report.create({
      reporter: req.user.id,
      reportedUser: reportedUserId,
      messageContent,
    });
    
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating report" });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate("reporter", "name email")
      .populate("reportedUser", "name email")
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching reports" });
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReportStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating report" });
  }
};

module.exports = {
  createReport,
  getReports,
  updateReportStatus,
};
