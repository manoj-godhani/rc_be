import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import folderRoutes from './routes/folderRoutes';
import fileRoutes from './routes/fileRoutes';
import teamRoutes from './routes/teamRoutes';
import stipeRoute from './routes/subscription';
import favoritesRoutes from "./routes/favoritesRoutes";
import tagsRoutes from "./routes/tagsRoutes";
import organizationRoute from "./routes/organizationRoutes"
import { subscribeCronJob } from './utils/crone';
import userRoutes from "./routes/userRoutes"

const port = process.env.PORT || 5000;

import pdfRoutes from './routes/pdfRoutes';
import { socketUse } from './socketIo/index';
import { config } from './config';

const app = express();
const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin:config.socketClientUrl,
    methods: ["GET", "POST"],
    credentials: true 
  },
});


app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST","PATCH","DELETE","PUT"],
  credentials: true 
}));

app.use(bodyParser.json());
app.use("/api/v1/users", userRoutes);
app.use('/api/files',fileRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/stipe', stipeRoute);
app.use('/api/v1/organization', organizationRoute)
app.use('/api/folders', folderRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/favorites', favoritesRoutes)
app.use('/api/tags', tagsRoutes)



app.get('/api/', (req: Request, res: Response) => {
  res.send('default root path');
});


socketUse(io);

server.listen(port, () => {
  subscribeCronJob()
  console.log(`Server is running on port ${port}`);
});

