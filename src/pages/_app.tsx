import { useState, useEffect } from 'react';
import axios from 'axios'
import '../styles/globals.scss';
import '../styles/font.scss';
import JapaneseFontAdjustment from '../styles/japaneseFontAdjustment';
import '../styles/japaneseFontAdjustment.scss';
import '../styles/tentative.scss';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../components/AuthContext';
import { Providers } from '../../components/nextui/providers';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { utils } from '../utils/utils';

export default function App({ Component, pageProps }: AppProps) {

// <-- ---------- useState ---------- -->

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userData, setUserData] = useState<any>(null);

// <-- ---------- 定数の定義 ---------- -->

    const { apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- 関数の定義 ---------- -->

    const checkAuth = async () => {
        const storedToken = localStorage.getItem('organizer_token');
        if (storedToken) {
            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get(`/organizer/check-auth`);
                if (response.data && response.data.hasOwnProperty("isLoggedIn")) {
                    setIsLoggedIn(response.data.isLoggedIn);

                    // ログインしている場合、ユーザーの詳細情報をフェッチする
                    if (response.data.isLoggedIn) {
                        const userDetails = await axios.get(`/user/details`, {
                            withCredentials: true
                        });
                        setUserData(userDetails.data); // ユーザーの詳細情報をステートにセット
                    }
                } else {
                    console.error("Unexpected API response format");
                }
            } catch (error) {
                setIsLoggedIn(false);
                setUserData(null); // エラーが発生した場合、userDataをnullにセット
            }
        } else {
            setIsLoggedIn(false);
        }
    };

    const sendLocation = async (latitude: number, longitude: number) => {
        try {
            const securedAxios = createSecuredAxiosInstance();
            securedAxios.post(`/location`, { latitude, longitude });
            console.log('Location sent successfully');
        } catch (error) {
            console.error('Failed to send location', error);
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    sendLocation(latitude, longitude);
                },
                (error) => {
                    console.error('Failed to get location', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser');
        }
    };

// <-- ---------- useEffect ---------- -->

    const router = useRouter();

    useEffect(() => {
        const path = router.asPath;

        // ログインしている場合
        if (isLoggedIn) {
            if (userData.user_type === 'guest') {
                if (path.startsWith('/guide') && !['/guide', '/guide/auth', '/guide/login', '/guide/signup'].includes(path)) {
                    alert('アクセス権限がありません');
                    router.back();
                    return;
                }
                if (path === '/guide') {
                    router.push('/guide/mypage');
                }
            } else if (userData.user_type === 'guide') {
                if (path.startsWith('/guest') && !['/guest', '/guest/guideprofile', '/guest/auth', '/guest/login', '/guest/signup'].includes(path)) {
                    alert('アクセス権限がありません');
                    router.back();
                    return;
                }
                if (path === '/guest') {
                    router.push('/');
                }
            }
        } else {
            // ログインしていない場合
            if (path.startsWith('/guest') && !['/test', '/guest', '/guest/guideprofile', '/guest/auth', '/guest/login', '/guest/signup'].includes(path)) {
                alert('ログインが必要です');
                router.push('/guest/auth');
                return;
            }
            if (path.startsWith('/guide') && !['/test', '/guide', '/guide/auth', '/guide/login', '/guide/signup'].includes(path)) {
                alert('ログインが必要です');
                router.push('/guide/auth');
                return;
            }
            if (path === '/guide') {
                router.push('/guide/auth');
            }
        }

        if (isLoggedIn && userData) {
            const { user_type, lastBookingStatus } = userData;
            let redirectPath = null;

            if (user_type === 'guide') {
                switch (lastBookingStatus) {
                    case 'finished':
                        redirectPath = '/guide/review';
                        break;
                    case 'started':
                        redirectPath = '/guide/timer';
                        break;
                    // 他のcaseについてはリダイレクトなし
                }
            } else if (user_type === 'guest') {
                switch (lastBookingStatus) {
                    case 'started':
                        redirectPath = '/guest/timer';
                        break;
                    case 'accepted':
                        redirectPath = '/guest/reserve-information';
                        break;
                    // 他のcaseについてはリダイレクトなし
                }
            }

            if (redirectPath) {
                router.push(redirectPath);
            }
        }

    }, [isLoggedIn, userData, router]);

    useEffect(() => {
        // 現在のパスを取得
        const currentPath = router.asPath;

        // ログイン中であるかどうかを確認
        if (isLoggedIn) {
            // ログイン中で、/guest/auth、/guide/auth、/guest/login、/guest/signin、/guide/login、/guide/signin のいずれかにアクセスした場合
            if (
                currentPath.startsWith('/guest/auth') ||
                currentPath.startsWith('/guide/auth') ||
                currentPath.startsWith('/guest/login') ||
                currentPath.startsWith('/guest/signup') ||
                currentPath.startsWith('/guide/login') ||
                currentPath.startsWith('/guide/signup')
            ) {
                alert('ログイン中です');
                router.back();
                return;
            }
        } else {
            if (currentPath.startsWith('/guest/login') || currentPath.startsWith('/guest/signup')) {
                router.push({
                    pathname: '/guest/auth',
                    query: { tab: currentPath.includes('login') ? 'login' : 'signup' }
                });
            }

            if (currentPath.startsWith('/guide/login') || currentPath.startsWith('/guide/signup')) {
                router.push({
                    pathname: '/guide/auth',
                    query: { tab: currentPath.includes('login') ? 'login' : 'signup' }
                });
            }
        }
    }, [isLoggedIn]);


    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (isLoggedIn && userData) {
            const { user_type, lastBookingStatus, status } = userData;

            // 条件に合致する場合、位置情報を取得し、APIに送信
            if (user_type === 'guide' && (lastBookingStatus === 'reviewed' || lastBookingStatus === 'cancelled' || lastBookingStatus === null) && status === 'active') {
                getLocation();

                // 5分ごとに位置情報を取得し、APIに送信
                const intervalId = setInterval(getLocation, 5 * 60 * 1000);

                return () => clearInterval(intervalId); // クリーンアップ関数
            }
        }
    }, [isLoggedIn, userData]);

// <-- ---------- 表示 ---------- -->

    return (
        <>
            <Providers>
            <AuthProvider checkAuth={checkAuth}>
                <Header isLoggedIn={isLoggedIn} userData={userData} />
                <JapaneseFontAdjustment />
                <Component {...pageProps} isLoggedIn={isLoggedIn} userData={userData} />
            </AuthProvider>
            </Providers>
        </>
    );
}