import bcrypt from 'bcryptjs'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

export const registerUser = async (
  email: string,
  password: string,
  role: string
) => {
  const hashedPassword = await bcrypt.hash(password, 12)
  const newUser = new User({ email, password: hashedPassword, role })
  await newUser.save()
  return newUser
}

export const authenticateUser = async (email: string, inputPassword: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('User not found')
  }

  // Compare inputPassword with the user's stored password
  const isMatch = await bcrypt.compare(inputPassword, user.password)
  if (!isMatch) {
    throw new Error('Invalid credentials')
  }

  const token = jwt.sign({ userId: user?._id, role: user?.role }, JWT_SECRET, {
    expiresIn: '1h'
  })

  // Return user data without the password field
  const { password, ...userWithoutPassword } = user.toObject()
  
  return { token, user: userWithoutPassword }
}



export const validateToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}
