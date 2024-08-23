export interface EnvConfig {
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    GEMINI_API_KEY_SECRET: string;
}

// Тип для папки
export type Folder = {
    id: string;
    name: string;
    parent_folder_id: string | null;
    user_id: string | null;
    created_at: string | null;
};

// Тип для вставки новой папки
export type FolderInsert = {
    id?: string; // UUID генерируется автоматически, если не предоставлен
    folder_name: string;
    parent_id?: string | null;
    user_id?: string | null;
    is_root?: boolean;
    created_at?: string | null;
};

// Тип для обновления папки
export type FolderUpdate = {
    id?: string;
    name?: string;
    parent_folder_id?: string | null;
    user_id?: string | null;
    created_at?: string | null;
};

// Тип для файла
export type FileDB = {
    id: string;
    file_name: string;
    file_url: string;
    folder_id: string | null;
    user_id: string | null;
    created_at: string | null;
};

// Тип для вставки нового файла
export type FileInsert = {
    id?: string; // UUID генерируется автоматически, если не предоставлен
    file_name: string;
    file_url: string;
    folder_id?: string | null;
    user_id?: string | null;
    created_at?: string | null;
};

// Тип для обновления файла
export type FileUpdate = {
    id?: string;
    file_name?: string;
    file_url?: string;
    folder_id?: string | null;
    user_id?: string | null;
    created_at?: string | null;
};

export type FavoriteDB = {
    id: string;
    file_id: string;
    user_id: string;
    created_at: string | null;
};

export type TagDB = {
    id: string;
    tag_name: string;
    color: string;
    user_id: string;
    file_id: string;
    created_at: string | null;
};

export type TagDBUpdate = {
    tag_name?: string;
    color?: string;
};

export interface FileDataResponse {
    path: string;
    fullPath: string;
}

export interface ErrorDetails {
    statusCode: number;
    message: string;
}

// Интерфейс для ответа
export interface UploadResponse {
    data: FileDataResponse | null;
    error: ErrorDetails | null;
    message: string | null;
}

export interface SuccessStorageUploadResponse {
    data: FileDataResponse;
    error: null;
    pdfData: AIBasicPDFInformation;
}

export interface ErrorStorageUploadResponse {
    statusCode: string;
    error: string;
    message: string;
}

export type StorageApiUploadResponse = SuccessStorageUploadResponse | ErrorStorageUploadResponse;


export  interface FileMoveParams {
    fromPath: string;
    toPath: string;
    folderId: string;
}
export interface SuccessStorageMoveResponse {
    data: { message: string };
    error: null;
}

export interface ErrorStorageMoveResponse {
    statusCode: string;
    error: string;
    message: string;
}

export type StorageApiMoveResponse = SuccessStorageMoveResponse | ErrorStorageMoveResponse;

export interface SuccessStorageResponseData {
    message: string;
}

export interface SuccessStorageResponse<T = SuccessStorageResponseData> {
    data: T;
    error: null;
}

export interface ErrorStorageResponse<T> {
    error: T | string;
    message: string;
}


export type StorageApiResponse<T,N> = SuccessStorageResponse<T> | ErrorStorageResponse<N>;

export type JSONStructure = {
    [key: string]: any;
};

export interface JobData<T> {
    data: T;
}

export interface FileParsingJobData {
    fileId: number;
    filePath: string;
}



export interface AIBasicPDFInformation {
    Title: string;
    Authors: string | null;
    "Publication Date": string | null;
    "Number Of Pages": number | null;
    "Upload Date": string | null;
    "File Size": string | null;
}

export interface BasicPDFInformation {
    title: string;
    authors: string | null;
    publication_date: string | null;
    number_of_pages: number | null;
    upload_date: string | null;
    file_size: number | null|string;
}

export interface FolderDB{
    id: string;
    name: string;
    created_at: string;
}



export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academic_contents: {
        Row: {
          abstract: string | null
          file_data_id: string | null
          id: string
          key_points_and_findings: string | null
          keywords: string | null
          strengths_and_weaknesses: string | null
        }
        Insert: {
          abstract?: string | null
          file_data_id?: string | null
          id?: string
          key_points_and_findings?: string | null
          keywords?: string | null
          strengths_and_weaknesses?: string | null
        }
        Update: {
          abstract?: string | null
          file_data_id?: string | null
          id?: string
          key_points_and_findings?: string | null
          keywords?: string | null
          strengths_and_weaknesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_contents_file_data_id_fkey"
            columns: ["file_data_id"]
            isOneToOne: false
            referencedRelation: "file_data"
            referencedColumns: ["id"]
          },
        ]
      }
      citation_and_impact_metrics: {
        Row: {
          author_profiles: string | null
          citation_counts: string | null
          file_data_id: string | null
          id: string
          impact_factors: string | null
          related_works: string | null
        }
        Insert: {
          author_profiles?: string | null
          citation_counts?: string | null
          file_data_id?: string | null
          id?: string
          impact_factors?: string | null
          related_works?: string | null
        }
        Update: {
          author_profiles?: string | null
          citation_counts?: string | null
          file_data_id?: string | null
          id?: string
          impact_factors?: string | null
          related_works?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "citation_and_impact_metrics_file_data_id_fkey"
            columns: ["file_data_id"]
            isOneToOne: false
            referencedRelation: "file_data"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          item_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_item_id_fkey1"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      file_data: {
        Row: {
          authors: string | null
          file_id: string | null
          file_size: number | null
          id: string
          number_of_pages: number | null
          publication_date: string | null
          title: string | null
          upload_date: string | null
        }
        Insert: {
          authors?: string | null
          file_id?: string | null
          file_size?: number | null
          id?: string
          number_of_pages?: number | null
          publication_date?: string | null
          title?: string | null
          upload_date?: string | null
        }
        Update: {
          authors?: string | null
          file_id?: string | null
          file_size?: number | null
          id?: string
          number_of_pages?: number | null
          publication_date?: string | null
          title?: string | null
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_data_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string | null
          file_name: string
          file_url: string
          folder_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_url: string
          folder_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_url?: string
          folder_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string | null
          folder_name: string
          id: string
          is_root: boolean | null
          parent_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          folder_name: string
          id?: string
          is_root?: boolean | null
          parent_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          folder_name?: string
          id?: string
          is_root?: boolean | null
          parent_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      metadata: {
        Row: {
          extracted_keywords: Json | null
          file_data_id: string | null
          id: string
          metadata_fields: Json | null
        }
        Insert: {
          extracted_keywords?: Json | null
          file_data_id?: string | null
          id?: string
          metadata_fields?: Json | null
        }
        Update: {
          extracted_keywords?: Json | null
          file_data_id?: string | null
          id?: string
          metadata_fields?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "metadata_file_data_id_fkey"
            columns: ["file_data_id"]
            isOneToOne: false
            referencedRelation: "file_data"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_metrics: {
        Row: {
          author_credibility: string | null
          bias: string | null
          confidence_scores: Json | null
          file_data_id: string | null
          id: string
          methodology: string | null
          reliability: string | null
          validity: string | null
        }
        Insert: {
          author_credibility?: string | null
          bias?: string | null
          confidence_scores?: Json | null
          file_data_id?: string | null
          id?: string
          methodology?: string | null
          reliability?: string | null
          validity?: string | null
        }
        Update: {
          author_credibility?: string | null
          bias?: string | null
          confidence_scores?: Json | null
          file_data_id?: string | null
          id?: string
          methodology?: string | null
          reliability?: string | null
          validity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quality_metrics_file_data_id_fkey"
            columns: ["file_data_id"]
            isOneToOne: false
            referencedRelation: "file_data"
            referencedColumns: ["id"]
          },
        ]
      }
      research_details: {
        Row: {
          data_type: string | null
          file_data_id: string | null
          id: string
          models_and_frameworks: string | null
          research_approach: string | null
          research_methods: string | null
          statistical_approaches: string | null
          statistical_software: string | null
        }
        Insert: {
          data_type?: string | null
          file_data_id?: string | null
          id?: string
          models_and_frameworks?: string | null
          research_approach?: string | null
          research_methods?: string | null
          statistical_approaches?: string | null
          statistical_software?: string | null
        }
        Update: {
          data_type?: string | null
          file_data_id?: string | null
          id?: string
          models_and_frameworks?: string | null
          research_approach?: string | null
          research_methods?: string | null
          statistical_approaches?: string | null
          statistical_software?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_details_file_data_id_fkey"
            columns: ["file_data_id"]
            isOneToOne: false
            referencedRelation: "file_data"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string | null
          created_at: string
          file_id: string
          id: number
          name: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          file_id: string
          id?: number
          name?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          file_id?: string
          id?: number
          name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
