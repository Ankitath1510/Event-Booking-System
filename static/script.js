document.addEventListener('DOMContentLoaded', loadData);

function loadData() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            populateUsers(data.users);
            populateEvents(data.events);
            populateDropdowns(data.users, data.events);
        });
}

// USERS CRUD
function populateUsers(users) {
    const usersDiv = document.getElementById('users');
    usersDiv.innerHTML = '';
    users.forEach(user => {
        usersDiv.innerHTML += `
            <div>
                <input type="text" id="userName-${user.id}" value="${user.name}">
                <button onclick="updateUser(${user.id})">Save</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;
    });
}

function addUser() {
    const name = document.getElementById('newUserName').value;
    if (!name) return alert("Enter a name");

    fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
    .then(() => {
        document.getElementById('newUserName').value = '';
        loadData();
    });
}

function updateUser(userId) {
    const name = document.getElementById(`userName-${userId}`).value;
    fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
    .then(() => loadData());
}

function deleteUser(userId) {
    fetch(`/api/users/${userId}`, { method: 'DELETE' })
    .then(() => loadData());
}

// EVENTS CRUD
function populateEvents(events) {
    const eventsDiv = document.getElementById('events');
    const eventSelect = document.getElementById('eventSelect');
    eventsDiv.innerHTML = '';
    eventSelect.innerHTML = '';

    events.forEach(event => {
        const availableSeats = event.totalSeats - event.bookedSeats;
        let badgeClass = 'green';
        let badgeText = 'Available';

        if (availableSeats === 0) { badgeClass = 'red'; badgeText = 'Sold Out'; }
        else if (availableSeats <= 5) { badgeClass = 'orange'; badgeText = 'Few Left'; }

        eventsDiv.innerHTML += `
            <div>
                <input type="text" id="eventName-${event.id}" value="${event.name}">
                <input type="datetime-local" id="eventDateTime-${event.id}" value="${formatDateTimeLocal(event.dateTime)}">
                <input type="number" id="eventSeats-${event.id}" value="${event.totalSeats}">
                <button onclick="updateEvent(${event.id})">Save</button>
                <button onclick="deleteEvent(${event.id})">Delete</button>
                <span class="badge ${badgeClass}">${badgeText}</span>
                <span class="seats-left">Seats Left: <span>${availableSeats}</span></span>
            </div>
        `;

        if (availableSeats > 0) {
            eventSelect.innerHTML += `<option value="${event.id}">${event.name}</option>`;
        }
    });
}

function addEvent() {
    const name = document.getElementById('newEventName').value;
    const dateTime = document.getElementById('newEventDateTime').value;
    const totalSeats = parseInt(document.getElementById('newEventSeats').value);

    if (!name || !dateTime || !totalSeats) return alert("Fill all fields");

    fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dateTime, totalSeats })
    })
    .then(() => {
        document.getElementById('newEventName').value = '';
        document.getElementById('newEventDateTime').value = '';
        document.getElementById('newEventSeats').value = '';
        loadData();
    });
}

function updateEvent(eventId) {
    const name = document.getElementById(`eventName-${eventId}`).value;
    const dateTime = document.getElementById(`eventDateTime-${eventId}`).value;
    const totalSeats = parseInt(document.getElementById(`eventSeats-${eventId}`).value);

    fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dateTime, totalSeats })
    })
    .then(() => loadData());
}

function deleteEvent(eventId) {
    fetch(`/api/events/${eventId}`, { method: 'DELETE' })
    .then(() => loadData());
}

// BOOKING
function populateDropdowns(users, events) {
    const userSelect = document.getElementById('userSelect');
    const eventSelect = document.getElementById('eventSelect');

    userSelect.innerHTML = '';
    users.forEach(user => {
        userSelect.innerHTML += `<option value="${user.id}">${user.name}</option>`;
    });

    eventSelect.innerHTML = '';
    events.forEach(event => {
        const availableSeats = event.totalSeats - event.bookedSeats;
        if (availableSeats > 0) {
            eventSelect.innerHTML += `<option value="${event.id}">${event.name}</option>`;
        }
    });
}

function bookEvent() {
    const userId = parseInt(document.getElementById('userSelect').value);
    const eventId = parseInt(document.getElementById('eventSelect').value);

    fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, eventId })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = data.message;
        loadData();
    });
}

function formatDateTimeLocal(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toISOString().slice(0,16);
}
