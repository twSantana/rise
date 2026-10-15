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
setupMobileMenu();
setupHeader();
document.querySelector("#current-year").textContent = String(new Date().getFullYear());
