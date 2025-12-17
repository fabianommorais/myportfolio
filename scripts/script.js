let translations = {};

fetch("/scripts/translations.json")
  .then((response) => response.json())
  .then((data) => {
    translations = data;

    const savedLanguage = localStorage.getItem("language");
    const userLanguage =
      savedLanguage || navigator.language.split("-")[0] || "pt";

    const supportedLangs = ["pt", "en", "fr"];
    const langToLoad = supportedLangs.includes(userLanguage)
      ? userLanguage
      : "pt";

    loadLanguage(langToLoad);
  });

// Função para carregar traduções
function loadLanguage(lang) {
  // Guarda o idioma no localStorage
  localStorage.setItem("language", lang);

  // Atualiza o seletor de idioma
  document.getElementById("language-select").value = lang;

  // Altera o texto do indicador de idioma
  const langIndicatorsSpan = document.getElementById("lang-name");
  const i18nKey = `lang.${lang}`;
  langIndicatorsSpan.textContent = translations[lang][i18nKey] || lang;
  langIndicatorsSpan.setAttribute("data-i18n", i18nKey);

  // Aplica as traduções para todos os elementos com data-i18n
  document.querySelectorAll("[data-i18n]").forEach((elem) => {
    const key = elem.dataset.i18n;
    if (translations[lang][key]) {
      elem.innerHTML = translations[lang][key];
    }
  });

  // Aplica as traduções para placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((elem) => {
    const key = elem.dataset.i18nPlaceholder;
    if (translations[lang][key]) {
      elem.placeholder = translations[lang][key];
    }
  });

  // Aplica as traduções para valores de input
  document.querySelectorAll("[data-i18n-value]").forEach((elem) => {
    const key = elem.dataset.i18nValue;
    if (translations[lang][key]) {
      elem.value = translations[lang][key];
    }
  });
}

// Menu Mobile
document.querySelector(".mobile-toggle").addEventListener("click", function () {
  document.querySelector(".mobile-menu").classList.toggle("active");
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    if (this.getAttribute("href") === "#") return;

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });

      // Fechar o menu mobile após o clique
      document.querySelector(".mobile-menu").classList.remove("active");
    }
  });
});

// Form Submission
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const lang = localStorage.getItem("language") || "pt";
  const messageOk =
    lang === "pt"
      ? "Mensagem enviada! Entrarei em contato em breve."
      : lang === "en"
        ? "Message sent! I will contact you soon."
        : "Message envoyé ! Je vous contacte bientôt.";
  const messageWarning =
    lang === "pt"
      ? "Por favor, marque o reCAPTCHA antes de enviar."
      : lang === "en"
        ? "Please check the reCAPTCHA before sending."
        : "Veuillez cocher le reCAPTCHA avant d'envoyer.";
  const messageErrorServer =
    lang === "pt"
      ? "Erro ao enviar a mensagem. Por favor, tente novamente."
      : lang === "en"
        ? "Error sending message. Please try again."
        : "Erreur dans l'envoi du message. Veuillez réessayer.";
  const messageErrorClient =
    lang === "pt"
      ? "Erro de conexão. Verifique sua internet."
      : lang === "en"
        ? "Connection error. Check your internet."
        : "Erreur de connexion. Vérifiez votre connexion internet.";
  const recaptchaToken = grecaptcha.getResponse();
  if (!recaptchaToken) {
    alert(messageWarning);
    return;
  }

  const formData = new FormData(form);
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      alert(messageOk);
      form.reset();
      grecaptcha.reset();
    } else {
      alert(messageErrorServer);
    }
  } catch (error) {
    alert(messageErrorClient);
  }
});

// Seletor de idioma
document.getElementById("language-select").addEventListener("change", (e) => {
  loadLanguage(e.target.value);
});

// Data do rodapé
document.getElementById("current-year").textContent = new Date().getFullYear();

// Verifica o idioma preferido do usuário ou idioma salvo
const savedLanguage = localStorage.getItem("language");
const userLanguage = savedLanguage || navigator.language.split("-")[0] || "pt";

// Define o idioma base
const supportedLangs = ["pt", "en", "fr"];
const langToLoad = supportedLangs.includes(userLanguage) ? userLanguage : "pt";
