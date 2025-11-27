// -------- Clase Message --------
class Message {
    constructor(nombre, email, texto, prioridad) {
        this.nombre = nombre;
        this.email = email;
        this.texto = texto;
        this.prioridad = prioridad;
        this.fecha = new Date().toLocaleString();
        this.leido = false;
    }

    toHTML(id) {
        return `
        <div class="card p-3 mb-3 ticket-card prioridad-${this.prioridad} ${this.leido ? "mensaje-leido" : ""}">
            <h5>${this.nombre} <small class="text-muted">(${this.email})</small></h5>
            <p>${this.texto}</p>
            <p><strong>Fecha:</strong> ${this.fecha}</p>
            <p><strong>Prioridad:</strong> ${this.prioridad.toUpperCase()}</p>

            <button class="btn btn-success btn-sm" onclick="marcarLeido(${id})">
                ${this.leido ? "Marcar no leído" : "Marcar leído"}
            </button>

            <button class="btn btn-danger btn-sm ms-2" onclick="eliminarTicket(${id})">
                Eliminar
            </button>
        </div>`;
    }
}

// -------- Variables --------
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

const lista = document.getElementById("listaTickets");
const contadorUrgentes = document.getElementById("contadorUrgentes");


// -------- Validación --------
function validarFormulario(nombre, email, mensaje) {
    let valido = true;

    document.getElementById("errNombre").innerText = "";
    document.getElementById("errEmail").innerText = "";
    document.getElementById("errMensaje").innerText = "";

    if (nombre.length < 3) {
        document.getElementById("errNombre").innerText = "El nombre debe tener al menos 3 caracteres.";
        valido = false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        document.getElementById("errEmail").innerText = "Correo inválido.";
        valido = false;
    }

    if (mensaje.length < 10) {
        document.getElementById("errMensaje").innerText = "El mensaje debe tener mínimo 10 caracteres.";
        valido = false;
    }

    return valido;
}


// -------- Agregar Ticket --------
document.getElementById("ticketForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();
    let prioridad = document.getElementById("prioridad").value;
    let mensaje = document.getElementById("mensaje").value.trim();

    if (!validarFormulario(nombre, email, mensaje)) return;

    let nuevo = new Message(nombre, email, mensaje, prioridad);
    tickets.unshift(nuevo); // más reciente arriba

    guardar();
    mostrarTickets();
    contarUrgentes();

    this.reset();
});


// -------- Mostrar Tickets --------
function mostrarTickets() {
    lista.innerHTML = "";

    let filtro = document.getElementById("filtroPrioridad").value;
    let buscar = document.getElementById("buscador").value.toLowerCase();

    tickets.forEach((ticket, index) => {

        if (filtro !== "todos" && ticket.prioridad !== filtro) return;

        if (!ticket.texto.toLowerCase().includes(buscar) &&
            !ticket.nombre.toLowerCase().includes(buscar)) return;

        lista.innerHTML += ticket.toHTML(index);
    });
}


// -------- Marcar leído --------
function marcarLeido(id) {
    tickets[id].leido = !tickets[id].leido;
    guardar();
    mostrarTickets();
}


// -------- Eliminar Ticket --------
function eliminarTicket(id) {
    tickets.splice(id, 1);
    guardar();
    mostrarTickets();
    contarUrgentes();
}


// -------- Contar urgentes --------
function contarUrgentes() {
    let urg = 0;

    tickets.forEach(t => {
        switch (t.prioridad) {
            case "alta":
                urg++;
                break;
        }
    });

    contadorUrgentes.textContent = urg;
}


// -------- Guardar --------
function guardar() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
}


// -------- Eventos --------
document.getElementById("filtroPrioridad").addEventListener("change", mostrarTickets);
document.getElementById("buscador").addEventListener("input", mostrarTickets);


// -------- Mostrar al inicio --------
mostrarTickets();
contarUrgentes();
