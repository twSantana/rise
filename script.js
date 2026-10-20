const RISE_CONFIG = {
  whatsappNumber: "554195807668",
  instagramUrl: "https://www.instagram.com/rise.collab/",
  phone: "+55 41 9580-7668",
  email: ""
};

const whatsappMessages = {
  orcamento: "Olá! Encontrei o site da RISE MARKETING e gostaria de solicitar um orçamento para o meu negócio.",
  geral: "Olá! Conheci a RISE MARKETING pelo site e gostaria de conversar sobre soluções para a presença digital do meu negócio.",
  telefone: "Olá! Encontrei o contato da RISE MARKETING pelo site e gostaria de conversar sobre o meu negócio.",
  instagram: "Olá! Conheci a RISE MARKETING pelo site e gostaria de saber mais sobre o serviço de marketing para Instagram.",
  sites: "Olá! Conheci a RISE MARKETING pelo site e gostaria de saber mais sobre a criação de um site para o meu negócio."
};

function updateWhatsAppLinks() {
  const number = RISE_CONFIG.whatsappNumber.replace(/\D/g, "");
  if (!number) {
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
    });
    return;
  }

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const message = whatsappMessages[link.dataset.whatsapp];
    if (!message) {
      throw new Error(`Mensagem de WhatsApp não configurada: ${link.dataset.whatsapp}`);
    }
    link.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function updateContactLinks() {
  document.querySelectorAll('[data-config="instagram"]').forEach((link) => {
    if (RISE_CONFIG.instagramUrl) {
      link.href = RISE_CONFIG.instagramUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const value = link.querySelector(".config-value");
      if (value) value.textContent = "Visite nosso perfil ↗";
    } else {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
    }
  });

  const phoneContact = document.querySelector('[data-config="phone"]');
  if (RISE_CONFIG.phone && phoneContact) {
    const phoneLink = phoneContact.querySelector(".phone-number");
    phoneLink.href = `tel:${RISE_CONFIG.phone.replace(/[^\d+]/g, "")}`;
    phoneLink.textContent = RISE_CONFIG.phone;
    phoneContact.hidden = false;
  }

  const emailLink = document.querySelector('[data-config="email"]');
  if (RISE_CONFIG.email && emailLink) {
    emailLink.href = `mailto:${RISE_CONFIG.email}`;
    emailLink.querySelector(".config-value").textContent = RISE_CONFIG.email;
    emailLink.hidden = false;
  }
}

function getBrazilianPhoneDigits(value) {
  const digits = value.replace(/\D/g, "");
  return /^55\d{10,11}$/.test(digits) ? digits.slice(2) : digits;
}

function formatBrazilianPhone(value) {
  const digits = getBrazilianPhoneDigits(value).slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;

  const areaCode = digits.slice(0, 2);
  const subscriber = digits.slice(2);
  const splitAt = digits.length > 10 ? 5 : 4;
  const formattedSubscriber = subscriber.length > splitAt
    ? `${subscriber.slice(0, splitAt)}-${subscriber.slice(splitAt)}`
    : subscriber;

  return `(${areaCode}) ${formattedSubscriber}`;
}

function isValidBrazilianPhone(value) {
  const digits = getBrazilianPhoneDigits(value);
  return /^(?:1[1-9]|[2-9]\d)(?:[2-9]\d{7}|9\d{8})$/.test(digits);
}

function setupLeadForm() {
  const form = document.querySelector("#lead-form");
  if (!form) return;

  const phoneInput = form.elements.phone;
  const feedback = document.querySelector("#lead-form-feedback");
  const fallbackLink = document.querySelector("#lead-whatsapp-fallback");

  phoneInput.addEventListener("input", () => {
    phoneInput.value = formatBrazilianPhone(phoneInput.value);
    phoneInput.setCustomValidity("");
    feedback.hidden = true;
  });

  form.addEventListener("input", (event) => {
    if (event.target !== phoneInput) event.target.setCustomValidity("");
    feedback.hidden = true;
  });
  form.addEventListener("change", (event) => {
    event.target.setCustomValidity("");
    feedback.hidden = true;
  });
  form.addEventListener("invalid", (event) => {
    const field = event.target;
    if (field === phoneInput && field.value && !isValidBrazilianPhone(field.value)) {
      field.setCustomValidity("Informe um WhatsApp válido com DDD, usando 10 ou 11 números.");
    } else if (field.validity.valueMissing) {
      const messages = {
        "lead-name": "Informe seu nome completo.",
        "lead-phone": "Informe seu WhatsApp com DDD.",
        "lead-service": "Selecione o serviço desejado."
      };
      field.setCustomValidity(messages[field.id] || "Preencha este campo.");
    }
  }, true);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    phoneInput.setCustomValidity(
      isValidBrazilianPhone(phoneInput.value)
        ? ""
        : "Informe um WhatsApp válido com DDD, usando 10 ou 11 números."
    );
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const company = String(formData.get("company") || "").trim();
    const budget = String(formData.get("budget") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const message = [
      "Olá, equipe da RISE MARKETING! Gostaria de solicitar um orçamento.",
      "",
      `Nome: ${String(formData.get("name")).trim()}`,
      `WhatsApp: ${phoneInput.value}`,
      ...(company ? [`Empresa: ${company}`] : []),
      `Serviço desejado: ${String(formData.get("service"))}`,
      ...(budget ? [`Faixa de orçamento: ${budget}`] : []),
      ...(description ? ["", "Descrição do projeto:", description] : []),
      "",
      "Aguardo o contato. Obrigado!"
    ].join("\n");
    const businessNumber = RISE_CONFIG.whatsappNumber.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;

    fallbackLink.href = whatsappUrl;
    feedback.hidden = false;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  if (!toggle || !navigation) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    navigation.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function setupHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

updateWhatsAppLinks();
updateContactLinks();
setupLeadForm();
setupMobileMenu();
setupHeader();
document.querySelector("#current-year").textContent = String(new Date().getFullYear());
