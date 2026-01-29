-- Drop the existing policy that allows all officers to see all complaints
DROP POLICY IF EXISTS "Admins and dept heads can view all complaints" ON public.complaints;

-- Create separate policies for each role with proper department filtering

-- Admins can view all complaints
CREATE POLICY "Admins can view all complaints"
ON public.complaints
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Department heads can view complaints in their department
CREATE POLICY "Dept heads can view department complaints"
ON public.complaints
FOR SELECT
USING (
  has_role(auth.uid(), 'department_head'::app_role) 
  AND (
    department_id IS NULL 
    OR department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
  )
);

-- Officers can view complaints assigned to their department
CREATE POLICY "Officers can view department complaints"
ON public.complaints
FOR SELECT
USING (
  has_role(auth.uid(), 'officer'::app_role)
  AND department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
);