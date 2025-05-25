import { Router } from 'express';
import {
    getAllMedici,
    getAppuntamentiMedico,
    prenotaVisita,
    loginPaziente,
    createPaziente,
    getMyBookings
} from "../controllers/mediciController.js";

const router = Router();

router.get("/", getAllMedici);
router.get("/:id/appuntamenti", getAppuntamentiMedico);
router.get("/prenotazioni", getMyBookings);
router.post("/prenota", prenotaVisita);
router.post("/login", loginPaziente);
router.post("/create", createPaziente);
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Errore durante il logout' });
        }
        res.json({ message: 'Logout effettuato con successo' });
    });
});

export default router;