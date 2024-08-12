import { Notifications } from "../models/notifications.model.js";

export async function createPlanNotification(
  name,
  portal,
  user_type,
  user_id,
  code
) {
  const data = [
    {
      type: "Portal Plan Purchase",
      content: `${name} has acquired a plan on ${portal} portal`,
      user_type,
      user_id,
    },
    {
      type: "Portal Plan Purchase",
      content: `${name} has acquired a plan on ${portal} portal using this Referral Code: ${code}`,
      user_type: "admin",
      user_id: 1,
    },
  ];
  await Notifications.bulkCreate(data);
}

export async function createRegNotification(
  name,
  portal,
  user_type,
  user_id,
  code
) {
  const data = {
    type: "Portal Register User",
    content: `${name} has become a member of the ${portal} portal`,
    user_type,
    user_id,
  };
  await Notifications.create(data);
}

export async function createPayoutNotification(name, amount) {
  const data = {
    type: "Payout Request",
    content: `${name} has made a payout request for ₹${amount}`,
    user_type: "admin",
    user_id: 1,
  };
  await Notifications.create(data);
}
