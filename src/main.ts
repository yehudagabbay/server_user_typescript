import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './user/user.routes';
import { engine } from 'express-handlebars';
import path from 'path';

// Charger les variables d'environnement
dotenv.config();

// Définir le port
const PORT = process.env.PORT || 3000; // Ajout d'un port par défaut si process.env.PORT n'est pas défini

// Créer l'application Express
const app: Express = express();
app.use(express.json());

// Configurer Helmet pour la sécurité
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
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
  origin: 'http://localhost:5173', // Permet uniquement cette origine
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permet ces méthodes HTTP
  allowedHeaders: ['Content-Type', 'Authorization'], // Permet ces en-têtes
  credentials: true, // Permet l'envoi des cookies et des informations d'authentification
};

app.use(cors(corsOptions));

// Configurer les vues
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views/'));

// Routes utilisateur
app.use('/api/users', userRouter);

// Gestion des erreurs CORS (si nécessaire, mais déjà couvert par `cors`)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`[SERVER] Server is live at http://localhost:${PORT}`);
});
