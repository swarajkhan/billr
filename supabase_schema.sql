-- Run this script in the Supabase SQL Editor to add the optional sub_category column to the products table.

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sub_category text;
