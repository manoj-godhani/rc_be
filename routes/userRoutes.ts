import express from 'express';
import UserController from "../controllers/user/userController";
import isAuthorized from '../middleware/auth';
const router = express.Router();
const userController = new UserController();

router.post("/signup", (req, res,next) =>
  userController.signUp(req, res, next)
);

router.get('/verify-email/:token',(req,res,next)=> userController.verifyEmail(req,res,next));

router.post('/resend-verify-email', (req,res,next)=> userController.resendEmailVerify(req,res,next))
router.post('/change-password',isAuthorized, (req,res,next)=>userController.changePassword(req,res,next))

router.patch("/updateSubscriptionPlan", isAuthorized,(req, res,next) =>
    userController.updateUserSubscriptionPlan(req, res,next)
  );
  router.patch("/extendSubscriptionPlan", isAuthorized,(req, res,next) =>
    userController.extendUserSubscriptionPlan(req, res,next)
  );
router.post ("/social_login",(req,res,next)=> userController.socialLogin(req,res,next))
router.post('/signin',(req,res,next)=>  userController.signIn(req,res,next));
router.post('/forgot-password',(req,res,next)=>  userController.forgotPassword(req,res,next));
router.post('/reset-password/:token',(req,res,next)=>  userController.resetPassword(req,res,next));

export default router;