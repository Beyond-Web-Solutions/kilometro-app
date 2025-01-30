import { VehiclesList } from "@/components/vehicles/list";
import { Container } from "@/components/_common/layout/container";
import { CreateVehicleFab } from "@/components/vehicles/fab";

export default function Vehicles() {
  return (
    <Container>
      <VehiclesList />
      <CreateVehicleFab />
    </Container>
  );
}
