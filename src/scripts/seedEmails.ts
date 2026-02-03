import { analyzeAndSaveEmail } from '../services/emailService';

const SAMPLE_EMAILS = [
  {
    senderEmail: 'newsletter@techcompany.com',
    senderName: 'Tech Company Weekly',
    subject: 'Your Weekly Tech Newsletter',
    body: 'Hello,\n\nHere are this week\'s top stories in technology:\n\n1. New AI breakthrough announced\n2. Cloud computing trends for 2024\n3. Cybersecurity best practices\n\nStay informed!\n\nBest regards,\nTech Company Team',
    userId: '00000000-0000-0000-0000-000000000000'
  },
  {
    senderEmail: 'winner9999@tempmail.com',
    senderName: '',
    subject: 'CONGRATULATIONS!!! YOU WON $5,000,000 LOTTERY!!!',
    body: 'URGENT! ACT NOW! You are the LUCKY WINNER of our international lottery! Claim your $5,000,000 prize NOW!\n\nClick here: http://fake-lottery-site.com/claim\nClick here: http://suspicious-winner.com/prize\nClick here: http://scam-alert.com/money\n\nLimited time offer! FREE MONEY! No risk! Satisfaction guaranteed!\n\nDon\'t miss this once in lifetime opportunity!',
    userId: '00000000-0000-0000-0000-000000000000'
  },
  {
    senderEmail: 'security@paypal-verify.net',
    senderName: '',
    subject: 'URGENT: Account Suspended - Verify Identity NOW!!!',
    body: 'Your PayPal account has been suspended due to unusual activity!!!\n\nVerify your identity immediately or your account will be permanently deleted!\n\nClick here to verify: http://fake-paypal.com/verify\n\nACT NOW! Time is running out!',
    userId: '00000000-0000-0000-0000-000000000000'
  },
  {
    senderEmail: 'business-opportunity@workfromhome.biz',
    senderName: 'Financial Freedom Team',
    subject: 'Make $10,000 per week from home! No experience needed!',
    body: 'Earn extra cash working from home! Make money fast! Increase your income today!\n\nGuaranteed $10,000 per week! No risk! Free consultation available!\n\nClick here to get started: http://make-money-now.com\n\nLimited time offer! Call now! Apply now! Become a member today!',
    userId: '00000000-0000-0000-0000-000000000000'
  },
  {
    senderEmail: 'sarah.johnson@company.com',
    senderName: 'Sarah Johnson',
    subject: 'Project update and next steps',
    body: 'Hi team,\n\nI wanted to share a quick update on our current project. We\'ve completed phase 1 and are moving into phase 2 next week.\n\nKey accomplishments:\n- Feature A is complete\n- Testing is underway\n- Documentation updated\n\nNext steps:\n- Begin phase 2 implementation\n- Schedule review meeting\n- Update stakeholders\n\nLet me know if you have any questions.\n\nBest,\nSarah',
    userId: '00000000-0000-0000-0000-000000000000'
  },
  {
    senderEmail: 'pharmacy-deals-4321@guerrillamail.com',
    senderName: '',
    subject: 'Cheap Viagra and prescription medication - 90% OFF!!!',
    body: 'Get your prescription medication at unbelievable prices!\n\nViagra - 90% OFF\nPills and pharmacy products - FREE SHIPPING\n\nNo prescription needed! Order now!\n\nhttp://cheap-pharmacy.com\nhttp://discount-meds.com\nhttp://buy-pills-now.com',
    userId: '00000000-0000-0000-0000-000000000000'
  },
  {
    senderEmail: 'support@github.com',
    senderName: 'GitHub Support',
    subject: 'Your pull request has been merged',
    body: 'Hello,\n\nYour pull request #1234 "Fix authentication bug" has been successfully merged into the main branch.\n\nThank you for your contribution!\n\nGitHub Team',
    userId: '00000000-0000-0000-0000-000000000000'
  },
  {
    senderEmail: 'prince-abdullah@nigeria-royalty.com',
    senderName: '',
    subject: 'Urgent Business Proposal - $25 Million Inheritance',
    body: 'Dear Friend,\n\nI am Prince Abdullah from Nigeria. I have an urgent business proposal involving $25 million dollars inheritance that I need to transfer out of the country.\n\nI need your help as a trusted partner. You will receive 40% of the total amount ($10 million dollars) for your assistance.\n\nPlease send your bank account details immediately.\n\nThis is a limited time offer! Act now!\n\nPrince Abdullah',
    userId: '00000000-0000-0000-0000-000000000000'
  },
  {
    senderEmail: 'alerts@bank.com',
    senderName: 'Bank Security Team',
    subject: 'Monthly statement available',
    body: 'Dear Customer,\n\nYour monthly bank statement for January 2024 is now available in your online banking portal.\n\nTo view your statement, please log in to your account.\n\nThank you for banking with us.\n\nBank Security Team',
    userId: '00000000-0000-0000-0000-000000000000'
  },
  {
    senderEmail: 'amazing-deals-xyz@10minutemail.com',
    senderName: 'Casino Promotions',
    subject: 'FREE $1000 Casino Bonus - Play Now and Win!!!',
    body: 'Get your FREE $1000 casino bonus today! No deposit required!\n\nPlay slots, poker, and more! Guaranteed wins! Easy money!\n\nClick here: http://free-casino.com\nClick here: http://bonus-slots.com\nClick here: http://win-money-now.com\n\nLimited time! Act now! Don\'t miss out! Free gift! Special promotion!',
    userId: '00000000-0000-0000-0000-000000000000'
  }
];

async function seedEmails() {
  console.log('Starting email seeding...');

  for (let i = 0; i < SAMPLE_EMAILS.length; i++) {
    const email = SAMPLE_EMAILS[i];
    try {
      console.log(`Seeding email ${i + 1}/${SAMPLE_EMAILS.length}: ${email.subject.substring(0, 50)}...`);
      await analyzeAndSaveEmail(email);
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error seeding email ${i + 1}:`, error);
    }
  }

  console.log('Email seeding completed!');
}

seedEmails().catch(console.error);
