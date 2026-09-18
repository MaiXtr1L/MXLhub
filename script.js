/**
 * MXLhub — Script interactif
 * Fonctions de partage, copie de lien et notification toast
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const shareBtn = document.getElementById('share-btn');
  const copyBtn = document.getElementById('copy-profile-btn');
  const qrBtn = document.getElementById('qr-btn');
  const qrModal = document.getElementById('qr-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  let toastTimeout = null;

  /**
   * Affiche une notification toast temporaire
   * @param {string} message 
   */
  function showToast(message) {
    if (!toast) return;

    if (toastMessage) {
      toastMessage.textContent = message;
    }

    toast.classList.add('show');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  /**
   * Copie l'URL actuelle dans le presse-papier
   */
  async function copyCurrentUrl() {
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback pour contextes non sécurisés ou anciens navigateurs
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      showToast('Lien copié dans le presse-papier !');
    } catch (err) {
      console.warn('Erreur lors de la copie du lien:', err);
      showToast('Impossible de copier automatiquement le lien');
    }
  }

  /**
   * Gestion du partage universel (Web Share API ou Copie)
   */
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MXLhub — Liens Officiels',
          text: 'Découvre l\'ensemble des réseaux et liens officiels de MXL !',
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyCurrentUrl();
        }
      }
    } else {
      copyCurrentUrl();
    }
  }

  // Event Listeners
  if (shareBtn) {
    shareBtn.addEventListener('click', handleShare);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', copyCurrentUrl);
  }

  // Copie de l'adresse email professionnelle
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'mxlexepro@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast('Email copié : ' + email);

        // Feedback visuel temporaire sur l'icône
        const arrowBox = copyEmailBtn.querySelector('.card-arrow');
        if (arrowBox) {
          const originalSvg = arrowBox.innerHTML;
          arrowBox.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="#00F2FE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          setTimeout(() => {
            arrowBox.innerHTML = originalSvg;
          }, 2000);
        }
      } catch (err) {
        console.warn('Erreur lors de la copie de l\'email:', err);
        showToast('Impossible de copier automatiquement l\'email');
      }
    });
  }

  // Gestion du Modal QR Code
  function openQrModal() {
    if (!qrModal) return;
    qrModal.classList.add('active');
    qrModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeQrModal() {
    if (!qrModal) return;
    qrModal.classList.remove('active');
    qrModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (qrBtn) {
    qrBtn.addEventListener('click', openQrModal);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeQrModal);
  }

  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        closeQrModal();
      }
    });
  }

  // Fermer la modale avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal && qrModal.classList.contains('active')) {
      closeQrModal();
    }
  });

  // Micro-interaction : Effet de brillance subtile qui suit la souris sur les cartes de lien
  const linkCards = document.querySelectorAll('.link-card');
  linkCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  console.log('MXLhub chargé avec succès — Thème Noir & Turquoise actif.');
});
