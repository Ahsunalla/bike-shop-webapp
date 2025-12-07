export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center">
        Om MS Cykelcenter
      </h1>

      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Hos MS Cykelcenter kombinerer vi passion for kvalitet, cykelglæde og mange års erfaring. 
        Vi hjælper dig med at finde den perfekte cykel og de bedste reservedele — uanset om du 
        pendler, motionerer eller vil ud på eventyr.
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
          Vores mål er at give dig den bedste service – både i butikken og online. 
          Vi udvælger nøje vores cykler og cykeldele, så du får produkter, du kan 
          stole på, og som holder i mange år.
        </p>

        <p>
          Hos os finder du alt fra herre-, dame- og børnecykler til hjelme, låse, 
          tilbehør og service. Vi tror på gennemsigtighed, god rådgivning og 
          konkurrencedygtige priser.
        </p>

        <p>
          Har du spørgsmål? Vores team står altid klar til at hjælpe dig videre — 
          både online og i butikken på Vester Farimagsgade.
        </p>
      </div>
    </div>
  );
}
