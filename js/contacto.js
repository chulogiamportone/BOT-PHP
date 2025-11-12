
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch('/api/send_mail.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('¡Mensaje enviado correctamente!');
        this.reset();
      } else {
        alert('Hubo un error, inténtalo de nuevo.');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Hubo un error, inténtalo de nuevo.');
    });
});

