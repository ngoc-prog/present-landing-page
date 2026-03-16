const landingForm = document.getElementById('duriLandingForm');
        const mainContent = document.getElementById('main-content');
        const thankYouPage = document.getElementById('thank-you-page');

        // Logic khi gửi Form - gộp chung với Google Sheet submit bên dưới
        // (Xử lý ở script riêng phía dưới)

        // Hàm quay lại trang chủ từ trang cảm ơn
        function backToHome() {
            thankYouPage.classList.add('hidden');
            thankYouPage.style.display = 'none';
            mainContent.classList.remove('hidden');
            window.scrollTo(0, 0);
        }
        
        // Countdown Timer
        const countdownEnd = new Date(Date.now() + 12 * 60 * 60 * 1000);

        // Province/City list from Vietnam provinces API
        async function populateProvinceCity() {
            const provinceSelect = document.getElementById('provinceCity');
            if (!provinceSelect) return;

            const endpoint = 'https://provinces.open-api.vn/api/p/';

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const response = await fetch(endpoint, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error('API request failed');
                }

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
        
        // Update countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);

        // Load province/city options on page load
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
            
            // Create notification element
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
            
            // Remove after 5 seconds
            setTimeout(() => {
                notifEl.style.opacity = '0';
                notifEl.style.transition = 'opacity 0.5s ease-out';
                setTimeout(() => notifEl.remove(), 500);
            }, 5000);
            
            notificationIndex = (notificationIndex + 1) % notifications.length;
        }
        
        // Show first notification after 3 seconds
        setTimeout(showNotification, 3000);
        
        // Show notification every 15 seconds
        setInterval(showNotification, 15000);
        
        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        const logo = document.getElementById('logo');
        const navLinks = document.querySelectorAll('.nav-link');
        const ctaButton = document.getElementById('cta-button');
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                // Scrolled down - dark navbar
                navbar.classList.remove('bg-white/90');
                navbar.classList.add('bg-gray-900');
                navbar.classList.add('shadow-xl');
                
                logo.classList.remove('brand-blue');
                logo.classList.add('text-white');
                
                navLinks.forEach(link => {
                    link.classList.remove('text-gray-800');
                    link.classList.add('text-white');
                });
                
                ctaButton.classList.remove('bg-brand-blue');
                ctaButton.classList.add('bg-white');
                ctaButton.classList.remove('text-white');
                ctaButton.classList.add('text-gray-900');
            } else {
                // Top of page - light navbar
                navbar.classList.remove('bg-gray-900');
                navbar.classList.remove('shadow-xl');
                navbar.classList.add('bg-white/90');
                
                logo.classList.remove('text-white');
                logo.classList.add('brand-blue');
                
                navLinks.forEach(link => {
                    link.classList.remove('text-white');
                    link.classList.add('text-gray-800');
                });
                
                ctaButton.classList.remove('bg-white');
                ctaButton.classList.remove('text-gray-900');
                ctaButton.classList.add('bg-brand-blue');
                ctaButton.classList.add('text-white');
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
            reviewsPrev.addEventListener('click', function() {
                reviewIndex = Math.max(0, reviewIndex - 1);
                updateReviewsCarousel();
            });

            reviewsNext.addEventListener('click', function() {
                reviewIndex = reviewIndex + 1;
                updateReviewsCarousel();
            });
        }

        window.addEventListener('resize', updateReviewsCarousel);
        updateReviewsCarousel();

const scriptURL = "https://script.google.com/macros/s/AKfycbxqlgb6Ueh7Rk4cmQzLVu41JCj7B0EUbLNY1xaSrh1jATMPK-v-lYkDwUu9HGr65L12/exec";

document.getElementById("duriLandingForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const mainContent = document.getElementById('main-content');
  const thankYouPage = document.getElementById('thank-you-page');

  var formEl = this;
  var jsonData = {
    name:             formEl.querySelector('[name="name"]').value,
    phone:            formEl.querySelector('[name="phone"]').value,
    email:            formEl.querySelector('[name="email"]').value,
    baby_age:         formEl.querySelector('[name="baby_age"]').value,
    product_interest: formEl.querySelector('[name="product_interest"]').value,
    city:             formEl.querySelector('[name="city"]').value,
    source:           "landing_page"
  };

  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonData)
  })
  .then(function() {
    mainContent.classList.add('hidden');
    thankYouPage.classList.remove('hidden');
    thankYouPage.style.display = 'flex';
    window.scrollTo(0, 0);
  })
  .catch(function(error) {
    console.error("Lỗi gửi form:", error);
    mainContent.classList.add('hidden');
    thankYouPage.classList.remove('hidden');
    thankYouPage.style.display = 'flex';
    window.scrollTo(0, 0);
  });
});