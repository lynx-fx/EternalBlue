const mongoose = require("mongoose");
const User = require("../model/Users");
const Scam = require("../model/Scam");

class ServiceError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

exports.getAnalytics = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const admins = await User.countDocuments({ role: "admin" });
        const activeDirectives = await Scam.countDocuments();
        const priorityAlerts = await Scam.countDocuments({ severity: "High" });
        return { totalUsers, activeUsers, admins, activeDirectives, priorityAlerts };
    } catch (e) {
        throw new ServiceError("Failed to aggregate data", 500);
    }
};

exports.getAllUsers = async () => {
    return await User.find({}).select("-password").sort({ createdAt: -1 });
};

exports.addAdmin = async (name, email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ServiceError("User already exists", 400);
    }
    const admin = new User({
        name,
        email,
        password,
        role: "admin",
        isActive: true
    });
    return await admin.save();
};

exports.banUser = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new ServiceError("User not found", 404);
    if (user.role === "admin") throw new ServiceError("Cannot modify another administrator", 403);
    
    user.isActive = !user.isActive;
    await user.save();
    return { user, isActive: user.isActive };
};

exports.deleteUser = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new ServiceError("User not found in system", 404);
    if (user.role === "admin") throw new ServiceError("Critical: Cannot execute deletion on fellow Administrator node.", 403);
    
    await User.findByIdAndDelete(id);
    return true;
};