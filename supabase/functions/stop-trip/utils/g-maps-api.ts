export async function reverseGeocode(lat: number, lon: number) {
  const mapsApiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&result_type=street_address&key=${mapsApiKey}`,
  );

  return response.json();
}

export async function getDistanceMatrix(
  codec: string,
  lat: number,
  lon: number,
) {
  const mapsApiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${lat},${lon}&origins=enc:${encodeURI(codec)}:&key=${mapsApiKey}`,
  );

  return response.json();
}
