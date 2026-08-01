// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";
import type { IUser, IUserResponse } from "../models/user.model";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return secret;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email and password are required",
      });
    }

    // Check if User exists
    const { data: existingUser, error: checkError } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid error when no User found

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create User in Supabase
    const { data: User, error } = await supabase
      .from('User')
      .insert({
        name,
        email,
        password: hash,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to create User",
      });
    }

    if (!User) {
      return res.status(500).json({
        success: false,
        message: "Failed to create User",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: User.id }, getJwtSecret(), {
      expiresIn: "1d",
    });

    return res.status(201).json({
      success: true,
      message: "User created",
      token,
      User: {
        id: User.id,
        name: User.name,
        email: User.email,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    // Find User by email
    const { data: User, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle() to avoid error when User not found

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }

    if (!User) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const ok = await bcrypt.compare(password, User.password);
    if (!ok) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: User.id }, getJwtSecret(), {
      expiresIn: "1d",
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      User: {
        id: User.id,
        name: User.name,
        email: User.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
