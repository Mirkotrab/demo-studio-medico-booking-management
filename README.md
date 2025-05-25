# Studio Medico - Sistema di Gestione Prenotazioni

Un'applicazione web per la gestione delle prenotazioni mediche sviluppata con Node.js, Express e MySQL.
Questa applicazione è stata sviluppata come implementazione della traccia scolastica per la simulazione della seconda prova dell'Esame di Stato in Informatica e Telecomunicazioni, dimostrando competenze avanzate nello sviluppo full-stack di sistemi informativi per il settore sanitario.

## 📋 Caratteristiche

- **Autenticazione utente**: Sistema di login e registrazione per i pazienti
- **Prenotazione visite**: Interfaccia intuitiva per prenotare visite mediche
- **Gestione disponibilità**: Visualizzazione orari disponibili per ogni medico
- **Storico prenotazioni**: Visualizzazione delle prenotazioni passate e future
- **Design responsive**: Interfaccia moderna con glassmorphism e animazioni

## 🛠️ Tecnologie Utilizzate

- **Backend**: Node.js, Express.js
- **Database**: MySQL/MariaDB
- **Frontend**: EJS, CSS3, JavaScript
- **Dipendenze**: express-session, mysql2, dotenv

## 📁 Struttura del Progetto

```
studio-medico/
├── config/
│   └── db.js                 # Configurazione database
├── controllers/
│   └── mediciController.js   # Logica di business
├── middlewares/             # Middleware personalizzati
├── models/
│   └── mediciModel.js       # Modelli e query database
├── routes/
│   └── mediciRoutes.js      # Definizione delle rotte API
├── views/
│   ├── medici.ejs          # Template principale
│   ├── css/
│   │   └── style.css       # Stili dell'applicazione
│   └── js/
│       └── medici.js       # Logica frontend
├── app.js                  # File principale dell'applicazione
├── medcare.sql            # Schema e dati del database
└── .env                   # Variabili d'ambiente
```

## ⚙️ Installazione

1. **Clona il repository**
   ```bash
   git clone <repository-url>
   cd studio-medico
   ```

2. **Installa le dipendenze**
   ```bash
   npm i
   ```

3. **Configura il database**
   - Importa il file `medcare.sql` nel tuo server MySQL
   - Configura le credenziali nel file `.env`

4. **Configura le variabili d'ambiente**
   ```env
   PORT=3000
   DB_URI=mysql://username:password@localhost:3306/medcare
   SESSION_SECRET=your-secret-key
   ```

5. **Avvia l'applicazione**
   ```bash
   npm start
   # oppure per development
   npm run dev
   ```

## 📊 Schema Database

Il database include le seguenti tabelle principali:

- **`paziente`**: Informazioni dei pazienti
- **`medico`**: Dati dei medici
- **`specialita`**: Specialità mediche e prezzi
- **`visita`**: Prenotazioni e visite
- **`problematica`**: Problematiche mediche
- **`storico_problematica`**: Storico delle problematiche per paziente

## 🔌 API Endpoints

### Medici
- `GET /api/v1/medici` - Lista tutti i medici con specialità
- `GET /api/v1/medici/:id/appuntamenti` - Appuntamenti di un medico per data

### Autenticazione
- `POST /api/v1/medici/login` - Login paziente
- `POST /api/v1/medici/create` - Registrazione nuovo paziente
- `POST /api/v1/medici/logout` - Logout

### Prenotazioni
- `POST /api/v1/medici/prenota` - Nuova prenotazione
- `GET /api/v1/medici/prenotazioni` - Le mie prenotazioni

## 🎨 Caratteristiche UI/UX

- **Design glassmorphism** con effetti di blur e trasparenza
- **Animazioni fluide** per migliorare l'esperienza utente
- **Elementi floating** per un design moderno
- **Sistema di notifiche** per feedback utente
- **Layout responsive** per dispositivi mobili

## 🔐 Sicurezza

- Gestione sessioni sicure con `express-session`
- Validazione input lato server
- Protezione contro SQL injection tramite prepared statements
- Cookie sicuri con configurazione `httpOnly`

## 👥 Funzionalità Utente

### Per i Pazienti:
- Registrazione e login
- Visualizzazione medici e specialità
- Prenotazione visite con selezione data/ora
- Visualizzazione storico prenotazioni
- Aggiunta note per le visite

### Sistema di Prenotazione:
- Controllo disponibilità in tempo reale
- Prevenzione double booking
- Interfaccia calendar-style per selezione date
- Griglia orari con disponibilità visuale

## 🚀 Scripts Disponibili

```bash
npm start      # Avvia il server in modalità produzione
npm run dev    # Avvia il server in modalità sviluppo con nodemon
```

## 📝 Note Tecniche

- Il progetto utilizza **ES6 modules** (`"type": "module"` in `package.json`)
- La gestione delle date è ottimizzata per evitare problemi di timezone
- Il sistema di sessioni mantiene l'autenticazione per 24 ore
- Le query SQL sono ottimizzate con JOIN per performance migliori

## 👨‍💻 Autore

**Mirko Marini 5C IIS Beretta Gardone VT 2025** - Studio Medico Management System

---

*Applicazione sviluppata per la gestione efficiente delle prenotazioni mediche con un'interfaccia moderna e