"use client";

import UserInfo from "@/components/UserInfo";
import BikeInfo from "@/components/BikeInfo";
import BikeForm from "@/components/BikeForm";

import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type FormData = {
    registrationNumber: string;
    make: string;
    colour: string;
    fuelType: string;
    engineCapacity: string;
    yearOfManufacture: string;

    fullName: string;
    email: string;
    phone: string;
    address: string;
};

type Vehicle = {
  registrationNumber?: string;
  make?: string;
  colour?: string;
  fuelType?: string;
  engineCapacity?: number;
  yearOfManufacture?: number;
  motStatus?: string;
  motExpiryDate?: string;
  taxStatus?: string;
  monthOfFirstRegistration?: string;
  dateOfLastV5CIssued?: string;
  wheelplan?: string;
  co2Emissions?: number;
  markedForExport?: boolean;
};

export default function FormPage() {
    const { register, handleSubmit } = useForm<FormData>();

    const searchParams = useSearchParams();
    const reg = searchParams.get("reg");
    console.log("reg =", reg);

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!reg) return;

        const getVehicle = async () => {
            try {
                setLoading(true);

                const response = await fetch("/api/vehicle", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        registrationNumber: reg,
                    }),
                });

                const data = await response.json();
                console.log(data);

                setVehicle(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getVehicle();
    }, [reg]);

    const onSubmit = (data: FormData) => {
        console.log(data);

        // 后面保存数据库
        // 或发送邮件
    };


    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="max-w-7xl mx-auto"
                >
                    <div className="grid md:grid-cols-2 gap-8">

                        {vehicle ? (
                            <BikeInfo vehicle={vehicle} />
                        ) : (
                            <BikeForm register={register} />
                        )}

                        <UserInfo register={register} />

                    </div>

                    <button
                        type="submit"
                        className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg"
                    >
                        Submit
                    </button>
                </form>


            </div>
        </main>
    );

}
