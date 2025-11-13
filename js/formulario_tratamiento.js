(function () {
  const form = document.getElementById('tratamientoForm');
  const msg = document.getElementById('msg');

  // Agregar párrafos dinámicos
  document.getElementById('btnAddTexto').addEventListener('click', () => {
    const container = document.getElementById('textoContainer');
    const count = container.querySelectorAll('.texto-item').length + 1;
    const ta = document.createElement('textarea');
    ta.name = 'texto[]';
    ta.className = 'texto-item';
    ta.placeholder = `Párrafo ${count}`;
    container.appendChild(ta);
  });

  // Agregar subsecciones dinámicas
  document.getElementById('btnAddSub').addEventListener('click', () => {
    const container = document.getElementById('subseccionesContainer');
    const item = document.createElement('div');
    item.className = 'subseccion-item';
    item.innerHTML = `
      <input type="text" name="subsecciones[titulo][]" placeholder="Título de subsección">
      <textarea name="subsecciones[contenido][]" placeholder="Contenido de subsección"></textarea>
      <button type="button" class="btn btn-danger btn-remove">Eliminar</button>
    `;
    container.appendChild(item);

    item.querySelector('.btn-remove').addEventListener('click', () => {
      item.remove();
    });
  });

  // Envío con FormData
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    fetch('/api/tratamiento_save.php', {
      method: 'POST',
      body: fd
    })
      .then(res => res.json())
      .then(data => {
        msg.style.display = 'block';
        if (data.success) {
          msg.className = 'msg success';
          msg.textContent = '✓ ' + (data.message || 'Tratamiento guardado correctamente');
          form.reset();
          // reset dinámicos
          document.getElementById('textoContainer').innerHTML =
            '<textarea name="texto[]" class="texto-item" placeholder="Párrafo 1"></textarea>';
          document.getElementById('subseccionesContainer').innerHTML = '';
        } else {
          msg.className = 'msg error';
          msg.textContent = '✗ ' + (data.error || 'Error al guardar');
        }
      })
      .catch(err => {
        console.error(err);
        msg.style.display = 'block';
        msg.className = 'msg error';
        msg.textContent = '✗ Error de conexión';
      });
  });
})();