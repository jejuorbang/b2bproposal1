// ==================== AOS (Animate On Scroll) 초기화 ====================
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });

    // 모든 기능 초기화
    initNavigation();
    initScrollHeader();
    initCountUp();
    initFAQ();
    initSmoothScroll();
    initContactForm();
});

// ==================== 네비게이션 토글 (모바일 메뉴) ====================
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // 메뉴 링크 클릭 시 메뉴 닫기
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // 메뉴 외부 클릭 시 메뉴 닫기
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// ==================== 스크롤 시 헤더 스타일 변경 ====================
function initScrollHeader() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            header.style.padding = '10px 0';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            header.style.padding = '15px 0';
        }
    });
}

// ==================== 숫자 카운트업 애니메이션 ====================
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(statNumber => {
                    const target = parseInt(statNumber.getAttribute('data-count'));
                    animateCount(statNumber, target);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.intro-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCount(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

// ==================== FAQ 아코디언 ====================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            // 현재 아이템이 이미 열려있는지 확인
            const isActive = item.classList.contains('active');

            // 모든 FAQ 아이템 닫기
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });

            // 현재 아이템이 닫혀있었다면 열기
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ==================== 부드러운 스크롤 ====================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // 빈 href나 #만 있는 경우 제외
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // 헤더 높이 고려
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== 문의 폼 제출 처리 ====================
function initContactForm() {
    const form = document.getElementById('inquiryForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // 폼 데이터 수집
            const formData = {
                business_name: form.business_name.value,
                manager_name: form.manager_name.value,
                phone: form.phone.value,
                email: form.email.value,
                location: form.location.value,
                message: form.message.value
            };

            // 폼 유효성 검사
            if (!validateForm(formData)) {
                return;
            }

            // 실제 환경에서는 여기서 서버로 데이터 전송
            // 현재는 콘솔에 출력하고 알림 표시
            console.log('문의 내용:', formData);

            // 성공 메시지 표시
            showSuccessMessage();

            // 폼 리셋
            form.reset();
        });
    }
}

function validateForm(formData) {
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        return false;
    }

    // 전화번호 형식 검증 (숫자와 하이픈만)
    const phoneRegex = /^[0-9-]+$/;
    if (!phoneRegex.test(formData.phone)) {
        alert('올바른 전화번호를 입력해주세요.');
        return false;
    }

    return true;
}

function showSuccessMessage() {
    // 성공 메시지 요소 생성
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✓</span>
            <p>문의가 성공적으로 접수되었습니다!</p>
            <p class="success-sub">빠른 시일 내에 연락드리겠습니다.</p>
        </div>
    `;

    // 스타일 추가
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 10px 50px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;

    // 배경 오버레이 생성
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;

    // DOM에 추가
    document.body.appendChild(overlay);
    document.body.appendChild(message);

    // 3초 후 자동 제거
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
            message.remove();
            overlay.remove();
        }, 300);
    }, 3000);

    // 클릭시 제거
    overlay.addEventListener('click', () => {
        message.remove();
        overlay.remove();
    });
}

// ==================== 스크롤 애니메이션 스타일 추가 ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -40%);
        }
    }

    .success-content {
        color: #333;
    }

    .success-icon {
        display: inline-block;
        width: 60px;
        height: 60px;
        background-color: #FF9F45;
        color: white;
        border-radius: 50%;
        font-size: 36px;
        line-height: 60px;
        margin-bottom: 20px;
    }

    .success-content p {
        font-size: 18px;
        font-weight: 600;
        margin: 10px 0;
    }

    .success-sub {
        font-size: 14px !important;
        font-weight: 400 !important;
        color: #999;
    }

    .success-overlay {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// ==================== 페이지 로드 완료 후 추가 효과 ====================
window.addEventListener('load', function() {
    // 로딩 후 Hero 섹션에 페이드인 효과
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease';
            heroContent.style.opacity = '1';
        }, 100);
    }
});

// ==================== 활성 네비게이션 링크 표시 ====================
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
            link.style.color = '#FF9F45';
        } else {
            link.style.color = '';
        }
    });
});

// ==================== 이미지 레이지 로딩 ====================
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// ==================== 반응형 테이블 스크롤 힌트 ====================
window.addEventListener('resize', function() {
    // 화면 크기 변경 시 AOS 리프레시
    AOS.refresh();
});

// ==================== 디버그용 콘솔 메시지 ====================
console.log('%c모이소 B2B 납품제안서 랜딩페이지', 'font-size: 20px; color: #FF9F45; font-weight: bold;');
console.log('%c제작: Claude Code MVP', 'font-size: 12px; color: #4A90E2;');
console.log('문의: 010-6701-4122 | 카카오톡: sssongwww');
