export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center">
        About MS Cykelcenter
      </h1>

      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        At MS Cykelcenter, we combine a passion for quality, a love of cycling, and many years of experience.
        We help you find the perfect bike and the best spare parts, whether you commute, exercise, or are heading out on an adventure. 
      </p>

      {/* Image section */}
      <div className="rounded-xl overflow-hidden shadow mb-12">
        <img
          src="https://images.unsplash.com/photo-1518655048521-f130df041f66"
          alt="Bike workshop"
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Mission section */}
      <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
        <p>
          Our goal is to provide you with the best service, both in store and online.
          We carefully select our bicycles and bike parts so you get products you can rely on and that will last for many years.
        </p>

        <p>
          With us, you’ll find everything from men’s, women’s, and children’s bicycles to helmets, locks, accessories, and service. 
          We believe in transparency, good guidance, and competitive prices.
        </p>

        <p>
          Do you have any questions? Our team is always ready to assist you, both online and in our shop on Vester Farimagsgade.
        </p>
      </div>
    </div>
  );
}
