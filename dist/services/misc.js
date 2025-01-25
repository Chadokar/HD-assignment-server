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
exports.handlebarsReplacements = exports.compareHash = exports.parseToken = exports.verifyJWT = exports.generateJWT = exports.generateHash = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const handlebars_1 = __importDefault(require("handlebars"));
const handlebarsReplacements = ({ source, replacements }) => {
    return handlebars_1.default.compile(source)(replacements);
};
exports.handlebarsReplacements = handlebarsReplacements;
const generateJWT = (payload, options = { expiresIn: "1d" }) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, options);
};
exports.generateJWT = generateJWT;
const parseToken = (req) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        throw new Error("Token not found");
    }
    return token;
};
exports.parseToken = parseToken;
const verifyJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
};
exports.verifyJWT = verifyJWT;
const generateHash = (text, saltRounds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(String(text), saltRounds);
});
exports.generateHash = generateHash;
const compareHash = (text, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(String(text), hash);
});
exports.compareHash = compareHash;
