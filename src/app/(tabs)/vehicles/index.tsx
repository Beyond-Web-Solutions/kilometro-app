import { VehiclesList } from "@/src/components/vehicles/list";
import { Container } from "@/src/components/_common/layout/container";
import { CreateVehicleFab } from "@/src/components/vehicles/fab";

export default function Vehicles() {
  return (
    <Container>
      <VehiclesList />
      <CreateVehicleFab />
    </Container>
  );
}
