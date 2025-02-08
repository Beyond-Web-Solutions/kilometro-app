import { Tables } from "@/src/types/supabase";
import { LatLng } from "react-native-maps";

export type Trip = Omit<Tables<"trips">, "start_point" | "end_point"> & {
  start_point: LatLng;
  end_point: LatLng;
};
