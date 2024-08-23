import { Router } from "express";
import OrganizationController from "../controllers/organization/organizationController";
import { isAuthorized,isAuthorizedTeamOwner } from "../middleware/auth";

const router = Router();
const organizationController = new OrganizationController();

router.post("/createOrganization", isAuthorized,isAuthorizedTeamOwner, (req, res) =>
  organizationController.createOrganization(req, res,)
);


router.get("/findAll", isAuthorized, (req, res) =>
  organizationController.getOrganization(req, res,)
);



router.put("/updateOrganization", isAuthorized,isAuthorizedTeamOwner, (req, res) =>
  organizationController.updateOrganization(req, res,)
);


router.delete("/:organizationId", isAuthorized, isAuthorizedTeamOwner,(req, res) =>
  organizationController.deleteOrganization(req, res,)
);
router.get('/getNotifications', isAuthorized, (req, res,next) =>organizationController.subscriptionNotification(req, res,next) );

export default router;
