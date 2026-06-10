import InfoCard from "./InfoCard";

export default function BikeInfo({
  vehicle,
}: {
  vehicle: any;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Bike Information
      </h2>

      <div className="grid gap-4">
        <InfoCard
          label="Registration Number"
          value={vehicle.registrationNumber}
        />

        <InfoCard
          label="Make"
          value={vehicle.make}
        />

        <InfoCard
          label="Colour"
          value={vehicle.colour}
        />

        <InfoCard
          label="Fuel Type"
          value={vehicle.fuelType}
        />

        <InfoCard
          label="Engine Capacity"
          value={`${vehicle.engineCapacity} cc`}
        />
      </div>
    </div>
  );
}