import { UseFormRegister } from "react-hook-form";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

type Props = {
  register: UseFormRegister<FormData>;
};

export default function UserInfo({ register }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        User Information
      </h2>

      <div className="space-y-4">
        <input
          {...register("fullName")}
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
        />

        <input
          {...register("phone")}
          placeholder="Phone"
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          {...register("address")}
          placeholder="Address"
          rows={4}
          className="w-full border p-3 rounded-lg"
        />
      </div>
    </div>
  );
}