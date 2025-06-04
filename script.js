let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let editIndex = -1;

document.getElementById("formularioCliente").addEventListener("submit", function (e) {
  e.preventDefault();

  const fileInput = document.getElementById("fotoCliente");
  if (fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      guardarCliente(e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    guardarCliente("");
  }
});

function guardarCliente(fotoBase64) {
  const cliente = {
    nombre: document.getElementById("nombre").value,
    rut: document.getElementById("rut").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
    nombreCde: document.getElementById("nombreCde").value,
    numeroCde: document.getElementById("numeroCde").value,
    tipoMembresia: document.getElementById("tipoMembresia").value,
    fechaInicio: document.getElementById("fechaInicio").value,
    foto: fotoBase64
  };

  if (editIndex === -1) {
    clientes.push(cliente);
  } else {
    cliente.foto = fotoBase64 || clientes[editIndex].foto;
    clientes[editIndex] = cliente;
    editIndex = -1;
  }

  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
  limpiarFormulario();
}

function mostrarClientes() {
  const tbody = document.getElementById("tablaClientes");
  tbody.innerHTML = "";

  const filtro = document.getElementById("busqueda").value.toLowerCase();

  clientes.forEach((cliente, i) => {
    const termino = calcularFechaTermino(cliente.fechaInicio, cliente.tipoMembresia);
    const estado = calcularEstado(termino);

    if (
      cliente.nombre.toLowerCase().includes(filtro) ||
      cliente.rut.toLowerCase().includes(filtro)
    ) {
      tbody.innerHTML += `
        <tr class="${colorEstado(estado)}">
          <td>${cliente.nombre}</td>
          <td>${cliente.rut}</td>
          <td>${cliente.tipoMembresia} días</td>
          <td>${estado}</td>
          <td>
            <button class="btn btn-info btn-sm" onclick="verDetalle(${i})">Detalle</button>
            <button class="btn btn-warning btn-sm" onclick="editarCliente(${i})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${i})">Eliminar</button>
          </td>
        </tr>`;
    }
  });
}

function calcularFechaTermino(inicio, dias) {
  const fecha = new Date(inicio);
  fecha.setDate(fecha.getDate() + parseInt(dias));
  return fecha;
}

function calcularEstado(termino) {
  const hoy = new Date();
  const diferencia = (termino - hoy) / (1000 * 60 * 60 * 24);
  if (diferencia < 0) return "Vencido";
  if (diferencia <= 7) return "Por vencer";
  return "Activo";
}

function colorEstado(estado) {
  switch (estado) {
    case "Activo": return "table-success";
    case "Por vencer": return "table-warning";
    case "Vencido": return "table-danger";
    default: return "";
  }
}

function limpiarFormulario() {
  document.getElementById("formularioCliente").reset();
  document.getElementById("previewFoto").style.display = "none";
  editIndex = -1;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById("limpiarBtn").addEventListener("click", limpiarFormulario);

function editarCliente(i) {
  const c = clientes[i];
  document.getElementById("nombre").value = c.nombre;
  document.getElementById("rut").value = c.rut;
  document.getElementById("telefono").value = c.telefono;
  document.getElementById("email").value = c.email;
  document.getElementById("nombreCde").value = c.nombreCde;
  document.getElementById("numeroCde").value = c.numeroCde;
  document.getElementById("tipoMembresia").value = c.tipoMembresia;
  document.getElementById("fechaInicio").value = c.fechaInicio;

  if (c.foto) {
    const preview = document.getElementById("previewFoto");
    preview.src = c.foto;
    preview.style.display = "block";
  }

  editIndex = i;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function eliminarCliente(i) {
  if (confirm("¿Estás seguro de eliminar este cliente?")) {
    clientes.splice(i, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));
    mostrarClientes();
  }
}

function verDetalle(i) {
  const c = clientes[i];
  const detalle = `
    <p><strong>Nombre:</strong> ${c.nombre}</p>
    <p><strong>RUT:</strong> ${c.rut}</p>
    <p><strong>Teléfono:</strong> ${c.telefono}</p>
    <p><strong>Email:</strong> ${c.email}</p>
    <p><strong>Nombre CdE:</strong> ${c.nombreCde}</p>
    <p><strong>Número CdE:</strong> ${c.numeroCde}</p>
    <p><strong>Membresía:</strong> ${c.tipoMembresia} días</p>
    <p><strong>Fecha inicio:</strong> ${c.fechaInicio}</p>
    <img src="${c.foto}" style="max-width:150px;" alt="Foto cliente">
  `;
  document.getElementById("detalleCliente").innerHTML = detalle;
  const modal = new bootstrap.Modal(document.getElementById("modalDetalle"));
  modal.show();
}

document.getElementById("fotoCliente").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("previewFoto");
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("busqueda").addEventListener("input", mostrarClientes);

mostrarClientes();
