// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { vehicle_id, start_odometer, latitude, longitude } = await req.json();

  const mapsApiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    },
  );

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user) {
    return new Response(
      JSON.stringify({ ok: false, message: "Unauthorized" }),
      { status: 401 },
    );
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=street_address&key=${mapsApiKey}`,
  );

  const geodata = await response.json();
  const address = geodata.results[0];

  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      start_odometer,
      vehicle_id,
      start_place_id: address?.place_id ?? null,
      start_point: `POINT(${address?.geometry.location.lat ?? latitude} ${address?.geometry.location.lng ?? longitude})`,
      start_address: address?.formatted_address ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ ok: false, error }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, data }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/start-trip' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
