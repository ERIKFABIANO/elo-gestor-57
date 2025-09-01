-- Fix security warning by setting search_path for functions
CREATE OR REPLACE FUNCTION public.track_daily_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.daily_access (user_id, access_date, access_count, last_access_time)
  VALUES (NEW.user_id, CURRENT_DATE, 1, now())
  ON CONFLICT (user_id, access_date)
  DO UPDATE SET 
    access_count = daily_access.access_count + 1,
    last_access_time = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;