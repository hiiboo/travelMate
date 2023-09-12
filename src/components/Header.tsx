import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/header.module.scss';
import { MdMenu, MdClose } from 'react-icons/md';
import { PiUserCircle } from 'react-icons/pi';

function Header(): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [leftMenuOpen, setLeftMenuOpen] = useState<boolean>(false);
    const [rightMenuOpen, setRightMenuOpen] = useState<boolean>(false);
    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const checkAuth = async () => {
            // localStorageからトークンを取得
            const storedToken = localStorage.getItem('organizer_token');
            // トークンが存在すればログイン中とみなす
            if (storedToken) {
                try {
                    const response = await axios.get(`${apiUrl}/organizer/check-auth`, {
                        withCredentials: true
                    });
                    console.log("Auth check response:", response.data);
                    if (response.data && response.data.hasOwnProperty("isLoggedIn")) {
                        setIsLoggedIn(response.data.isLoggedIn);
                        console.log("Logged in", response);
                    } else {
                        console.error("Unexpected API response format");
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                        // 401 Unauthorized（未認証）なので、ユーザーがログアウトしていると解釈
                        setIsLoggedIn(false);
                        console.log("Logged out", error);
                    } else {
                        // 401以外のエラーは予期しないエラーとして取り扱う
                        console.error("Auth check error", error);
                    }
                    return;
                }
            } else {
                // トークンが存在しない場合はログアウトしているとみなす
                setIsLoggedIn(false);
            }
        };
        // ページ読み込み時に認証確認
        checkAuth();

        // ルーティングの変更ごとに認証確認
        const handleRouteChange = () => {
            checkAuth();
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${apiUrl}/auth/organizer/logout`, {}, {
                withCredentials: true
            });
            if (response.status === 200 && response.data.message === "Logout successful") {
                // ログアウト成功
                localStorage.removeItem('organizer_token'); // トークンをlocalStorageから削除
                setIsLoggedIn(false);
                router.push('/'); // ログアウト後、トップページにリダイレクト
                closeAllMenus(); // メニューを閉じる
                alert('Logout successful');
                console.log("Logout successful", response);
            } else {
                // ログアウト失敗
                alert('Logout failed');
                console.error("Logout failed", response);
            }
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const toggleLeftMenu = () => {
        setLeftMenuOpen(prevState => !prevState);
        setRightMenuOpen(false);
    };

    const toggleRightMenu = () => {
        setRightMenuOpen(prevState => !prevState);
        setLeftMenuOpen(false);
    };

    const closeAllMenus = () => {
        setLeftMenuOpen(false);
        setRightMenuOpen(false);
    };

    // メニューを閉じる動作とルーティングを組み合わせた関数
    const handleMenuClick = (route: string) => {
        closeAllMenus();
        router.push(route);
    };

    return (
        <div className={styles.header}>
            <button className={styles.hamburger} onClick={toggleLeftMenu}>
                <MdMenu size="2rem" />
            </button>

            {leftMenuOpen && (
                <div className={styles.menu}>
                    <button className={styles.cancel} onClick={toggleLeftMenu}>
                        <MdClose size="2rem" />
                    </button>
                    <ul>
                        {isLoggedIn ? (
                            <>
                                <li onClick={() => handleMenuClick('/event/management')}>イベントを管理する</li>
                                <li onClick={() => handleMenuClick('/event/list')}>イベントを閲覧する</li>
                                <li onClick={() => handleMenuClick('/article/management')}>記事を管理する</li>
                                <li onClick={() => handleMenuClick('/article/list')}>記事を閲覧する</li>
                            </>
                        ) : (
                            <>
                                <li onClick={() => handleMenuClick('/event/list')}>イベントを閲覧する</li>
                                <li onClick={() => handleMenuClick('/article/list')}>記事を閲覧する</li>
                            </>
                        )}
                    </ul>
                </div>
            )}

            <img className={styles.logo} onClick={() => router.push('/')} src="/logo.png" alt="Logo" />

            <button className={styles.icon} onClick={toggleRightMenu}>
                <PiUserCircle size="2rem" />
            </button>

            {rightMenuOpen && (
                <div className={styles.menu}>
                    <button className={styles.cancel} onClick={toggleRightMenu}>
                        <MdClose size="2rem" />
                    </button>
                    <ul>
                        {isLoggedIn ? (
                            <>
                                <li onClick={handleLogout}>ログアウト</li>
                                <li onClick={() => handleMenuClick('/profile')}>プロフィール</li>
                            </>
                        ) : (
                            <>
                                <li onClick={() => handleMenuClick('/login')}>ログイン</li>
                                <li onClick={() => handleMenuClick('/register')}>新規登録</li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Header;