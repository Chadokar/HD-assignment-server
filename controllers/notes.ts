import { Request, Response, NextFunction } from "express";
import NotesModel from "../models/NotesModel";

const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { detail, userId } = req.body;
    const note = await NotesModel.create({ detail, userId });
    res.status(201).json({
      note: {
        id: note._id,
        detail: note.detail,
        userId: note.userId,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.body.user.id;
    const notes = await NotesModel.find({ userId })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(201).json(
      notes.map((note) => ({
        id: note._id,
        detail: note.detail,
        userId: note.userId,
      }))
    );
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
