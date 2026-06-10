"use client";
import { useState } from "react";

export default function Home() {
  const [registration, setRegistration] = useState("");
  const [vehicle, setVehicle] = useState(null);

  const searchVehicle = async () => {
    const response = await fetch("/api/vehicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registrationNumber: registration,
      }),
    });

    const data = await response.json();
    console.log(data);

    setVehicle(data);
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
          DVLA Vehicle Checker
        </h1>

        <p className="text-center text-slate-500 mb-8">
          Enter a registration number to retrieve vehicle information.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={registration}
            onChange={(e) => setRegistration(e.target.value.toUpperCase())}
            placeholder="AA19AAA"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={searchVehicle}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            Search
          </button>
        </div>

        {vehicle && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">
              Vehicle Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Registration Number
                </p>
                <p className="font-semibold">
                  {vehicle.registrationNumber}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Make
                </p>
                <p className="font-semibold">
                  {vehicle.make}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Colour
                </p>
                <p className="font-semibold">
                  {vehicle.colour}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Year Of Manufacture
                </p>
                <p className="font-semibold">
                  {vehicle.yearOfManufacture}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Fuel Type
                </p>
                <p className="font-semibold">
                  {vehicle.fuelType}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Engine Capacity
                </p>
                <p className="font-semibold">
                  {vehicle.engineCapacity} cc
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  CO₂ Emissions
                </p>
                <p className="font-semibold">
                  {vehicle.co2Emissions} g/km
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Wheel Plan
                </p>
                <p className="font-semibold">
                  {vehicle.wheelplan}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Tax Status
                </p>
                <p className={`font-semibold ${vehicle.taxStatus === "Taxed"
                    ? "text-green-600"
                    : "text-red-600"
                  }`}>
                  {vehicle.taxStatus}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  MOT Status
                </p>
                <p className={`font-semibold ${vehicle.motStatus === "Valid"
                    ? "text-green-600"
                    : "text-red-600"
                  }`}>
                  {vehicle.motStatus}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  MOT Expiry Date
                </p>
                <p className="font-semibold">
                  {vehicle.motExpiryDate}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  First Registration
                </p>
                <p className="font-semibold">
                  {vehicle.monthOfFirstRegistration}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Last V5C Issued
                </p>
                <p className="font-semibold">
                  {vehicle.dateOfLastV5CIssued}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Marked For Export
                </p>
                <p className="font-semibold">
                  {vehicle.markedForExport ? "Yes" : "No"}
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}
