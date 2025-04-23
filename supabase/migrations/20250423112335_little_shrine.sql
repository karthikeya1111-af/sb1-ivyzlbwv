/*
  # Create habits tracking tables

  1. New Tables
    - `habits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `category` (text)
      - `value` (decimal)
      - `unit` (text)
      - `mode` (text, nullable)
      - `type` (text, nullable)
      - `co2_impact` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `habits` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  category text NOT NULL,
  value decimal NOT NULL,
  unit text NOT NULL,
  mode text,
  type text,
  co2_impact decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own habits"
  ON habits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);