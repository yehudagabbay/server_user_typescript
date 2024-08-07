import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './user/user.routes';
import { engine } from 'express-handlebars';
import path from 'path';

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
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Configurer les vues
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views/'));

// Routes utilisateur
app.use('/api/users', userRouter);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`[SERVER] Server is live at http://localhost:${PORT}`);
});
