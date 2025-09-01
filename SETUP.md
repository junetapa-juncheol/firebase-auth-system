# 🔧 Firebase Authentication System 설정 가이드

이 가이드는 Firebase Authentication System을 실제로 작동시키기 위한 단계별 설정 방법을 제공합니다.

## 📋 사전 요구사항

- Google 계정 (Firebase Console 접근용)
- 웹 브라우저
- 간단한 웹 서버 (로컬 개발용)

## 🚀 1단계: Firebase 프로젝트 생성

### 1.1 Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. Google 계정으로 로그인

### 1.2 새 프로젝트 생성
1. "프로젝트 만들기" 클릭
2. 프로젝트 이름 입력 (예: `my-auth-system`)
3. Google 애널리틱스는 선택사항 (학습용이므로 비활성화 가능)
4. "프로젝트 만들기" 클릭

## 🔐 2단계: Authentication 설정

### 2.1 Authentication 활성화
1. 좌측 메뉴에서 "Authentication" 클릭
2. "시작하기" 클릭

### 2.2 로그인 방법 설정
1. "Sign-in method" 탭 클릭
2. 다음 제공업체들을 활성화:

#### 이메일/비밀번호
- "이메일/비밀번호" 클릭
- "사용 설정" 토글 ON
- "저장" 클릭

#### Google
- "Google" 클릭  
- "사용 설정" 토글 ON
- 프로젝트 지원 이메일 선택
- "저장" 클릭

#### GitHub
- "GitHub" 클릭
- "사용 설정" 토글 ON
- [GitHub Developer Settings](https://github.com/settings/developers)에서 OAuth App 생성:
  - Application name: `Firebase Auth Test`
  - Homepage URL: `http://localhost:8000`
  - Authorization callback URL: `https://your-project-id.firebaseapp.com/__/auth/handler`
- GitHub에서 Client ID와 Client Secret 복사
- Firebase에 입력 후 "저장"

## 🌐 3단계: 웹 앱 등록

### 3.1 앱 추가
1. 프로젝트 개요 화면에서 웹 아이콘 `</>` 클릭
2. 앱 닉네임 입력 (예: `Auth System Web`)
3. Firebase Hosting은 선택사항
4. "앱 등록" 클릭

### 3.2 Firebase SDK 구성
화면에 표시된 구성 객체를 복사하세요:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## ⚙️ 4단계: 프로젝트 설정

### 4.1 Firebase 설정 업데이트
`js/firebase/firebase-init.js` 파일을 열어 다음 부분을 수정:

```javascript
// 이 부분을 Firebase Console에서 복사한 설정으로 교체
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",           // ← 실제 API 키로 교체
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // ← 실제 도메인으로 교체
  projectId: "YOUR_PROJECT_ID",         // ← 실제 프로젝트 ID로 교체
  storageBucket: "YOUR_PROJECT_ID.appspot.com",   // ← 실제 스토리지로 교체
  messagingSenderId: "YOUR_SENDER_ID",  // ← 실제 Sender ID로 교체
  appId: "YOUR_APP_ID",                 // ← 실제 App ID로 교체
  measurementId: "YOUR_MEASUREMENT_ID"  // ← 애널리틱스 사용시에만
};
```

### 4.2 승인된 도메인 설정 (선택사항)
Firebase Console > Authentication > Settings > 승인된 도메인에서:
- `localhost` (개발용)
- 실제 배포할 도메인 추가

## 🖥️ 5단계: 로컬 서버 실행

ES6 모듈 사용으로 인해 로컬 웹 서버가 필요합니다:

### 옵션 1: Python 서버
```bash
# Python 3가 설치된 경우
cd firebase-auth
python -m http.server 8000
```

### 옵션 2: Node.js http-server
```bash
# Node.js가 설치된 경우
npx http-server firebase-auth -p 8000
```

### 옵션 3: VS Code Live Server
1. VS Code에서 "Live Server" 확장 설치
2. `index.html` 파일 우클릭
3. "Open with Live Server" 선택

## 🧪 6단계: 테스트

### 6.1 브라우저에서 확인
`http://localhost:8000`에 접속하여:

1. **메인 페이지** 로딩 확인
2. **회원가입** 테스트:
   - 새 이메일로 회원가입
   - 이메일 인증 확인
3. **로그인** 테스트:
   - 방금 만든 계정으로 로그인
   - 대시보드 접근 확인
4. **소셜 로그인** 테스트:
   - Google 로그인 확인
   - GitHub 로그인 확인
5. **기타 기능** 테스트:
   - 프로필 페이지 확인
   - 비밀번호 재설정 테스트
   - 로그아웃 및 회원탈퇴

### 6.2 브라우저 콘솔 확인
개발자 도구(F12)의 Console 탭에서 오류 메시지 확인

## ❗ 문제 해결

### 자주 발생하는 오류들

#### 1. "Firebase configuration error"
- `firebase-init.js`의 설정값이 올바른지 확인
- API 키에 특수문자나 공백이 없는지 확인

#### 2. "This domain is not authorized"
- Firebase Console > Authentication > Settings > 승인된 도메인에 `localhost` 추가

#### 3. "CORS 오류" 또는 모듈 로딩 실패
- 반드시 웹 서버를 통해 접근 (file:// 프로토콜 사용 금지)
- 브라우저의 CORS 정책으로 인해 로컬 파일 직접 열기 불가

#### 4. Google 로그인 실패
- Firebase Console에서 Google 로그인이 활성화되었는지 확인
- 프로젝트 지원 이메일이 설정되었는지 확인

#### 5. GitHub 로그인 실패
- GitHub OAuth App 설정 확인
- Callback URL이 정확한지 확인: `https://your-project-id.firebaseapp.com/__/auth/handler`

## 🚀 배포 준비

### Netlify 배포
1. GitHub에 프로젝트 푸시
2. [Netlify](https://netlify.com)에서 GitHub 저장소 연결
3. 빌드 설정 없음 (정적 사이트)
4. 배포 후 Firebase Console에서 승인된 도메인에 Netlify 도메인 추가

### Firebase Hosting 배포
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📞 도움이 필요한 경우

1. **Firebase 문서**: [https://firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)
2. **프로젝트 README**: `README.md` 파일 참조
3. **브라우저 콘솔**: 자세한 오류 정보 확인
4. **Firebase Console**: 사용자 생성 및 로그인 시도 확인

---

✅ **설정이 완료되면 모든 기능이 정상적으로 작동할 것입니다!**