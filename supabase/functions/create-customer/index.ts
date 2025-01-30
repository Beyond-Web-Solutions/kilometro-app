// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { generateOrganizationCode } from "./utils/gen-org-code.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17.5.0";

Deno.serve(async (req: Request) => {
  const { name, email } = await req.json();

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    },
  );

  // Get the session or user object
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

  // Create a new customer
  const customer = await stripe.customers.create({
    name,
    email,
  });

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      name,
      email,
      code: generateOrganizationCode(),
      stripe_customer_id: customer.id,
    })
    .select("id")
    .single();

  if (error) {
    return new Response(JSON.stringify({ ok: false, message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  await supabase.from("organization_members").insert({
    user_id: user.id,
    organization_id: data.id,
    is_default: true,
  });

  return new Response(JSON.stringify({ ok: true, id: data.id }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe-create-customer' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
