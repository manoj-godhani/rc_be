import { Router } from "express";
import TeamController from "../controllers/team/teamController";
import  {isAuthorized, isAuthorizedTeamOwner}  from "../middleware/auth";
const router = Router();
const teamController = new TeamController();

router.post("/createTeam", isAuthorized,isAuthorizedTeamOwner, (req, res) =>
  teamController.createTeam(req, res)
);

router.patch("/updateTeam", isAuthorized, isAuthorizedTeamOwner,(req, res) =>
  teamController.updateTeam(req, res)
);

router.post("/invitations", isAuthorized ,isAuthorizedTeamOwner,(req, res,next) =>
  teamController.sendInvitation(req, res,next)
);

router.get("/invitations/verify/:token", (req, res) =>
  teamController.verifyInvitation(req, res)
);

router.put('/members/role', isAuthorized,isAuthorizedTeamOwner, (req, res, next) =>
  teamController.updateTeamMemberRoleHandler(req, res, next)
);

router.get('/get_team_members', isAuthorized,(req, res) =>
  teamController.getAllTeamMembers(req, res)
);

router.get('/getTeams', isAuthorized, (req, res) =>
  teamController.getAllTeams(req, res)
);

router.get('/:id', isAuthorized, (req, res) =>
  teamController.getSingleTeam(req, res)
);


router.delete("/delete_team/:id", isAuthorized,isAuthorizedTeamOwner, (req, res) =>
  teamController.deactivateTeam(req, res)
);

router.delete("/delete_team_member/:id", isAuthorized,isAuthorizedTeamOwner, (req, res) =>
  teamController.deactivateTeamMember(req, res)
);


export default router;
