import { auth } from "./firebase/firebase-init.js";
import { onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// DOM 요소들
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userUid = document.getElementById("user-uid");
const userCreated = document.getElementById("user-created");
const userLastLogin = document.getElementById("user-last-login");
const emailVerified = document.getElementById("email-verified");
const userAvatar = document.getElementById("user-avatar");
const verificationBadge = document.getElementById("verification-badge");
const providerInfo = document.getElementById("provider-info");
const resendVerificationBtn = document.getElementById("resend-verification");
const refreshInfoBtn = document.getElementById("refresh-info");
const accountAge = document.getElementById("account-age");
const securityScore = document.getElementById("security-score");

// 모달 요소들
const messageModal = document.getElementById("message-modal");
const messageIcon = document.getElementById("message-icon");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const closeMessageModal = document.getElementById("close-message-modal");

let currentUser = null;

// 사용자 인증 상태 확인
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        updateUserProfile(user);
    } else {
        // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
        alert("로그인이 필요합니다.");
        window.location.href = "login.html";
    }
});

// 사용자 프로필 정보 업데이트
function updateUserProfile(user) {
    const displayName = user.displayName || "이름없음";
    const email = user.email;
    
    // 기본 정보 업데이트
    userName.textContent = displayName;
    userEmail.textContent = email;
    userUid.textContent = user.uid;

    // 아바타 업데이트
    if (user.photoURL) {
        userAvatar.src = user.photoURL;
    } else {
        userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=white`;
    }

    // 날짜 포맷팅
    const createdDate = new Date(user.metadata.creationTime);
    userCreated.textContent = createdDate.toLocaleDateString("ko-KR", {
        year: 'numeric',
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const lastLoginDate = new Date(user.metadata.lastSignInTime);
    userLastLogin.textContent = lastLoginDate.toLocaleDateString("ko-KR", {
        year: 'numeric',
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    // 계정 나이 계산
    const accountAgeInDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    accountAge.textContent = accountAgeInDays;

    // 이메일 인증 상태 업데이트
    updateEmailVerificationStatus(user);

    // 로그인 방법 정보 업데이트
    updateProviderInfo(user);

    // 보안 점수 계산
    calculateSecurityScore(user);
}

// 이메일 인증 상태 업데이트
function updateEmailVerificationStatus(user) {
    const isVerified = user.emailVerified;
    const isSocialLogin = user.providerData.some(provider => 
        provider.providerId === 'google.com' || provider.providerId === 'github.com'
    );

    if (isVerified || isSocialLogin) {
        emailVerified.textContent = "인증됨";
        emailVerified.className = "text-green-600 font-semibold";
        verificationBadge.className = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800";
        verificationBadge.innerHTML = '<i class="fas fa-check-circle mr-2"></i>인증 완료';
        resendVerificationBtn.classList.add("hidden");
    } else {
        emailVerified.textContent = "인증 필요";
        emailVerified.className = "text-red-600 font-semibold";
        verificationBadge.className = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800";
        verificationBadge.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>인증 필요';
        resendVerificationBtn.classList.remove("hidden");
    }
}

// 로그인 방법 정보 업데이트
function updateProviderInfo(user) {
    const providers = [];
    
    user.providerData.forEach(provider => {
        let providerName = '';
        let iconClass = '';
        let bgClass = '';
        
        switch(provider.providerId) {
            case 'google.com':
                providerName = 'Google';
                iconClass = 'fab fa-google';
                bgClass = 'bg-red-100 text-red-800';
                break;
            case 'github.com':
                providerName = 'GitHub';
                iconClass = 'fab fa-github';
                bgClass = 'bg-gray-100 text-gray-800';
                break;
            case 'password':
                providerName = '이메일/비밀번호';
                iconClass = 'fas fa-envelope';
                bgClass = 'bg-blue-100 text-blue-800';
                break;
            default:
                providerName = provider.providerId;
                iconClass = 'fas fa-user';
                bgClass = 'bg-gray-100 text-gray-800';
        }
        
        providers.push(`
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgClass}">
                <i class="${iconClass} mr-2"></i>${providerName}
            </span>
        `);
    });
    
    providerInfo.innerHTML = providers.join('');
}

// 보안 점수 계산
function calculateSecurityScore(user) {
    let score = 0;
    
    // 이메일 인증 확인
    if (user.emailVerified || user.providerData.some(p => p.providerId === 'google.com' || p.providerId === 'github.com')) {
        score += 40;
    }
    
    // 소셜 로그인 사용
    if (user.providerData.some(p => p.providerId === 'google.com' || p.providerId === 'github.com')) {
        score += 30;
    }
    
    // 프로필 정보 완성도
    if (user.displayName) score += 15;
    if (user.photoURL) score += 15;
    
    securityScore.textContent = score;
    
    // 점수에 따른 색상 변경
    const scoreElement = document.getElementById("security-score");
    if (score >= 80) {
        scoreElement.className = "text-3xl font-bold text-green-600";
        scoreElement.parentElement.querySelector("p").textContent = "우수함";
    } else if (score >= 60) {
        scoreElement.className = "text-3xl font-bold text-yellow-600";
        scoreElement.parentElement.querySelector("p").textContent = "보통";
    } else {
        scoreElement.className = "text-3xl font-bold text-red-600";
        scoreElement.parentElement.querySelector("p").textContent = "개선 필요";
    }
}

// 메시지 모달 표시 함수
function showMessage(type, title, text) {
    messageIcon.className = type === "success" 
        ? "fas fa-check-circle text-green-500 text-4xl mb-4"
        : "fas fa-exclamation-circle text-red-500 text-4xl mb-4";
    
    messageTitle.textContent = title;
    messageText.textContent = text;
    messageModal.classList.remove("hidden");
}

// 이메일 인증 재발송
resendVerificationBtn.addEventListener("click", async () => {
    try {
        await sendEmailVerification(currentUser);
        showMessage("success", "인증 메일 발송", "인증 메일이 발송되었습니다. 이메일을 확인해주세요.");
    } catch (error) {
        console.error("인증 메일 발송 실패:", error);
        showMessage("error", "발송 실패", "인증 메일 발송에 실패했습니다. 다시 시도해주세요.");
    }
});

// 정보 새로고침
refreshInfoBtn.addEventListener("click", () => {
    if (currentUser) {
        // 사용자 정보 새로고침
        currentUser.reload().then(() => {
            updateUserProfile(currentUser);
            showMessage("success", "새로고침 완료", "프로필 정보가 업데이트되었습니다.");
        }).catch((error) => {
            console.error("정보 새로고침 실패:", error);
            showMessage("error", "새로고침 실패", "정보 새로고침에 실패했습니다.");
        });
    }
});

// 모달 닫기
closeMessageModal.addEventListener("click", () => {
    messageModal.classList.add("hidden");
});

// 모달 외부 클릭시 닫기
messageModal.addEventListener("click", (e) => {
    if (e.target === messageModal) {
        messageModal.classList.add("hidden");
    }
});