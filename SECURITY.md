# 🔒 보안 가이드

## ⚠️ 중요: Firebase 설정 보안

### 🚫 절대 하지 말아야 할 것

1. **실제 API 키를 GitHub에 커밋하지 마세요**
   ```javascript
   // ❌ 잘못된 예시 - 실제 키를 코드에 직접 입력
   const firebaseConfig = {
     apiKey: "AIzaSyEXAMPLE-NOT-A-REAL-KEY-000000000", // 실제 키!
     authDomain: "my-real-project.firebaseapp.com",
     // ...
   };
   ```

2. **개인 이메일이나 계정 정보를 코드에 포함하지 마세요**

3. **Firebase 프로젝트를 공개 저장소에 연결할 때 주의하세요**

### ✅ 안전한 개발 방법

#### 방법 1: 환경 변수 사용
```javascript
// firebase-init.js에서
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // ...
};
```

#### 방법 2: 별도 설정 파일 (.gitignore에 추가)
```javascript
// firebase-config.js (이 파일은 .gitignore에 포함)
export const firebaseConfig = {
  apiKey: "실제_API_키",
  authDomain: "실제_도메인",
  // ...
};
```

```javascript
// firebase-init.js에서
import { firebaseConfig } from './firebase-config.js';
```

#### 방법 3: Firebase Hosting 환경 변수
Firebase Hosting을 사용하는 경우:
```bash
firebase functions:config:set someservice.key="THE API KEY"
```

### 🛡️ Firebase 보안 규칙

Firebase Console > Firestore Database > 규칙에서:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 자신의 데이터에 접근
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 🔐 API 키 제한 설정

Google Cloud Console에서 API 키 제한:
1. [Google Cloud Console](https://console.cloud.google.com/) → API 및 서비스 → 사용자 인증 정보
2. API 키 선택 → 애플리케이션 제한사항 설정:
   - **HTTP 리퍼러**: 특정 도메인만 허용
   - **API 제한사항**: Firebase 관련 API만 허용

### 📝 현재 프로젝트 상태

✅ **이 프로젝트는 안전합니다:**
- 모든 설정값이 플레이스홀더
- 실제 API 키나 개인 정보 없음
- `.gitignore` 파일로 민감한 파일 보호

### 🚀 실제 배포 시 체크리스트

- [ ] Firebase 설정을 환경 변수로 분리
- [ ] API 키에 도메인 제한 설정
- [ ] Firebase 보안 규칙 설정
- [ ] 불필요한 인증 방법 비활성화
- [ ] HTTPS 강제 사용
- [ ] CORS 정책 적절히 설정

### 📞 보안 문제 발견 시

보안 문제를 발견하시면:
1. 즉시 Firebase Console에서 해당 API 키 재생성
2. Git 히스토리에서 민감한 정보 완전 제거
3. 새로운 보안 정책 적용

---

**🔒 보안은 개발의 기본입니다. 항상 신중하게 처리하세요!**
