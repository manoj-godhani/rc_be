import jwt from "jsonwebtoken";
import { config } from "../config/index";


export async function generateToken(payload:any) {
  const expiresIn = 7 * 24 * 60 * 60; 
  const token = await jwt.sign(payload, config.secrets.jwtSecretKey, {
    expiresIn: expiresIn,
  });

  return token;
}
  
export async function generateRefreshToken(payload:any) {
  const expiresIn = 7 * 24 * 60 * 60; 
  try {
      const token = await jwt.sign(payload, config.secrets.jwtSecretKey, {
          expiresIn: expiresIn,
      });
      return token;
  } catch (error) {
      console.error('Error generating token:', error);
      throw error; 
  }
}

export async function verifyJwtToken(payload) {
  return jwt.verify(payload, config.secrets.jwtSecretKey);
}