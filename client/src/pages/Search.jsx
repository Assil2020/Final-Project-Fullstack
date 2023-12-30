import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";
export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    sort: "created_at",
    order: "desc",
    priceFilter: "created_at_desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === "offer") {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "brand") {
      setBrand(e.target.value);
    }

    if (e.target.id === "model") {
      setModel(e.target.value);
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
    if (e.target.id === "year") {
      setYear(e.target.value);
    }

    if (e.target.id === "fuelType") {
      setFuelType(e.target.value);
    }

    if (e.target.id === "transmission") {
      setTransmission(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("brand", brand);
    urlParams.set("model", model);
    urlParams.set("year", parseInt(year, 10).toString());
    urlParams.set("fuelType", fuelType);
    urlParams.set("transmission", transmission);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();

    const newItems = data.filter(
      (newItem) => !listings.some((item) => item._id === newItem._id)
    );

    if (newItems.length < 1) {
      setShowMore(false);
    }

    setListings((prevListings) => [...prevListings, ...newItems]);
  };

  const handleResetFilters = () => {
    setSidebardata({
      searchTerm: "",
      type: "all",
      offer: false,
      sort: "created_at",
      order: "desc",
      priceFilter: "created_at_desc",
    });

    setBrand("");
    setModel("");
    setYear("");
    setFuelType("");
    setTransmission("");
  };

  return (
    <div className="text-slate-100 flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="mt-16 flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Terme de recherche:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Recherche..."
              className="text-black border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Location et vente</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Location</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Vente</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Réduction</span>
            </div>
          </div>
          <div className=" flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Marque:</label>
            <input
              type="text"
              id="brand"
              placeholder="Marque..."
              className="text-black border rounded-lg p-3 w-full"
              value={brand}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Modèle:</label>
            <input
              type="text"
              id="model"
              placeholder="Modèle..."
              className="text-black border rounded-lg p-3 w-full"
              value={model}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Année:</label>
            <input
              type="text"
              id="year"
              placeholder="Année..."
              className="text-black border rounded-lg p-3 w-full"
              value={year}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Type de carburant:
            </label>
            <select
              id="fuelType"
              className="text-black border rounded-lg p-3"
              value={fuelType}
              onChange={handleChange}
            >
              <option value="">Sélectionnez le type de carburant...</option>
              <option value="Essence">Essence</option>
              <option value="GasOil">Gas-oil</option>
              <option value="Electrique">Electrique</option>
              <option value="Hybride">Hybride</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Transmission:
            </label>
            <select
              id="transmission"
              className="text-black border rounded-lg p-3"
              value={transmission}
              onChange={handleChange}
            >
              <option value="">Sélectionnez le type de transmission...</option>
              <option value="Manuelle">Manuelle</option>
              <option value="Automatique">Automatique</option>
            </select>
          </div>
          <div className="text-black flex items-center gap-2">
            <label className="text-white font-semibold">Prix:</label>
            <select
              onChange={handleChange}
              value={sidebardata.priceFilter}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="">Sélectionnez l'ordre du prix...</option>
              <option value="regularPrice_desc">
                Prix du haut vers le bas
              </option>
              <option value="regularPrice_asc">Prix élevé</option>
              <option value="createdAt_desc">Le plus récent</option>
              <option value="createdAt_asc">Le plus ancien</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Recherche
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="bg-gray-500 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Réinitialiser les filtres
          </button>
        </form>
      </div>
      <div className="flex-1 mt-16">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-200 mt-5">
          Résultats de l'annonce:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-red-700">Aucune annonce trouvée!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Chargement...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Afficher plus
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
