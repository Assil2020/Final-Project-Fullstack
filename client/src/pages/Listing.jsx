import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaMapMarkerAlt, FaShare, FaCar } from "react-icons/fa";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import { GiSteelDoor } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import {
  BsFillFuelPumpDieselFill,
  BsCalendarDateFill,
  BsSpeedometer,
} from "react-icons/bs";
import { IoIosColorFill } from "react-icons/io";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const formatPriceWithSpaces = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <main
      className="bg-white"
      style={{
        backgroundImage:
          "url('https://www.freepik.com/free-photo/grunge-abstract-metal-background_4007400.htm#query=car%20background&position=5&from_view=keyword&track=ais&uuid=b088e1d9-58ff-421f-985b-722ac7fefd67')",
        backgroundAttachment: "fixed",
      }}
    >
      {loading && <p className="text-center my-7 text-2xl">Chargement...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Une erreur s'est produite!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} -{" "}
              {listing.offer
                ? `${formatPriceWithSpaces(listing.discountPrice)} DA`
                : `${formatPriceWithSpaces(listing.regularPrice)} DA`}
              {listing.type === "rent" && " / jour"}
            </p>

            <p className="flex items-center mt-6 gap-2 text-green-900  text-sm">
              <FaMapMarkerAlt className="text-green-900" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "À louer" : "À vendre"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {+listing.regularPrice - +listing.discountPrice} DA de Remise
                </p>
              )}
            </div>
            <p className="text-gray-600">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              {listing.seats && (
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <MdOutlineAirlineSeatReclineExtra className="text-lg" />
                  {listing.seats > 1
                    ? `${listing.seats} Sièges `
                    : `${listing.seats} Siège `}
                </li>
              )}
              {listing.doors && (
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <GiSteelDoor className="text-lg" />
                  {listing.doors > 1
                    ? `${listing.doors} Portes `
                    : `${listing.doors} Porte `}
                </li>
              )}
              {listing.fuelType && (
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <BsFillFuelPumpDieselFill className="text-lg" />
                  {listing.fuelType === "Essence"
                    ? "Essence"
                    : listing.fuelType === "GasOil"
                    ? "GasOil"
                    : listing.fuelType === "Electrique"
                    ? "Electrique"
                    : "Hybride"}
                </li>
              )}
              {listing.transmission && (
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <TbManualGearbox className="text-lg" />
                  {listing.transmission.toLowerCase() === "manuelle"
                    ? "Manuelle"
                    : listing.transmission.toLowerCase() === "automatique"
                    ? "Automatique"
                    : "Autre"}
                </li>
              )}
              {listing.transmission && (
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <IoIosColorFill className="text-lg" />
                  {listing.color.toLowerCase() === "bleu"
                    ? "Bleu"
                    : listing.color.toLowerCase() === "rouge"
                    ? "Rouge"
                    : listing.color.toLowerCase() === "vert"
                    ? "Vert"
                    : listing.color.toLowerCase() === "noir"
                    ? "Noir"
                    : listing.color.toLowerCase() === "blanc"
                    ? "Blanc"
                    : listing.color.toLowerCase() === "argent"
                    ? "Argent"
                    : listing.color.toLowerCase() === "gris"
                    ? "Gris"
                    : listing.color.toLowerCase() === "jaune"
                    ? "Jaune"
                    : listing.color.toLowerCase() === "orange"
                    ? "Orange"
                    : listing.color.toLowerCase() === "marron"
                    ? "Marron"
                    : listing.color.toLowerCase() === "rose"
                    ? "Rose"
                    : listing.color.toLowerCase() === "violet"
                    ? "Violet"
                    : "Autre"}
                </li>
              )}
              {listing.transmission && (
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <FaCar className="text-lg" />
                  {listing.brand === "acura"
                    ? "Acura"
                    : listing.brand.toLowerCase() === "alfa romeo"
                    ? "Alfa Romeo"
                    : listing.brand.toLowerCase() === "aston martin"
                    ? "Aston Martin"
                    : listing.brand.toLowerCase() === "audi"
                    ? "Audi"
                    : listing.brand.toLowerCase() === "bentley"
                    ? "Bentley"
                    : listing.brand.toLowerCase() === "bmw"
                    ? "BMW"
                    : listing.brand.toLowerCase() === "bugatti"
                    ? "Bugatti"
                    : listing.brand.toLowerCase() === "cadillac"
                    ? "Cadillac"
                    : listing.brand.toLowerCase() === "chevrolet"
                    ? "Chevrolet"
                    : listing.brand.toLowerCase() === "chrysler"
                    ? "Chrysler"
                    : listing.brand.toLowerCase() === "dodge"
                    ? "Dodge"
                    : listing.brand.toLowerCase() === "ferrari"
                    ? "Ferrari"
                    : listing.brand.toLowerCase() === "ford"
                    ? "Ford"
                    : listing.brand.toLowerCase() === "genesis"
                    ? "Genesis"
                    : listing.brand.toLowerCase() === "jaguar"
                    ? "Jaguar"
                    : listing.brand.toLowerCase() === "jeep"
                    ? "Jeep"
                    : listing.brand.toLowerCase() === "kia"
                    ? "Kia"
                    : listing.brand.toLowerCase() === "lamborghini"
                    ? "Lamborghini"
                    : listing.brand.toLowerCase() === "land rover"
                    ? "Land Rover"
                    : listing.brand.toLowerCase() === "lexus"
                    ? "Lexus"
                    : listing.brand.toLowerCase() === "lincoln"
                    ? "Lincoln"
                    : listing.brand.toLowerCase() === "lotus"
                    ? "Lotus"
                    : listing.brand.toLowerCase() === "maserati"
                    ? "Maserati"
                    : listing.brand.toLowerCase() === "mcLaren"
                    ? "McLaren"
                    : listing.brand.toLowerCase() === "mercedes-benz"
                    ? "Mercedes-Benz"
                    : listing.brand.toLowerCase() === "porsche"
                    ? "Porsche"
                    : listing.brand.toLowerCase() === "rolls-royce"
                    ? "Rolls-Royce"
                    : listing.brand.toLowerCase() === "tesla"
                    ? "Tesla"
                    : "Autre"}
                </li>
              )}

              {listing.year && (
                <li className="flex items-center gap-2">
                  <BsCalendarDateFill className="text-green-700" />
                  <span>{listing.year}</span>
                </li>
              )}
              {listing.mileage && (
                <li className="flex items-center gap-2">
                  <BsSpeedometer className="text-green-700" />
                  <span>{listing.mileage} km</span>
                </li>
              )}
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contacter le propriétaire
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
