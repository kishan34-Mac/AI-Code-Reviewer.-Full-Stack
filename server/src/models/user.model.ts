// src/models/user.model.ts

// Interface for user data from Supabase
export interface IUser {
  id: string;          // UUID from Supabase
  name: string;
  email: string;
  password: string;
  created_at?: string; // timestamp from Supabase
  updated_at?: string; // timestamp from Supabase
}

// Interface for user response (without password)
export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

// Interface for user registration input
export interface IUserRegister {
  name: string;
  email: string;
  password: string;
}

// Interface for user login input
export interface IUserLogin {
  email: string;
  password: string;
}
