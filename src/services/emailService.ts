import { supabase } from '../lib/supabase';
import { analyzeSpam } from './spamDetection';
import type { Database } from '../lib/database.types';

type Email = Database['public']['Tables']['emails']['Row'];
type EmailInsert = Database['public']['Tables']['emails']['Insert'];
type SpamIndicatorInsert = Database['public']['Tables']['spam_indicators']['Insert'];

export async function fetchEmails(filter: 'all' | 'inbox' | 'spam' = 'all') {
  let query = supabase
    .from('emails')
    .select('*')
    .order('received_at', { ascending: false });

  if (filter === 'inbox') {
    query = query.eq('status', 'inbox').eq('is_spam', false);
  } else if (filter === 'spam') {
    query = query.eq('is_spam', true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Email[];
}

export async function fetchEmailById(id: string) {
  const { data: email, error: emailError } = await supabase
    .from('emails')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (emailError) throw emailError;
  if (!email) return null;

  const { data: indicators, error: indicatorsError } = await supabase
    .from('spam_indicators')
    .select('*')
    .eq('email_id', id)
    .order('weight', { ascending: false });

  if (indicatorsError) throw indicatorsError;

  return { email: email as Email, indicators: indicators || [] };
}

export async function analyzeAndSaveEmail(emailData: {
  senderEmail: string;
  senderName: string;
  subject: string;
  body: string;
  userId: string;
}) {
  const analysis = analyzeSpam({
    senderEmail: emailData.senderEmail,
    senderName: emailData.senderName,
    subject: emailData.subject,
    body: emailData.body
  });

  const emailInsert: EmailInsert = {
    user_id: emailData.userId,
    sender_email: emailData.senderEmail,
    sender_name: emailData.senderName,
    subject: emailData.subject,
    body: emailData.body,
    is_spam: analysis.isSpam,
    spam_score: analysis.spamScore,
    status: analysis.isSpam ? 'spam' : 'inbox'
  };

  const { data: email, error: emailError } = await supabase
    .from('emails')
    .insert(emailInsert)
    .select()
    .single();

  if (emailError) throw emailError;

  if (analysis.indicators.length > 0) {
    const indicatorsInsert: SpamIndicatorInsert[] = analysis.indicators.map(indicator => ({
      email_id: email.id,
      indicator_type: indicator.type,
      indicator_value: indicator.value,
      weight: indicator.weight
    }));

    const { error: indicatorsError } = await supabase
      .from('spam_indicators')
      .insert(indicatorsInsert);

    if (indicatorsError) throw indicatorsError;
  }

  return email;
}

export async function updateEmailStatus(emailId: string, status: string, isSpam?: boolean) {
  const updateData: Database['public']['Tables']['emails']['Update'] = { status };
  if (isSpam !== undefined) {
    updateData.is_spam = isSpam;
  }

  const { error } = await supabase
    .from('emails')
    .update(updateData)
    .eq('id', emailId);

  if (error) throw error;
}

export async function deleteEmail(emailId: string) {
  const { error } = await supabase
    .from('emails')
    .delete()
    .eq('id', emailId);

  if (error) throw error;
}
