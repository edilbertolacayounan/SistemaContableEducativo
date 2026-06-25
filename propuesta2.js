const pestanas = document.querySelectorAll('.boton-pestana');
const secciones = document.querySelectorAll('.seccion');
const botonActualizarCuentas = document.getElementById('boton-actualizar-cuentas');
const botonLimpiarCuentas = document.getElementById('boton-limpiar-cuentas');
const botonCalcularMovimientos = document.getElementById('boton-calcular-movimientos');
const botonLimpiarMovimientos = document.getElementById('boton-limpiar-movimientos');
const botonActualizarResultados = document.getElementById('boton-actualizar-resultados');

const cuenta1Nombre = document.getElementById('cuenta-1-nombre');
const cuenta1Tipo = document.getElementById('cuenta-1-tipo');
const cuenta1Naturaleza = document.getElementById('cuenta-1-naturaleza');
const cuenta2Nombre = document.getElementById('cuenta-2-nombre');
const cuenta2Tipo = document.getElementById('cuenta-2-tipo');
const cuenta2Naturaleza = document.getElementById('cuenta-2-naturaleza');
const cuenta3Nombre = document.getElementById('cuenta-3-nombre');
const cuenta3Tipo = document.getElementById('cuenta-3-tipo');
const cuenta3Naturaleza = document.getElementById('cuenta-3-naturaleza');

const filaCuenta1 = document.getElementById('fila-cuenta-1');
const filaCuenta2 = document.getElementById('fila-cuenta-2');
const filaCuenta3 = document.getElementById('fila-cuenta-3');

const movCuenta1 = document.getElementById('mov-cuenta-1');
const movTipo1 = document.getElementById('mov-tipo-1');
const movMonto1 = document.getElementById('mov-monto-1');
const movCuenta2 = document.getElementById('mov-cuenta-2');
const movTipo2 = document.getElementById('mov-tipo-2');
const movMonto2 = document.getElementById('mov-monto-2');
const movCuenta3 = document.getElementById('mov-cuenta-3');
const movTipo3 = document.getElementById('mov-tipo-3');
const movMonto3 = document.getElementById('mov-monto-3');

const totalDebe = document.getElementById('total-debe');
const totalHaber = document.getElementById('total-haber');
const totalDiferencia = document.getElementById('total-diferencia');
const mensajeMovimiento = document.getElementById('mensaje-movimiento');

const finalDebe = document.getElementById('final-debe');
const finalHaber = document.getElementById('final-haber');
const finalDiferencia = document.getElementById('final-diferencia');
const finalEstado = document.getElementById('final-estado');

function mostrarSeccion(nombre) {
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].classList.remove('visible');
        if (secciones[i].id === nombre) {
            secciones[i].classList.add('visible');
        }
    }
}

function activarPestana(boton) {
    for (let i = 0; i < pestanas.length; i++) {
        pestanas[i].classList.remove('activa');
    }
    boton.classList.add('activa');
}

function leerCuenta(nombre, tipo, naturaleza) {
    const valorNombre = nombre.value.trim();
    const valorTipo = tipo.value;
    const valorNaturaleza = naturaleza.value;
    return { valorNombre, valorTipo, valorNaturaleza };
}

function actualizarCatalogo() {
    const cuentaA = leerCuenta(cuenta1Nombre, cuenta1Tipo, cuenta1Naturaleza);
    const cuentaB = leerCuenta(cuenta2Nombre, cuenta2Tipo, cuenta2Naturaleza);
    const cuentaC = leerCuenta(cuenta3Nombre, cuenta3Tipo, cuenta3Naturaleza);

    actualizarFila(filaCuenta1, cuentaA);
    actualizarFila(filaCuenta2, cuentaB);
    actualizarFila(filaCuenta3, cuentaC);
    actualizarOpcionesMovimientos(cuentaA.valorNombre, cuentaB.valorNombre, cuentaC.valorNombre);
}

function actualizarFila(fila, cuenta) {
    const columnas = fila.querySelectorAll('span');
    columnas[0].textContent = cuenta.valorNombre;
    columnas[1].textContent = cuenta.valorTipo;
    columnas[2].textContent = cuenta.valorNaturaleza;
}

function actualizarOpcionesMovimientos(nombreA, nombreB, nombreC) {
    const opciones = crearOpciones(nombreA, nombreB, nombreC);
    movCuenta1.innerHTML = opciones;
    movCuenta2.innerHTML = opciones;
    movCuenta3.innerHTML = opciones;
}

function crearOpciones(a, b, c) {
    let html = '<option value="">Elige una cuenta</option>';
    if (a) { html += '<option value="' + a + '">' + a + '</option>'; }
    if (b) { html += '<option value="' + b + '">' + b + '</option>'; }
    if (c) { html += '<option value="' + c + '">' + c + '</option>'; }
    return html;
}

function limpiarCuentas() {
    cuenta1Nombre.value = '';
    cuenta1Tipo.value = '';
    cuenta1Naturaleza.value = '';
    cuenta2Nombre.value = '';
    cuenta2Tipo.value = '';
    cuenta2Naturaleza.value = '';
    cuenta3Nombre.value = '';
    cuenta3Tipo.value = '';
    cuenta3Naturaleza.value = '';
    actualizarCatalogo();
}

function leerNumero(input) {
    const valor = parseFloat(input.value);
    return Number.isFinite(valor) ? valor : 0;
}

function calcularMovimientos() {
    let debe = 0;
    let haber = 0;
    const monto1 = leerNumero(movMonto1);
    const monto2 = leerNumero(movMonto2);
    const monto3 = leerNumero(movMonto3);

    if (movTipo1.value === 'debe') { debe += monto1; } else { haber += monto1; }
    if (movTipo2.value === 'debe') { debe += monto2; } else { haber += monto2; }
    if (movTipo3.value === 'debe') { debe += monto3; } else { haber += monto3; }

    const diff = Math.abs(debe - haber);
    totalDebe.textContent = formatearMoneda(debe);
    totalHaber.textContent = formatearMoneda(haber);
    totalDiferencia.textContent = formatearMoneda(diff);

    if (debe === 0 && haber === 0) {
        mensajeMovimiento.textContent = 'Ingrese montos para calcular la partida doble.';
    } else if (debe === haber) {
        mensajeMovimiento.textContent = 'El asiento cuadra. Debe y Haber son iguales.';
    } else if (debe > haber) {
        mensajeMovimiento.textContent = 'El Debe es mayor que el Haber. Ajuste los montos.';
    } else {
        mensajeMovimiento.textContent = 'El Haber es mayor que el Debe. Ajuste los montos.';
    }
}

function limpiarMovimientos() {
    movCuenta1.value = '';
    movTipo1.value = 'debe';
    movMonto1.value = '';
    movCuenta2.value = '';
    movTipo2.value = 'debe';
    movMonto2.value = '';
    movCuenta3.value = '';
    movTipo3.value = 'debe';
    movMonto3.value = '';
    totalDebe.textContent = '$0.00';
    totalHaber.textContent = '$0.00';
    totalDiferencia.textContent = '$0.00';
    mensajeMovimiento.textContent = 'Líneas de movimiento reiniciadas.';
}

function actualizarResultados() {
    const debe = parseMoneda(totalDebe.textContent);
    const haber = parseMoneda(totalHaber.textContent);
    const diff = Math.abs(debe - haber);
    finalDebe.textContent = formatearMoneda(debe);
    finalHaber.textContent = formatearMoneda(haber);
    finalDiferencia.textContent = formatearMoneda(diff);
    if (debe === 0 && haber === 0) {
        finalEstado.textContent = 'Sin datos.';
    } else if (debe === haber) {
        finalEstado.textContent = 'La contabilidad cuadra.';
    } else {
        finalEstado.textContent = 'No cuadra. Revisa los montos.';
    }
}

function parseMoneda(texto) {
    return Number(texto.replace(/[\$,.]/g, '')) / 100;
}

function formatearMoneda(valor) {
    return '$' + valor.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

for (let i = 0; i < pestanas.length; i++) {
    pestanas[i].addEventListener('click', function () {
        activarPestana(this);
        mostrarSeccion(this.dataset.seccion);
    });
}

botonActualizarCuentas.addEventListener('click', function () {
    actualizarCatalogo();
    mensajeMovimiento.textContent = 'Catálogo actualizado. Ahora puedes usar las cuentas en movimientos.';
});

botonLimpiarCuentas.addEventListener('click', function () {
    limpiarCuentas();
});

botonCalcularMovimientos.addEventListener('click', function () {
    calcularMovimientos();
});

botonLimpiarMovimientos.addEventListener('click', function () {
    limpiarMovimientos();
});

botonActualizarResultados.addEventListener('click', function () {
    actualizarResultados();
});

actualizarCatalogo();
