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
exports.deleteNote = exports.getNotes = exports.createNote = void 0;
const NotesModel_1 = __importDefault(require("../models/NotesModel"));
const createNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { detail, userId } = req.body;
        const note = yield NotesModel_1.default.create({ detail, userId });
        res.status(201).json({
            note: {
                id: note._id,
                detail: note.detail,
                userId: note.userId,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createNote = createNote;
const getNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const userId = req.body.user.id;
        const notes = yield NotesModel_1.default.find({ userId })
            .limit(limit)
            .skip((page - 1) * limit);
        res.status(201).json(notes.map((note) => ({
            id: note._id,
            detail: note.detail,
            userId: note.userId,
        })));
    }
    catch (error) {
        next(error);
    }
});
exports.getNotes = getNotes;
const deleteNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield NotesModel_1.default.findByIdAndDelete(id);
        res.status(204).json({
            message: "Note deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteNote = deleteNote;
