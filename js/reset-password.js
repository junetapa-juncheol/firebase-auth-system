import { resetPassword } from "./firebase/firebase-auth.js";

const resetPasswordForm = document.getElementById("reset-password-form");
const resetPasswordButton = document.getElementById("reset-password-button");
const resetText = document.getElementById("reset-text");
const resetLoading = document.getElementById("reset-loading");
const emailInput = document.getElementById("email");

// 모달 요소들
const messageModal = document.getElementById("message-modal");
const messageIcon = document.getElementById("message-icon");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const closeModal = document.getElementById("close-modal");

const successDetailModal = document.getElementById("success-detail-modal");
const resetEmail = document.getElementById("reset-email");
const closeSuccessModal = document.getElementById("close-success-modal");

// 로딩 상태 변경 함수
function setLoading(isLoading) {
    if (isLoading) {
        resetPasswordButton.disabled = true;
        resetText.textContent = "발송 중...";
        resetLoading.classList.remove("hidden");
    } else {
        resetPasswordButton.disabled = false;
        resetText.textContent = "링크 보내기";
        resetLoading.classList.add("hidden");
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

// 상세 성공 모달 표시
function showSuccessDetail(email) {
    resetEmail.textContent = email;
    successDetailModal.classList.remove("hidden");
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 비밀번호 재설정 폼 제출
resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();

    // 입력값 검증
    if (!email) {
        showMessage("error", "입력 오류", "이메일을 입력해주세요.");
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showMessage("error", "입력 오류", "유효한 이메일 주소를 입력해주세요.");
        emailInput.focus();
        return;
    }

    setLoading(true);

    try {
        await resetPassword(email);
        
        // 폼 리셋
        resetPasswordForm.reset();
        
        // 상세 성공 모달 표시
        setTimeout(() => {
            showSuccessDetail(email);
        }, 500);

    } catch (error) {
        console.error("비밀번호 재설정 실패:", error);
        let errorMessage = "비밀번호 재설정에 실패했습니다. 다시 시도해주세요.";
        
        switch(error.code) {
            case "auth/user-not-found":
                errorMessage = "등록되지 않은 이메일입니다. 이메일 주소를 확인해주세요.";
                break;
            case "auth/invalid-email":
                errorMessage = "유효하지 않은 이메일 주소입니다.";
                break;
            case "auth/too-many-requests":
                errorMessage = "너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.";
                break;
            case "auth/network-request-failed":
                errorMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
                break;
            default:
                if (error.message) {
                    errorMessage = error.message;
                }
        }
        
        showMessage("error", "재설정 실패", errorMessage);
    } finally {
        setLoading(false);
    }
});

// 모달 닫기 이벤트들
closeModal.addEventListener("click", () => {
    messageModal.classList.add("hidden");
});

closeSuccessModal.addEventListener("click", () => {
    successDetailModal.classList.add("hidden");
});

// 모달 외부 클릭시 닫기
messageModal.addEventListener("click", (e) => {
    if (e.target === messageModal) {
        messageModal.classList.add("hidden");
    }
});

successDetailModal.addEventListener("click", (e) => {
    if (e.target === successDetailModal) {
        successDetailModal.classList.add("hidden");
    }
});

// Enter 키로 폼 제출
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !resetPasswordButton.disabled) {
        resetPasswordForm.dispatchEvent(new Event("submit"));
    }
});

// 이메일 입력시 실시간 유효성 검사
emailInput.addEventListener("input", () => {
    const email = emailInput.value.trim();
    
    if (email && !isValidEmail(email)) {
        emailInput.classList.add("border-red-500", "focus:ring-red-500");
        emailInput.classList.remove("border-gray-300", "focus:ring-orange-500");
    } else {
        emailInput.classList.remove("border-red-500", "focus:ring-red-500");
        emailInput.classList.add("border-gray-300", "focus:ring-orange-500");
    }
});

// 페이지 로드시 이메일 입력 포커스
window.addEventListener("load", () => {
    emailInput.focus();
});