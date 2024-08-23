import express from "express";
import pdfController from "../controllers/pdf/pdfController";

const router = express.Router();
router.get('/extract-data',(req,res)=> pdfController.extractFileData(req,res));

export default router;
