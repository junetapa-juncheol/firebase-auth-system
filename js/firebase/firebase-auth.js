import { auth } from './firebase-init.js';
import {
    createUserWithEmailAndPassword, // 회원가입
    signInWithEmailAndPassword, // 로그인
    updateProfile, // 프로필 표시 이름
    sendEmailVerification, // 이메일 인증 보내기
    sendPasswordResetEmail, // 비밀번호 재설정 이메일 보내기
    GoogleAuthProvider,
    GithubAuthProvider, 
    signInWithPopup, // 팝업을 이용한 소셜 로그인
    signOut, // 로그아웃 처리
    deleteUser, // 현재 로그인된 사용자 계정 삭제
    reauthenticateWithCredential, // 이메일/비번으로 재인증 처리
    reauthenticateWithPopup, // 소셜로그인 계정 재인증 처리
    EmailAuthProvider, // 이메일/비번 인증용 Provider 생성
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// 회원가입 함수
export const signup = async(email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    // 방금 가입한 사용자의 이름을 Firebase 사용자 정보에 저장
    await updateProfile(userCredential.user, {
        displayName: displayName
    });

    // 사용자의 이메일 주소로 인증 메일 발송
    await sendEmailVerification(userCredential.user);

    return userCredential.user;
};

// 로그인 함수
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // 이메일 인증 확인
        if (!userCredential.user.emailVerified) {
            throw new Error("이메일 인증이 필요합니다. 이메일을 확인해주세요.");
        }

        console.log("로그인 성공: ", userCredential.user);
        return userCredential.user;
    } catch (error) {
        // 에러 처리
        if (error.code === "auth/invalid-credential") {
            throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (error.code === "auth/too-many-requests") {
            throw new Error("너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.");
        } else if(error.code === "auth/wrong-password") {
            throw new Error("비밀번호가 틀렸습니다.");
        } else if(error.code === "auth/user-not-found") {
            throw new Error("등록되지않은 이메일입니다.");
        } else {
            throw error;
        }
    }
};

// 비밀번호 재설정
export const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
};

// 구글 로그인
export const googleLogin = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log("Google 로그인 성공: ", user);
        return user;
    } catch (error) {
        if (error.code === "auth/popup-closed-by-user") {
            throw new Error("로그인 창이 닫혔습니다. 다시 시도해주세요.");
        } else if (error.code === "auth/network-request-failed") {
            throw new Error("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
        } else {
            console.error("Google 로그인 실패: ", error);
            throw new Error("구글 로그인에 실패했습니다. 다시 시도해주세요");
        }
    }
};

// Github 로그인
export const githubLogin = async () => {
    try {
        const provider = new GithubAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log("Github 로그인 성공: ", user);
        return user;
    } catch (error) {
        if (error.code === "auth/popup-closed-by-user") {
            throw new Error("로그인 창이 닫혔습니다. 다시 시도해주세요.");
        } else if (error.code === "auth/network-request-failed") {
            throw new Error("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
        } else {
            console.error("Github 로그인 실패: ", error);
            throw new Error("깃허브 로그인에 실패했습니다. 다시 시도해주세요");
        }
    }
};

// 로그아웃
export const logout = async () => {
    try{
        await signOut(auth);
        console.log('로그아웃 성공');
        alert("성공적으로 로그아웃이 되었습니다.");
        window.location.href = 'login.html';
    } catch (error) {
        console.log('로그아웃 실패 : ', error);
    }
};

// 회원탈퇴 함수
export const deleteAccount = async () => {
    try {
        const user = auth.currentUser;

        if (!user) {
            alert("로그인이 필요합니다");
            return;
        }

        // 소셜 로그인 재인증
        if (user.providerData.some((provider) => provider.providerId == "google.com")) {
            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(user, provider);
            alert("Google 사용자 재인증 성공");
        } else if (user.providerData.some((provider) => provider.providerId == "github.com")) {
            const provider = new GithubAuthProvider();
            await reauthenticateWithPopup(user, provider);
            alert("Github 사용자 재인증 성공");
        } else {
            // 이메일/비밀번호 재인증
            const email = user.email;
            const password = prompt("비밀번호를 입력하세요: ");

            if (!password) {
                alert("비밀번호를 입력해야합니다.");
                return;
            }

            const credential = EmailAuthProvider.credential(email, password);
            await reauthenticateWithCredential(user, credential);
            alert("이메일 사용자 재인증 성공");
        }

        await deleteUser(user);
        alert("계정이 성공적으로 삭제되었습니다.");
        window.location.href = "signup.html";
    } catch (error) {
        if (error.code === "auth/requires-recent-login") {
            alert("최근 인증정보가 필요합니다.");
        } else {
            console.error("계정삭제실패: ", error.message);
            alert("계정을 삭제할 수 없습니다. 다시 시도해주세요");
        }
    }
};