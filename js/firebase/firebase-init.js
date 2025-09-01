// Firebase SDK 초기화 설정
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase 프로젝트 설정 정보
// ⚠️ 보안 주의: 실제 사용 시에는 환경 변수나 별도 파일로 관리하세요!
// 📖 자세한 설정 방법은 SETUP.md와 SECURITY.md를 참조하세요
const firebaseConfig = {
  // 🔑 Firebase Console에서 발급받은 설정값으로 교체 필요
  apiKey: "YOUR_API_KEY_HERE",                    // 예: "AIzaSyC7K8l9f2h4j6k7m8n9p0q1r2s3t4u5v6w"
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // 예: "my-auth-project.firebaseapp.com"
  projectId: "YOUR_PROJECT_ID",                   // 예: "my-auth-project"
  storageBucket: "YOUR_PROJECT_ID.appspot.com",   // 예: "my-auth-project.appspot.com"
  messagingSenderId: "YOUR_SENDER_ID",            // 예: "123456789012"
  appId: "YOUR_APP_ID",                          // 예: "1:123456789012:web:abcdef123456"
  measurementId: "YOUR_MEASUREMENT_ID"            // 예: "G-ABCDEF1234" (선택사항)
};

// 🚨 보안 체크: 실제 API 키가 들어있는지 확인
if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
  console.warn("⚠️ Firebase 설정이 필요합니다! SETUP.md 파일을 참조하세요.");
  console.warn("🔧 Firebase Console에서 프로젝트를 생성하고 설정값을 업데이트하세요.");
}

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase Auth 서비스 초기화
export const auth = getAuth(app);

// 기본 설정
auth.languageCode = 'ko'; // 한국어 설정

console.log("Firebase 초기화 완료");