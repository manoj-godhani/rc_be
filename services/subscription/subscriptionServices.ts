import supabase from "../db/supabase";

interface Subscription {
  user_id: string;
  billingCycleEndDate: Date;
  has_extended: boolean;
  created_at: string;
  // Add other fields as needed
}

export const getSubscriptionByConditions = async (
  model: string,
  condition: Object,
  removeFields = ""
) => {
  const { data, error } = await supabase
    .getClient()
    .from(model)
    .select(removeFields ? `*` : `*`, { count: "exact" })
    .match(condition)
    .order("billingCycleEndDate", { ascending: false })
    .limit(1);

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    // if (data.length === 0) {
    //   return {
    //     has_used_free_plan:false,
    //     subscriptionPlan: null,
    //     subscriptionStartDate: null,
    //     subscriptionEndDate: null,
    //   };
    // }
    console.log(error, "error");
    throw new Error(error.message);
  }
  return data[0];
};

export const createSubscription = async (model: string, data: Object) => {
  const { data: subscriptionData, error } = await supabase
    .getClient()
    .from(model)
    .insert(data)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return subscriptionData;
};

export const updateSubscriptionStatus = async (
  model: string,
  userId: string,
  dataUpdated: Object
) => {
  const { data, error } = await supabase
    .getClient()
    .from(model)
    .update(dataUpdated)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .select("*")
    .limit(1)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateSubscription = async (
  userId: string,
  newEndDate: Object
) => {
  const { data, error: updateError } = await supabase
    .getClient()
    .from("Subscriptions")
    .update({ billingCycleEndDate: newEndDate, has_extended: true })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .select("*")
    .limit(1)
    .single();
  if (updateError) {
    throw new Error(updateError.message);
  }
  return data;
};
