document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ticketForm");
    const lista = document.getElementById("listaTickets");
    const contadorUrgentes = document.getElementById("contadorUrgentes");
    const filtroPrioridad = document.getElementById("filtroPrioridad");
    const buscador = document.getElementById("buscador");

    let tickets = [];

    // ---- Crear Ticket ----
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let nombre = document.getElementById("nombre").value.trim();
        let email = document.getElementById("email").value.trim();
        let prioridad = document.getElementById("prioridad").value;
        let mensaje = document.getElementById("mensaje").value.trim();

        // Validación
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

        // Crear objeto ticket
        let ticket = {
            id: Date.now(),
            nombre,
            email,
            prioridad,
            mensaje
        };

        tickets.push(ticket);

        actualizarLista();
        form.reset();
    });

    // ---- Renderizar Lista ----
    function actualizarLista() {
        let filtro = filtroPrioridad.value;
        let busqueda = buscador.value.toLowerCase();

        let filtrados = tickets.filter(t => {
            let cumplePrioridad = filtro === "todos" || t.prioridad === filtro;
            let cumpleBusqueda = 
                t.nombre.toLowerCase().includes(busqueda) ||
                t.mensaje.toLowerCase().includes(busqueda);

            return cumplePrioridad && cumpleBusqueda;
        });

        lista.innerHTML = "";

        filtrados.forEach(t => {
            let div = document.createElement("div");
            div.className = "card p-3 mb-3";

            div.innerHTML = `
                <h5>${t.nombre}</h5>
                <p><strong>Correo:</strong> ${t.email}</p>
                <p><strong>Prioridad:</strong> ${t.prioridad}</p>
                <p>${t.mensaje}</p>
            `;

            lista.append(div);
        });

        // Actualizar contador urgentes
        let urgentes = tickets.filter(t => t.prioridad === "alta").length;
        contadorUrgentes.textContent = urgentes;
    }

    // Filtros en vivo
    filtroPrioridad.addEventListener("change", actualizarLista);
    buscador.addEventListener("input", actualizarLista);
});
