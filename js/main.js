const landingForm = document.getElementById('duriLandingForm');
const mainContent = document.getElementById('main-content');
const thankYouPage = document.getElementById('thank-you-page');

function backToHome() {
    thankYouPage.classList.add('hidden');
    thankYouPage.style.display = 'none';
    mainContent.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Countdown Timer
const countdownEnd = new Date(Date.now() + 12 * 60 * 60 * 1000);

async function populateProvinceCity() {
    const provinceSelect = document.getElementById('provinceCity');
    if (!provinceSelect) return;
    const endpoint = 'https://provinces.open-api.vn/api/p/';
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(endpoint, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error('API request failed');
        const provinces = await response.json();
        provinceSelect.innerHTML = '<option value="">Chọn Tỉnh/Thành phố</option>';
        provinces
            .sort((a, b) => a.name.localeCompare(b.name, 'vi'))
            .forEach((province) => {
                const option = document.createElement('option');
                option.value = province.name;
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            });
    } catch (error) {
        provinceSelect.innerHTML = '<option value="">Không tải được danh sách tỉnh/thành</option>';
        provinceSelect.disabled = true;
        console.error('Không thể tải dữ liệu tỉnh/thành:', error);
    }
}

function updateCountdown() {
    const now = new Date();
    const diff = Math.max(0, countdownEnd - now);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);
populateProvinceCity();

// Social Proof Notification Popup
const notifications = [
    { name: 'Minh Anh', location: 'Hà Nội', time: '2 phút trước' },
    { name: 'Thu Hà', location: 'TP.HCM', time: '5 phút trước' },
    { name: 'Lan Phương', location: 'Đà Nẵng', time: '8 phút trước' },
    { name: 'Ngọc Mai', location: 'Hải Phòng', time: '12 phút trước' }
];
let notificationIndex = 0;

function showNotification() {
    const notification = notifications[notificationIndex];
    const notifEl = document.createElement('div');
    notifEl.className = 'notification-popup fixed bottom-6 right-6 bg-white rounded-xl shadow-xl p-4 max-w-sm z-50 border border-gray-100';
    notifEl.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-11 h-11 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                ${notification.name.charAt(0)}
            </div>
            <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm text-gray-900">${notification.name} vừa nhận tư vấn</div>
                <div class="text-xs text-gray-500 mt-1">${notification.location} • ${notification.time}</div>
            </div>
            <div class="text-green-500 text-xl">✓</div>
        </div>
    `;
    document.body.appendChild(notifEl);
    setTimeout(() => {
        notifEl.style.opacity = '0';
        notifEl.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => notifEl.remove(), 500);
    }, 5000);
    notificationIndex = (notificationIndex + 1) % notifications.length;
}

setTimeout(showNotification, 3000);
setInterval(showNotification, 15000);

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const logo = document.getElementById('logo');
const navLinks = document.querySelectorAll('.nav-link');
const ctaButton = document.getElementById('cta-button');

window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
        navbar.classList.remove('bg-white/90');
        navbar.classList.add('bg-gray-900', 'shadow-xl');
        logo.classList.remove('brand-blue');
        logo.classList.add('text-white');
        navLinks.forEach(link => { link.classList.remove('text-gray-800'); link.classList.add('text-white'); });
        ctaButton.classList.remove('bg-brand-blue', 'text-white');
        ctaButton.classList.add('bg-white', 'text-gray-900');
    } else {
        navbar.classList.remove('bg-gray-900', 'shadow-xl');
        navbar.classList.add('bg-white/90');
        logo.classList.remove('text-white');
        logo.classList.add('brand-blue');
        navLinks.forEach(link => { link.classList.remove('text-white'); link.classList.add('text-gray-800'); });
        ctaButton.classList.remove('bg-white', 'text-gray-900');
        ctaButton.classList.add('bg-brand-blue', 'text-white');
    }
});

// Reviews carousel
const reviewsTrack = document.getElementById('reviews-track');
const reviewsPrev = document.getElementById('reviews-prev');
const reviewsNext = document.getElementById('reviews-next');
let reviewIndex = 0;

function getVisibleReviews() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

function updateReviewsCarousel() {
    if (!reviewsTrack) return;
    const cards = reviewsTrack.children;
    if (!cards.length) return;
    const styles = getComputedStyle(reviewsTrack);
    const gap = parseFloat(styles.gap || styles.columnGap || '0');
    const cardWidth = cards[0].getBoundingClientRect().width;
    const step = cardWidth + gap;
    const maxIndex = Math.max(0, cards.length - getVisibleReviews());
    reviewIndex = Math.min(reviewIndex, maxIndex);
    reviewsTrack.style.transform = `translateX(${-reviewIndex * step}px)`;
    if (reviewsPrev) reviewsPrev.disabled = reviewIndex === 0;
    if (reviewsNext) reviewsNext.disabled = reviewIndex === maxIndex;
}

if (reviewsPrev && reviewsNext) {
    reviewsPrev.addEventListener('click', function () { reviewIndex = Math.max(0, reviewIndex - 1); updateReviewsCarousel(); });
    reviewsNext.addEventListener('click', function () { reviewIndex = reviewIndex + 1; updateReviewsCarousel(); });
}

window.addEventListener('resize', updateReviewsCarousel);
updateReviewsCarousel();

// ===== FORM SUBMIT =====
const scriptURL = "https://script.google.com/macros/s/AKfycbxJUoFOdVCYpEeXFvp74sjL70hkjZapvjSoU3EYmrl0GiVWuG9bXi-XjV7BR_omZFq9/exec";
const N8N_WEBHOOK = "https://durimallvn.app.n8n.cloud/webhook/b0666c6c-de60-4390-8ea3-970c4e47bd4d";
const N8N_EMAIL_WEBHOOK = "https://durimallvn.app.n8n.cloud/webhook/duri-ai-email";

document.getElementById("duriLandingForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const mainContent = document.getElementById('main-content');
    const thankYouPage = document.getElementById('thank-you-page');

    try { gtag('event', 'generate_lead', { event_category: 'form', event_label: 'DURI Landing Form', value: 1 }); } catch (e) { }

    var formEl = this;
    var jsonData = {
        name: formEl.querySelector('[name="name"]').value,
        phone: formEl.querySelector('[name="phone"]').value,
        email: formEl.querySelector('[name="email"]').value,
        baby_age: formEl.querySelector('[name="baby_age"]').value,
        product_interest: formEl.querySelector('[name="product_interest"]').value,
        city: formEl.querySelector('[name="city"]').value,
        source: "landing_page"
    };

    try {
        await Promise.allSettled([
            fetch(scriptURL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData)
            }),
            fetch(N8N_WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...jsonData, timestamp: new Date().toLocaleString('vi-VN'), source: "DURI Landing Page" })
            }),
            fetch(N8N_EMAIL_WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...jsonData, timestamp: new Date().toLocaleString('vi-VN'), source: "DURI Landing Page" })
            })
        ]);
    } catch (err) {
        console.error("Lỗi webhook:", err);
    }

    mainContent.classList.add('hidden');
    thankYouPage.classList.remove('hidden');
    thankYouPage.style.display = 'flex';
    window.scrollTo(0, 0);
});

// Gửi Google Sheet
fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonData)
}).then(function () {
    // Gửi n8n webhook
    fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: jsonData.name,
            phone: jsonData.phone,
            email: jsonData.email,
            baby_age: jsonData.baby_age,
            product_interest: jsonData.product_interest,
            city: jsonData.city,
            timestamp: new Date().toLocaleString('vi-VN'),
            source: "DURI Landing Page"
        })
    }).catch(err => console.log('n8n error:', err));
    // Gửi n8n email webhook
    fetch(N8N_EMAIL_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: jsonData.name,
            phone: jsonData.phone,
            email: jsonData.email,
            baby_age: jsonData.baby_age,
            product_interest: jsonData.product_interest,
            city: jsonData.city,
            timestamp: new Date().toLocaleString('vi-VN'),
            source: "DURI Landing Page"
        })
    }).catch(err => console.log('n8n email error:', err));

    mainContent.classList.add('hidden');
    thankYouPage.classList.remove('hidden');
    thankYouPage.style.display = 'flex';
    window.scrollTo(0, 0);
}).catch(function (error) {
    console.error("Lỗi gửi form:", error);
    mainContent.classList.add('hidden');
    thankYouPage.classList.remove('hidden');
    thankYouPage.style.display = 'flex';
    window.scrollTo(0, 0);
});

// ===== CHATBOX =====
const PROXY_URL = "https://script.google.com/macros/s/AKfycbzc7oN8aBv2xjEqZhbGGbYIF9pSZNEMcTpBE_FFWAFyBREZia7nZHsDDnk_fFUtkqs9fg/exec";

let chatHistory = [];
let quickRepliesShown = false;

const quickReplies = [
    { label: '🍼 Sản phẩm phù hợp theo độ tuổi bé?', value: 'Sản phẩm DURI phù hợp cho bé mấy tháng tuổi?' },
    { label: '🚽 Toilet seat DURI có gì đặc biệt?', value: 'Toilet seat DURI có đặc điểm gì nổi bật?' },
    { label: '🛡️ Sản phẩm có an toàn không?', value: 'Sản phẩm DURI có an toàn cho bé không?' },
];

async function getBotReply(userText) {
    try {
        const response = await fetch(PROXY_URL, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ message: userText, history: chatHistory })
        });
        const data = await response.json();
        const reply = data.reply;

        chatHistory.push({ role: "user", text: userText });
        chatHistory.push({ role: "model", text: reply });
        if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

        return reply;
    } catch (err) {
        console.error(err);
        return "Xin lỗi, mình đang gặp sự cố kết nối. Bạn thử lại sau nhé! 🙏";
    }
}

function renderQuickReplies() {
    if (quickRepliesShown) return; // ← chỉ hiện 1 lần
    quickRepliesShown = true;
    const msgs = document.getElementById('chat-messages');
    const old = msgs.querySelector('.quick-replies-wrap');
    if (old) old.remove();

    const wrap = document.createElement('div');
    wrap.className = 'quick-replies-wrap';

    const label = document.createElement('div');
    label.className = 'quick-replies-label';
    label.textContent = '💡 Bạn có thể hỏi:';
    wrap.appendChild(label);

    const chipsWrap = document.createElement('div');
    chipsWrap.className = 'quick-replies-chips';

    quickReplies.forEach(({ label: btnLabel, value }) => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = btnLabel;
        btn.onclick = () => sendQuick(value);
        chipsWrap.appendChild(btn);
    });

    wrap.appendChild(chipsWrap);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
}

function toggleChat() {
    const win = document.getElementById('chat-window');
    const toggle = document.getElementById('chat-toggle');
    const iconOpen = document.getElementById('chat-icon-open');
    const iconClose = document.getElementById('chat-icon-close');
    const isOpen = win.style.display === 'flex';

    if (isOpen) {
        win.style.display = 'none';
        toggle.style.display = 'flex';
    } else {
        win.style.display = 'flex';
        win.style.flexDirection = 'column';
        toggle.style.display = 'none';

        try { gtag('event', 'chatbot_open', { event_category: 'chatbot', event_label: 'DURI Assistant opened' }); } catch (e) { }

        const msgs = document.getElementById('chat-messages');
        if (msgs.children.length === 0) {
            appendMessage('bot', 'Xin chào! Mình là DURI Assistant 👋\nBạn đang tìm sản phẩm chăm sóc bé nào?');
            renderQuickReplies();
        }
    }

    iconOpen.style.display = isOpen ? 'inline' : 'none';
    iconClose.style.display = isOpen ? 'none' : 'inline';
}

function appendMessage(sender, text) {
    const msgs = document.getElementById('chat-messages');
    const old = msgs.querySelector('.quick-replies-wrap');
    if (old) old.remove();

    const div = document.createElement('div');
    div.className = sender === 'bot' ? 'msg-bot' : 'msg-user';
    div.style.whiteSpace = 'pre-line';
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
    const msgs = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'msg-bot';
    div.id = 'typing-indicator';
    div.textContent = '...';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    try { gtag('event', 'chatbot_message_sent', { event_category: 'chatbot', event_label: text.substring(0, 100) }); } catch (e) { }

    appendMessage('user', text);
    input.value = '';
    showTyping();

    const reply = await getBotReply(text);

    removeTyping();
    appendMessage('bot', reply);

    // Chỉ hiện button khi bot mời điền form / để lại thông tin
    const formPhrases = [
        'để lại thông tin',
        'điền thông tin',
        'điền form',
        'form trên trang',
        'form phía trên',
        'form bên trên',
        'để lại số điện thoại',
        'để lại thông tin của bạn',
        'nhận tư vấn trực tiếp',
        'đội ngũ sẽ liên hệ',
        'team sẽ liên hệ',
        'liên hệ lại trong',
    ];
    const shouldShowBtn = formPhrases.some(phrase => reply.toLowerCase().includes(phrase));
    if (shouldShowBtn) {
        appendFormButton();
    }
}
function appendFormButton() {
    const msgs = document.getElementById('chat-messages');

    // Không thêm nếu đã có rồi
    if (msgs.querySelector('.chat-form-btn')) return;

    const btn = document.createElement('a');
    btn.href = '#form';
    btn.className = 'chat-form-btn';
    btn.textContent = '📋 Điền form nhận tư vấn ngay';
    btn.onclick = () => toggleChat(); // đóng chat khi click
    msgs.appendChild(btn);
    msgs.scrollTop = msgs.scrollHeight;
}
async function sendQuick(text) {
    document.getElementById('chat-input').value = text;
    await sendMessage();
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && document.activeElement.id === 'chat-input') {
        sendMessage();
    }
});

// ===== GA4 TRACKING =====
document.querySelectorAll('a[href*="#"], button').forEach(btn => {
    btn.addEventListener('click', function () {
        const label = this.textContent.trim().substring(0, 50);
        if (label && !this.id.includes('chat') && !this.id.includes('toggle')) {
            try { gtag('event', 'cta_click', { button_text: label, page_location: window.location.href }); } catch (e) { }
        }
    });
});

let scrollTracked = { 25: false, 50: false, 75: false, 90: false };
window.addEventListener('scroll', function () {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    [25, 50, 75, 90].forEach(depth => {
        if (scrollPercent >= depth && !scrollTracked[depth]) {
            scrollTracked[depth] = true;
            try { gtag('event', 'scroll_depth', { event_category: 'engagement', event_label: depth + '%', value: depth }); } catch (e) { }
        }
    });
});