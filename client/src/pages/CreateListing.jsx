import { useState, useEffect, useMemo } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "sale",
    seats: 5,
    doors: 4,
    regularPrice: 5000,
    discountPrice: 0,
    offer: false,
    transmission: "Manuelle",
    fuelType: "Essence",
    year: "2020",
    mileage: "10000",
    color: "Bleu",
    brand: "",
    model: "",
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [carModels, setCarModels] = useState([]);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(
            "Échec du téléchargement de l'image (2Mo maximum par image)"
          );
          setUploading(false);
        });
    } else {
      setImageUploadError(
        "Vous ne pouvez télécharger que 6 images par annonce"
      );
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (e.target.id === "offer") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === "fuelType") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "transmission") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "year") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "mileage") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "color") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "brand") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "model") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    console.log("Brand value after change:", formData.brand);
    console.log("Model value after change:", formData.model);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("Vous devez télécharger au moins une image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Le prix réduit doit être inférieur au prix régulier");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const carModelsData = useMemo(() => {
    return {
      Acura: ["INTEGRA", "TLX", "RDX", "MDX"],
      "Alfa Romeo": ["TONALE", "GIULIA", "STELVIO"],
      "Aston Martin": ["Db11", "Db12", "Dbs", "Dbx"],
      Audi: [
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "Q2",
        "Q3",
        "Q4 e-tron",
        "Q5",
        "Q7",
        "Q8",
        "TT",
        "R8",
      ],
      Bentley: ["Bentayga", "Continental", "Flying Spur"],
      BMW: [
        "X1",
        "X3",
        "X5",
        "2 Series",
        "4 Series",
        "5 Series",
        "6 Series",
        "7 Series",
        "8 Series",
        "Z4",
        "i3",
        "i4",
        "iX",
        "iX3",
        "M2",
        "M3",
        "M4",
        "M5",
        "M8",
        "X3 M",
        "X4 M",
        "X5 M",
        "X6 M",
      ],
      Bugatti: ["Chiron", "Veyron", "Divo"],
      Cadillac: ["Escalade", "XT4", "XT5"],
      Chevrolet: [
        "Camaro",
        "Silverado",
        "Tahoe",
        "Suburban",
        "Corvette",
        "Blazer",
      ],
      Chrysler: ["300"],
      Dodge: ["Charger", "Durango", "Challenger", "Durango SRT"],
      Ferrari: [
        "488",
        "F8 Tributo",
        "Portofino",
        "Roma",
        "296 GTB",
        "SF90 Stradale",
        "812 Superfast",
      ],
      Ford: [
        "Mustang",
        "Bronco",
        "Bronco Sport",
        "Maverick",
        "Edge",
        "Explorer",
        "Expedition",
        "F-150",
        "Super Duty",
        "Mustang Mach-E",
      ],
      Genesis: [
        "G70",
        "G80",
        "GV80",
        "G90",
        "GV60",
        "GV70",
        "GV80 Electrified",
      ],
      Jaguar: ["F-PACE", "XE", "I-PACE", "F-TYPE", "XF", "E-PACE"],
      Jeep: [
        "Cherokee",
        "Grand Cherokee",
        "Wrangler",
        "Gladiator",
        "Wagoneer",
        "Grand Wagoneer",
      ],
      Kia: ["Seltos", "Sportage", "Telluride"],
      Lamborghini: ["Aventador", "Huracán", "Urus"],
      "Land Rover": ["Defender", "Discovery", "Range Rover", "Velar", "Evoque"],
      Lexus: ["ES", "RX", "NX", "IS", "LC", "RC", "UX", "GX", "LX"],
      Lincoln: [
        "Aviator",
        "Corsair",
        "Navigator",
        "MKZ",
        "Nautilus",
        "Aviator Grand Touring",
      ],
      Lotus: ["Evora", "Exige", "Elise"],
      Maserati: ["Ghibli", "Levante", "Quattroporte", "MC20"],
      McLaren: ["570S", "720S", "Artura"],
      "Mercedes-Benz": [
        "C-Class",
        "E-Class",
        "S-Class",
        "GLA",
        "GLB",
        "GLC",
        "GLE",
        "GLS",
        "G-Class",
        "SL",
        "SLC",
        "AMG GT",
        "EQS",
        "EQE",
        "EQB",
        "EQV",
      ],
      Porsche: [
        "911",
        "Cayenne",
        "Panamera",
        "Taycan",
        "718 Cayman",
        "718 Boxster",
        "Macan",
      ],
      "Rolls-Royce": ["Phantom", "Ghost", "Cullinan"],
      Tesla: ["Model 3", "Model S", "Model X"],
    };
  }, []);

  useEffect(() => {
    setCarModels(carModelsData[selectedBrand] || []);

    if (!formData.model && selectedBrand && carModelsData[selectedBrand]) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        model: carModelsData[selectedBrand][0] || "",
      }));
    }
  }, [selectedBrand, carModelsData, formData]);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-slate-100 text-3xl font-semibold text-center my-7">
        Créer une annonce
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Titre"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Addresse"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="text-slate-100 flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Vendre</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Louer</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Réduction</span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="brand">Marque de voiture : </label>
              <select
                id="brand"
                required
                className="text-black p-3 border border-gray-300 rounded-lg"
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setFormData({
                    ...formData,
                    brand: e.target.value,
                  });
                }}
                value={formData.brand}
              >
                <option value="" disabled>
                  Sélectionner une Marque
                </option>
                <option value="Acura">Acura</option>
                <option value="Alfa Romeo">Alfa Romeo</option>
                <option value="Aston Martin">Aston Martin</option>
                <option value="Audi">Audi</option>
                <option value="Bentley">Bentley</option>
                <option value="BMW">BMW</option>
                <option value="Bugatti">Bugatti</option>
                <option value="Cadillac">Cadillac</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Chrysler">Chrysler</option>
                <option value="Dodge">Dodge</option>
                <option value="Ferrari">Ferrari</option>
                <option value="Ford">Ford</option>
                <option value="Genesis">Genesis</option>
                <option value="Jaguar">Jaguar</option>
                <option value="Jeep">Jeep</option>
                <option value="Kia">Kia</option>
                <option value="Lamborghini">Lamborghini</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Lexus">Lexus</option>
                <option value="Lincoln">Lincoln</option>
                <option value="Lotus">Lotus</option>
                <option value="Maserati">Maserati</option>
                <option value="McLaren">McLaren</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Porsche">Porsche</option>
                <option value="Rolls-Royce">Rolls-Royce</option>
                <option value="Tesla">Tesla</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="model">Modèle de voiture : </label>
              <select
                id="model"
                required
                className="text-black p-3 border border-gray-300 rounded-lg"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    model: e.target.value,
                  });
                }}
                value={formData.model}
              >
                <option value="" disabled>
                  Sélectionner un modèle
                </option>
                {carModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <p>Année de mise en circulation: </p>
              <input
                type="text"
                id="year"
                minLength="4"
                maxLength="4"
                pattern="\d{4}"
                placeholder="YYYY"
                required
                className="text-black p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.year}
              />
            </div>
            {/* <div className="flex items-center gap-2">
              <p>Kilométrage: </p>
              <input
                type="text"
                id="mileage"
                minLength="1"
                maxLength="3000000"
                placeholder="Kilométrage"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.mileage}
              />
              <span className="ml-2">KM</span>
            </div> */}
            <div className="flex items-center gap-2">
              <p>Kilométrage: </p>
              <input
                type="number"
                id="mileage"
                min="1"
                max="10000000"
                required
                className="text-black p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.mileage}
              />
              <span className="ml-2">KM</span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="fuelType">Type de carburant: </label>
              <select
                id="fuelType"
                required
                className="text-black p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.fuelType}
              >
                <option value="Essence">Essence</option>
                <option value="GasOil">Gas-oil</option>
                <option value="Electrique">Electrique</option>
                <option value="Hybride">Hybride</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="transmission">Transmission: </label>
              <select
                id="transmission"
                required
                className="text-black p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.transmission}
              >
                <option value="Manuelle">Manuelle</option>
                <option value="Automatique">Automatique</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="text-slate-100 flex items-center gap-2">
              <p>Sièges: </p>
              <input
                type="number"
                id="seats"
                min="2"
                max="7"
                required
                className="text-black p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.seats}
              />
            </div>
            <div className="text-slate-100 flex items-center gap-2">
              <p>Portes: </p>
              <input
                type="number"
                id="doors"
                min="2"
                max="5"
                required
                className="text-black p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.doors}
              />
            </div>
            <div className="text-slate-100 flex items-center gap-2">
              <label htmlFor="color">Couleur: </label>
              <select
                id="color"
                required
                className="text-black p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.color}
              >
                <option value="Bleu">Bleu</option>
                <option value="Rouge">Rouge</option>
                <option value="Vert">Vert</option>
                <option value="Noir">Noir</option>
                <option value="Blanc">Blanc</option>
                <option value="Argent">Argent</option>
                <option value="Gris">Gris</option>
                <option value="Jaune">Jaune</option>
                <option value="Orange">Orange</option>
                <option value="Marron">Marron</option>
                <option value="Rose">Rose</option>
                <option value="Violet">Violet</option>
              </select>
            </div>
            <div className="text-slate-100 flex items-center gap-2">
              <p>Prix final: </p>
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000000"
                required
                className="text-black p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                {formData.type === "rent" && (
                  <span className="text-xs">(DA / jour)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="text-slate-100 flex items-center gap-2">
                <p>Prix avec réduction: </p>
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="text-black p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  {formData.type === "rent" && (
                    <span className="text-xs">(DA / jour)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-slate-100 flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-400 ml-2">
              La première image sera la couverture (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="text-white p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Téléchargement..." : "Télécharger"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Supprimer
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Création..." : "Créer une annonce"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
