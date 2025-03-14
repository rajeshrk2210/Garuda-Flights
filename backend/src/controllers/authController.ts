import { Request, Response } from 'express'
import { authenticateUser, registerUser } from '../services/authService'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body
    const newUser = await registerUser(email, password, role)
    res.status(201).json({ message: 'User registered successfully', user: newUser })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res.status(400).json({ message: errorMessage })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);  // Log email for debugging
    const { token, user } = await authenticateUser(email, password)

    console.log("Login Response User:", user); // Log the user object

    res.status(200).json({ message: 'Login successful', token, user })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    console.error("Login error:", errorMessage);  // Log the error
    res.status(400).json({ message: errorMessage });
  }
}
