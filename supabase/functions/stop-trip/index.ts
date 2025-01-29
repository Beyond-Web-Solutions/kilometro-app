// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "./supabase/client.ts";
import { getUser } from "./utils/get-user.ts";
import { getDistanceMatrix, reverseGeocode } from "./utils/g-maps-api.ts";

Deno.serve(async (req) => {
  const {
    id,
    distance,
    end_odometer,
    latitude,
    longitude,
    type,
    codec,
    avg_speed,
    max_speed,
  } = await req.json();

  const supabase = createClient(req);
  const user = await getUser(req);

  if (!user) {
    return new Response(
      JSON.stringify({ ok: false, message: "Unauthorized" }),
      { status: 401 },
    );
  }

  const geocoderResult = await reverseGeocode(latitude, longitude);
  const address = geocoderResult.results[0];

  const { error } = await supabase
    .from("trips")
    .update({
      end_odometer,
      codec,
      avg_speed,
      max_speed,
      end_place_id: address?.place_id ?? null,
      end_point: `POINT(${address?.geometry?.location?.lat ?? latitude} ${address?.geometry?.location?.lng ?? longitude})`,
      end_address: address?.formatted_address ?? null,
      distance,
      ended_at: new Date().toISOString(),
      status: "done",
      is_private: type === "private",
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ ok: false, error }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stop-trip' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
