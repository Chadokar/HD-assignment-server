import { Request, Response, NextFunction } from "express";
import NotesModel from "../models/NotesModel";

const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { detail, userId } = req.body;
    const note = await NotesModel.create({ detail, userId });
    res.status(201).json({ note });
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.body.user.id;
    const notes = await NotesModel.find({ userId })
      .limit(Number(limit))
      .skip((Number(limit) - 1) * Number(page));
    res.status(201).json({ notes });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await NotesModel.findByIdAndDelete(id);
    res.status(204).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { createNote, getNotes, deleteNote };
