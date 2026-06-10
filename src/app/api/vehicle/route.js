// export async function POST(request) {
//   const { registrationNumber } = await request.json();

//   const response = await fetch(
//     "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
//     {
//       method: "POST",
//       headers: {
//         "x-api-key": process.env.DVLA_API_KEY,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         registrationNumber,
//       }),
//     }
//   );

//   const data = await response.json();

//   return Response.json(data);
// }

export async function POST(request) {
  try {
    const { registrationNumber } = await request.json();

    const response = await fetch(
      "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.DVLA_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationNumber,
        }),
      }
    );

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch vehicle data" },
      { status: 500 }
    );
  }
}