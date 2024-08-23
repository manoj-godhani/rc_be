import axios from "axios";
import { AppError } from "../../utils/erroHandler";

export async function verifyGoogleIdToken(accessToken: string) {
  try {
    
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error.response ? error.response.data : error.message);
    throw new AppError('Failed to fetch user info', 400);
  }
}


export async function getMicrosoftUserInfo(accessToken: string) {
  try {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error.response ? error.response.data : error.message);
    throw new AppError('Failed to fetch user info', 400);
  }
}



export const getFacebookUserinfo = async (accessToken:string) => {
  try {
  const response = await axios.get('https://graph.facebook.com/me', {
      params: {
          access_token: accessToken,
            fields: 'email, id, name'
      }
  });
  return response.data;
}
catch (error) {
  console.error('Error fetching user info:', error.response ? error.response.data : error.message);
  throw new AppError('Failed to fetch user info', 400);
}
};