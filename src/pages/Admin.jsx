import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const ADMIN_EMAIL = "owner@mscykler.dk";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [loginForm, setLoginForm] = useState({ email: ADMIN_EMAIL, password: "" });
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("bikes"); // "bikes" | "parts"

  // Bikes state
  const [bikes, setBikes] = useState([]);
  const [bikesLoading, setBikesLoading] = useState(false);
  const [bikeForm, setBikeForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image_url: "",
  });
  const [bikeSaving, setBikeSaving] = useState(false);

  // Parts state
  const [parts, setParts] = useState([]);
  const [partsLoading, setPartsLoading] = useState(false);
  const [partForm, setPartForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image_url: "",
  });
  const [partSaving, setPartSaving] = useState(false);

  // Check existing session on load
  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session || null);
      setCheckingSession(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load bikes and parts when logged in
  useEffect(() => {
    if (!session) return;
    loadBikes();
    loadParts();
  }, [session]);

  const loadBikes = async () => {
    setBikesLoading(true);
    const { data, error } = await supabase
      .from("bikes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setBikes(data);
    setBikesLoading(false);
  };

  const loadParts = async () => {
    setPartsLoading(true);
    const { data, error } = await supabase
      .from("parts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setParts(data);
    setPartsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (loginForm.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setLoginError("Only the shop owner can log in.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (error) {
      setLoginError(error.message || "Login failed");
    } else {
      setSession(data.session);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Helpers: reset forms
  const resetBikeForm = () => {
    setBikeForm({
      id: null,
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image_url: "",
    });
  };

  const resetPartForm = () => {
    setPartForm({
      id: null,
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image_url: "",
    });
  };

  // Save bike (create or update)
  const handleSaveBike = async (e) => {
    e.preventDefault();
    setBikeSaving(true);

    const payload = {
      name: bikeForm.name,
      description: bikeForm.description,
      price: Number(bikeForm.price),
      stock: Number(bikeForm.stock),
      category: bikeForm.category,
      image_url: bikeForm.image_url,
    };

    let error;
    if (bikeForm.id) {
      ({ error } = await supabase
        .from("bikes")
        .update(payload)
        .eq("id", bikeForm.id));
    } else {
      ({ error } = await supabase.from("bikes").insert(payload));
    }

    if (error) {
      alert("Error saving bike: " + error.message);
    } else {
      resetBikeForm();
      await loadBikes();
    }

    setBikeSaving(false);
  };

  const handleEditBike = (bike) => {
    setBikeForm({
      id: bike.id,
      name: bike.name || "",
      description: bike.description || "",
      price: bike.price || "",
      stock: bike.stock || "",
      category: bike.category || "",
      image_url: bike.image_url || "",
    });
  };

  const handleDeleteBike = async (id) => {
    if (!window.confirm("Delete this bike?")) return;
    const { error } = await supabase.from("bikes").delete().eq("id", id);
    if (error) {
      alert("Error deleting bike: " + error.message);
    } else {
      await loadBikes();
    }
  };

  // Save part (create or update)
  const handleSavePart = async (e) => {
    e.preventDefault();
    setPartSaving(true);

    const payload = {
      name: partForm.name,
      description: partForm.description,
      price: Number(partForm.price),
      stock: Number(partForm.stock),
      category: partForm.category,
      image_url: partForm.image_url,
    };

    let error;
    if (partForm.id) {
      ({ error } = await supabase
        .from("parts")
        .update(payload)
        .eq("id", partForm.id));
    } else {
      ({ error } = await supabase.from("parts").insert(payload));
    }

    if (error) {
      alert("Error saving part: " + error.message);
    } else {
      resetPartForm();
      await loadParts();
    }

    setPartSaving(false);
  };

  const handleEditPart = (part) => {
    setPartForm({
      id: part.id,
      name: part.name || "",
      description: part.description || "",
      price: part.price || "",
      stock: part.stock || "",
      category: part.category || "",
      image_url: part.image_url || "",
    });
  };

  const handleDeletePart = async (id) => {
    if (!window.confirm("Delete this part?")) return;
    const { error } = await supabase.from("parts").delete().eq("id", id);
    if (error) {
      alert("Error deleting part: " + error.message);
    } else {
      await loadParts();
    }
  };

  if (checkingSession) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-lg text-gray-600">Checking admin session...</p>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!session) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            MS Cykler – Admin Login
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Only the shop owner can access this area.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {loginError && (
              <p className="text-red-600 text-sm mt-2">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Logged in as <span className="font-medium">{session.user.email}</span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 text-sm"
        >
          Log out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab("bikes")}
          className={`pb-2 text-sm font-semibold border-b-2 ${
            activeTab === "bikes"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
          }`}
        >
          Bikes
        </button>
        <button
          onClick={() => setActiveTab("parts")}
          className={`pb-2 text-sm font-semibold border-b-2 ${
            activeTab === "parts"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
          }`}
        >
          Bike Parts
        </button>
      </div>

      {/* BIKES TAB */}
      {activeTab === "bikes" && (
        <div className="space-y-10">
          {/* Bike form */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {bikeForm.id ? "Edit Bike" : "Add New Bike"}
            </h2>

            <form onSubmit={handleSaveBike} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={bikeForm.name}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, name: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Price (kr)"
                value={bikeForm.price}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, price: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={bikeForm.stock}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, stock: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Category"
                value={bikeForm.category}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, category: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={bikeForm.image_url}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, image_url: e.target.value })
                }
                className="border rounded-lg px-3 py-2 md:col-span-2"
              />
              <textarea
                placeholder="Description"
                value={bikeForm.description}
                onChange={(e) =>
                  setBikeForm({ ...bikeForm, description: e.target.value })
                }
                className="border rounded-lg px-3 py-2 md:col-span-2"
                rows={3}
              />

              <div className="flex gap-3 md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={bikeSaving}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-60"
                >
                  {bikeForm.id ? "Save Changes" : "Add Bike"}
                </button>

                {bikeForm.id && (
                  <button
                    type="button"
                    onClick={resetBikeForm}
                    className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Bike list */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">All Bikes</h2>

            {bikesLoading ? (
              <p className="text-gray-600">Loading bikes...</p>
            ) : bikes.length === 0 ? (
              <p className="text-gray-600">No bikes found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Name</th>
                      <th className="text-left py-2 pr-4">Category</th>
                      <th className="text-left py-2 pr-4">Price</th>
                      <th className="text-left py-2 pr-4">Stock</th>
                      <th className="text-left py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bikes.map((bike) => (
                      <tr key={bike.id} className="border-b last:border-0">
                        <td className="py-2 pr-4">{bike.name}</td>
                        <td className="py-2 pr-4">{bike.category}</td>
                        <td className="py-2 pr-4">
                          {new Intl.NumberFormat("da-DK").format(bike.price)} kr
                        </td>
                        <td className="py-2 pr-4">{bike.stock}</td>
                        <td className="py-2 pr-4 flex gap-2">
                          <button
                            onClick={() => handleEditBike(bike)}
                            className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBike(bike.id)}
                            className="px-3 py-1 text-xs border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PARTS TAB */}
      {activeTab === "parts" && (
        <div className="space-y-10">
          {/* Part form */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {partForm.id ? "Edit Part" : "Add New Part"}
            </h2>

            <form onSubmit={handleSavePart} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={partForm.name}
                onChange={(e) =>
                  setPartForm({ ...partForm, name: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Price (kr)"
                value={partForm.price}
                onChange={(e) =>
                  setPartForm({ ...partForm, price: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={partForm.stock}
                onChange={(e) =>
                  setPartForm({ ...partForm, stock: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Category"
                value={partForm.category}
                onChange={(e) =>
                  setPartForm({ ...partForm, category: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={partForm.image_url}
                onChange={(e) =>
                  setPartForm({ ...partForm, image_url: e.target.value })
                }
                className="border rounded-lg px-3 py-2 md:col-span-2"
              />
              <textarea
                placeholder="Description"
                value={partForm.description}
                onChange={(e) =>
                  setPartForm({ ...partForm, description: e.target.value })
                }
                className="border rounded-lg px-3 py-2 md:col-span-2"
                rows={3}
              />

              <div className="flex gap-3 md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={partSaving}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-60"
                >
                  {partForm.id ? "Save Changes" : "Add Part"}
                </button>

                {partForm.id && (
                  <button
                    type="button"
                    onClick={resetPartForm}
                    className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Parts list */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">All Parts</h2>

            {partsLoading ? (
              <p className="text-gray-600">Loading parts...</p>
            ) : parts.length === 0 ? (
              <p className="text-gray-600">No parts found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Name</th>
                      <th className="text-left py-2 pr-4">Category</th>
                      <th className="text-left py-2 pr-4">Price</th>
                      <th className="text-left py-2 pr-4">Stock</th>
                      <th className="text-left py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((part) => (
                      <tr key={part.id} className="border-b last:border-0">
                        <td className="py-2 pr-4">{part.name}</td>
                        <td className="py-2 pr-4">{part.category}</td>
                        <td className="py-2 pr-4">
                          {new Intl.NumberFormat("da-DK").format(part.price)} kr
                        </td>
                        <td className="py-2 pr-4">{part.stock}</td>
                        <td className="py-2 pr-4 flex gap-2">
                          <button
                            onClick={() => handleEditPart(part)}
                            className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePart(part.id)}
                            className="px-3 py-1 text-xs border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
