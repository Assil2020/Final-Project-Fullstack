import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import PropTypes from "prop-types";
export default function ListingItem({ listing }) {
  const formatPriceWithSpaces = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-red-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-black truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-black line-clamp-2">
            {listing.description}
          </p>
          <p className="text-red-700 mt-2 font-semibold ">
            {listing.offer
              ? `${formatPriceWithSpaces(listing.discountPrice)} DA`
              : `${formatPriceWithSpaces(listing.regularPrice)} DA`}
            {listing.type === "rent" && " / jour"}
          </p>
          {/* <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.seats > 1
                ? `${listing.seats} Sièges `
                : `${listing.seats} Siège `}
            </div>
            <div className="font-bold text-xs">
              {listing.doors > 1
                ? `${listing.doors} Portes `
                : `${listing.doors} Porte `}
            </div>
            <div className="font-bold text-xs">
              {listing.year && <span>{listing.year}</span>}
            </div>
            <div className="font-bold text-xs">
              {listing.mileage && <span>{listing.mileage}</span>}
            </div>
            <div className="font-bold text-xs">
              {listing.color && <span>{listing.color}</span>}
            </div>
            <div className="font-bold text-xs">
              {listing.brand && <span>{listing.brand}</span>}
            </div>
          </div> */}
        </div>
      </Link>
    </div>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    offer: PropTypes.bool.isRequired,
    discountPrice: PropTypes.number.isRequired,
    regularPrice: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["rent", "sale"]).isRequired,
    seats: PropTypes.number.isRequired,
    doors: PropTypes.number.isRequired,
    year: PropTypes.number,
    mileage: PropTypes.number,
    color: PropTypes.string,
    brand: PropTypes.string,
  }).isRequired,
};
