"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decoder = exports.redirectedUrl = void 0;
const googleapis_1 = require("googleapis");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const misc_1 = require("../services/misc");
const client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);
const redirectedUrl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("entered");
    try {
        const authorizationUrl = client.generateAuthUrl({
            access_type: "offline",
            scope: ["email", "profile"],
            include_granted_scopes: true,
        });
        res.status(200).send({ url: authorizationUrl });
    }
    catch (error) {
        next(error);
    }
});
exports.redirectedUrl = redirectedUrl;
const decoder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("query : ", req.query);
        const code = Array.isArray(req.query.code)
            ? req.query.code[0]
            : req.query.code;
        if (typeof code !== "string") {
            res
                .status(400)
                .json({ message: "Authorization code not provided or invalid" });
            return;
        }
        // console.log("code : ", code);
        const { tokens } = yield client.getToken(code);
        if (!tokens || !tokens.id_token) {
            res.status(400).json({ message: "Invalid Google token" });
            return;
        }
        const ticket = yield client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            res.status(400).json({ message: "Invalid Google token" });
            return;
        }
        let user = yield UserModel_1.default.findOne({
            email: payload.email,
        });
        if (!user) {
            user = yield UserModel_1.default.create({
                email: payload.email,
                name: payload.name,
            });
        }
        const token = (0, misc_1.generateJWT)({ id: user._id });
        res.json({
            token,
            user: { name: user.name, email: user.email, id: user._id },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.decoder = decoder;
