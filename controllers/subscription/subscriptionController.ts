import { Request, Response, NextFunction } from "express";
import { AppError, handleError } from "../../utils/erroHandler";
import {
  checkoutSessionSchema,
  createSubscriptionSchema,
  portalSessionSchema,
  stripeCustomerUpdateSchema,
  subscriptionSchema,
} from "../../services/subscription/subscriptionValidation";
import Joi from "joi";

import {
  getSubscriptionByConditions,
  createSubscription,
  updateSubscriptionStatus,
} from "../../services/subscription/subscriptionServices";

import {
  checkoutSession,
  getStripeOrderDetails,
  portalSession,
  stirpeCustomerUpdate,
} from "../../utils/stripe";
import { MESSEGES } from "../../constants/index";
import {
  findUserById,
  updateUserInUsersTable,
} from "../../services/user/userServices";
import { sendEmail } from "../../utils/email";

class SubscriptionController {
  private validate(schema: Joi.ObjectSchema, data: any) {
    const { error } = schema.validate(data);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }
  }
  async createCheckoutSession(req: any, res: Response, next: NextFunction) {
    try {
      this.validate(checkoutSessionSchema, req.body);
      const user = req.user;
      const customer = await findUserById(user?.id);

      const sessionURL = await checkoutSession(req.body.lookupKey, {
        customer: customer?.stripe_customer_id,
        customer_email: customer?.email,
      });
      return res.status(201).send({
        isSuccess: true,
        message: MESSEGES.STRIPE_PAYMENT_SUCCESS,
        sessionURL,
      });
    } catch (error) {
      console.log(error);
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).send({ isSuccess: false, message });
    }
  }

  async createPortalSession(req: Request, res: Response, next: NextFunction) {
    try {
      this.validate(portalSessionSchema, req.body);

      const portalURL = await portalSession(req.body.customerId);

      return res.status(201).send({
        isSuccess: true,
        message: MESSEGES.STRIPE_PAYMENT_SUCCESS,
        portalURL,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).send({ isSuccess: false, message });
    }
  }
  async stripeCustomerDetailsUpdate(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      this.validate(stripeCustomerUpdateSchema, req.body);
      const { address_1, address_2, city, postal_code, country, state } =
        req.body;
      const user = req.user;

      const customerData = await stirpeCustomerUpdate(user.stripe_customer_id, {
        line1: address_1,
        line2: address_2,
        city,
        postal_code: postal_code,
        country,
        state,
      });

      if (!customerData) {
        throw new AppError(MESSEGES.COULD_NOT_UPDATE_CUSTOMER_DETAILS, 400);
      }

      return res.status(201).send({
        isSuccess: true,
        message: MESSEGES.STIPE_CUSTOMER_UPDATE_SUCCESS,
      });
    } catch (error) {
      console.error("Error in stripeCustomerDetailsUpdate:", error);
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).send({ isSuccess: false, message });
    }
  }

  async subscriptions(req: any, res: Response, next: NextFunction) {
    try {
      const { object } = req.body.data || {};
      const user = req.user;
      const userId = user?.id;

      if (req.body.type === "customer.subscription.created") {
        let requiredFields: any = {
          billingCycleStartDate: object.current_period_start,
          billingCycleEndDate: object.current_period_end,
          stripesubscriptionid: object.id,
          planId: object.plan.id,
          subscription_plan: object.items.data[0]?.price?.lookup_key,
          status: true,
          price: object.items.data[0].price.id,
          user_id: userId,
        };
        requiredFields.billingCycleStartDate = new Date(
          object.current_period_start * 1000
        );
        requiredFields.billingCycleEndDate = new Date(
          object.current_period_end * 1000
        );

        const subscriptionExists = await getSubscriptionByConditions(
          "Subscriptions",
          {
            stripesubscriptionid: requiredFields.stripesubscriptionid,
            user_id: userId,
          }
        );

        if (subscriptionExists.status === true) {
          throw new AppError(MESSEGES.SUBSCRIPTION_ALREADY_EXISTS, 400);
        }

        const subscription = await createSubscription(
          "Subscriptions",
          requiredFields
        );

        await sendEmail(
          user?.email,
          "subscriptionPlan",
          subscription.subscription_plan
        );

        const updatedUser = await updateUserInUsersTable(userId, {
          subscription_plan: subscription.subscription_plan,
          is_user_plan_active: true,
        });

        if (!subscription) {
          throw new AppError(MESSEGES.SUBSCRIPTION_CREATED_FAILED, 400);
        }

        return res.status(201).send({
          isSuccess: true,
          message: MESSEGES.SUBSCRIPTION_CREATED_SUCCESS,
          updatedUser: { ...updatedUser, subscription: subscription },
        });
      } else if (req.body.type === "customer.subscription.deleted") {
        const subscription = await getSubscriptionByConditions(
          "Subscriptions",
          {
            user_id: user?.id,
          }
        );

        if (!subscription) {
          throw new AppError(MESSEGES.SUBSCRIPTION_NOT_EXIST, 404);
        }

        await updateSubscriptionStatus("Subscriptions", user.id, {
          status: false,
        });
        return res.status(200).send({
          isSuccess: true,
          message: MESSEGES.SUBSCRIPTION_DELETED_SUCCESS,
        });
      } else {
        console.log(`Unhandled subscription event type: ${req.body.type}`);
        return res.status(400).send({
          isSuccess: false,
          message: `Unhandled subscription event type: ${req.body.type}`,
        });
      }
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).send({ isSuccess: false, message });
    }
  }

  async createSubscription(req: any, res: Response, next: NextFunction) {
    try {
      this.validate(createSubscriptionSchema, req.body);
      const userId = req?.user?.id;
      const user = req.user;

      const stripeUserData = await getStripeOrderDetails(req?.body?.sessionId);

      if (!stripeUserData) {
        throw new AppError(MESSEGES.SUBSCRIPTION_RETRIVED_FAILED, 400);
      }

      const formatDataAndTime = (unixTimestamp: number) => {
        const date = new Date(unixTimestamp * 1000);
        const formattedDate = date.toISOString();
        return formattedDate;
      };

      let subscriptionObj = {
        billingCycleStartDate: formatDataAndTime(
          stripeUserData.current_period_start
        ),
        billingCycleEndDate: formatDataAndTime(
          stripeUserData.current_period_end
        ),
        stripesubscriptionid: stripeUserData.id,
        planId: stripeUserData.plan.id,
        subscription_plan: stripeUserData?.items?.data[0]?.price?.lookup_key,
        is_user_plan_active: true,
        price: stripeUserData?.items?.data[0]?.price?.id,
        user_id: userId,
        has_used_free_plan: true,
        has_extended: true,
      };

      const subscription = await getSubscriptionByConditions("Subscriptions", {
        stripesubscriptionid: stripeUserData?.id,
      });

      if (!subscription && stripeUserData?.status === "active") {
        const subscription = await createSubscription("Subscriptions", {
          ...subscriptionObj,
          status: true,
        });
        await sendEmail(
          user?.email,
          "subscriptionPlan",
          subscriptionObj.subscription_plan
        );

        const updatedUser = await updateUserInUsersTable(userId, {
          subscription_plan: subscriptionObj.subscription_plan,
          is_user_plan_active: true,
        });

        return res.status(201).send({
          isSuccess: true,
          messsage: MESSEGES.PAYMENT_DATA_CREATED,
          updatedUser: { ...updatedUser, subscription },
        });
      } else if (stripeUserData?.status === "active") {
        const billingCycleEndDate = subscription?.billingCycleEndDate;

        const updatedSubscription = await updateSubscriptionStatus(
          "Subscriptions",
          user.id,
          {
            status: true,
            billingCycleEndDate: new Date(billingCycleEndDate),
          }
        );

        await sendEmail(
          user?.email,
          "subscriptionPlan",
          subscriptionObj.subscription_plan
        );

        const updatedUser = await updateUserInUsersTable(userId, {
          subscription_plan: subscriptionObj.subscription_plan,
          is_user_plan_active: true,
        });

        return res.status(201).send({
          isSuccess: true,
          message: MESSEGES.PAYMENT_DATA_UPDATED,
          updatedUser: { ...updatedUser, subscription: updatedSubscription },
        });
      }
    } catch (error) {
      console.log("Error in subscriptions handler:", error);
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).send({ isSuccess: false, message });
    }
  }
}

export default SubscriptionController;
