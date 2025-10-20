document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const payload = {
      email: document.getElementById('email').value.trim(),
      nombre: document.getElementById('nombre').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      comentario: document.getElementById('comentario').value.trim(),
      enviarCopia: document.getElementById('enviarCopia')?.checked || false
    };

    try {
      const resp = await fetch('contacto.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const result = await resp.json();
      if (!resp.ok || !result.success) throw new Error(result.message || `Error ${resp.status}`);
      alert('Formulario enviado correctamente');
      this.reset();
    } catch (err) {
      console.error(err);
      alert('Error al enviar el formulario.');
    }
  });
});