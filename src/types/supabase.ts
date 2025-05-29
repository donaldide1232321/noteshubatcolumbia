export interface Database {
  public: {
    Tables: {
      uploads: {
        Row: {
          id: string;
          file_name: string;
          file_url: string;
          course: string;
          professor: string;
          file_type: string;
          label: string;
          upload_date: string;
          file_size: number;
          mime_type: string;
          upvotes: number;
          downvotes: number;
          user_id: string;
          username: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_url: string;
          course: string;
          professor: string;
          file_type: string;
          label: string;
          upload_date?: string;
          file_size: number;
          mime_type: string;
          upvotes?: number;
          downvotes?: number;
          user_id?: string;
          username?: string;
        };
      };
      app_stats: {
        Row: {
          id: number;
          upload_count: number;
        };
      };
    };
    Functions: {
      increment_upload_count: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
  };
} 