let selectedDoctor = null;
let selectedBookingDoctor = null;
let currentMedicoId = null;
let selectedDate = null;
let selectedTime = null;

function showMessage(elementId, message, type = 'error') {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.classList.add('show');

    if (type === 'success') {
        setTimeout(() => {
            hideMessage(elementId);
        }, 8000);
    }
}

function hideMessage(elementId) {
    const messageElement = document.getElementById(elementId);
    messageElement.classList.remove('show');
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'message';
    }, 500);
}

function showLoginModal() {
    document.getElementById('authModal').style.display = 'block';
}

function bookAppointment(name, surname, specialty, medicoId) {
    selectedDoctor = { name, surname, specialty, medicoId };
    
    const button = event?.target || document.activeElement;
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    showLoginModal();
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    selectedDoctor = null;
    hideMessage('loginMessage');
    hideMessage('registerMessage');
}

function switchToRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    hideMessage('loginMessage');
}

function switchToLogin() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    hideMessage('registerMessage');
}

async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/api/v1/medici/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('loginMessage', 'Login effettuato con successo! Reindirizzamento in corso...', 'success');
            
            setTimeout(() => {
                closeAuthModal();
                window.location.reload();
            }, 2500);
        } else {
            showMessage('loginMessage', result.message || 'Credenziali non valide', 'error');
        }
    } catch (error) {
        console.error('Errore:', error);
        showMessage('loginMessage', 'Errore di connessione. Riprova più tardi.', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const registerData = {
        nome: formData.get('nome'),
        cognome: formData.get('cognome'),
        data_nascita: formData.get('data_nascita'),
        codice_fiscale: formData.get('codice_fiscale'),
        provincia: formData.get('provincia'),
        username: formData.get('username'),
        password: formData.get('password')
    };

    for (const [key, value] of Object.entries(registerData)) {
        if (!value || value.trim() === '') {
            showMessage('registerMessage', `Il campo ${key.replace('_', ' ')} è obbligatorio`, 'error');
            return;
        }
    }

    // Aggiungi gestione del pulsante
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Registrazione in corso...';

    try {
        const response = await fetch('/api/v1/medici/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('registerMessage', 'Registrazione completata con successo! Ora puoi effettuare il login.', 'success');
            
            setTimeout(() => {
                switchToLogin();
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }, 3000);
        } else {
            showMessage('registerMessage', result.message || 'Errore durante la registrazione', 'error');
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    } catch (error) {
        console.error('Errore:', error);
        showMessage('registerMessage', 'Errore di connessione. Riprova più tardi.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

async function logout() {
    try {
        const response = await fetch('/api/v1/medici/logout', {
            method: 'POST'
        });

        if (response.ok) {
            window.location.reload();
        }
    } catch (error) {
        console.error('Errore durante il logout:', error);
        window.location.reload();
    }
}

async function getAppuntamentiMedico(medicoId, dataSelezionata) {
    try {
        const response = await fetch(`/api/v1/medici/${medicoId}/appuntamenti?data=${dataSelezionata}`);
        if (response.ok) {
            const appuntamenti = await response.json();
            return appuntamenti;
        } else {
            console.error('Errore nel recupero appuntamenti:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Errore nella chiamata API:', error);
        return [];
    }
}

async function calcolaOrariDisponibili(medicoId, dataSelezionata) {
    const orariLavoro = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    const appuntamentiGiorno = await getAppuntamentiMedico(medicoId, dataSelezionata);
    const orariOccupati = appuntamentiGiorno.map(app => app.ora_inizio);
    const orariDisponibili = orariLavoro.filter(orario => !orariOccupati.includes(orario));
    
    return orariDisponibili;
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createDateCard(date, index) {
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    
    const dateCard = document.createElement('div');
    dateCard.className = 'date-card';
    dateCard.dataset.date = date.toISOString().split('T')[0];
    
    const dayNameDiv = document.createElement('div');
    dayNameDiv.className = 'day-name';
    dayNameDiv.textContent = dayNames[date.getDay()];
    
    const dayNumberDiv = document.createElement('div');
    dayNumberDiv.className = 'day-number';
    dayNumberDiv.textContent = date.getDate();
    
    const monthYearDiv = document.createElement('div');
    monthYearDiv.className = 'month-year';
    monthYearDiv.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    dateCard.appendChild(dayNameDiv);
    dateCard.appendChild(dayNumberDiv);
    dateCard.appendChild(monthYearDiv);
    
    dateCard.addEventListener('click', () => selectDate(dateCard));
    
    return dateCard;
}

function generateDateCards() {
    const dateGrid = document.getElementById('dateGrid');
    clearElement(dateGrid);
    
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateCard = createDateCard(date, i);
        dateGrid.appendChild(dateCard);
    }
}

function selectDate(dateCard) {
    document.querySelectorAll('.date-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    dateCard.classList.add('selected');
    selectedDate = dateCard.dataset.date;
    document.getElementById('selectedDate').value = selectedDate;
    
    selectedTime = null;
    document.getElementById('selectedTime').value = '';
    
    generateTimeSlots();
    updateSummary();
}

function createNoDataMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'no-date-message';
    messageDiv.textContent = message;
    return messageDiv;
}

function createTimeSlot(orario) {
    const timeSlot = document.createElement('div');
    timeSlot.className = 'time-slot';
    timeSlot.textContent = orario;
    timeSlot.dataset.time = orario;
    timeSlot.addEventListener('click', () => selectTime(timeSlot));
    return timeSlot;
}

async function generateTimeSlots() {
    const timeGrid = document.getElementById('timeGrid');
    clearElement(timeGrid);
    
    timeGrid.appendChild(createNoDataMessage('Caricamento orari...'));
    
    if (!selectedDate || !currentMedicoId) {
        clearElement(timeGrid);
        timeGrid.appendChild(createNoDataMessage('Seleziona prima una data'));
        return;
    }
    
    try {
        const orariDisponibili = await calcolaOrariDisponibili(currentMedicoId, selectedDate);
        clearElement(timeGrid);
        
        if (orariDisponibili.length === 0) {
            timeGrid.appendChild(createNoDataMessage('Nessun orario disponibile per questo giorno'));
            return;
        }
        
        orariDisponibili.forEach(orario => {
            const timeSlot = createTimeSlot(orario);
            timeGrid.appendChild(timeSlot);
        });
        
    } catch (error) {
        console.error('Errore nel caricamento orari:', error);
        clearElement(timeGrid);
        timeGrid.appendChild(createNoDataMessage('Errore nel caricamento degli orari'));
    }
}

function selectTime(timeSlot) {
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    timeSlot.classList.add('selected');
    selectedTime = timeSlot.dataset.time;
    document.getElementById('selectedTime').value = selectedTime;
    
    updateSummary();
}

function showBookingModal(name, surname, specialty, medicoId, price) {
    currentMedicoId = medicoId;
    selectedBookingDoctor = { name, surname, specialty, medicoId, price };
    selectedDate = null;
    selectedTime = null;
    
    document.getElementById('doctorName').textContent = `Dr. ${name} ${surname}`;
    document.getElementById('doctorSpecialty').textContent = specialty;
    document.getElementById('doctorPrice').textContent = `€${price}`;
    
    if (window.userData) {
        document.getElementById('patientName').textContent = `${window.userData.nome} ${window.userData.cognome}`;
    }
    
    document.getElementById('summaryDoctor').textContent = `Dr. ${name} ${surname}`;
    document.getElementById('summarySpecialty').textContent = specialty;
    document.getElementById('summaryPrice').textContent = `€${price}`;
    
    generateDateCards();
    
    const timeGrid = document.getElementById('timeGrid');
    clearElement(timeGrid);
    timeGrid.appendChild(createNoDataMessage('Seleziona prima una data'));
    
    document.querySelector('#bookingModal form').reset();
    document.getElementById('summaryDateTime').textContent = 'Seleziona data e orario';
    
    document.getElementById('bookingModal').style.display = 'block';
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    selectedBookingDoctor = null;
    currentMedicoId = null;
    selectedDate = null;
    selectedTime = null;
    hideMessage('bookingMessage');
    
    document.querySelector('#bookingModal form').reset();
    document.getElementById('summaryDateTime').textContent = 'Seleziona data e orario';
}

function updateSummary() {
    if (selectedDate && selectedTime) {
        const formattedDate = new Date(selectedDate).toLocaleDateString('it-IT');
        document.getElementById('summaryDateTime').textContent = `${formattedDate} alle ${selectedTime}`;
    } else {
        document.getElementById('summaryDateTime').textContent = 'Seleziona data e orario';
    }
}

async function handleBooking(event) {
    event.preventDefault();
    
    if (!window.userData || !window.userData.id_paziente) {
        showMessage('bookingMessage', 'Errore: dati utente non validi. Rieffettua il login.', 'error');
        return;
    }
    
    if (!selectedDate || !selectedTime) {
        showMessage('bookingMessage', 'Seleziona data e orario prima di procedere!', 'error');
        return;
    }
    
    const formData = new FormData(event.target);
    const bookingData = {
        id_medico: selectedBookingDoctor.medicoId,
        id_paziente: window.userData.id_paziente,
        data: selectedDate,
        ora_inizio: selectedTime,
        note: formData.get('note') || null
    };

    try {
        const orariDisponibili = await calcolaOrariDisponibili(selectedBookingDoctor.medicoId, selectedDate);
        if (!orariDisponibili.includes(selectedTime)) {
            showMessage('bookingMessage', 'L\'orario selezionato non è più disponibile. Seleziona un altro orario.', 'error');
            generateTimeSlots();
            return;
        }
    } catch (error) {
        showMessage('bookingMessage', 'Errore nella verifica disponibilità. Riprova.', 'error');
        return;
    }

    showMessage('bookingMessage', 'Prenotazione in corso...', 'loading');
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Prenotando...';

    try {
        const response = await fetch('/api/v1/medici/prenota', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('bookingMessage', 'Prenotazione confermata con successo!', 'success');
            
            setTimeout(() => {
                closeBookingModal();
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }, 2500);
        } else {
            showMessage('bookingMessage', result.message || 'Errore durante la prenotazione', 'error');
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    } catch (error) {
        console.error('Errore:', error);
        showMessage('bookingMessage', 'Errore di connessione. Riprova più tardi.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

async function showBookingsModal() {
    if (!window.userData || !window.userData.id_paziente) {
        showMessage('bookingsMessage', 'Errore: devi essere loggato per visualizzare le prenotazioni.', 'error');
        return;
    }
    
    document.getElementById('bookingsModal').style.display = 'block';
    loadMyBookings();
}

function closeBookingsModal() {
    document.getElementById('bookingsModal').style.display = 'none';
    hideMessage('bookingsMessage');
}

async function loadMyBookings() {
    const bookingsList = document.getElementById('bookingsList');
    clearElement(bookingsList);
    bookingsList.appendChild(createNoDataMessage('Caricamento prenotazioni...'));
    
    try {
        const response = await fetch('/api/v1/medici/prenotazioni');
        
        if (response.ok) {
            const prenotazioni = await response.json();
            displayBookings(prenotazioni);
        } else {
            const error = await response.json();
            showMessage('bookingsMessage', error.message || 'Errore nel caricamento delle prenotazioni', 'error');
            clearElement(bookingsList);
            bookingsList.appendChild(createNoBookingsElement('Errore', '⚠️', 'Impossibile caricare le prenotazioni'));
        }
    } catch (error) {
        console.error('Errore nel caricamento prenotazioni:', error);
        showMessage('bookingsMessage', 'Errore di connessione. Riprova più tardi.', 'error');
        clearElement(bookingsList);
        bookingsList.appendChild(createNoBookingsElement('Errore di connessione', '⚠️', 'Verifica la tua connessione e riprova'));
    }
}

function createNoBookingsElement(title, icon, description) {
    const noBookingsDiv = document.createElement('div');
    noBookingsDiv.className = 'no-bookings';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'no-bookings-icon';
    iconDiv.textContent = icon;
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    
    const descElement = document.createElement('p');
    descElement.textContent = description;
    
    noBookingsDiv.appendChild(iconDiv);
    noBookingsDiv.appendChild(titleElement);
    noBookingsDiv.appendChild(descElement);
    
    return noBookingsDiv;
}

function createBookingCard(prenotazione) {
    const bookingCard = document.createElement('div');
    bookingCard.className = 'booking-card';
    
    const header = document.createElement('div');
    header.className = 'booking-card-header';
    
    const doctorInfo = document.createElement('div');
    doctorInfo.className = 'doctor-info-card';
    
    const doctorName = document.createElement('h4');
    doctorName.textContent = `Dr. ${prenotazione.nome_medico} ${prenotazione.cognome_medico}`;
    
    const specialty = document.createElement('div');
    specialty.className = 'specialty-info';
    specialty.textContent = prenotazione.specialita;
    
    doctorInfo.appendChild(doctorName);
    doctorInfo.appendChild(specialty);
    
    const statusBadges = document.createElement('div');
    statusBadges.className = 'status-badges';
    
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${prenotazione.status}`;
    statusBadge.textContent = prenotazione.status === 'completata' ? 'Completata' : 'Programmata';
    
    const paymentBadge = document.createElement('span');
    paymentBadge.className = `status-badge ${prenotazione.pagamento}`;
    paymentBadge.textContent = prenotazione.pagamento === 'pagato' ? 'Pagato' : 'Da Pagare';
    
    statusBadges.appendChild(statusBadge);
    statusBadges.appendChild(paymentBadge);
    
    header.appendChild(doctorInfo);
    header.appendChild(statusBadges);
    
    const details = document.createElement('div');
    details.className = 'booking-details';
    
    const detailsData = [
        { label: 'Data', value: prenotazione.data },
        { label: 'Orario', value: prenotazione.ora_inizio },
        { label: 'Costo', value: `€${prenotazione.prezzo}` },
        { label: 'ID Prenotazione', value: `#${prenotazione.id}` }
    ];
    
    detailsData.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        
        const label = document.createElement('span');
        label.className = 'detail-label';
        label.textContent = detail.label;
        
        const value = document.createElement('span');
        value.className = 'detail-value';
        value.textContent = detail.value;
        
        detailItem.appendChild(label);
        detailItem.appendChild(value);
        details.appendChild(detailItem);
    });
    
    bookingCard.appendChild(header);
    bookingCard.appendChild(details);
    
    if (prenotazione.note) {
        const notesDiv = document.createElement('div');
        notesDiv.className = 'booking-notes';
        
        const notesLabel = document.createElement('span');
        notesLabel.className = 'detail-label';
        notesLabel.textContent = 'Note: ';
        
        const notesValue = document.createElement('span');
        notesValue.className = 'detail-value';
        notesValue.textContent = prenotazione.note;
        
        notesDiv.appendChild(notesLabel);
        notesDiv.appendChild(notesValue);
        bookingCard.appendChild(notesDiv);
    }
    
    return bookingCard;
}

function displayBookings(prenotazioni) {
    const bookingsList = document.getElementById('bookingsList');
    clearElement(bookingsList);
    
    if (prenotazioni.length === 0) {
        bookingsList.appendChild(createNoBookingsElement(
            'Nessuna prenotazione trovata', 
            '📅', 
            'Non hai ancora effettuato nessuna prenotazione. Prenota la tua prima visita!'
        ));
        return;
    }
    
    prenotazioni.forEach(prenotazione => {
        const bookingCard = createBookingCard(prenotazione);
        bookingsList.appendChild(bookingCard);
    });
}

function handleModalClick(event) {
    const authModal = document.getElementById('authModal');
    const bookingModal = document.getElementById('bookingModal');
    const bookingsModal = document.getElementById('bookingsModal');
    
    if (event.target === authModal) {
        closeAuthModal();
    } else if (event.target === bookingModal) {
        closeBookingModal();
    } else if (event.target === bookingsModal) {
        closeBookingsModal();
    }
}

function preventModalClose(event) {
    event.stopPropagation();
}

window.onclick = handleModalClick;

document.getElementById('authModal')?.addEventListener('click', preventModalClose);
document.getElementById('bookingModal')?.addEventListener('click', preventModalClose);
document.getElementById('bookingsModal')?.addEventListener('click', preventModalClose);