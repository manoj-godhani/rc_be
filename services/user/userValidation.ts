import Joi from "joi";

export const signUpSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(8).max(30).required().label('Password'),
  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .label('Confirm Password')
    .messages({ 'any.only': 'Password and Confirm Password do not match' }),
    token:Joi.string().optional().allow(""),
});
export const signInSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(8).max(30).required().label('Password'),
});

export const subscriptionPlanSchema = Joi.object({
  userId: Joi.string().required().label('User ID'),
  subscriptionPlan: Joi.string().valid("free", "monthly", "yearly").required().label('Subscription Plan'),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).max(30).required().label('New Password'),
 
  confirmPassword: Joi.any()
  .valid(Joi.ref('password'))
  .required()
  .label('Confirm Password')
  .messages({ 'any.only': 'Password and Confirm Password do not match' }),
});

export const validateSubscriptionPlan = Joi.object({
  subscriptionPlan: Joi.string().valid("free"),
})

export const changePasswordSchema = Joi.object({
  password: Joi.string().min(8).max(30).required(),
  newPassword: Joi.string().min(8).max(30).required(),
});

export const ResendEmailSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
});