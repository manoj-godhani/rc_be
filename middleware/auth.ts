import { MESSEGES } from "../constants/index";
import { verifyJwtToken } from "../utils/token";

import { AppError, handleError } from '../utils/erroHandler'
import {
  checkSubscriptionTime,
  findUserByEmail,
  findUserById,
} from "../services/user/userServices";

export const isAuthorized = async (req: any, res: any, next: any) => {
  try {
    const bearer = req?.headers?.authorization;

    if (!bearer) {
      throw new AppError(MESSEGES.AUTHORIZATION_INVALID, 401);
    }

    const token = bearer.split(" ")[1] || "";

    if (!token) {
      throw new AppError(MESSEGES.AUTHORIZATION_TOKEN_NOT_FOUND, 401);
    }

    const decodeUser = await verifyJwtToken(token);

    if (!decodeUser) {
      throw new AppError(MESSEGES.TOKEN_NOT_VERIFIED, 401);
    }

    const { email } = decodeUser || {};

    if (!email) {
      throw new AppError(
        "Unauthorized access please Contact with the Administrator",
        401
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      throw new AppError("User not Found", 401);
    }

    const userSubscriptionTime = await checkSubscriptionTime(user?.id);

    if (userSubscriptionTime) {
      let currentDate = new Date();
      if (new Date(userSubscriptionTime.billingCycleEndDate) < currentDate) {
        throw new AppError(MESSEGES.USER_SUBSCRIPTION_PLAN_EXPIRED, 401);
      }
    }

    req.user_id = user.id;
    req.user = user;

    next();
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
};

export default isAuthorized;

export const isAuthorizedTeamOwner = async (req: any, res: any, next: any) => {
  try {
    const user = req.user;
    const accountOwner = await findUserById(user?.id);

    if (!accountOwner) {
      throw new AppError("User not authenticated", 401);
    }

    if (accountOwner.account_type === "owner") {
      return next();
    }

    throw new AppError("User is not authorized to access this resource", 403);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    return res.status(statusCode).json({ isSuccess: false, message });
  }
};
