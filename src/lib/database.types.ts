export interface Database {
  public: {
    Tables: {
      emails: {
        Row: {
          id: string;
          user_id: string;
          sender_email: string;
          sender_name: string;
          subject: string;
          body: string;
          received_at: string;
          is_spam: boolean;
          spam_score: number;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sender_email: string;
          sender_name?: string;
          subject: string;
          body: string;
          received_at?: string;
          is_spam?: boolean;
          spam_score?: number;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sender_email?: string;
          sender_name?: string;
          subject?: string;
          body?: string;
          received_at?: string;
          is_spam?: boolean;
          spam_score?: number;
          created_at?: string;
          status?: string;
        };
      };
      spam_indicators: {
        Row: {
          id: string;
          email_id: string;
          indicator_type: string;
          indicator_value: string;
          weight: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          email_id: string;
          indicator_type: string;
          indicator_value: string;
          weight?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email_id?: string;
          indicator_type?: string;
          indicator_value?: string;
          weight?: number;
          created_at?: string;
        };
      };
    };
  };
}
