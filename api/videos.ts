import { Router, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { authenticateToken } from '../middlewares/authenticateToken';
import { Video } from '../model/video';
import { SocketIOService } from "../websocketServer";
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
const router = Router();

router.post('/share', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  // Only accessible with a valid JWT token
  try {
    
    const { url, title } = req.body;
    const video = new Video(title, url, req?.user?.id);
    
    if(!video.isValid()) {
      return res.status(400).json({ error: "Invalid data" });
    }
    
    let result: any = await video.insert();
    if (result?.error) {
      return res.status(400).json({ error: result.error });
    }
    let maxObject: any = await Video.getMaxId(req?.user?.id);
    SocketIOService.instance().getServer().emit("shareVideo", { url, title, shareBy: req?.user?.name, senderId: req?.user?.id, id: maxObject.maxId } );
    res.status(200).json({  url, title, shareBy: req?.user?.name , message: "Video shared" });
  } catch(err: any) {
    res.status(400).json({ error: err.message });
  } 
});

router.post('/videos', async (req: AuthenticatedRequest, res: Response) => {
  // Only accessible with a valid JWT token
  try {
    
    const { offset, size } = req.body;
    const total: any = await Video.getAllVideos();
    const videos = await Video.getVideos(offset || 0, size || 10);
    res.status(200).json({ total: total.total, videos });
  } catch(err: any) {
    res.status(400).json({ error: err.message });
  } 
});



export default router;
