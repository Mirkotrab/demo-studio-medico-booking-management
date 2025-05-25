import { getMedici, getAppuntamentiMedicoByDate, dbPrenotaVisita, dbLoginPaziente, dbCreatePaziente, getPrenotazioniPaziente } from '../models/mediciModel.js';

export const getAllMedici = async (req, res) => {
    try {
        const medici = await getMedici();
        return res.status(200).json(medici);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

export const getAppuntamentiMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const { data } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'ID medico richiesto' });
        }

        const appuntamenti = await getAppuntamentiMedicoByDate(id, data);
        
        res.json(appuntamenti);
    } catch (error) {
        console.error('Errore nel recupero appuntamenti:', error);
        res.status(500).json({ message: 'Errore nel recupero degli appuntamenti' });
    }
};

export const prenotaVisita = async (req, res) => {
    try {
        const { id_medico, id_paziente, data, ora_inizio, note } = req.body;
        
        if (!id_medico || !id_paziente || !data || !ora_inizio) {
            return res.status(400).json({
                message: 'Parametri mancanti',
                received: { id_medico, id_paziente, data, ora_inizio, note }
            });
        }

        const noteValue = note || null;

        const newAppuntamento = await dbPrenotaVisita(id_medico, id_paziente, data, ora_inizio, noteValue);
        res.status(201).json({
            message: 'Prenotazione effettuata con successo', 
            appuntamento: newAppuntamento 
        });
    } catch (error) {
        console.error('Errore nella prenotazione:', error);
        res.status(500).json({ message: 'Errore interno del server' });
    }
};

export const loginPaziente = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username e password sono obbligatori' });
        }

        console.log('Tentativo login per username:', username);

        const paziente = await dbLoginPaziente(username, password);
        
        console.log('Risultato dal database:', paziente);
        
        if (paziente) {
            if (!paziente.id) {
                console.error('ERRORE: id è undefined nel risultato del database');
                return res.status(500).json({ message: 'Errore nei dati del paziente' });
            }

            req.session.user = {
                id_paziente: paziente.id,
                nome: paziente.nome,
                cognome: paziente.cognome,
                username: paziente.username,
                data_nascita: paziente.data_nascita,
                codice_fiscale: paziente.codice_fiscale,
                provincia: paziente.provincia
            };
            
            console.log('Utente salvato in sessione:', req.session.user);
            
            req.session.save((err) => {
                if (err) {
                    console.error('Errore nel salvare la sessione:', err);
                    return res.status(500).json({ message: 'Errore nel salvare la sessione' });
                }
                
                res.json({ 
                    message: 'Login effettuato con successo', 
                    paziente: req.session.user 
                });
            });
        } else {
            res.status(401).json({ message: 'Credenziali non valide' });
        }
    } catch (error) {
        console.error('Errore nel login:', error);
        res.status(500).json({ message: 'Errore interno del server' });
    }
};

export const createPaziente = async (req, res) => {
    try {
        const { nome, cognome, data_nascita, codice_fiscale, provincia, username, password } = req.body;
        
        if (!nome || !cognome || !data_nascita || !codice_fiscale || !provincia || !username || !password) {
            return res.status(400).json({ 
                message: 'Tutti i campi sono obbligatori',
                received: { nome, cognome, data_nascita, codice_fiscale, provincia, username, password: password ? '***' : undefined }
            });
        }

        const existingUser = await dbLoginPaziente(username, password);
        if (existingUser) {
            return res.status(400).json({ message: 'Username già esistente' });
        }

        const newPaziente = await dbCreatePaziente(nome, cognome, data_nascita, codice_fiscale, provincia, username, password);
        res.status(201).json({ 
            message: 'Paziente creato con successo', 
            paziente: newPaziente 
        });
    } catch (error) {
        console.error('Errore nella creazione del paziente:', error);
        res.status(500).json({ message: 'Errore interno del server' });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id_paziente) {
            return res.status(401).json({ message: 'Utente non autenticato' });
        }

        const prenotazioni = await getPrenotazioniPaziente(req.session.user.id_paziente);
        res.json(prenotazioni);
    } catch (error) {
        console.error('Errore nel recupero delle prenotazioni:', error);
        res.status(500).json({ message: 'Errore interno del server' });
    }
};