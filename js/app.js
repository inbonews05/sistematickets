document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ticketForm");
    const lista = document.getElementById("listaTickets");
    const contadorUrgentes = document.getElementById("contadorUrgentes");
    const filtroPrioridad = document.getElementById("filtroPrioridad");
    const buscador = document.getElementById("buscador");

    let tickets = [];

    // ==============================
    //   Cargar tickets del storage
    // ==============================
    if (localStorage.getItem("tickets")) {
        tickets = JSON.parse(localStorage.getItem("tickets"));
        actualizarLista();
    }

    // ==============================
    //     Crear Ticket
    // ==============================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let nombre = document.getElementById("nombre").value.trim();
        let email = document.getElementById("email").value.trim();
        let prioridad = document.getElementById("prioridad").value;
        let mensaje = document.getElementById("mensaje").value.trim();

        let valido = true;

        if (nombre === "") {
            valido = false;
            document.getElementById("errNombre").textContent = "El nombre es obligatorio";
            document.getElementById("nombre").classList.add("is-invalid");
        } else {
            document.getElementById("nombre").classList.remove("is-invalid");
        }

        if (email === "") {
            valido = false;
            document.getElementById("errEmail").textContent = "El correo es obligatorio";
            document.getElementById("email").classList.add("is-invalid");
        } else {
            document.getElementById("email").classList.remove("is-invalid");
        }

        if (mensaje === "") {
            valido = false;
            document.getElementById("errMensaje").textContent = "El mensaje es obligatorio";
            document.getElementById("mensaje").classList.add("is-invalid");
        } else {
            document.getElementById("mensaje").classList.remove("is-invalid");
        }

        if (!valido) return;

        let ticket = {
            id: Date.now(),
            nombre,
            email,
            prioridad,
            mensaje
        };

        tickets.push(ticket);

        // Guardar en storage
        localStorage.setItem("tickets", JSON.stringify(tickets));

        actualizarLista();
        form.reset();
    });

    // ==============================
    //   Actualizar Lista (Render)
    // ==============================
    function actualizarLista() {
        let filtro = filtroPrioridad.value;
        let busqueda = buscador.value.toLowerCase();

        let filtrados = tickets.filter(t => {
            let cumplePrioridad = filtro === "todos" || t.prioridad === filtro;
            let cumpleBusqueda =
                t.nombre.toLowerCase().includes(busqueda) ||
                t.email.toLowerCase().includes(busqueda) ||
                t.mensaje.toLowerCase().includes(busqueda);

            return cumplePrioridad && cumpleBusqueda;
        });

        lista.innerHTML = "";

        filtrados.forEach(t => {
            let div = document.createElement("div");
            div.className = "card p-3 mb-3 shadow-sm";

            div.innerHTML = `
                <h5>${t.nombre}</h5>
                <p><strong>Correo:</strong> ${t.email}</p>
                <p><strong>Prioridad:</strong> <span class="badge bg-${
                    t.prioridad === "alta" ? "danger" : t.prioridad === "normal" ? "warning" : "secondary"
                }">${t.prioridad}</span></p>
                <p>${t.mensaje}</p>

                <button class="btn btn-danger btn-sm eliminar" data-id="${t.id}">
                    Eliminar
                </button>
            `;

            lista.append(div);
        });

        // Contador urgentes
        let urgentes = tickets.filter(t => t.prioridad === "alta").length;
        contadorUrgentes.textContent = urgentes;

        // Activar botones de eliminar
        document.querySelectorAll(".eliminar").forEach(btn => {
            btn.addEventListener("click", eliminarTicket);
        });
    }

    // ==============================
    //   Eliminar ticket
    // ==============================
    function eliminarTicket(e) {
        let id = Number(e.target.dataset.id);

        tickets = tickets.filter(t => t.id !== id);

        // Guardar cambios
        localStorage.setItem("tickets", JSON.stringify(tickets));

        actualizarLista();
    }

    // ==============================
    //   Filtros en vivo
    // ==============================
    filtroPrioridad.addEventListener("change", actualizarLista);
    buscador.addEventListener("input", actualizarLista);
});

