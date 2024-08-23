import express from "express";
import SubscriptionController from "../controllers/subscription/subscriptionController";
import { isAuthorized } from "../middleware/auth";

const stripeController = new SubscriptionController();

const router = express.Router();

router.post('/create-checkout-session', isAuthorized, (req, res ,next) => stripeController.createCheckoutSession(req, res ,next))
router.post('/create-portal-session',isAuthorized, (req, res ,next) => stripeController.createPortalSession(req, res ,next))
router.post('/webhook/subscription',isAuthorized, (req, res ,next) => stripeController.subscriptions(req, res ,next))
router.post('/create-subscription',isAuthorized,(req, res ,next) => stripeController.createSubscription(req, res ,next))
// router.post('/stripe-customer-details-update',isAuthorized,(req, res ,next) => stripeController.stripeCustomerDetailsUpdate(req, res ,next))





export default router;