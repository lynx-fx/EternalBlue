const mongoose = require("mongoose");
const User = require("../model/Users");
const userService = require("../service/userService");

class ServiceError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}