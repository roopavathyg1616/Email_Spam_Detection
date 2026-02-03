/*
  # Email Spam Detection System Schema

  1. New Tables
    - `emails`
      - `id` (uuid, primary key) - Unique identifier for each email
      - `user_id` (uuid) - Reference to authenticated user
      - `sender_email` (text) - Email address of the sender
      - `sender_name` (text) - Name of the sender
      - `subject` (text) - Email subject line
      - `body` (text) - Email body content
      - `received_at` (timestamptz) - When the email was received
      - `is_spam` (boolean) - Spam classification result
      - `spam_score` (numeric) - Spam confidence score (0-100)
      - `created_at` (timestamptz) - Record creation timestamp
      - `status` (text) - Email status (inbox, spam, deleted, archived)
    
    - `spam_indicators`
      - `id` (uuid, primary key) - Unique identifier
      - `email_id` (uuid) - Reference to emails table
      - `indicator_type` (text) - Type of spam indicator detected
      - `indicator_value` (text) - Value or description of the indicator
      - `weight` (numeric) - Weight of this indicator in spam score
      - `created_at` (timestamptz) - Record creation timestamp
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own emails
    - Add policies for users to view their spam analysis results

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on is_spam for filtering
    - Add index on received_at for sorting
*/

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  sender_email text NOT NULL,
  sender_name text DEFAULT '',
  subject text NOT NULL,
  body text NOT NULL,
  received_at timestamptz DEFAULT now(),
  is_spam boolean DEFAULT false,
  spam_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'inbox'
);

-- Create spam_indicators table
CREATE TABLE IF NOT EXISTS spam_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  indicator_type text NOT NULL,
  indicator_value text NOT NULL,
  weight numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_is_spam ON emails(is_spam);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_emails_status ON emails(status);
CREATE INDEX IF NOT EXISTS idx_spam_indicators_email_id ON spam_indicators(email_id);

-- Enable RLS
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE spam_indicators ENABLE ROW LEVEL SECURITY;

-- Policies for emails table
CREATE POLICY "Users can view own emails"
  ON emails FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emails"
  ON emails FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emails"
  ON emails FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emails"
  ON emails FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for spam_indicators table
CREATE POLICY "Users can view spam indicators for own emails"
  ON spam_indicators FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM emails
      WHERE emails.id = spam_indicators.email_id
      AND emails.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert spam indicators for own emails"
  ON spam_indicators FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM emails
      WHERE emails.id = spam_indicators.email_id
      AND emails.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete spam indicators for own emails"
  ON spam_indicators FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM emails
      WHERE emails.id = spam_indicators.email_id
      AND emails.user_id = auth.uid()
    )
  );