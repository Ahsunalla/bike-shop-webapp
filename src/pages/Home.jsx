import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FE3C4C] min-h-screen">
      {/* Main hero container */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-white">
        {/* LEFT – text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Din lokale cykelbutik – nu online
          </h1>
          <p className="text-lg md:text-xl mb-6 text-red-50">
            Find den perfekte cykel til hverdag, arbejde eller eventyr.
            Kvalitetscykler, personlig service og ærlig rådgivning.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/bikes")}
              className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Se cykler
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-6 py-3 border border-white rounded-full font-semibold hover:bg-white hover:text-[#FE3C4C] transition"
            >
              Kontakt os
            </button>
          </div>
        </div>

        {/* RIGHT – image / illustration area */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-full h-64 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center">
            <span className="text-white/70 text-sm">
              (Her kan du senere indsætte et billede af butikken eller cykler)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
