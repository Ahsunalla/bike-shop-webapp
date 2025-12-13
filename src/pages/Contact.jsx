export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center">
        Contact Us
      </h1>

      <p className="text-center text-gray-600 max-w-xl mx-auto mb-12">
        Do you have any questions about bicycles, spare parts, or service?
        We are ready to help you.
      </p>

      {/* Contact Card */}
      <div className="bg-white rounded-2xl shadow p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">MS Cykelcenter</h2>

        <div className="space-y-3 text-gray-700 text-lg">
          <p>
            <strong>Tel:</strong>{" "}
            <a className="underline" href="tel:+45461655315">0045 - 61655315</a>
          </p>

          <p>
            <strong>Cvr.:</strong> 31518644
          </p>

          <p>
            <strong>Adress:</strong><br />
            Vester Farimagsgade 4-6,<br />
            1600 København V
          </p>

          <p>
            <strong>Email:</strong>{" "}
            <a className="underline" href="mailto:Hej@Findmincykel.dk">
              Hej@Findmincykel.dk
            </a>
          </p>

          <div className="mt-6">
            <p className="font-semibold text-gray-900">Opening hours</p>
            <p>Mon–Fri: 09.00 – 18.00</p>
            <p>Sat–Sun: 09.00 – 16.00</p>
          </div>
        </div>

        {/* Map (optional) */}
        <div className="mt-10 rounded-xl overflow-hidden shadow">
          <iframe
            title="MS Cykelcenter Location"
            src="https://www.google.com/maps?q=Vester%20Farimagsgade%204-6,%20K%C3%B8benhavn&output=embed"
            className="w-full h-80"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
