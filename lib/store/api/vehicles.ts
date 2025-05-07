// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { vehicles } from "@/lib/db/schema";
import { authClient } from "@/lib/auth/client";

// Define a service using a base URL and expected endpoints
export const vehiclesApi = createApi({
  reducerPath: "vehiclesApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `/api/`,
    prepareHeaders: async (headers) => {
      const { data } = await authClient.token();

      headers.set("Authorization", `Bearer ${data?.token}`);
    },
  }),
  endpoints: (build) => ({
    getAllVehicles: build.query<(typeof vehicles.$inferSelect)[], void>({
      query: () => `vehicles/list`,
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetAllVehiclesQuery } = vehiclesApi;
