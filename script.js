// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {




    // ====================
    // GESTION DU FORMULAIRE
    // ====================
    

    const registrationForm = document.getElementById('registration-form');
    const confirmationMessage = document.getElementById('confirmation-message');
    const newRegistrationBtn = document.getElementById('new-registration');
    const submitButton = registrationForm.querySelector('button[type="submit"]');

    // ===================================================================================
    // !! IMPORTANT !!
    // REMPLACEZ CETTE URL PAR L'URL DE VOTRE PROPRE SCRIPT GOOGLE APPS DÉPLOYÉ
    // ===================================================================================
    const googleScriptURL = 'https://script.google.com/macros/s/AKfycbw2oAoClVINA-Pl7aIWCIr2ilChHwOcAh3pEPRbfrkfwS9b5ENIOAo9YFEsiF-RtZagrA/exec';
    // ===================================================================================

    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Afficher un état de chargement sur le bouton
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

        // Créer un objet simple avec les données du formulaire
        const formData = new FormData(registrationForm);
        const data = {};
        formData.forEach((value, key) => {
            // Gérer les cases à cocher
            if (key === 'newsletter' || key === 'consent') {
                data[key] = document.getElementById(key).checked;
            } else {
                data[key] = value;
            }
        });

        // Envoyer les données au script Google
        fetch(googleScriptURL, {
            method: 'POST',
            mode: 'no-cors', // 'no-cors' est souvent nécessaire pour les scripts Google
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            redirect: 'follow',
        })
        .then(response => {
             // Avec 'no-cors', on ne peut pas lire la réponse,
             // donc on suppose que ça a réussi si aucune erreur n'est levée.
            console.log('Success (assumed due to no-cors mode)');
            
            // Masquer le formulaire et afficher le message de confirmation
            registrationForm.classList.add('hidden');
            confirmationMessage.classList.remove('hidden');
            confirmationMessage.scrollIntoView({ behavior: 'smooth' });
            registrationForm.reset();
        })
        .catch(error => {
            console.error('Erreur lors de la soumission :', error);
            // Afficher un message d'erreur à l'utilisateur (optionnel)
            alert("Une erreur est survenue. Veuillez réessayer plus tard.");
        })
        .finally(() => {
            // Rétablir l'état initial du bouton
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });

    newRegistrationBtn.addEventListener('click', function() {
        confirmationMessage.classList.add('hidden');
        registrationForm.classList.remove('hidden');
        registrationForm.scrollIntoView({ behavior: 'smooth' });
    });

    // ====================
    // SCROLL-TO-TOP BUTTON
    // ====================
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };

    // When the user clicks on the button, scroll to the top of the document
    scrollToTopBtn.addEventListener('click', function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });

    // ====================
    // POPUP LOGIC
    // ====================
    const eventPopup = document.getElementById('event-popup');

    if (eventPopup) {
        const popupCloseBtn = document.querySelector('#event-popup .popup-close-btn');
        const popupCtaBtn = document.querySelector('#event-popup .popup-cta-btn');

        let popupShownThisSession = false;
        try {
            popupShownThisSession = sessionStorage.getItem('eventPopupShown');
        } catch (e) {
            // Error accessing sessionStorage (likely Tracking Prevention), proceed as if not shown
        }

        if (!popupShownThisSession) {
            setTimeout(() => {
                eventPopup.classList.add('is-visible');
            }, 1000); // Show after 1 second
            
            try {
                sessionStorage.setItem('eventPopupShown', 'true');
            } catch (e) {
                // Error setting sessionStorage (likely Tracking Prevention)
            }
        }

        if (popupCloseBtn) {
            setTimeout(() => {
                popupCloseBtn.addEventListener('click', () => {
                    eventPopup.classList.remove('is-visible');
                });
            }, 100); // 100ms delay before activating listener
        }

        if (popupCtaBtn) {
            popupCtaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                eventPopup.classList.remove('is-visible');
                document.getElementById('inscription').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    // ====================
    // SCROLL ANIMATIONS
    // ====================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
});
