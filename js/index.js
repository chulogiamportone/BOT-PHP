
window.addEventListener("DOMContentLoaded", () => {
    const footer = document.querySelector("footer");
    document.body.appendChild(footer);
});


// cards.js

async function fetchCardsData(jsonUrl) {
  const res = await fetch(jsonUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`No se pudo cargar el JSON: ${res.status}`);
  return await res.json();
}

function createCard(data) {
  const mainContainer = document.createElement('div');
  mainContainer.className = 'MegadosisVitaminaC';
  mainContainer.setAttribute('data-layer', data.title.toLowerCase());
  Object.assign(mainContainer.style, {
    width: '370px',
    height: '170px',
    left: `${data.position?.left ?? 0}px`,
    top: `${data.position?.top ?? 0}px`,
    position: 'absolute',
    overflow: 'hidden'
  });

  // Cuadro info
  const infoBox = document.createElement('div');
  infoBox.className = 'CuadroInfo';
  infoBox.setAttribute('data-layer', 'cuadro info');
  Object.assign(infoBox.style, {
    width: '185px',
    height: '170px',
    left: '185px',
    top: '0px',
    position: 'absolute',
    background: '#E8E5F3',
    overflow: 'hidden'
  });

  const frame = document.createElement('div');
  frame.className = 'Frame41';
  frame.setAttribute('data-layer', 'Frame 41');
  Object.assign(frame.style, {
    width: '186px',
    height: '170px',
    left: '0px',
    top: '0px',
    position: 'absolute',
    overflow: 'hidden'
  });

  const title = document.createElement('div');
  title.className = 'MegadosisVitaminaC';
  title.setAttribute('data-layer', data.title);
  title.textContent = data.title;
  Object.assign(title.style, {
    width: '144px',
    height: '16px',
    left: '21px',
    top: '23px',
    position: 'absolute',
    color: 'black',
    fontSize: '12px',
    fontFamily: 'Montserrat',
    fontWeight: '700',
    wordWrap: 'break-word'
  });

  const description = document.createElement('div');
  // Permite line breaks con <br> si vienen en el JSON
  description.innerHTML = data.description;
  Object.assign(description.style, {
    width: '141.69px',
    height: '88.56px',
    left: '21px',
    top: '42px',
    position: 'absolute',
    color: 'black',
    fontSize: '10px',
    fontFamily: 'Montserrat',
    fontWeight: '400',
    wordWrap: 'break-word'
  });

  frame.appendChild(title);
  frame.appendChild(description);
  infoBox.appendChild(frame);

  // Botón
  const button = document.createElement('div');
  button.className = 'BotonMasInformacion';
  button.setAttribute('data-layer', 'boton mas informacion');
  Object.assign(button.style, {
    width: '185px',
    height: '34px',
    left: '185px',
    top: '136px',
    position: 'absolute',
    background: '#BAB7C2',
    overflow: 'hidden',
    cursor: 'pointer'
  });

  const buttonText = document.createElement('div');
  buttonText.className = 'Textomasinfo';
  Object.assign(buttonText.style, {
    width: '185px',
    height: '34px',
    left: '0px',
    top: '0px',
    position: 'absolute',
    overflow: 'hidden'
  });

  const textLabel = document.createElement('div');
  textLabel.textContent = 'MÁS INFORMACIÓN';
  Object.assign(textLabel.style, {
    width: '128.22px',
    height: '19px',
    left: '21px',
    top: '7px',
    position: 'absolute',
    textAlign: 'right',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    fontSize: '12px',
    fontFamily: 'Montserrat',
    fontWeight: '700',
    wordWrap: 'break-word'
  });

  const svgWrapper = document.createElement('div');
  svgWrapper.setAttribute('data-svg-wrapper', '');
  Object.assign(svgWrapper.style, {
    left: '156.22px',
    top: '10.14px',
    position: 'absolute'
  });
  svgWrapper.innerHTML = `
    <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.02779 7.20699L2.37079 12.864L0.956787 11.45L5.90679 6.49999L0.956787 1.54999L2.37079 0.135986L8.02779 5.79299C8.21526 5.98051 8.32057 6.23482 8.32057 6.49999C8.32057 6.76515 8.21526 7.01946 8.02779 7.20699Z" fill="white"/>
    </svg>
  `;

  buttonText.appendChild(textLabel);
  buttonText.appendChild(svgWrapper);
  button.appendChild(buttonText);

  // Imagen
  const photoBox = document.createElement('div');
  photoBox.className = 'CuadroFoto';
  photoBox.setAttribute('data-layer', 'cuadro foto');
  Object.assign(photoBox.style, {
    width: '185px',
    height: '170px',
    left: '0px',
    top: '0px',
    position: 'absolute',
    overflow: 'hidden'
  });

  const img = document.createElement('img');
  img.src = data.image;
  img.alt = data.title;
  Object.assign(img.style, {
    width: '186px',
    height: '170px',
    left: '-1px',
    top: '0px',
    position: 'absolute'
  });

  photoBox.appendChild(img);

  // Ensamble
  mainContainer.appendChild(infoBox);
  mainContainer.appendChild(button);
  mainContainer.appendChild(photoBox);

  // Acción del botón
  button.addEventListener('click', () => {
    // Aquí puedes disparar un modal, navegar, o emitir un evento custom
    console.log(`Más información sobre: ${data.title}`);
    if (typeof window.onCardMoreInfo === 'function') {
      window.onCardMoreInfo(data);
    }
  });

  return mainContainer;
}

function renderCards(cardsArray, containerId) {
  const container = document.getElementById(containerId);
  container.style.position = container.style.position || 'relative';
  cardsArray.forEach(cardData => {
    const card = createCard(cardData);
    container.appendChild(card);
  });
}

// Inicializador: carga JSON y renderiza
async function initCards({ jsonUrl, containerId = 'cards-container' }) {
  const data = await fetchCardsData(jsonUrl);
  renderCards(data, containerId);
}

// Exponer init para usarlo desde el HTML
window.initCards = initCards;