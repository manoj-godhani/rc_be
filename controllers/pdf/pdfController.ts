import { Request, response, Response } from "express";
import { handleError } from '../../utils/erroHandler'

class PdfController {
	async extractFileData(req: Request, res: Response) {
      try {
         console.log("req",req.body);
			if (true) {
				res.status(200).json({ success: true, message: 'File uploaded successfully' })
			}
		} catch (error) {
			const { statusCode, message } = handleError(error)
			res.status(statusCode).json({ message })
		}
   }

}

export default new PdfController();
