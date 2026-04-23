const Scam = require("../model/Scam");

exports.addScam = async (req, res) => {
    try {
        const { country, title, description, severity, coordinates } = req.body;
        if (!country || !title || !description) {
            return res.status(400).json({ success: false, message: "Country, title, and description are required" });
        }

        const newScam = new Scam({
            country,
            title,
            description,
            severity: severity || "Medium",
            coordinates: coordinates || null,
            createdBy: req.user.id || req.user._id
        });

        await newScam.save();
        res.status(201).json({ success: true, message: "Scam added successfully", scam: newScam });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding scam" });
    }
};

exports.getScamsByCountry = async (req, res) => {
    try {
        const { country } = req.params;
        const scams = await Scam.find({ country: country.toLowerCase().trim() }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, scams });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching scams" });
    }
};

exports.getAllScams = async (req, res) => {
    try {
        const scams = await Scam.find().sort({ country: 1, createdAt: -1 });
        res.status(200).json({ success: true, scams });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching scams" });
    }
};

exports.deleteScam = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Scam.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Scam not found" });
        }
        res.status(200).json({ success: true, message: "Scam deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting scam" });
    }
};
