import Listning from "../models/listning.model.js";

export const createListning = async (req, res, next) => {
  try {
    const listning = await Listning.create(req.body);
    return res.status(200).json(listning);
  } catch (error) {
    next(error);
  }
};
