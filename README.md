# 🔥 Firebase Authentication System

Firebase를 활용한 완전한 사용자 인증 시스템입니다. 현대적인 웹 기술을 사용하여 구축되었으며, 실제 프로덕션 환경에서 사용할 수 있는 수준의 기능들을 제공합니다.

## ✨ 주요 기능

### 🔐 인증 기능
- **이메일/비밀번호 인증**: 전통적인 회원가입 및 로그인
- **소셜 로그인**: Google, GitHub OAuth 연동
- **이메일 인증**: 회원가입 시 자동 인증 메일 발송
- **비밀번호 재설정**: 이메일을 통한 안전한 비밀번호 재설정

### 👤 사용자 관리
- **프로필 관리**: 상세한 사용자 정보 표시
- **보안 점수**: 계정 보안 상태 평가
- **계정 삭제**: 안전한 회원 탈퇴 기능
- **실시간 인증 상태**: Firebase의 실시간 인증 상태 감지

### 🎨 사용자 경험
- **반응형 디자인**: 모든 디바이스에서 완벽한 표시
- **다크 모드 준비**: 다크 모드 지원 준비 완료
- **접근성**: WCAG 가이드라인 준수
- **애니메이션**: 부드러운 전환 효과

## 🚀 빠른 시작

### 1. 프로젝트 클론
```bash
git clone https://github.com/junetapa-juncheol/firebase-auth-system.git
cd firebase-auth-system
```

### 2. Firebase 프로젝트 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication 활성화 및 이메일/비밀번호, Google, GitHub 제공업체 설정
3. 웹 앱 등록 후 구성 정보 확인

### 3. Firebase 설정 파일 업데이트
`js/firebase/firebase-init.js` 파일의 설정 정보를 업데이트하세요:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 4. 웹 서버에서 실행
로컬 개발 서버 실행 (ES6 모듈 사용으로 인해 필요):

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 설치 후)
npx http-server -p 8000

# Live Server (VS Code 확장)
# Live Server 확장 설치 후 index.html 우클릭 > "Open with Live Server"
```

브라우저에서 `http://localhost:8000` 접속

## 📁 프로젝트 구조

```
firebase-auth/
├── index.html              # 메인 랜딩 페이지
├── signup.html             # 회원가입 페이지
├── login.html              # 로그인 페이지
├── dashboard.html          # 사용자 대시보드
├── profile.html            # 프로필 관리 페이지
├── reset-password.html     # 비밀번호 재설정 페이지
├── css/
│   └── auth-styles.css     # 커스텀 스타일
├── js/
│   ├── firebase/
│   │   ├── firebase-init.js    # Firebase 초기화
│   │   └── firebase-auth.js    # 인증 기능 모듈
│   ├── signup.js           # 회원가입 로직
│   ├── login.js            # 로그인 로직
│   ├── dashboard.js        # 대시보드 로직
│   ├── profile.js          # 프로필 관리 로직
│   └── reset-password.js   # 비밀번호 재설정 로직
└── README.md               # 프로젝트 문서
```

## 🛠️ 사용된 기술

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **JavaScript ES6+**: 모던 JavaScript (모듈, async/await 등)

### Backend & Services
- **Firebase Authentication**: 사용자 인증 서비스
- **Firebase Hosting**: (선택적) 호스팅 서비스

### 개발 도구
- **ES6 모듈**: 코드 모듈화
- **Font Awesome**: 아이콘 라이브러리
- **Google Fonts**: 웹 폰트

## 🔧 주요 컴포넌트

### 1. 인증 모듈 (`firebase-auth.js`)
```javascript
// 주요 함수들
export const signup = async (email, password, displayName)
export const login = async (email, password)
export const googleLogin = async ()
export const githubLogin = async ()
export const logout = async ()
export const resetPassword = async (email)
export const deleteAccount = async ()
```

### 2. UI 컴포넌트
- 반응형 모달 시스템
- 사용자 드롭다운 메뉴
- 폼 유효성 검사
- 로딩 상태 표시
- 에러 메시지 처리

### 3. 보안 기능
- 이메일 인증 확인
- 재인증 시스템
- 비밀번호 강도 검사
- 세션 관리

## 🎯 사용 방법

### 회원가입 프로세스
1. `signup.html` 페이지에서 사용자 정보 입력
2. Firebase에 계정 생성
3. 자동 이메일 인증 발송
4. 사용자가 이메일 인증 완료
5. 로그인 가능 상태

### 로그인 프로세스
1. `login.html` 페이지에서 로그인 정보 입력
2. Firebase 인증 확인
3. 이메일 인증 상태 확인
4. 대시보드로 리디렉션

### 소셜 로그인
- Google 또는 GitHub 버튼 클릭
- OAuth 팝업 창 표시
- 사용자 승인 후 자동 로그인
- 즉시 대시보드 접근 가능

## 🔒 보안 고려사항

### 구현된 보안 기능
- ✅ 이메일 인증 필수
- ✅ 강력한 비밀번호 정책
- ✅ 재인증 시스템
- ✅ 세션 관리
- ✅ XSS 방지
- ✅ CSRF 토큰 (Firebase 자동 처리)

### 추가 권장사항
- 2FA (이중 인증) 구현
- 계정 잠금 정책
- 로그인 시도 제한
- 감사 로그 시스템

## 📱 반응형 디자인

### 지원 화면 크기
- 📱 모바일: 320px~768px
- 📟 태블릿: 768px~1024px
- 🖥️ 데스크톱: 1024px+

### 브라우저 지원
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🚦 테스트

### 수동 테스트 체크리스트
- [ ] 회원가입 완료
- [ ] 이메일 인증 확인
- [ ] 로그인/로그아웃
- [ ] Google 소셜 로그인
- [ ] GitHub 소셜 로그인
- [ ] 비밀번호 재설정
- [ ] 프로필 정보 확인
- [ ] 회원 탈퇴
- [ ] 반응형 디자인 확인

### 테스트 계정
```
이메일: demo@example.com
비밀번호: demo123
```

## 🔄 배포

### Firebase Hosting (권장)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 기타 호스팅 서비스
- Netlify
- Vercel
- GitHub Pages

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📋 TODO

### 계획된 기능
- [ ] 2FA (이중 인증) 구현
- [ ] 다크 모드 완전 지원
- [ ] 프로필 이미지 업로드
- [ ] 계정 설정 페이지
- [ ] 이메일 템플릿 커스터마이징
- [ ] 소셜 로그인 확장 (Facebook, Twitter)

### 개선사항
- [ ] 단위 테스트 추가
- [ ] E2E 테스트 구현
- [ ] 성능 최적화
- [ ] SEO 최적화
- [ ] PWA 기능 추가

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👨‍💻 제작자

**junetapa** - *Firebase Authentication System*
- GitHub: [@junetapa](https://github.com/junetapa)
- 이 프로젝트는 학습 목적으로 제작되었습니다.

## 🙏 감사의 글

- [Firebase](https://firebase.google.com/) - 백엔드 서비스
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Font Awesome](https://fontawesome.com/) - 아이콘 라이브러리

## 📞 연락처

프로젝트에 대한 질문이나 제안사항이 있으시면 GitHub Issues를 통해 언제든 연락해주세요!

---

**⭐ 이 프로젝트가 도움이 되었다면 별표를 눌러주세요!**