import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Annonce introuvable!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(
      errorHandler(401, "Vous ne pouvez supprimer que vos propres annonces!")
    );
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("L'annonce a été supprimée!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Annonce introuvable!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(
      errorHandler(
        401,
        "Vous ne pouvez mettre à jour que vos propres annonces!"
      )
    );
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Annonce introuvable!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const brand = req.query.brand || "";
    const model = req.query.model || "";
    const year = isNaN(req.query.year) ? undefined : parseInt(req.query.year);
    const fuelType = req.query.fuelType || "";
    const transmission = req.query.transmission || "";

    const filter = {
      name: { $regex: searchTerm, $options: "i" },
      offer,
      type,
    };

    if (brand) filter.brand = { $regex: brand, $options: "i" };
    if (model) filter.model = { $regex: model, $options: "i" };
    if (year !== undefined) filter.year = year;
    if (fuelType) filter.fuelType = { $regex: fuelType, $options: "i" };
    if (transmission)
      filter.transmission = { $regex: transmission, $options: "i" };

    const listings = await Listing.find(filter)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
