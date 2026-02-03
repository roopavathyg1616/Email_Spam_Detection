import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, Trash2, Archive, ShieldAlert, ShieldCheck } from 'lucide-react';
import { fetchEmailById, updateEmailStatus, deleteEmail } from '../services/emailService';
import type { Database } from '../lib/database.types';

type Email = Database['public']['Tables']['emails']['Row'];
type SpamIndicator = Database['public']['Tables']['spam_indicators']['Row'];

interface EmailDetailProps {
  emailId: string;
  onBack: () => void;
  onUpdate: () => void;
}

export default function EmailDetail({ emailId, onBack, onUpdate }: EmailDetailProps) {
  const [email, setEmail] = useState<Email | null>(null);
  const [indicators, setIndicators] = useState<SpamIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmailDetail();
  }, [emailId]);

  async function loadEmailDetail() {
    try {
      setLoading(true);
      const data = await fetchEmailById(emailId);
      if (data) {
        setEmail(data.email);
        setIndicators(data.indicators);
      }
    } catch (error) {
      console.error('Error loading email detail:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsSpam() {
    if (!email) return;
    try {
      await updateEmailStatus(email.id, 'spam', true);
      onUpdate();
    } catch (error) {
      console.error('Error marking as spam:', error);
    }
  }

  async function handleMarkAsNotSpam() {
    if (!email) return;
    try {
      await updateEmailStatus(email.id, 'inbox', false);
      onUpdate();
    } catch (error) {
      console.error('Error marking as not spam:', error);
    }
  }

  async function handleDelete() {
    if (!email) return;
    try {
      await deleteEmail(email.id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  }

  async function handleArchive() {
    if (!email) return;
    try {
      await updateEmailStatus(email.id, 'archived');
      onUpdate();
    } catch (error) {
      console.error('Error archiving email:', error);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-600">Loading email details...</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Email not found</p>
      </div>
    );
  }

  function getSpamScoreColor(score: number) {
    if (score >= 70) return 'text-red-600 bg-red-100 border-red-200';
    if (score >= 40) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-green-600 bg-green-100 border-green-200';
  }

  function getIndicatorIcon(type: string) {
    const iconMap: Record<string, string> = {
      keyword_subject: '🔍',
      keyword_body: '📝',
      spam_phrase: '💬',
      suspicious_domain: '🌐',
      excessive_caps: '🔠',
      excessive_punctuation: '❗',
      high_url_density: '🔗',
      missing_sender_name: '👤',
      suspicious_email: '📧',
      short_with_links: '⚡',
      money_mentions: '💰'
    };
    return iconMap[type] || '⚠️';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to list</span>
        </button>

        <div className="flex items-center space-x-2">
          {email.is_spam ? (
            <button
              onClick={handleMarkAsNotSpam}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Mark as Not Spam</span>
            </button>
          ) : (
            <button
              onClick={handleMarkAsSpam}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Mark as Spam</span>
            </button>
          )}
          <button
            onClick={handleArchive}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Archive className="w-4 h-4" />
            <span>Archive</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {email.is_spam ? (
              <div className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
                <AlertTriangle className="w-5 h-5" />
                <span>SPAM DETECTED</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                <CheckCircle className="w-5 h-5" />
                <span>CLEAN EMAIL</span>
              </div>
            )}
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 font-bold text-lg ${getSpamScoreColor(email.spam_score)}`}>
            Spam Score: {email.spam_score}/100
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-slate-600">From</label>
            <div className="mt-1 flex items-center space-x-2">
              <span className="font-semibold text-slate-900">{email.sender_name || 'Unknown'}</span>
              <span className="text-slate-500">({email.sender_email})</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Subject</label>
            <p className="mt-1 text-lg font-semibold text-slate-900">{email.subject}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Received</label>
            <p className="mt-1 text-slate-700">{new Date(email.received_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <label className="text-sm font-medium text-slate-600 mb-3 block">Message Content</label>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-slate-800 whitespace-pre-wrap">{email.body}</p>
          </div>
        </div>
      </div>

      {indicators.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <span>Spam Indicators Detected ({indicators.length})</span>
          </h3>

          <div className="space-y-3">
            {indicators.map((indicator) => (
              <div
                key={indicator.id}
                className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-2xl">{getIndicatorIcon(indicator.indicator_type)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{indicator.indicator_value}</p>
                      <p className="text-sm text-slate-600 mt-1 capitalize">
                        Type: {indicator.indicator_type.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold">
                      +{indicator.weight} pts
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Analysis Summary</h4>
            <p className="text-sm text-blue-800">
              This email triggered {indicators.length} spam indicator{indicators.length !== 1 ? 's' : ''} with a
              total spam score of {email.spam_score}/100.
              {email.is_spam
                ? ' The email has been classified as spam and filtered from your inbox.'
                : ' Despite some indicators, the overall score is below the spam threshold.'}
            </p>
          </div>
        </div>
      )}

      {indicators.length === 0 && !email.is_spam && (
        <div className="bg-white rounded-xl border-2 border-green-200 p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-bold text-green-900">No Spam Indicators Detected</h3>
              <p className="text-green-700 mt-1">This email appears to be legitimate with no suspicious patterns.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
