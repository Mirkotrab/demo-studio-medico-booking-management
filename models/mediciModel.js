import pool from "../config/db.js";

export const getAppuntamentiMedicoByDate = async (id_medico, data = null) => {
    try {
        let query = "SELECT id, id_paziente, id_medico, DATE_FORMAT(data, '%Y-%m-%d') as data_formatted, TIME_FORMAT(ora_inizio, '%H:%i') as ora_inizio_formatted, effettuata, saldo, note FROM visita WHERE id_medico = ?";
        const params = [id_medico];

        if (data) {
            // Confronta con la data formattata
            query += ` AND DATE_FORMAT(data, '%Y-%m-%d') = ?`;
            params.push(data);
        }

        query += ' ORDER BY data, ora_inizio';

        const [appuntamenti] = await pool.execute(query, params);
        
        /* Formattazione per mantenere consistenza tra front-end e back-end e per risolvere problemi di timezone*/ 
        const appuntamentiFormatted = appuntamenti.map(app => ({ 
            id: app.id,
            id_paziente: app.id_paziente,
            id_medico: app.id_medico,
            data: app.data_formatted,           // "2025-05-30"
            ora_inizio: app.ora_inizio_formatted, // "09:00"
            effettuata: app.effettuata,
            saldo: app.saldo,
            note: app.note
        }));

        return appuntamentiFormatted;
    } catch (error) {
        console.error('Errore nel recupero appuntamenti dal database:', error);
        throw error;
    }
};

export const getMedici = async() => {
    const query = "SELECT m.id AS id_medico, m.nome AS nome_medico, m.cognome AS cognome_medico, s.nome AS specialita, s.prezzo FROM medico m INNER JOIN specialita s ON m.id_specialita = s.id ORDER BY s.nome ASC, m.cognome ASC;";
    try {
        const [results] = await pool.query(query);
        return results;
    } catch (err) {
        console.error(err);
    }
}

export const dbPrenotaVisita = async (id_medico, id_paziente, data, ora_inizio, note) => {
    try {
        const query = "INSERT INTO visita ( id_medico, id_paziente, data, ora_inizio, effettuata, saldo, note ) VALUES (?, ?, ?, ?, 'no', 'no', ?);";
        
        const [result] = await pool.execute(query, [id_medico, id_paziente, data, ora_inizio, note]);
        
        const [newAppuntamento] = await pool.execute(
            'SELECT * FROM visita WHERE id = ?',
            [result.insertId]
        );
        
        return newAppuntamento[0];
    } catch (error) {
        console.error('Errore nel database durante la prenotazione:', error);
        throw error;
    }
};

export const dbLoginPaziente = async (username, password) => {
    try {
        const query = "SELECT id, nome, cognome, username, data_nascita, codice_fiscale, provincia FROM paziente WHERE username = ? AND password = ?";
        
        const [rows] = await pool.execute(query, [username, password]);
        
        if (rows.length > 0) {
            console.log('Paziente trovato nel database:', rows[0]);
            return rows[0];
        }
        
        return null;
    } catch (error) {
        console.error('Errore nel login del paziente:', error);
        throw error;
    }
};

export const dbCreatePaziente = async (nome, cognome, data_nascita, codice_fiscale, provincia, username, password) => {
    const sql = "INSERT INTO paziente (nome, cognome, data_nascita, codice_fiscale, provincia, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
    try {
        const [result] = await pool.execute(sql, [nome, cognome, data_nascita, codice_fiscale, provincia, username, password]);
        return { id: result.insertId, nome, cognome, data_nascita, codice_fiscale, provincia, username };
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getPrenotazioniPaziente = async (id_paziente) => {
    try {
        const query = "SELECT v.id, v.data, TIME_FORMAT(v.ora_inizio, '%H:%i') as ora_inizio, v.effettuata, v.saldo, v.note, m.nome as nome_medico, m.cognome as cognome_medico, s.nome as specialita, s.prezzo FROM visita v INNER JOIN medico m ON v.id_medico = m.id INNER JOIN specialita s ON m.id_specialita = s.id WHERE v.id_paziente = ? ORDER BY v.data DESC, v.ora_inizio DESC";
        
        const [prenotazioni] = await pool.execute(query, [id_paziente]);
        
        // Formatta le date per il frontend
        const prenotazioniFormatted = prenotazioni.map(prenotazione => ({
            ...prenotazione,
            data: new Date(prenotazione.data).toLocaleDateString('it-IT'),
            status: prenotazione.effettuata === 'si' ? 'completata' : 'programmata',
            pagamento: prenotazione.saldo === 'si' ? 'pagato' : 'non_pagato'
        }));
        
        return prenotazioniFormatted;
    } catch (error) {
        console.error('Errore nel recupero prenotazioni paziente:', error);
        throw error;
    }
};