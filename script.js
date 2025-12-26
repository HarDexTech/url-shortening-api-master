'use strict';
const urlInput = document.getElementById('url-input');
const btnSubmit = document.getElementById('btn-submit');
const closeModal = document.querySelector('.close');
const openModal = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.overlay');
const linkList = document.querySelector('#links-list ul');

function closeModalFunc() {
  document.getElementById('nav-mobile').classList.add('hidden');
  overlay.classList.add('hidden');
}
closeModal.addEventListener('click', closeModalFunc);
overlay.addEventListener('click', closeModalFunc);

function openModalFunc() {
  document.getElementById('nav-mobile').classList.remove('hidden');
  overlay.classList.remove('hidden');
}
openModal.addEventListener('click', openModalFunc);

function btnSubmitFunc() {
  const encodedUrl = encodeURIComponent(urlInput.value);

  fetch(`https://tinyurl.com/api-create.php?url=${encodedUrl}`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      return response.text();
    })
    .then((shortUrl) => {
      if (shortUrl.startsWith('https://tinyurl.com/')) {
        console.log('✅ Short URL:', shortUrl);
        createHtml(urlInput.value, shortUrl);
        return shortUrl;
      } else {
        throw new Error('Invalid response from TinyURL');
      }
    })
    .catch((error) => {
      console.error('❌ TinyURL failed:', error.message);
      return;
    });
}
btnSubmit.addEventListener('click', btnSubmitFunc);

function createHtml(urlInputValue, shortUrl) {
  linkList.innerHTML += `<li><div id="output">
          <div class="original-url">${urlInputValue}</div>
          <div class="urlOutput"><div class="short-url"><a href="${shortUrl}" target="_blank" rel="noopener">${shortUrl}</a></div>
          <div class="copyBtnContainer"><button class="copy-btn">Copy</button></div></div>
        </div></li>`;
}

//copy btn
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('copy-btn')) {
    navigator.clipboard.writeText(
      document.querySelector('span a').getAttribute('href')
    );
  }
});

// Scroll direction detection
let lastScrollTop = 0;
let isScrollingDown = true;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    isScrollingDown = true;
  } else {
    isScrollingDown = false;
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

AOS.init({
  duration: 1000, // animation duration in ms
  once: false, // allow animations to trigger multiple times
  offset: 100, // offset from the original trigger point
});

// Listen for AOS init to modify animations based on scroll direction
document.addEventListener('aos:in', (e) => {
  const element = e.detail;
  if (isScrollingDown) {
    // Keep original animation (fade-up, fade-left, etc.)
  } else {
    // Change to opposite direction when scrolling up
    const currentAnimation = element.getAttribute('data-aos');
    let newAnimation = currentAnimation;

    if (currentAnimation === 'fade-up') {
      newAnimation = 'fade-down';
    } else if (currentAnimation === 'fade-down') {
      newAnimation = 'fade-up';
    } else if (currentAnimation === 'fade-left') {
      newAnimation = 'fade-right';
    } else if (currentAnimation === 'fade-right') {
      newAnimation = 'fade-left';
    }

    element.setAttribute('data-aos', newAnimation);
    AOS.refreshHard();
  }
});
