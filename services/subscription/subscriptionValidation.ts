import Joi from "joi";

export const checkoutSessionSchema = Joi.object({
  lookupKey: Joi.string().required().messages({
    "any.required": "lookupKey is required",
    "string.base": "lookupKey should be a string",
  }),
});

export const portalSessionSchema = Joi.object({
  customerId: Joi.string().required().messages({
    "any.required": "customerId is required",
    "string.base": "customerId should be a string",
  }),
});

export const subscriptionSchema = Joi.object({
  billingCycleStartDate: Joi.number().required().messages({
    "any.required": "billingCycleStartDate is required",
    "number.base": "billingCycleStartDate should be a number",
  }),
  billingCycleEndDate: Joi.number().required().messages({
    "any.required": "billingCycleEndDate is required",
    "number.base": "billingCycleEndDate should be a number",
  }),
  stripeSubscriptionid: Joi.string().required().messages({
    "any.required": "stripeSubscriptionId is required",
    "string.base": "stripeSubscriptionId should be a string",
  }),
  planId: Joi.string().required().messages({
    "any.required": "planId is required",
    "string.base": "planId should be a string",
  }),
});

export const stripeCustomerUpdateSchema = Joi.object({
  address1: Joi.string().required(),
  address2: Joi.string().required(),
  city: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
});

export const createSubscriptionSchema = Joi.object({
  sessionId: Joi.string().required(),
});
