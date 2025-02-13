create policy "Enable delete for admins" on "public"."organizations" as PERMISSIVE for DELETE to authenticated using (
    (
        (
                (SELECT get_user_role() AS get_user_role) = 'admin'::text
            )
            AND (
            id IN (SELECT get_org_ids_for_user() AS get_org_ids_for_user)
            )
        )
    );

CREATE OR REPLACE FUNCTION public.remove_stripe_customer()
    RETURNS TRIGGER
    SECURITY DEFINER
AS
$$
BEGIN
    DELETE
    FROM stripe_customers
    WHERE id = OLD.stripe_customer_id;

    RETURN OLD;
END;

$$ LANGUAGE plpgsql;

CREATE
    OR REPLACE TRIGGER "on_organizations_delete"
    AFTER DELETE
    ON "public"."organizations"
    FOR EACH ROW
EXECUTE FUNCTION "public"."remove_stripe_customer"();