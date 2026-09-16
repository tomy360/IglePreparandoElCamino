// ============================================
//  RENDERIZADO DE EVENTOS / NOTICIAS
//  Lee window.eventos (JS/eventos.js) y genera
//  las tarjetas .EventoIndividual.
// ============================================

function formatearFecha(iso) {
    if (!iso) return "";
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
                   "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const partes = iso.split("-");
    if (partes.length !== 3) return iso;
    return `${parseInt(partes[2])} de ${meses[parseInt(partes[1]) - 1]} de ${partes[0]}`;
}

function crearTarjetaEvento(evento) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "EventoIndividual";

    const img = document.createElement("img");
    img.src = evento.imagen;
    img.alt = evento.titulo;
    img.loading = "lazy";
    img.style.cursor = "zoom-in";
    img.title = "Click para ampliar";
    img.addEventListener("click", function() {
        abrirLightbox(evento.imagen);
    });
    tarjeta.appendChild(img);

    const info = document.createElement("div");
    info.className = "EventoInfo";

    if (evento.fecha) {
        const fecha = document.createElement("span");
        fecha.className = "EventoFecha";
        fecha.textContent = formatearFecha(evento.fecha);
        info.appendChild(fecha);
    }

    const h3 = document.createElement("h3");
    h3.textContent = evento.titulo;
    info.appendChild(h3);

    if (evento.detalles && evento.detalles.length) {
        const ul = document.createElement("ul");
        evento.detalles.forEach(det => {
            const li = document.createElement("li");
            li.textContent = det;
            ul.appendChild(li);
        });
        info.appendChild(ul);
    }

    if (evento.nota) {
        const nota = document.createElement("p");
        nota.className = "EventoNota";
        nota.textContent = evento.nota;
        info.appendChild(nota);
    }

    tarjeta.appendChild(info);
    return tarjeta;
}

function ordenarPorFecha(eventos) {
    return [...eventos].sort((a, b) =>
        (b.fecha || "").localeCompare(a.fecha || "")
    );
}

// Muestra los N eventos más recientes
function renderEventosIndex(id, cantidad) {
    const contenedor = document.getElementById(id);
    if (!contenedor) return;

    const ordenados = ordenarPorFecha(window.eventos || []);
    ordenados.slice(0, cantidad).forEach(ev => contenedor.appendChild(crearTarjetaEvento(ev)));
}

// Muestra todos los eventos
function renderEventosTodos(id) {
    const contenedor = document.getElementById(id);
    if (!contenedor) return;

    ordenarPorFecha(window.eventos || []).forEach(ev => contenedor.appendChild(crearTarjetaEvento(ev)));
}

document.addEventListener("DOMContentLoaded", () => {
    renderEventosIndex("EventosEspecialesCont", 3);
    renderEventosTodos("NoticiasCont");
});

// ============================================
//  LIGHTBOX (zoom de imagen de noticias)
// ============================================

let lightboxEl = null;

function crearLightbox() {
    lightboxEl = document.createElement("div");
    lightboxEl.className = "lightbox";
    document.body.appendChild(lightboxEl);
    lightboxEl.addEventListener("click", cerrarLightbox);
}

function abrirLightbox(src) {
    if (!lightboxEl) crearLightbox();
    lightboxEl.innerHTML = "";
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Imagen ampliada";
    lightboxEl.appendChild(img);
    lightboxEl.classList.add("activo");
    document.body.style.overflow = "hidden";
}

function cerrarLightbox() {
    if (!lightboxEl || !lightboxEl.classList.contains("activo")) return;
    lightboxEl.classList.add("cerrando");
    setTimeout(() => {
        lightboxEl.classList.remove("activo", "cerrando");
        document.body.style.overflow = "";
    }, 250);
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") cerrarLightbox();
});
