import { signup, googleLogin, githubLogin } from "./firebase/firebase-auth.js";

const signupForm = document.getElementById("signup-form");
const signupButton = document.getElementById("signup-button");
const signupText = document.getElementById("signup-text");
const signupLoading = document.getElementById("signup-loading");
const googleSignupBtn = document.getElementById("google-signup");
const githubSignupBtn = document.getElementById("github-signup");
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

// 메시지 모달 요소들
const messageModal = document.getElementById("message-modal");
const messageIcon = document.getElementById("message-icon");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const closeModal = document.getElementById("close-modal");

// 비밀번호 보기/숨기기 기능
togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    
    const icon = togglePassword.querySelector("i");
    if (type === "text") {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
});

// 메시지 모달 표시 함수
function showMessage(type, title, text) {
    messageIcon.className = type === "success" 
        ? "fas fa-check-circle text-green-500 text-4xl mb-4"
        : "fas fa-exclamation-circle text-red-500 text-4xl mb-4";
    
    messageTitle.textContent = title;
    messageText.textContent = text;
    messageModal.classList.remove("hidden");
}

// 모달 닫기
closeModal.addEventListener("click", () => {
    messageModal.classList.add("hidden");
});

// 로딩 상태 변경 함수
function setLoading(isLoading) {
    if (isLoading) {
        signupButton.disabled = true;
        signupText.textContent = "가입 중...";
        signupLoading.classList.remove("hidden");
    } else {
        signupButton.disabled = false;
        signupText.textContent = "회원가입";
        signupLoading.classList.add("hidden");
    }
}

// 이메일/비밀번호 회원가입
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const displayName = document.getElementById("displayName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // 입력값 검증
    if (!displayName) {
        showMessage("error", "입력 오류", "사용자 이름을 입력해주세요.");
        return;
    }

    if (!email) {
        showMessage("error", "입력 오류", "이메일을 입력해주세요.");
        return;
    }

    if (password.length < 6) {
        showMessage("error", "입력 오류", "비밀번호는 6자리 이상이어야 합니다.");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("error", "입력 오류", "비밀번호가 일치하지 않습니다.");
        return;
    }

    setLoading(true);

    try {
        await signup(email, password, displayName);
        showMessage(
            "success", 
            "회원가입 성공!", 
            "이메일 인증 링크가 발송되었습니다. 이메일을 확인한 후 로그인해주세요."
        );
        
        // 폼 리셋
        signupForm.reset();
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
            window.location.href = "login.html";
        }, 3000);

    } catch (error) {
        console.error("회원가입 실패:", error);
        let errorMessage = "회원가입에 실패했습니다. 다시 시도해주세요.";
        
        if (error.code === "auth/email-already-in-use") {
            errorMessage = "이미 사용 중인 이메일입니다.";
        } else if (error.code === "auth/invalid-email") {
            errorMessage = "유효하지 않은 이메일 주소입니다.";
        } else if (error.code === "auth/weak-password") {
            errorMessage = "비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.";
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showMessage("error", "회원가입 실패", errorMessage);
    } finally {
        setLoading(false);
    }
});

// Google 로그인
googleSignupBtn.addEventListener("click", async () => {
    try {
        const user = await googleLogin();
        showMessage(
            "success", 
            "가입 성공!", 
            `환영합니다, ${user.displayName}님!`
        );
        
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);
    } catch (error) {
        console.error("Google 회원가입 실패:", error);
        showMessage("error", "Google 가입 실패", error.message);
    }
});

// GitHub 로그인
githubSignupBtn.addEventListener("click", async () => {
    try {
        const user = await githubLogin();
        showMessage(
            "success", 
            "가입 성공!", 
            `환영합니다, ${user.displayName || user.email}님!`
        );
        
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);
    } catch (error) {
        console.error("GitHub 회원가입 실패:", error);
        showMessage("error", "GitHub 가입 실패", error.message);
    }
});

// Enter 키로 폼 제출
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !signupButton.disabled) {
        signupForm.dispatchEvent(new Event("submit"));
    }
});