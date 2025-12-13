import { useNavigate } from "react-router-dom";
import { FaArrowDown } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-hidden">

      {/* HERO SECTION */}
      <section
        className="relative w-full h-[900px] flex items-center justify-center"
        style={{ backgroundColor: "#FE3C4C" }}
      >
        {/* COMFY TEXT */}
        <h1
          className="absolute text-white font-[Anton] select-none"
          style={{
            fontSize: "400px",
            top: "50px",
            lineHeight: "0.8",
            letterSpacing: "-10px",
          }}
        >
          COMFY
        </h1>

        {/* BIKE IMAGE */}
        <img
          src="https://nrwytmkeshyrkblofvrz.supabase.co/storage/v1/object/public/bike-images/IMG_9166-PhotoRoom.png-PhotoRoom.png.webp"
          alt="Red Bike"
          className="absolute"
          style={{
            width: "676px",
            height: "507px",
            top: "260px",
          }}
        />

        {/* TEXT + BUTTON */}
        <div className="absolute left-16" style={{ top: "500px" }}>
          <h2 className="text-white text-4xl font-bold mb-4">Red Beauty</h2>

          <p className="text-white max-w-md mb-6">
          Are you looking for bicycles for sale in Copenhagen? The red Van de Lux women's bike with 3 gears is waiting for you at MS Cykelcenter, your local bike shop by Vesterport Station.
          </p>

          {/* BUTTON (one button only) */}
          <button
            onClick={() => navigate("/bikes")}
            className="px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            See Bikes
          </button>
        </div>

        {/* SCROLL DOWN CIRCLE */}
        <div
          className="absolute right-16 flex flex-col items-center text-white cursor-pointer"
          style={{ bottom: "180px" }}
          onClick={() =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            })
          }
        >
          <div className="w-16 h-16 border border-white rounded-full flex items-center justify-center text-xl">
            <FaArrowDown />
          </div>
          <span className="text-sm mt-2">Scroll Down</span>
        </div>
      </section>

      {/* NORDEN ELLEN BLUSH STRIP */}
      <section className="w-full py-4 px-4">
  <div className="bg-black text-white py-20 rounded-xl flex flex-col items-center">
    <h2 className="text-7xl font-bold mb-6">Van de Lux </h2>
    <p className="mb-8 text-4xl opacity-80">With 7 Gears</p>

    <img
      src="https://nrwytmkeshyrkblofvrz.supabase.co/storage/v1/object/public/bike-images/IMG_9153-PhotoRoom.png-PhotoRoom.png.webp"
      className="w-[500px]"
      alt="Norden Ellen Blush"
    />

    <button
      onClick={() => navigate("/bikes")}
      className="mt-6 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition"
    >
      See More
    </button>
  </div>
</section>


      {/* FIRST 2-COLUMN ROW (WITH WHITE GAP) */}
      <section className="w-full px-4 mt-4">
        <div className="grid grid-cols-2 gap-4">

          {/* LEFT SIDE */}
          <div
  className="flex flex-col items-center py-16 rounded-xl"
  style={{
    background: "linear-gradient(to bottom, #F5F5F7 0%, #FFFFFF 100%)"
  }}
>
  <h3 className="text-3xl font-semibold">Velo Lux </h3>
  <p className="mb-6 opacity-70">
    The ultimate way to reach your destination
  </p>

  <img
    src="https://nrwytmkeshyrkblofvrz.supabase.co/storage/v1/object/public/bike-images/IMG_9150-PhotoRoom.png-PhotoRoom.png.webp"
    className="w-[430px]"
  />

  <button
    onClick={() => navigate("/bikes")}
    className="mt-6 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white"
  >
    See More
  </button>
</div>


          {/* RIGHT SIDE */}
          <div className="bg-[#F2B8BE] flex flex-col items-center py-16 rounded-xl">
            <h3 className="text-3xl font-semibold"> Falcon</h3>
            <p className="mb-6 opacity-70">
              Enjoy every minute with comfort and style
            </p>

            <img
              src="https://nrwytmkeshyrkblofvrz.supabase.co/storage/v1/object/public/bike-images/IMG_9204-PhotoRoom.png-PhotoRoom.png.webp"
              className="w-[430px]"
              alt="Norden Ellen Pink"
            />

            <button
              onClick={() => navigate("/bikes")}
              className="mt-6 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white"
            >
              See More
            </button>
          </div>

        </div>
      </section>

      {/* SECOND 2-COLUMN ROW (NEW) */}
      <section className="w-full px-4 mt-4 mb-10">
        <div className="grid grid-cols-2 gap-4">

          {/* NEW LEFT BOX – Purple */}
          <div
  className="flex flex-col items-center py-16 rounded-xl"
  style={{
    background: "linear-gradient(to bottom right, #E8D9FF 0%, #FFCCE7 100%)"
  }}
>
  <h3 className="text-3xl font-semibold">Falcon</h3>
  <p className="mb-6 opacity-70">Enjoy your elegant rides</p>

  <img
    src="https://nrwytmkeshyrkblofvrz.supabase.co/storage/v1/object/public/bike-images/IMG_9197-PhotoRoom.png-PhotoRoom.png.webp"
    className="w-[430px]"
  />

  <button
    onClick={() => navigate("/bikes")}
    className="mt-6 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white"
  >
    See More
  </button>
</div>


          {/* NEW RIGHT BOX – WHITE */}
          <div
  className="flex flex-col items-center py-16 rounded-xl"
  style={{
    background: "linear-gradient(to bottom, #D7E5F3, #FFFFFF)"
  }}
>
  <h3 className="text-3xl font-semibold">Van de Lux</h3>
  <p className="mb-6 opacity-70">
    The best example of perfection as a bike
  </p>

  <img
    src="https://nrwytmkeshyrkblofvrz.supabase.co/storage/v1/object/public/bike-images/IMG_9173_2-PhotoRoom.png-PhotoRoom.png.webp"
    className="w-[430px]"
  />

  <button
    onClick={() => navigate("/bikes")}
    className="mt-6 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white"
  >
    See More
  </button>
</div>


        </div>
      </section>
    </div>
  );
}
