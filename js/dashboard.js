import { logout, deleteAccount } from "./firebase/firebase-auth.js";
import { auth } from "./firebase/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// DOM 요소들
const welcomeMessage = document.getElementById("welcome-message");
const userNameNav = document.getElementById("user-name-nav");
const userAvatar = document.getElementById("user-avatar");
const userMenuButton = document.getElementById("user-menu-button");
const userMenu = document.getElementById("user-menu");
const logoutButton = document.getElementById("logout-button");
const logoutLink = document.getElementById("logout-link");
const deleteAccountButton = document.getElementById("delete-account-button");

// 모달 요소들
const confirmModal = document.getElementById("confirm-modal");
const confirmIcon = document.getElementById("confirm-icon");
const confirmTitle = document.getElementById("confirm-title");
const confirmText = document.getElementById("confirm-text");
const confirmCancel = document.getElementById("confirm-cancel");
const confirmOk = document.getElementById("confirm-ok");

const messageModal = document.getElementById("message-modal");
const messageIcon = document.getElementById("message-icon");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const closeMessageModal = document.getElementById("close-message-modal");

let currentUser = null;

// 사용자 인증 상태 확인
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (!user.emailVerified && !user.providerData.some(provider => 
            provider.providerId === 'google.com' || provider.providerId === 'github.com'
        )) {
            // 이메일 인증이 안된 일반 회원
            alert("이메일 인증이 필요합니다. 로그인 페이지로 이동합니다.");
            window.location.href = "login.html";
            return;
        }

        currentUser = user;
        updateUserInfo(user);
    } else {
        // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
        window.location.href = "login.html";
    }
});

// 사용자 정보 업데이트
function updateUserInfo(user) {
    const displayName = user.displayName || user.email.split('@')[0];
    const email = user.email;
    
    // 환영 메시지 업데이트
    welcomeMessage.textContent = `${displayName}님, 환영합니다!`;
    
    // 네비게이션 사용자 이름 업데이트
    userNameNav.textContent = displayName;
    
    // 아바타 업데이트 (Google 프로필 사진이 있다면 사용)
    if (user.photoURL) {
        userAvatar.src = user.photoURL;
    } else {
        userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=white`;
    }
}

// 사용자 메뉴 토글
userMenuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("hidden");
});

// 문서 클릭시 메뉴 닫기
document.addEventListener("click", () => {
    userMenu.classList.add("hidden");
});

// 확인 모달 표시 함수
function showConfirmModal(type, title, text, onConfirm) {
    if (type === "danger") {
        confirmIcon.className = "fas fa-exclamation-triangle text-red-500 text-4xl mb-4";
        confirmOk.className = "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700";
    } else {
        confirmIcon.className = "fas fa-question-circle text-yellow-500 text-4xl mb-4";
        confirmOk.className = "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700";
    }
    
    confirmTitle.textContent = title;
    confirmText.textContent = text;
    confirmModal.classList.remove("hidden");
    
    // 기존 이벤트 리스너 제거
    const newConfirmOk = confirmOk.cloneNode(true);
    confirmOk.parentNode.replaceChild(newConfirmOk, confirmOk);
    
    // 새로운 이벤트 리스너 추가
    newConfirmOk.addEventListener("click", () => {
        confirmModal.classList.add("hidden");
        onConfirm();
    });
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

// 모달 닫기 이벤트들
confirmCancel.addEventListener("click", () => {
    confirmModal.classList.add("hidden");
});

closeMessageModal.addEventListener("click", () => {
    messageModal.classList.add("hidden");
});

// 모달 외부 클릭시 닫기
confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) {
        confirmModal.classList.add("hidden");
    }
});

messageModal.addEventListener("click", (e) => {
    if (e.target === messageModal) {
        messageModal.classList.add("hidden");
    }
});

// 로그아웃 기능
const handleLogout = async () => {
    try {
        await logout();
        // firebase-auth.js에서 이미 페이지 리디렉션을 처리하므로 추가 작업 불필요
    } catch (error) {
        console.error("로그아웃 실패:", error);
        showMessage("error", "로그아웃 실패", "로그아웃 중 오류가 발생했습니다.");
    }
};

// 회원탈퇴 기능
const handleDeleteAccount = async () => {
    try {
        await deleteAccount();
        // firebase-auth.js에서 이미 페이지 리디렉션을 처리하므로 추가 작업 불필요
    } catch (error) {
        console.error("회원탈퇴 실패:", error);
        showMessage("error", "회원탈퇴 실패", error.message || "회원탈퇴 중 오류가 발생했습니다.");
    }
};

// 이벤트 리스너들
logoutButton.addEventListener("click", () => {
    showConfirmModal(
        "normal",
        "로그아웃",
        "정말로 로그아웃 하시겠습니까?",
        handleLogout
    );
});

logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    showConfirmModal(
        "normal",
        "로그아웃",
        "정말로 로그아웃 하시겠습니까?",
        handleLogout
    );
});

deleteAccountButton.addEventListener("click", () => {
    showConfirmModal(
        "danger",
        "회원탈퇴",
        "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
        handleDeleteAccount
    );
});

// 설정 링크 (임시)
document.getElementById("settings-link").addEventListener("click", (e) => {
    e.preventDefault();
    showMessage("info", "개발 중", "설정 기능은 개발 중입니다.");
});