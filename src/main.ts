import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './user/user.routes';

// Charger les variables d'environnement
dotenv.config();

// Définir le port
const PORT = process.env.PORT ?? 5555;

// Créer l'application Express
const app: Express = express();
app.use(express.json());

// Configurer Helmet pour la sécurité
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      frameAncestors: ["'none'"],
    },
  })
);

// Configurer CORS
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000', // Permet uniquement cette origine
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permet ces méthodes HTTP
  allowedHeaders: ['Content-Type', 'Authorization'], // Permet ces en-têtes
  credentials: true, // Permet l'envoi des cookies et des informations d'authentification
};

app.use(cors(corsOptions));

// Routes utilisateur
app.use('/api/users', userRouter);

// Gestion des erreurs CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5555');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`[SERVER] Server is live at http://localhost:${PORT}`);
});
