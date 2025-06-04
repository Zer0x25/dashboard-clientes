let clients = JSON.parse(localStorage.getItem("clients")) || [];
let editIndex = null;

document.getElementById("clientForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const cliente = {
    nombre: document.getElementById("nombre").value,
    rut: document.getElementById("rut").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
    cdeNombre: document.getElementById("cdeNombre").value,
    cdeNumero: document.getElementById("cdeNumero").value,
    membresia: document.getElementById("membresia").value,
    fechaInicio: document.getElementById("fechaInicio").value,
  };

  if (editIndex !== null) {
    clients[editIndex] = cliente;
    editIndex = null;
  } else {
    clients.push(cliente);
  }

  localStorage.setItem("clients", JSON.stringify(clients));
  this.reset();
  renderList();
});

function renderList() {
  const tbody = document.getElementById("clientList");
  tbody.innerHTML = "";

  clients.forEach((cliente, index) => {
    const estadoInfo = calcularEstado(cliente.fechaInicio, cliente.membresia);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cliente.nombre}</td>
      <td>${cliente.rut}</td>
      <td>${cliente.membresia} días</td>
      <td class="${estadoInfo.clase}">${estadoInfo.estado}</td>
      <td>
        <button class="btn btn-info btn-sm" onclick="verDetalle(${index})">Detalle</button>
        <button class="btn btn-warning btn-sm" onclick="editarCliente(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${index})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function limpiarFormulario() {
  document.getElementById("clientForm").reset();
  editIndex = null;
  document.getElementById("clientForm").scrollIntoView({ behavior: "smooth" });
}

function editarCliente(index) {
  const cliente = clients[index];
  document.getElementById("nombre").value = cliente.nombre;
  document.getElementById("rut").value = cliente.rut;
  document.getElementById("telefono").value = cliente.telefono ?? "";
  document.getElementById("email").value = cliente.email ?? "";
  document.getElementById("cdeNombre").value = cliente.cdeNombre ?? "";
  document.getElementById("cdeNumero").value = cliente.cdeNumero ?? "";
  document.getElementById("membresia").value = cliente.membresia;
  document.getElementById("fechaInicio").value = cliente.fechaInicio;
  editIndex = index;
  document.getElementById("clientForm").scrollIntoView({ behavior: "smooth" });
}

function eliminarCliente(index) {
  if (confirm("¿Estás seguro de eliminar este cliente?")) {
    clients.splice(index, 1);
    localStorage.setItem("clients", JSON.stringify(clients));
    renderList();
  }
}

function calcularEstado(fechaInicio, duracionDias) {
  const inicio = new Date(fechaInicio);
  const hoy = new Date();
  const fin = new Date(inicio);
  fin.setDate(inicio.getDate() + parseInt(duracionDias));

  const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { estado: "Vencido", clase: "estado-vencido" };
  if (diff <= 7) return { estado: "Por vencer", clase: "estado-vencer" };
  return { estado: "Activo", clase: "estado-activo" };
}

function verDetalle(index) {
  const c = clients[index];
  const contenido = `
    <p><strong>Nombre:</strong> ${c.nombre}</p>
    <p><strong>RUT:</strong> ${c.rut}</p>
    <p><strong>Teléfono:</strong> ${c.telefono}</p>
    <p><strong>Email:</strong> ${c.email}</p>
    <p><strong>Nombre CdE:</strong> ${c.cdeNombre}</p>
    <p><strong>Número CdE:</strong> ${c.cdeNumero}</p>
    <p><strong>Membresía:</strong> ${c.membresia} días</p>
    <p><strong>Fecha de Inicio:</strong> ${c.fechaInicio}</p>
  `;
  document.getElementById("detalleContenido").innerHTML = contenido;
  new bootstrap.Modal(document.getElementById("modalDetalle")).show();
}

function filtrarClientes() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const filas = document.querySelectorAll("#clientList tr");
  filas.forEach((fila) => {
    const celdas = fila.querySelectorAll("td");
    const contenido = `${celdas[0].textContent} ${celdas[1].textContent}`.toLowerCase();
    fila.style.display = contenido.includes(texto) ? "" : "none";
  });
}

renderList();
