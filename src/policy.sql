-- How to check if a row exists
EXISTS (
    SELECT 1 FROM extended_family
    WHERE extended_family.shoe_size = 10
    AND extended_family.fave_color = "red"

)

-- Policy for reps to only add thire own deals
CREATE policy "Reps can only add their own deals"
ON public.sales_deals
FOR insert
TO authenicated
WITH CHECK (

    auth.uid() = user_id
  
    AND EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.account_type = 'rep'
    )

);
-- Admins to add anyone's deals
CREATE policy "Admins to add anyone's deals"
ON public.sales_deals
FOR insert
TO authenicated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.account_type = 'admin'
    )

);