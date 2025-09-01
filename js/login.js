import { login, googleLogin, githubLogin } from "./firebase/firebase-auth.js";
import { auth } from "./firebase/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginText = document.getElementById("login-text");
const loginLoading = document.getElementById("login-loading");
const googleLoginBtn = document.getElementById("google-login");
const githubLoginBtn = document.getElementById("github-login");
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");
const demoLoginBtn = document.getElementById("demo-login");

// 메시지 모달 요소들
const messageModal = document.getElementById("message-modal");
const messageIcon = document.getElementById("message-icon");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const closeModal = document.getElementById("close-modal");

// 데모 모달 요소들
const demoModal = document.getElementById("demo-modal");
const closeDemoModal = document.getElementById("close-demo-modal");

// 이미 로그인된 사용자 확인
onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        // 이미 로그인된 사용자는 대시보드로 리디렉션
        window.location.href = "dashboard.html";
    }
});

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

// 데모 모달 열기/닫기
demoLoginBtn.addEventListener("click", () => {
    demoModal.classList.remove("hidden");
});

closeDemoModal.addEventListener("click", () => {
    demoModal.classList.add("hidden");
});

// 로딩 상태 변경 함수
function setLoading(isLoading) {
    if (isLoading) {
        loginButton.disabled = true;
        loginText.textContent = "로그인 중...";
        loginLoading.classList.remove("hidden");
    } else {
        loginButton.disabled = false;
        loginText.textContent = "로그인";
        loginLoading.classList.add("hidden");
    }
}

// 이메일/비밀번호 로그인
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // 입력값 검증
    if (!email) {
        showMessage("error", "입력 오류", "이메일을 입력해주세요.");
        return;
    }

    if (!password) {
        showMessage("error", "입력 오류", "비밀번호를 입력해주세요.");
        return;
    }

    setLoading(true);

    try {
        const user = await login(email, password);
        showMessage(
            "success", 
            "로그인 성공!", 
            `환영합니다, ${user.displayName || user.email}님!`
        );
        
        // 2초 후 대시보드로 이동
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);

    } catch (error) {
        console.error("로그인 실패:", error);
        let errorMessage = "로그인에 실패했습니다. 다시 시도해주세요.";
        
        if (error.message) {
            errorMessage = error.message;
        }
        
        showMessage("error", "로그인 실패", errorMessage);
    } finally {
        setLoading(false);
    }
});

// Google 로그인
googleLoginBtn.addEventListener("click", async () => {
    try {
        const user = await googleLogin();
        showMessage(
            "success", 
            "로그인 성공!", 
            `환영합니다, ${user.displayName}님!`
        );
        
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);
    } catch (error) {
        console.error("Google 로그인 실패:", error);
        showMessage("error", "Google 로그인 실패", error.message);
    }
});

// GitHub 로그인
githubLoginBtn.addEventListener("click", async () => {
    try {
        const user = await githubLogin();
        showMessage(
            "success", 
            "로그인 성공!", 
            `환영합니다, ${user.displayName || user.email}님!`
        );
        
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);
    } catch (error) {
        console.error("GitHub 로그인 실패:", error);
        showMessage("error", "GitHub 로그인 실패", error.message);
    }
});

// Enter 키로 폼 제출
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !loginButton.disabled && !messageModal.classList.contains("hidden") === false) {
        loginForm.dispatchEvent(new Event("submit"));
    }
});

// 모달 외부 클릭시 닫기
messageModal.addEventListener("click", (e) => {
    if (e.target === messageModal) {
        messageModal.classList.add("hidden");
    }
});

demoModal.addEventListener("click", (e) => {
    if (e.target === demoModal) {
        demoModal.classList.add("hidden");
    }
});