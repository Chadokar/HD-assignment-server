"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const misc_1 = require("../services/misc");
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const decoded = (0, misc_1.verifyJWT)(token);
        req.body.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.default = authenticate;
