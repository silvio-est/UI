document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pedidoForm');
    const categoriaSelect = document.getElementById('categoria');
    const idMesa = document.getElementById('idMesa');
    const platosContainer = document.getElementById('platos');

    let platosSeleccionados = {};

    // Definir los platos para cada categoría
    const platosPorCategoria = {
        liquidos: ["Agua", "Refresco", "Jugo de Naranja"],
        entrantes: ["Empanadas", "Tostones", "Ceviche"],
        ensaladas: ["Cesar", "Caprese", "Waldorf"],
        carnes: ["Filete de Res", "Pollo a la Parrilla", "Churrasco"]
    };

    // Función para actualizar los platos mostrados según la categoría seleccionada
    function actualizarPlatos() {
        const categoriaSeleccionada = categoriaSelect.value;
        const platos = platosPorCategoria[categoriaSeleccionada];

        // Limpiar los platos anteriores
        platosContainer.innerHTML = '';

        // Mostrar los nuevos platos
        if (platos) {
            platos.forEach(plato => {
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item');
                menuItem.innerHTML = `
                    <label for="${plato.toLowerCase()}">${plato}</label>
                    <div>
                        <button type="button" class="add-btn" data-item="${plato.toLowerCase()}">+</button>
                        <input type="number" name="${plato.toLowerCase()}" id="${plato.toLowerCase()}" value="0" min="0">
                    </div>
                `;
                platosContainer.appendChild(menuItem);
            });
        }
    }

    // Actualizar los platos cuando se cambie la categoría
    categoriaSelect.addEventListener('change', actualizarPlatos);

    // Inicializar los platos al cargar la página
    actualizarPlatos();

    // Manejar el evento de enviar el formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obtener la lista de platos seleccionados
        const platos = Object.keys(platosSeleccionados).filter(plato => platosSeleccionados[plato] > 0);
        // Mostrar cuadro de diálogo de confirmación
        const confirmacion = confirm(`¿Estás seguro de enviar el pedido con los siguientes platos?\n${platos.join('\n')}`);

        // Si el usuario confirma, puedes agregar aquí el código para enviar el pedido al backend
        if (confirmacion) {
            // Aquí puedes enviar datosFormulario al backend

            // Asignar los datos del formulario al objeto JSON
            datosFormulario = {
                "idPedido": 2,
                idMesa: parseInt(idMesa.value),
                categoriaPlato: categoriaSelect.value,
                listaPlatosPedidos: platos
            };
            console.log('Datos del formulario enviados:', datosFormulario);

            fetch('http://localhost:8080/restaurante/guardarPedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosFormulario)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Respuesta del backend:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        }
    });

    // Manejar el evento de agregar platos
    platosContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('add-btn')) {
            const itemName = event.target.getAttribute('data-item');
            const inputField = document.querySelector(`input[name='${itemName}']`);
            inputField.value = parseInt(inputField.value) + 1;

            // Guardar la cantidad de platos seleccionados
            platosSeleccionados[itemName] = parseInt(inputField.value);
        }
    });
});
