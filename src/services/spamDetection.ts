export interface SpamIndicator {
  type: string;
  value: string;
  weight: number;
}

export interface SpamAnalysisResult {
  isSpam: boolean;
  spamScore: number;
  indicators: SpamIndicator[];
}

const SPAM_KEYWORDS = [
  'winner', 'congratulations', 'claim', 'prize', 'lottery', 'casino',
  'viagra', 'pharmacy', 'prescription', 'medication', 'pills',
  'urgent', 'act now', 'limited time', 'expires', 'hurry',
  'free money', 'cash bonus', 'earn money', 'work from home',
  'click here', 'click below', 'unsubscribe', 'opt out',
  'guarantee', 'no risk', 'risk free', 'satisfaction guaranteed',
  'debt', 'credit', 'loan', 'refinance', 'mortgage',
  'nigerian prince', 'inheritance', 'beneficiary',
  'account suspended', 'verify account', 'confirm identity',
  'password reset', 'unusual activity', 'security alert'
];

const SUSPICIOUS_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', '10minutemail.com', 'yopmail.com'
];

const SPAM_PHRASES = [
  'act now', 'apply now', 'become a member', 'call now',
  'click here', 'get it now', 'do it today', 'dont delete',
  'earn extra cash', 'extra income', 'financial freedom',
  'free access', 'free consultation', 'free gift', 'free preview',
  'get paid', 'increase sales', 'increase traffic', 'lose weight',
  'make money', 'million dollars', 'once in lifetime', 'order now',
  'please read', 'special promotion', 'while supplies last'
];

export function analyzeSpam(email: {
  senderEmail: string;
  senderName: string;
  subject: string;
  body: string;
}): SpamAnalysisResult {
  const indicators: SpamIndicator[] = [];
  let totalScore = 0;

  const lowerSubject = email.subject.toLowerCase();
  const lowerBody = email.body.toLowerCase();
  const fullText = `${lowerSubject} ${lowerBody}`;

  SPAM_KEYWORDS.forEach(keyword => {
    const subjectMatches = (lowerSubject.match(new RegExp(keyword, 'g')) || []).length;
    const bodyMatches = (lowerBody.match(new RegExp(keyword, 'g')) || []).length;

    if (subjectMatches > 0) {
      const weight = subjectMatches * 8;
      indicators.push({
        type: 'keyword_subject',
        value: `Spam keyword in subject: "${keyword}"`,
        weight
      });
      totalScore += weight;
    }

    if (bodyMatches > 0) {
      const weight = bodyMatches * 3;
      indicators.push({
        type: 'keyword_body',
        value: `Spam keyword in body: "${keyword}" (${bodyMatches}x)`,
        weight
      });
      totalScore += weight;
    }
  });

  SPAM_PHRASES.forEach(phrase => {
    if (fullText.includes(phrase)) {
      const weight = 10;
      indicators.push({
        type: 'spam_phrase',
        value: `Common spam phrase: "${phrase}"`,
        weight
      });
      totalScore += weight;
    }
  });

  const senderDomain = email.senderEmail.split('@')[1]?.toLowerCase() || '';
  if (SUSPICIOUS_DOMAINS.some(domain => senderDomain.includes(domain))) {
    const weight = 25;
    indicators.push({
      type: 'suspicious_domain',
      value: `Suspicious sender domain: ${senderDomain}`,
      weight
    });
    totalScore += weight;
  }

  const capsPercentage = (email.subject.match(/[A-Z]/g) || []).length / email.subject.length;
  if (capsPercentage > 0.5 && email.subject.length > 5) {
    const weight = 15;
    indicators.push({
      type: 'excessive_caps',
      value: `Excessive capitals in subject (${Math.round(capsPercentage * 100)}%)`,
      weight
    });
    totalScore += weight;
  }

  const exclamationCount = (email.subject.match(/!/g) || []).length;
  if (exclamationCount >= 3) {
    const weight = exclamationCount * 5;
    indicators.push({
      type: 'excessive_punctuation',
      value: `Multiple exclamation marks (${exclamationCount})`,
      weight
    });
    totalScore += weight;
  }

  const urlMatches = email.body.match(/https?:\/\/[^\s]+/g) || [];
  const urlDensity = urlMatches.length / Math.max(email.body.split(/\s+/).length, 1);
  if (urlDensity > 0.1 && urlMatches.length > 3) {
    const weight = 20;
    indicators.push({
      type: 'high_url_density',
      value: `High URL density: ${urlMatches.length} URLs`,
      weight
    });
    totalScore += weight;
  }

  if (!email.senderName || email.senderName.trim() === '') {
    const weight = 8;
    indicators.push({
      type: 'missing_sender_name',
      value: 'No sender name provided',
      weight
    });
    totalScore += weight;
  }

  const hasRandomChars = /[0-9]{5,}|[a-z]{15,}/i.test(email.senderEmail.split('@')[0]);
  if (hasRandomChars) {
    const weight = 12;
    indicators.push({
      type: 'suspicious_email',
      value: 'Suspicious email format (random characters)',
      weight
    });
    totalScore += weight;
  }

  if (email.body.length < 50 && urlMatches.length > 0) {
    const weight = 15;
    indicators.push({
      type: 'short_with_links',
      value: 'Very short message with links',
      weight
    });
    totalScore += weight;
  }

  const moneyRegex = /\$[0-9,]+|\d+\s*(dollars|USD|EUR|GBP)/gi;
  const moneyMentions = (email.body.match(moneyRegex) || []).length;
  if (moneyMentions > 2) {
    const weight = moneyMentions * 5;
    indicators.push({
      type: 'money_mentions',
      value: `Multiple money mentions (${moneyMentions})`,
      weight
    });
    totalScore += weight;
  }

  const spamScore = Math.min(Math.round(totalScore), 100);
  const isSpam = spamScore >= 40;

  return {
    isSpam,
    spamScore,
    indicators: indicators.sort((a, b) => b.weight - a.weight)
  };
}
