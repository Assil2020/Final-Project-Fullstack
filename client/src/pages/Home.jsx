import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div
      className="bg-black"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/sports-car-races-through-dark-blurred-motion-generative-ai_188544-12490.jpg?w=2000&t=st=1703972353~exp=1703972953~hmac=2d16f7dcec1b93eb614917abe50925794961b5893a8ab3e604e7cc49577ebdff')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-gray-200 font-bold text-3xl lg:text-6xl">
          Trouvez votre prochain <span className="text-red-700">véhicule</span>
          <br />
          parfait
        </h1>
        <div className="text-slate-100 text-xs sm:text-xl">
          <span className="text-red-700">AssilAuto</span> est le meilleur
          endroit pour trouver votre prochain véhicule en ligne.
          <br />
          Nous mettons à votre disposition une vaste sélection de véhicule,
          parmi lesquelles vous pouvez faire votre choix.
        </div>
        <Link
          to={"/search"}
          className="text-xl sm:text-xl text-green-700 font-bold hover:underline"
        >
          Commençons...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-5xl font-semibold text-gray-200">
                Offres récentes
              </h2>
              <Link
                className="text-xl text-green-700 hover:underline"
                to={"/search?offer=true"}
              >
                Afficher plus d'offres
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-5xl font-semibold text-gray-200">
                Voitures récentes à louer
              </h2>
              <Link
                className="text-xl text-green-700 hover:underline"
                to={"/search?type=rent"}
              >
                Afficher plus de véhicule à louer
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-5xl font-semibold text-gray-200">
                Véhicules récents à vendre
              </h2>
              <Link
                className="text-xl text-green-700 hover:underline"
                to={"/search?type=sale"}
              >
                Afficher plus de voitures à vendre
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
