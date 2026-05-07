// Firebase Configuration - تم تحديث الرابط فقط لضمان استقبال الأخبار
const firebaseConfig = {
  databaseURL: "https://continental-f76a8-default-rtdb.firebaseio.com/",
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentLang = "en";

// Language Toggle Logic
function toggleLanguage() {
  currentLang = currentLang === "en" ? "ar" : "en";
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = currentLang;

  document.getElementById("lang-btn").innerText =
    currentLang === "en" ? "AR" : "EN";

  const elements = document.querySelectorAll("[data-en]");
  elements.forEach((el) => {
    el.innerHTML = el.getAttribute(`data-${currentLang}`);
  });

  const placeholders = document.querySelectorAll("[data-en-placeholder]");
  placeholders.forEach((el) => {
    el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`);
  });

  showToast(
    currentLang === "ar"
      ? "تم تغيير اللغة إلى العربية"
      : "Language changed to English",
  );
}

// Toast Function
function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// Contact Form Handler
function handleFormSubmit(e) {
  showToast(
    currentLang === "ar"
      ? "تم إرسال الطلب بنجاح! سنتواصل معك قريباً."
      : "Request sent successfully! We will contact you soon.",
  );
}

// Render News from Firebase
function renderNews() {
  database
    .ref("news")
    .orderByChild("timestamp")
    .on("value", (snapshot) => {
      const container = document.getElementById("news-container");
      let html = "";
      snapshot.forEach((child) => {
        const item = child.val();
        const id = child.key;
        const isLong = item.content.length > 130;
        html =
          `
              <div class="news-card">
                <img src="${item.img}" class="news-img">
                <div class="news-body">
                  <span class="news-tag tag-${item.type}">${item.type}</span>
                  <h3 style="margin-bottom:10px;">${item.title}</h3>
                  <p style="font-size:0.9rem; opacity:0.8;">${isLong ? item.content.substring(0, 130) + "..." : item.content}</p>
                  ${isLong ? `<button class="read-more-btn" onclick="openStory(\`${item.title}\`, \`${item.content.replace(/\n/g, "\\n")}\`, \`${item.img}\`)">${currentLang === "ar" ? "اقرأ القصة كاملة ←" : "Read Full Story →"}</button>` : ""}
                  <small style="display:block; margin-top:15px; opacity:0.5">${item.date}</small>
                </div>
              </div>` + html;
      });
      container.innerHTML =
        html ||
        `<p style="text-align:center; grid-column:1/-1;">${currentLang === "ar" ? "لا توجد تحديثات حالياً." : "No updates at the moment."}</p>`;
    });
}

// Modals Logic
function openStory(title, content, img) {
  document.getElementById("storyTitle").innerText = title;
  document.getElementById("storyContent").innerText = content;
  const sImg = document.getElementById("storyImg");
  if (img && !img.includes("placeholder")) {
    sImg.src = img;
    sImg.style.display = "block";
  } else {
    sImg.style.display = "none";
  }
  document.getElementById("storyModal").style.display = "flex";
}

function closeStory() {
  document.getElementById("storyModal").style.display = "none";
}

function openModal() {
  document.getElementById("quoteModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("quoteModal").style.display = "none";
}

// Global Click Listener for UI
window.addEventListener("click", function (e) {
  const nav = document.getElementById("navbar");
  const menuBtn = document.querySelector(".menu-btn");
  const quoteModal = document.getElementById("quoteModal");

  if (
    nav &&
    nav.classList.contains("active") &&
    !nav.contains(e.target) &&
    menuBtn &&
    !menuBtn.contains(e.target)
  ) {
    toggleMenu();
  }

  if (e.target === quoteModal) {
    closeModal();
  }
});

// Preloader & Initialization
window.addEventListener("load", () => {
  const logoOverlay = document.getElementById("logo-overlay");
  const preloader = document.getElementById("preloader");
  const mainContent = document.getElementById("main-content");

  setTimeout(() => {
    logoOverlay.style.opacity = "0";
    preloader.style.display = "flex";
    setTimeout(() => {
      logoOverlay.style.display = "none";
    }, 800);
  }, 1800);

  setTimeout(() => {
    preloader.style.opacity = "0";
    mainContent.style.visibility = "visible";
    renderNews();
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }, 3800);
});

// FAQ Accordion
document.querySelectorAll(".faq-question").forEach((q) => {
  q.addEventListener("click", () => {
    q.parentElement.classList.toggle("active");
  });
});

// Menu Toggle
function toggleMenu() {
  const nav = document.getElementById("navbar");
  const menuIcon = document.getElementById("menu-icon");
  nav.classList.toggle("active");
  if (nav.classList.contains("active")) {
    menuIcon.classList.replace("fa-bars", "fa-times");
  } else {
    menuIcon.classList.replace("fa-times", "fa-bars");
  }
}

// Dark/Light Mode
function toggleMode() {
  document.body.classList.toggle("light");
  const icon = document.getElementById("theme-icon");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
}

// Scroll Logic
const backToTop = document.getElementById("backToTop");
window.onscroll = function () {
  if (document.documentElement.scrollTop > 400)
    backToTop.style.display = "flex";
  else backToTop.style.display = "none";

  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.style.height = "70px";
    header.style.background = "rgba(255, 255, 255, 0.98)";
  } else {
    header.style.height = "80px";
  }
};

backToTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Statistics Counter
const startCounters = () => {
  document.querySelectorAll(".counter").forEach((counter) => {
    if (counter.dataset.started === "true") return;
    counter.dataset.started = "true";

    const target = +counter.getAttribute("data-target");
    const duration = 2500;
    const step = target / (duration / 40);

    const update = () => {
      const count = +counter.innerText.replace("+", "");
      if (count < target) {
        counter.innerText = Math.ceil(count + step) + "+";
        setTimeout(update, 40);
      } else {
        counter.innerText = target + "+";
      }
    };
    update();
  });
};

// Intersection Observer for Reveal Animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        if (
          entry.target.classList.contains("counter") ||
          entry.target.querySelector(".counter")
        ) {
          startCounters();
        }
      }
    });
  },
  { threshold: 0.5 },
);

document
  .querySelectorAll(".reveal, .counter")
  .forEach((el) => observer.observe(el));

// Hero Slider
let slides = document.querySelectorAll(".slide");
let slideIdx = 0;
setInterval(() => {
  if (slides.length > 0) {
    slides[slideIdx].classList.remove("active");
    slideIdx = (slideIdx + 1) % slides.length;
    slides[slideIdx].classList.add("active");
  }
}, 5000);

/* --- CHATBOT LOGIC --- */
const REMOTE_SERVER_URL = "https://ai-server-jqbp.onrender.com/ask-gemini";

function toggleChat() {
  const chatWindow = document.getElementById("chatWindow");
  if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
    chatWindow.style.display = "flex";
    const messagesDiv = document.getElementById("chatMessages");
    if (messagesDiv.children.length === 0) {
      setTimeout(() => {
        const welcomeMsg =
          currentLang === "ar"
            ? "مرحباً بك في كونتننتال! أنا مستشارك الذكي، كيف يمكنني مساعدتك اليوم؟"
            : "Welcome to Continental! I am your AI consultant, how can I assist you today?";
        addMessage(welcomeMsg, "bot");
      }, 500);
    }
  } else {
    chatWindow.style.display = "none";
  }
}

async function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (message !== "") {
    addMessage(message, "user");
    input.value = "";

    const loadingId = "loading-" + Date.now();
    addMessage(
      currentLang === "ar" ? "جاري التفكير..." : "Thinking...",
      "bot",
      loadingId,
    );

    try {
      const response = await fetch(REMOTE_SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a professional business consultant for "Continental". 
                   The user is asking: ${message}. 
                   Respond professionally in ${currentLang === "ar" ? "Arabic" : "English"}.`,
        }),
      });

      const data = await response.json();
      const loadingElement = document.getElementById(loadingId);
      if (loadingElement) loadingElement.remove();

      if (data.text) {
        addMessage(data.text, "bot");
      } else if (data.error) {
        addMessage(
          currentLang === "ar"
            ? "حدث خطأ في السيرفر: " + data.error
            : "Server error: " + data.error,
          "bot",
        );
      }
    } catch (error) {
      const loadingElement = document.getElementById(loadingId);
      if (loadingElement) loadingElement.remove();
      addMessage(
        currentLang === "ar" ? "خطأ في الاتصال بالسيرفر." : "Connection error.",
        "bot",
      );
    }
  }
}

document.getElementById("chatInput")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendChatMessage();
});

function addMessage(text, sender, id = null) {
  const messagesDiv = document.getElementById("chatMessages");
  const msgElement = document.createElement("div");
  msgElement.className = `message ${sender}`;
  if (id) msgElement.id = id;
  msgElement.innerText = text;
  messagesDiv.appendChild(msgElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
