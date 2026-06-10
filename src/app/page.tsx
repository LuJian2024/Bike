"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [registration, setRegistration] = useState("");
  const router = useRouter();

  const handleClick = () => {
  const reg = registration.trim().toUpperCase();

  if (reg) {
    router.push(`/form?reg=${encodeURIComponent(reg)}`);
  } else {
    router.push("/form");
  }
};

  return (
    <div className="flex flex-col gap-4 p-10">
      <input
        value={registration}
        onChange={(e) =>
          setRegistration(e.target.value)
        }
        placeholder="Registration Number"
        className="border p-3 rounded"
      />

      <button
        onClick={handleClick}
        className="bg-blue-600 text-white p-3 rounded"
      >
        Get Value
      </button>
    </div>
  );
}