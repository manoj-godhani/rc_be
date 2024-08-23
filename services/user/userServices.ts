import { config } from "../../config";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/erroHandler";
import { MESSEGES } from "../../constants";
import supabase from "../db/supabase";

export const ExistUser = async (model: string, data: string) => {
  const response = await supabase
    .getClient()
    .from(model)
    .select("*")
    .eq("email", data)
    .single();
  return response?.data;
};

export const findUserByResetToken = async (resetToken: string) => {
  const { data, error } = await supabase
    .getClient()
    .from("users")
    .select(
      "id,email,subscription_plan,is_user_plan_active,stripe_customer_id,account_type"
    )
    .eq("resetToken", resetToken);

  return data?.length > 0 ? data[0] : null;
};

export const updateEmailVerificationStatus = async (email: string) => {
  try {
    const { error } = await supabase
      .getClient()
      .from("users")
      .update({ is_email_verified: true, resetToken: null, token_expiry: null })
      .eq("email", email);

    if (error) throw new Error(error.message);

    return true;
  } catch (error) {
    throw new Error(
      `Error updating email verification status: ${error.message}`
    );
  }
};

export const findUser = async (email: string) => {
  const { data, error } = await supabase
    .getClient()
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return false;
  return !!data;
};

export const createUser = async (userDetails: any) => {
  const { data, error } = await supabase
    .getClient()
    .from("users")
    .insert([userDetails])
    .select()
    .single();

  if (error) {
    console.error("Error inserting user:", error.message);
    throw new Error(error.message);
  }

  return data;
};

export const updatePassword = async (email: string, hashedPassword: string) => {
  const { error } = await supabase
    .getClient()
    .from("users")
    .update({ password: hashedPassword, resetToken: null })
    .eq("email", email);

  if (error) {
    throw new AppError("Error updating password", 500);
  }
};

export const updateResetToken = async (
  email: string,
  resetToken: string,
  token_expiry: Date
) => {
  const { error } = await supabase
    .getClient()
    .from("users")
    .update({ resetToken, token_expiry })
    .eq("email", email);

  if (error) {
    throw new AppError("Error updating reset token", 500);
  }
};

export const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .getClient()
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
};

export const updateUserPassword = async (
  userId: string,
  newPassword: string
) => {
  const { data, error } = await supabase
    .getClient()
    .from("users")
    .update({ password: newPassword })
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const setUserSubscriptionTime = async (subscriptionPlan: string) => {
  const now = new Date();
  let endDate = new Date(now);

  if (subscriptionPlan === "free") {
    endDate.setDate(now.getDate() + 14);
  } else {
    throw new Error("This User have no subscription plan");
  }
  return {
    billingCycleStartDate: now.toISOString(),
    billingCycleEndDate: endDate.toISOString(),
  };
};
export const updateUserInUsersTable = async (
  userId: string,
  updateData: any
) => {
  const { data, error } = await supabase
    .getClient()
    .from("users")
    .update(updateData)
    .eq("id", userId)
    .select(
      "id,email,subscription_plan,is_user_plan_active,stripe_customer_id,account_type"
    )
    .single();

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data;
};

export const getUserSubscriptionTimeFromDB = async (userId: string) => {
  try {
    const { data: subscriptions, error } = await supabase
      .getClient()
      .from("Subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("billingCycleStartDate", { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    if (subscriptions.length === 0) {
      return {
        has_used_free_plan: false,
        subscriptionPlan: null,
        billingCycleStartDate: null,
        billingCycleEndDate: null,
      };
    }

    const subscription = subscriptions[0];

    return {
      id: subscription?.id,
      has_used_free_plan: subscription?.has_used_free_plan,
      subscriptionPlan: subscription?.subscription_plan,
      billingCycleStartDate: subscription?.billingCycleStartDate,
      billingCycleEndDate: subscription?.billingCycleEndDate,
      has_extended: subscription?.has_extended,
    };
  } catch (error) {
    console.error("Error fetching user subscription time:", error);
    throw error;
  }
};

export const checkSubscriptionTime = async (userId: string) => {
  try {
    const { data: subscriptions, error } = await supabase
      .getClient()
      .from("Subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("billingCycleStartDate", { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    if (subscriptions.length === 0) {
      // return false
    }

    const subscription = subscriptions[0];

    return {
      billingCycleEndDate: subscription?.billingCycleEndDate,
    };
  } catch (error) {
    console.error("Error fetching user subscription time:", error);
    throw error;
  }
};

export const getCurrentSubscription = async (userId: any) => {
  try {
    const { data: subscription, error } = await supabase
      .getClient()
      .from("Subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("billingCycleStartDate", { ascending: false })
      // .eq('subscription_plan', 'free')
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }
    return subscription[0];
  } catch (error) {
    console.error("Error fetching current subscription:", error);
    throw error;
  }
};

export const getSubscriptionLimits = (subscriptionPlan: string) => {
  switch (subscriptionPlan) {
    case "free":
      return { numberOfUploads: 10, numberOfAILimits: 5 };
    case "standard-monthly":
      return { numberOfUploads: 100, numberOfAILimits: 50 };
    case "standard-yearly":
      return { numberOfUploads: 200, numberOfAILimits: 100 };
    default:
      throw new Error("Invalid subscription plan");
  }
};

export const findSocialLoginByUidAndProvider = async (
  uid: any,
  provider: any
) => {
  const { data, error } = await supabase
    .getClient()
    .from("socialLogin")
    .select("user_id")
    .eq("uid", uid)
    .eq("provider", provider)
    .single();
  if (error || !data) {
    return null;
  }

  return data;
};

export const getUserInfo = async (userId: any) => {
  const { data, error } = await supabase
    .getClient()
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error && error.code === "PGRST116") {
    throw new AppError("User not found", 404);
  }
  return data;
};

export const findUserById = async (userId: any) => {
  const { data, error } = await supabase
    .getClient()
    .from("users")
    .select(
      "id, email, subscription_plan, is_user_plan_active, stripe_customer_id,account_type"
    )
    .eq("id", userId)
    .single();
  if (error && error.code === "PGRST116") {
    throw new AppError("User not found", 404);
  }
  return data;
};

export const createSocialLogin = async (socialLoginData: any) => {
  const { data, error } = await supabase
    .getClient()
    .from("socialLogin")
    .insert(socialLoginData);
  if (error) {
    throw error;
  }
  return data;
};
