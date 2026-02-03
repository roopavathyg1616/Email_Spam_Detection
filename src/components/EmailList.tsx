import { Mail, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Email = Database['public']['Tables']['emails']['Row'];

interface EmailListProps {
  emails: Email[];
  onSelectEmail: (email: Email) => void;
}

export default function EmailList({ emails, onSelectEmail }: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600 text-lg">No emails found</p>
        <p className="text-slate-500 text-sm mt-2">Try adding a test email to see the spam detection in action</p>
      </div>
    );
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  function getSpamScoreColor(score: number) {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  }

  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <div
          key={email.id}
          onClick={() => onSelectEmail(email)}
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                {email.is_spam ? (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold">
                    <AlertTriangle className="w-3 h-3" />
                    <span>SPAM</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    <span>CLEAN</span>
                  </div>
                )}
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getSpamScoreColor(email.spam_score)}`}>
                  Score: {email.spam_score}
                </span>
              </div>

              <h3 className="font-semibold text-slate-900 mb-1 truncate">
                {email.subject}
              </h3>

              <div className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
                <span className="font-medium">{email.sender_name || 'Unknown'}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{email.sender_email}</span>
              </div>

              <p className="text-sm text-slate-600 line-clamp-2">
                {email.body}
              </p>
            </div>

            <div className="flex items-center space-x-2 ml-4 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm whitespace-nowrap">{formatDate(email.received_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
