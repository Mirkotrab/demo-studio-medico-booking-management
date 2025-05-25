import express from 'express';
import session from 'express-session';
import pool from './config/db.js';
import mediciRoutes from './routes/mediciRoutes.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/css', express.static('views/css'));
app.use('/js', express.static('views/js'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'studio-medico-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 24 * 60 * 60 * 1000, // 24 ore
        httpOnly: true 
    }
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/api/v1/medici", mediciRoutes);

app.get('/', async (req, res) => {
    try {
        console.log('Sessione utente:', req.session.user);
        
        const response = await fetch(`http://localhost:${PORT}/api/v1/medici`);
        const medici = await response.json();
        res.render('medici', { 
            medici,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Errore nel recupero dei medici:', error);
        res.status(500).send('Errore del server');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});