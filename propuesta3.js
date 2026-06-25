const pestanas = document.querySelectorAll('.boton-pestana');
const secciones = document.querySelectorAll('.seccion');

const botonAgregarCuenta = document.getElementById('boton-agregar-cuenta');
const botonLimpiarCuentas = document.getElementById('boton-limpiar-cuentas');
const botonAgregarLinea = document.getElementById('boton-agregar-linea');
const botonRegistrarAsiento = document.getElementById('boton-registrar-asiento');
const botonLimpiarAsiento = document.getElementById('boton-limpiar-asiento');

const cuentaNombre = document.getElementById('cuenta-nombre');
const cuentaTipo = document.getElementById('cuenta-tipo');
const cuentaNaturaleza = document.getElementById('cuenta-naturaleza');
const mensajeCuenta = document.getElementById('mensaje-cuenta');
const listaCuentas = document.getElementById('lista-cuentas');
const movCuenta = document.getElementById('mov-cuenta');
const movTipo = document.getElementById('mov-tipo');
const movMonto = document.getElementById('mov-monto');
const listaLineas = document.getElementById('lista-lineas');
const totalDebe = document.getElementById('total-debe');
const totalHaber = document.getElementById('total-haber');
const totalDiferencia = document.getElementById('total-diferencia');
const mensajeAsiento = document.getElementById('mensaje-asiento');
const listaDiario = document.getElementById('lista-diario');
const mensajeDiario = document.getElementById('mensaje-diario');
const listaMayor = document.getElementById('lista-mayor');
const resultadoCuentas = document.getElementById('resultado-cuentas');
const resultadoAsientos = document.getElementById('resultado-asientos');
const resultadoDebe = document.getElementById('resultado-debe');
const resultadoHaber = document.getElementById('resultado-haber');
const resultadoEstado = document.getElementById('resultado-estado');
const graficoCanvas = document.getElementById('grafico-mayor');

const entradaFecha = document.getElementById('entrada-fecha');
const entradaDescripcion = document.getElementById('entrada-descripcion');

let cuentas = [];
let asientoLineas = [];
let asientos = [];

function mostrarSeccion(nombre) {
    secciones.forEach(seccion => {
        seccion.classList.toggle('visible', seccion.id === nombre);
    });
}

function activarPestana(boton) {
    pestanas.forEach(tab => tab.classList.toggle('activa', tab === boton));
}

function limpiarMensaje(elemento) {
    elemento.textContent = '';
}

function formatearMoneda(valor) {
    return '$' + valor.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function obtenerSaldoCuenta(cuenta) {
    const saldo = cuenta.debe - cuenta.haber;
    if (cuenta.naturaleza === 'Acreedora') {
        return cuenta.haber - cuenta.debe;
    }
    return saldo;
}

function actualizarOpcionesCuentas() {
    let html = '<option value="">Elige una cuenta</option>';
    cuentas.forEach(cuenta => {
        html += `<option value="${cuenta.nombre}">${cuenta.nombre}</option>`;
    });
    movCuenta.innerHTML = html;
}

function mostrarCuentas() {
    if (cuentas.length === 0) {
        listaCuentas.innerHTML = '<div class="fila"><span colspan="4">No hay cuentas creadas.</span></div>';
        return;
    }
    listaCuentas.innerHTML = '';
    cuentas.forEach((cuenta, index) => {
        const fila = document.createElement('div');
        fila.className = 'fila';
        fila.innerHTML = `
            <span>${cuenta.nombre}</span>
            <span>${cuenta.tipo}</span>
            <span>${cuenta.naturaleza}</span>
            <span><button class="boton boton-secundario" data-index="${index}">Eliminar</button></span>
        `;
        listaCuentas.appendChild(fila);
    });
    listaCuentas.querySelectorAll('button').forEach(boton => {
        boton.addEventListener('click', function () {
            const index = Number(this.dataset.index);
            cuentas.splice(index, 1);
            actualizarCuentas();
            mostrarResultado();
        });
    });
}

function actualizarCuentas() {
    mostrarCuentas();
    actualizarOpcionesCuentas();
    resultadoCuentas.textContent = cuentas.length;
}

function agregarCuenta() {
    const nombre = cuentaNombre.value.trim();
    const tipo = cuentaTipo.value;
    const naturaleza = cuentaNaturaleza.value;
    if (!nombre || !tipo || !naturaleza) {
        mensajeCuenta.textContent = 'Complete todos los campos de la cuenta.';
        return;
    }
    if (cuentas.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
        mensajeCuenta.textContent = 'La cuenta ya existe. Cambie el nombre.';
        return;
    }
    cuentas.push({ nombre, tipo, naturaleza, debe: 0, haber: 0 });
    cuentaNombre.value = '';
    cuentaTipo.value = '';
    cuentaNaturaleza.value = '';
    mensajeCuenta.textContent = 'Cuenta agregada correctamente.';
    actualizarCuentas();
}

function agregarLineaAsiento() {
    const cuenta = movCuenta.value;
    const tipo = movTipo.value;
    const monto = parseFloat(movMonto.value);
    if (!cuenta || !tipo || !Number.isFinite(monto) || monto <= 0) {
        mensajeAsiento.textContent = 'Seleccione cuenta, tipo y monto válido.';
        return;
    }
    asientoLineas.push({ cuenta, tipo, monto });
    movCuenta.value = '';
    movTipo.value = 'Debe';
    movMonto.value = '';
    mensajeAsiento.textContent = 'Línea agregada al asiento.';
    mostrarLineasAsiento();
    actualizarTotalesAsiento();
}

function eliminarLinea(index) {
    asientoLineas.splice(index, 1);
    mostrarLineasAsiento();
    actualizarTotalesAsiento();
}

function mostrarLineasAsiento() {
    if (asientoLineas.length === 0) {
        listaLineas.innerHTML = '<div class="fila-linea"><span colspan="4">No hay líneas en el asiento.</span></div>';
        return;
    }
    listaLineas.innerHTML = '';
    asientoLineas.forEach((linea, index) => {
        const fila = document.createElement('div');
        fila.className = 'fila-linea';
        fila.innerHTML = `
            <span>${linea.cuenta}</span>
            <span>${linea.tipo}</span>
            <span>${formatearMoneda(linea.monto)}</span>
            <button class="boton boton-secundario" data-index="${index}">Quitar</button>
        `;
        listaLineas.appendChild(fila);
    });
    listaLineas.querySelectorAll('button').forEach(boton => {
        boton.addEventListener('click', function () {
            eliminarLinea(Number(this.dataset.index));
        });
    });
}

function actualizarTotalesAsiento() {
    let debe = 0;
    let haber = 0;
    asientoLineas.forEach(linea => {
        if (linea.tipo === 'Debe') {
            debe += linea.monto;
        } else {
            haber += linea.monto;
        }
    });
    const diferencia = Math.abs(debe - haber);
    totalDebe.textContent = formatearMoneda(debe);
    totalHaber.textContent = formatearMoneda(haber);
    totalDiferencia.textContent = formatearMoneda(diferencia);
}

function limpiarAsiento() {
    asientoLineas = [];
    entradaFecha.value = '';
    entradaDescripcion.value = '';
    listaLineas.innerHTML = '<div class="fila-linea"><span colspan="4">No hay líneas en el asiento.</span></div>';
    actualizarTotalesAsiento();
    mensajeAsiento.textContent = 'Asiento limpio. Agregue nuevas líneas.';
}

function asientoCuadra() {
    const debe = parseMoneda(totalDebe.textContent);
    const haber = parseMoneda(totalHaber.textContent);
    return debe > 0 && debe === haber;
}

function registrarAsiento() {
    const fecha = entradaFecha.value;
    const descripcion = entradaDescripcion.value.trim();
    if (!fecha || !descripcion) {
        mensajeAsiento.textContent = 'Ingrese fecha y descripción del asiento.';
        return;
    }
    if (asientoLineas.length === 0) {
        mensajeAsiento.textContent = 'Agregue al menos una línea al asiento.';
        return;
    }
    if (!asientoCuadra()) {
        mensajeAsiento.textContent = 'El asiento no cuadra. Ajuste los montos.';
        return;
    }
    asientos.push({ fecha, descripcion, lineas: [...asientoLineas] });
    asientoLineas.forEach(linea => {
        const cuenta = cuentas.find(c => c.nombre === linea.cuenta);
        if (cuenta) {
            if (linea.tipo === 'Debe') {
                cuenta.debe += linea.monto;
            } else {
                cuenta.haber += linea.monto;
            }
        }
    });
    limpiarAsiento();
    mensajeAsiento.textContent = 'Asiento registrado correctamente.';
    mostrarDiario();
    mostrarMayor();
    mostrarResultado();
}

function mostrarDiario() {
    if (asientos.length === 0) {
        listaDiario.innerHTML = '<p>No hay asientos registrados.</p>';
        mensajeDiario.textContent = '';
        return;
    }
    listaDiario.innerHTML = '';
    asientos.forEach((asiento, index) => {
        const bloque = document.createElement('div');
        bloque.className = 'asiento';
        bloque.innerHTML = `
            <div class="asiento-meta">
                <div><strong>Asiento #${index + 1}</strong></div>
                <div>Fecha: ${asiento.fecha}</div>
                <div>Descripción: ${asiento.descripcion}</div>
            </div>
            <div class="asiento-lineas"></div>
        `;
        const lineasContenedor = bloque.querySelector('.asiento-lineas');
        asiento.lineas.forEach(linea => {
            const fila = document.createElement('div');
            fila.className = 'fila-linea';
            fila.innerHTML = `
                <span>${linea.cuenta}</span>
                <span>${linea.tipo}</span>
                <span>${formatearMoneda(linea.monto)}</span>
                <span></span>
            `;
            lineasContenedor.appendChild(fila);
        });
        listaDiario.appendChild(bloque);
    });
    mensajeDiario.textContent = `Asientos registrados: ${asientos.length}.`;
}

function mostrarMayor() {
    if (cuentas.length === 0) {
        listaMayor.innerHTML = '<div class="fila"><span colspan="5">No hay cuentas para mostrar.</span></div>';
        return;
    }
    listaMayor.innerHTML = '';
    cuentas.forEach(cuenta => {
        const saldo = obtenerSaldoCuenta(cuenta);
        const fila = document.createElement('div');
        fila.className = 'fila';
        fila.innerHTML = `
            <span>${cuenta.nombre}</span>
            <span>${formatearMoneda(cuenta.debe)}</span>
            <span>${formatearMoneda(cuenta.haber)}</span>
            <span>${formatearMoneda(saldo)}</span>
            <span>${cuenta.tipo}</span>
        `;
        listaMayor.appendChild(fila);
    });
}

function mostrarResultado() {
    const totalDebe = cuentas.reduce((sum, cuenta) => sum + cuenta.debe, 0);
    const totalHaber = cuentas.reduce((sum, cuenta) => sum + cuenta.haber, 0);
    resultadoAsientos.textContent = asientos.length;
    resultadoDebe.textContent = formatearMoneda(totalDebe);
    resultadoHaber.textContent = formatearMoneda(totalHaber);
    resultadoEstado.textContent = totalDebe === totalHaber ? 'El libro cuadra' : 'El libro no cuadra';
    dibujarGrafico();
}

function dibujarGrafico() {
    const ctx = graficoCanvas.getContext('2d');
    if (!ctx) {
        return;
    }
    const ancho = graficoCanvas.width;
    const alto = graficoCanvas.height;
    ctx.clearRect(0, 0, ancho, alto);

    if (cuentas.length === 0) {
        ctx.fillStyle = '#566573';
        ctx.font = '16px system-ui';
        ctx.fillText('No hay datos para graficar.', 20, 40);
        return;
    }

    const valores = cuentas.map(c => Math.max(0, obtenerSaldoCuenta(c)));
    const nombres = cuentas.map(c => c.nombre);
    const maxValor = Math.max(...valores, 1);
    const margen = 40;
    const espacio = (ancho - margen * 2) / Math.max(valores.length, 1);
    const barraAncho = Math.min(40, espacio * 0.7);

    valores.forEach((valor, index) => {
        const x = margen + index * espacio + (espacio - barraAncho) / 2;
        const altura = (valor / maxValor) * (alto - margen * 2);
        const y = alto - margen - altura;
        ctx.fillStyle = '#1f618d';
        ctx.fillRect(x, y, barraAncho, altura);
        ctx.fillStyle = '#222f3e';
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(nombres[index], x + barraAncho / 2, alto - margen + 16);
        ctx.fillText(formatearMoneda(valor), x + barraAncho / 2, y - 8);
    });
}

function parseMoneda(texto) {
    return Number(texto.replace(/[$.,]/g, '')) / 100;
}

botonAgregarCuenta.addEventListener('click', function () {
    agregarCuenta();
});

botonLimpiarCuentas.addEventListener('click', function () {
    cuentaNombre.value = '';
    cuentaTipo.value = '';
    cuentaNaturaleza.value = '';
    limpiarMensaje(mensajeCuenta);
});

botonAgregarLinea.addEventListener('click', function (event) {
    event.preventDefault();
    agregarLineaAsiento();
});

botonRegistrarAsiento.addEventListener('click', function () {
    registrarAsiento();
});

botonLimpiarAsiento.addEventListener('click', function () {
    limpiarAsiento();
});

pestanas.forEach(boton => {
    boton.addEventListener('click', function () {
        activarPestana(this);
        mostrarSeccion(this.dataset.seccion);
        if (this.dataset.seccion === 'movimientos') {
            actualizarOpcionesCuentas();
            mostrarLineasAsiento();
        }
        if (this.dataset.seccion === 'diario') {
            mostrarDiario();
        }
        if (this.dataset.seccion === 'mayor') {
            mostrarMayor();
        }
        if (this.dataset.seccion === 'resultados') {
            mostrarResultado();
        }
    });
});

actualizarCuentas();
limpiarAsiento();
mostrarDiario();
mostrarMayor();
mostrarResultado();
