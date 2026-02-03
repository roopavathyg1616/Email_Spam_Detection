import { useState, useEffect } from 'react';
import { Shield, Mail, Inbox, Trash2, AlertTriangle } from 'lucide-react';
import { fetchEmails } from '../services/emailService';
import type { Database } from '../lib/database.types';
import EmailList from './EmailList';
import EmailDetail from './EmailDetail';
import AddEmailModal from './AddEmailModal';

type Email = Database['public']['Tables']['emails']['Row'];

export default function EmailDashboard() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filter, setFilter] = useState<'all' | 'inbox' | 'spam'>('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userId] = useState('00000000-0000-0000-0000-000000000000');

  useEffect(() => {
    loadEmails();
  }, [filter]);

  async function loadEmails() {
    try {
      setLoading(true);
      const data = await fetchEmails(filter);
      setEmails(data);
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleEmailSelect(email: Email) {
    setSelectedEmail(email);
  }

  function handleBack() {
    setSelectedEmail(null);
  }

  async function handleEmailUpdate() {
    await loadEmails();
    setSelectedEmail(null);
  }

  const stats = {
    total: emails.length,
    spam: emails.filter(e => e.is_spam).length,
    inbox: emails.filter(e => !e.is_spam && e.status === 'inbox').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">AI Spam Detector</h1>
                <p className="text-slate-600 text-sm mt-1">Intelligent email classification system</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Emails</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Inbox</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.inbox}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Inbox className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Spam Detected</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.spam}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All ({emails.length})
                </button>
                <button
                  onClick={() => setFilter('inbox')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'inbox'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Inbox ({stats.inbox})
                </button>
                <button
                  onClick={() => setFilter('spam')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'spam'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Spam ({stats.spam})
                </button>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Test Email
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-slate-600">Loading emails...</p>
              </div>
            ) : selectedEmail ? (
              <EmailDetail
                emailId={selectedEmail.id}
                onBack={handleBack}
                onUpdate={handleEmailUpdate}
              />
            ) : (
              <EmailList
                emails={emails}
                onSelectEmail={handleEmailSelect}
              />
            )}
          </div>
        </div>
      </main>

      {showAddModal && (
        <AddEmailModal
          userId={userId}
          onClose={() => setShowAddModal(false)}
          onEmailAdded={loadEmails}
        />
      )}
    </div>
  );
}
