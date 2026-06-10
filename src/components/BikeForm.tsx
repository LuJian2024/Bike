import { UseFormRegister } from "react-hook-form";

type FormData = {
  registrationNumber: string;
  make: string;
  colour: string;
  fuelType: string;
  engineCapacity: string;
  yearOfManufacture: string;
};

type Props = {
  register: UseFormRegister<any>;
};

export default function BikeForm({ register }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Bike Information
      </h2>

      <div className="space-y-4">
        <input
          {...register("registrationNumber")}
          placeholder="Registration Number"
          className="w-full border p-3 rounded-lg"
        />

        <input
          {...register("make")}
          placeholder="Make"
          className="w-full border p-3 rounded-lg"
        />

        <input
          {...register("colour")}
          placeholder="Colour"
          className="w-full border p-3 rounded-lg"
        />

        <input
          {...register("fuelType")}
          placeholder="Fuel Type"
          className="w-full border p-3 rounded-lg"
        />

        <input
          {...register("engineCapacity")}
          placeholder="Engine Capacity"
          className="w-full border p-3 rounded-lg"
        />

        <input
          {...register("yearOfManufacture")}
          placeholder="Year"
          className="w-full border p-3 rounded-lg"
        />
      </div>
    </div>
  );
}