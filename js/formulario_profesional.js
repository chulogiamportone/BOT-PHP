(function () {
  const form = document.getElementById('profForm');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    fetch('/api/profesional_save.php', {
      method: 'POST',
      body: fd
    })
      .then(res => res.json())
      .then(data => {
        msg.style.display = 'block';
        if (data.success) {
          msg.className = 'msg success';
          msg.textContent = '✓ ' + (data.message || 'Profesional guardado correctamente');
          form.reset();
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