import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.APP_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

const agreementDraftSchema = z.object({ title:z.string().min(1), type:z.enum(['EMPLOYMENT','INTERNSHIP','MANAGER','NDA','CUSTOM']), employeeId:z.string().uuid(), representativeId:z.string().uuid(), terms:z.string().min(1), effectiveDate:z.string().date(), expiresAt:z.string().date().optional(), metadata:z.record(z.string()).optional() });
app.get('/health', (_req,res) => res.json({ service:'thephi-api', status:'ok' }));
app.use('/api/v1', (_req,res,next) => { res.setHeader('X-API-Version','1'); next(); });
app.post('/api/v1/agreements', (req,res) => { const parsed=agreementDraftSchema.safeParse(req.body); if(!parsed.success) return res.status(400).json({error:{code:'VALIDATION_ERROR',message:'Invalid agreement payload',details:parsed.error.flatten()}}); return res.status(501).json({error:{code:'NOT_CONFIGURED',message:'Supabase persistence is required before creating agreements'}}); });
app.use((_err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => res.status(500).json({error:{code:'INTERNAL_ERROR',message:'An unexpected error occurred'}}));

const port = Number(process.env.PORT ?? 4000);
if (process.env.NODE_ENV !== 'test') app.listen(port, () => console.log(`ThePhi API listening on ${port}`));
export { app };
