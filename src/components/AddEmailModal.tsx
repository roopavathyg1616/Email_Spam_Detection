import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { analyzeAndSaveEmail } from '../services/emailService';

interface AddEmailModalProps {
  userId: string;
  onClose: () => void;
  onEmailAdded: () => void;
}

const SAMPLE_EMAILS = [
  {
    name: 'Legitimate Newsletter',
    senderEmail: 'newsletter@company.com',
    senderName: 'Company Newsletter',
    subject: 'Your Monthly Update',
    body: 'Hello,\n\nHere is your monthly newsletter with the latest updates from our company. We hope you find this information useful.\n\nBest regards,\nThe Team'
  },
  {
    name: 'Spam - Lottery Win',
    senderEmail: 'winner123xyz@tempmail.com',
    senderName: '',
    subject: 'CONGRATULATIONS!!! YOU WON $1,000,000!!!',
    body: 'URGENT! ACT NOW! You have won the lottery! Click here to claim your prize! Limited time offer! FREE MONEY!\n\nhttp://suspicious-link.com/claim\nhttp://another-link.com/win\nhttp://fake-site.com/lottery'
  },
  {
    name: 'Spam - Phishing',
    senderEmail: 'security-alert9876543@suspicious.com',
    senderName: '',
    subject: 'URGENT: Account Suspended - Verify Now!!!',
    body: 'Your account has been suspended due to unusual activity! Click here immediately to verify your identity and restore access! Act now or lose your account forever!\n\nhttp://fake-bank.com/verify'
  },
  {
    name: 'Spam - Get Rich Quick',
    senderEmail: 'makemoney@workfromhome.net',
    senderName: 'Financial Freedom',
    subject: 'Make $5000 per week working from home! No experience needed!',
    body: 'Earn extra cash now! Work from home opportunity! Make money fast! No risk! Satisfaction guaranteed! Click here to start earning $5000 per week immediately!\n\nFree consultation! Limited time offer! Act now!'
  },
  {
    name: 'Clean - Work Email',
    senderEmail: 'john.doe@company.com',
    senderName: 'John Doe',
    subject: 'Meeting scheduled for tomorrow',
    body: 'Hi,\n\nI wanted to confirm our meeting scheduled for tomorrow at 2 PM in the conference room. Please let me know if you need to reschedule.\n\nThanks,\nJohn'
  }
];

export default function AddEmailModal({ userId, onClose, onEmailAdded }: AddEmailModalProps) {
  const [formData, setFormData] = useState({
    senderEmail: '',
    senderName: '',
    subject: '',
    body: ''
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  try {
    const spamKeywords = [
      'free', 'win', 'winner', 'cash', 'offer',
      'urgent', 'click', 'prize', 'money', 'act now'
    ];

    const emailText = (formData.subject + ' ' + formData.body).toLowerCase();

    const isSpam = spamKeywords.some(word =>
      emailText.includes(word)
    );

    if (isSpam) {
      alert('🚨 This email is detected as SPAM!');
    } else {
      alert('✅ This email looks SAFE.');
    }

    onEmailAdded(); // refresh list
    onClose();      // close modal
  } catch (error) {
    console.error(error);
    alert('Something went wrong.');
  } finally {
    setLoading(false);
  }
}


  function loadSampleEmail(sample: typeof SAMPLE_EMAILS[0]) {
    setFormData({
      senderEmail: sample.senderEmail,
      senderName: sample.senderName,
      subject: sample.subject,
      body: sample.body
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Add Test Email</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Quick Load Sample Emails</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_EMAILS.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => loadSampleEmail(sample)}
                  className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-left"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sender Email *
              </label>
              <input
                type="email"
                required
                value={formData.senderEmail}
                onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="sender@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sender Name
              </label>
              <input
                type="text"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message Body *
              </label>
              <textarea
                required
                rows={8}
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Email content..."
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze & Add Email'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
