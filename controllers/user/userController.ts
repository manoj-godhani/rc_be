import { Response, NextFunction } from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { MESSEGES } from "../../constants";
import {
  createSocialLogin,
  createUser,
  ExistUser,
  findSocialLoginByUidAndProvider,
  findUser,
  findUserByEmail,
  findUserById,
  findUserByResetToken,
  getCurrentSubscription,
  getSubscriptionLimits,
  getUserInfo,
  getUserSubscriptionTimeFromDB,
  setUserSubscriptionTime,
  updateEmailVerificationStatus,
  updatePassword,
  updateResetToken,
  updateUserInUsersTable,
  updateUserPassword,
} from "../../services/user/userServices";

import {
  resetPasswordSchema,
  forgotPasswordSchema,
  signUpSchema,
  signInSchema,
  ResendEmailSchema,
  changePasswordSchema,
  validateSubscriptionPlan,
} from "../../services/user/userValidation";
import { sendEmail, sendVerificationEmail } from "../../utils/email";
import { AppError, handleError } from "../../utils/erroHandler";
import { createStripeCustomer } from "../../utils/stripe";
import { generateRefreshToken, generateToken } from "../../utils/token";
import { config } from "../../config";
import {
  getFacebookUserinfo,
  getMicrosoftUserInfo,
  verifyGoogleIdToken,
} from "../../services/user/userSocialLogin";
import {
  createSubscription,
  updateSubscription,
} from "../../services/subscription/subscriptionServices";

class UserController {
  private async validate(schema: any, data: any) {
    const { error } = schema.validate(data);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }
  }

  async signUp(req: any, res: Response, next: NextFunction) {
    try {
      await this.validate(signUpSchema, req.body);

      const { email, password } = req.body;
      const existingUser = await findUser(email);

      if (existingUser) {
        throw new AppError(MESSEGES.USER_ALREADY_EXISTS, 400);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const stripeResponse = await createStripeCustomer(email);

      const resetToken = nanoid(100);
      const token_expiry = new Date(Date.now() + config.emailVerifyExpiry);

      await createUser({
        email,
        password: hashedPassword,
        resetToken,
        token_expiry,
        stripe_customer_id: stripeResponse,
      });

      await sendVerificationEmail(
        email,
        resetToken,
        "accountVerification",
        next
      );

      return res
        .status(201)
        .send({ isSuccess: true, message: MESSEGES.VERIFICATION_EMAIL_SENT });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }
  async verifyEmail(req: any, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;

      if (!token) {
        throw new AppError(MESSEGES.INVALID_TOKEN, 400);
      }

      const user:{
        id: string;
        email: string;
        account_type: string;
        token_expiry?: Date;
      } = await findUserByResetToken(token);

      if (!user) {
        throw new AppError(MESSEGES.INVALID_OR_EXPIRED_TOKEN, 400);
      }

      if (user?.token_expiry < new Date()) {
        throw new AppError(MESSEGES.INVITATION_EXPIRED, 400);
      }

      const accessToken = await generateToken({
        userId: user?.id,
        email: user?.email,
        account_type: user?.account_type,
      });
      const refreshToken = await generateRefreshToken({
        userId: user?.id,
        email: user?.email,
        account_type: user?.account_type,
      });

      await updateEmailVerificationStatus(user.email);

      return res.status(201).send({
        isSuccess: true,
        message: MESSEGES.EMAIL_VERIFIED,
        data: { refreshToken, token: accessToken },
        user,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }
  async signIn(req: any, res: Response, next: NextFunction) {
    try {
      await this.validate(signInSchema, req.body);

      const { email, password } = req.body;

      const user = await ExistUser("users", email);

      if (!user) {
        throw new AppError(MESSEGES.INVALID_EMAIL_OR_PASSWORD, 401);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new AppError(MESSEGES.INVALID_EMAIL_OR_PASSWORD, 401);
      }
      if (!user.is_email_verified) {
        throw new AppError(MESSEGES.EMAIL_NOT_VERIFIED, 403);
      }
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        account_type: user.account_type,
      });
      const refreshToken = await generateRefreshToken({
        userId: user.id,
        email: user.email,
        account_type: user.account_type,
      });

      const userToSend = await findUserById(user?.id);

      const userSubscriptionTime = await getUserSubscriptionTimeFromDB(
        user?.id
      );
      return res.status(200).send({
        isSuccess: true,
        message: MESSEGES.SIGNIN_SUCCESSFUL,
        data: {
          token,
          refreshToken,
          user: { ...userToSend, subscription: userSubscriptionTime },
        },
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async forgotPassword(req: any, res: Response, next: NextFunction) {
    try {
      await this.validate(forgotPasswordSchema, req.body);
      const { email } = req.body;

      const user = await ExistUser("users", email);

      if (!user) {
        throw new AppError(MESSEGES.USER_NOT_FOUND, 404);
      }

      const resetToken = nanoid(100);
      const token_expiry = new Date(Date.now() + 10 * 60 * 1000);

      await updateResetToken(email, resetToken, token_expiry);

      await sendVerificationEmail(
        email,
        resetToken,
        "accountForgotPassword",
        next
      );

      return res
        .status(200)
        .send({ isSuccess: true, message: MESSEGES.PASSWORD_RESET_EMAIL_SENT });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async resetPassword(req: any, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;

      await this.validate(resetPasswordSchema, req.body);

      const { password } = req.body;

      const user = await findUserByResetToken(token);

      if (!user) {
        throw new AppError(MESSEGES.INVALID_OR_EXPIRED_TOKEN, 400);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await updatePassword(user.email, hashedPassword);

      return res.status(200).send({
        isSuccess: true,
        message: MESSEGES.PASSWORD_CHANGED_SUCCESSFULLY,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }
  async resendEmailVerify(req: any, res: Response, next: NextFunction) {
    try {
      await this.validate(ResendEmailSchema, req.body);

      const { email } = req.body;

      const user = await ExistUser("users", email);

      if (!user) {
        throw new AppError(MESSEGES.USER_NOT_FOUND, 404);
      }

      const resetToken = nanoid(100);
      const token_expiry = new Date(Date.now() + 10 * 60 * 1000);

      await updateResetToken(email, resetToken, token_expiry);

      await sendVerificationEmail(
        email,
        resetToken,
        "accountVerification",
        next
      );

      return res.status(201).json({
        isSuccess: true,
        message: MESSEGES.EMAIL_SENT,
        data: { email },
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }
  async changePassword(req: any, res: Response, next: NextFunction) {
    try {
      await this.validate(changePasswordSchema, req.body);

      const { newPassword, password } = req.body;

      const userId = req.user_id;
      const user = await getUserInfo(userId);
      if (!user) {
        throw new AppError(MESSEGES.USER_DOES_NOT_EXIST, 400);
      }

      console.log(user);

      const match = await bcrypt.compare(password, user.password);

      console.log(match);

      if (!match) {
        throw new AppError(MESSEGES.PASSWORD_INVALID, 400);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log(hashedPassword);

      await updateUserPassword(user.id, hashedPassword);

      return res
        .status(201)
        .send({ isSuccess: true, message: MESSEGES.PASSWORD_RESET_SUCCESS });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async updateUserSubscriptionPlan(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      await this.validate(validateSubscriptionPlan, req.body);

      const userId = req.user_id;
      const { subscriptionPlan } = req.body;
      const user = await findUserById(userId);

      if (!user) {
        throw new AppError(MESSEGES.USER_DOES_NOT_EXIST, 400);
      }

      const currentSubscription = await getCurrentSubscription(userId);

      if (
        subscriptionPlan === "free" &&
        currentSubscription?.has_used_free_plan
      ) {
        throw new AppError(MESSEGES.USER_SUBSCRIPTION_PLAN, 400);
      }

      const userSubscriptionTime = await setUserSubscriptionTime(
        subscriptionPlan
      );

      const { numberOfUploads, numberOfAILimits } =
        getSubscriptionLimits(subscriptionPlan);

      const userSubscription = await createSubscription("Subscriptions", {
        user_id: userId,
        subscription_plan: subscriptionPlan,
        has_used_free_plan:
          subscriptionPlan === "free"
            ? true
            : currentSubscription?.has_used_free_plan,
        billingCycleStartDate: userSubscriptionTime.billingCycleStartDate,
        billingCycleEndDate: userSubscriptionTime.billingCycleEndDate,
        numberOfUploads: numberOfUploads,
        numberOfAILimits: numberOfAILimits,
      });

      await sendEmail(user.email, "subscriptionPlan", subscriptionPlan);

      const updatedUser = await updateUserInUsersTable(userId, {
        subscription_plan: subscriptionPlan,
        is_user_plan_active: true,
      });

      return res.status(200).send({
        isSuccess: true,
        message: MESSEGES.SUBSCRIPTION_PLAN_SUCCESSFULL,

        updatedUser: { ...updatedUser, subscription: userSubscription },
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async extendUserSubscriptionPlan(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user_id;
      const user = await findUserById(userId);

      if (!user) {
        throw new AppError(MESSEGES.USER_DOES_NOT_EXIST, 400);
      }

      const currentSubscription = await getCurrentSubscription(userId);
      if (currentSubscription.has_extended) {
        throw new AppError(MESSEGES.SUBSCRIPTION_EXTENSION_ALREADY_USED, 400);
      }

      const currentEndDate = new Date(currentSubscription.billingCycleEndDate);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setDate(currentEndDate.getDate() + 7);
      console.log(newEndDate);
      let updatedSubscription;

      if (currentSubscription.subscription_plan === "free") {
        updatedSubscription = await updateSubscription(
          userId,
          newEndDate.toISOString()
        );
      } else {
        throw new AppError(MESSEGES.USER_FREE_SUBSCRIPTION_PLAN_EXTENSION, 400);
      }
      let subscriptionPlan = "free";
      const updatedUser = await updateUserInUsersTable(userId, {
        subscription_plan: subscriptionPlan,
        is_user_plan_active: true,
      });

      return res.status(200).send({
        isSuccess: true,
        message: MESSEGES.SUBSCRIPTION_EXTENDED_SUCCESSFULLY,
        updatedUser: { ...updatedUser, subscription: updatedSubscription },
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async socialLogin(req: any, res: Response, next: NextFunction) {
    const { provider, token } = req.body;
    try {
      let userObj: any;
      if (provider === "google") {
        userObj = await verifyGoogleIdToken(token);
      } else if (provider === "microsoft") {
        userObj = await getMicrosoftUserInfo(token);
      } else if (provider === "facebook")
        userObj = await getFacebookUserinfo(token);
      else {
        throw new AppError("Invalid Social Provider", 400);
      }

      if (!userObj) {
        throw new AppError("Invalid OAuth.", 400);
      }

      const existSocialLogin = await findSocialLoginByUidAndProvider(
        userObj.sub || userObj.id,
        provider
      );

      if (existSocialLogin) {
        const existingUser = await findUserById(existSocialLogin.user_id);
        const userSubscriptionTime = await getUserSubscriptionTimeFromDB(
          existingUser?.id
        );

        const token = await generateToken({
          userId: existingUser?.id,
          email: existingUser?.email,
          account_type: existingUser?.account_type,
        });
        const refreshToken = await generateRefreshToken({
          userId: existingUser?.id,
          email: existingUser?.email,
          account_type: existingUser?.account_type,
        });
        return res.status(200).json({
          isSuccess: true,
          user: { ...existingUser, subscription: userSubscriptionTime },
          token,
          refreshToken,
          message: MESSEGES.USER_SIGN_IN,
        });
      } else {
        let userId;

        const existingEmailUser = await findUserByEmail(userObj?.email);

        if (existingEmailUser) {
          userId = existingEmailUser.id;
        } else {
          const stripeResponse = await createStripeCustomer(userObj?.email);

          const newUser = await createUser({
            email: userObj.email,
            is_email_verified: true,
            stripe_customer_id: stripeResponse,
          });
          userId = newUser.id;
        }
        const userSubscriptionTime = await getUserSubscriptionTimeFromDB(
          userId
        );
        await createSocialLogin({
          uid: userObj.id || userObj.sub,
          provider,
          user_id: userId,
        });

        const userToSend = await findUserById(userId);
        const token = await generateToken({
          userId: userToSend.id,
          email: userToSend.email,
          account_type: userToSend.account_type,
        });
        const refreshToken = await generateRefreshToken({
          userId: userToSend.id,
          email: userToSend.email,
          account_type: userToSend.account_type,
        });
        return res.status(200).json({
          isSuccess: true,

          user: { ...userToSend, subscription: userSubscriptionTime },
          token,
          refreshToken,
          message: MESSEGES.USER_SIGN_IN,
        });
      }
    } catch (error) {
      console.log(error);

      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }
}

export default UserController;
