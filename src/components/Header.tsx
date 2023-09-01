import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/header.module.scss';
import { MdMenu, MdClose } from 'react-icons/md';
import { PiUserCircle } from 'react-icons/pi';

function Header(): JSX.Element {
     // *** ログイン設定する時にコメントアウト解除 ***
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // ログイン設定する時にコメントアウト
    const [leftMenuOpen, setLeftMenuOpen] = useState<boolean>(false);
    const [rightMenuOpen, setRightMenuOpen] = useState<boolean>(false);
    const router = useRouter();

    // *** ログイン設定する時にコメントアウト解除 ***
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/check-auth`, {
                    withCredentials: true
                });
                console.log("Auth check response:", response.data);
                if (response.data && response.data.hasOwnProperty("isLoggedIn")) {
                    setIsLoggedIn(response.data.isLoggedIn);
                } else {
                    console.error("Unexpected API response format");
                }
            } catch (error) {
                console.error("Auth check error", error);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${apiUrl}/auth/user/logout`, {}, {
                withCredentials: true
            });
            setIsLoggedIn(false);
            router.push('/'); // ログアウト後、トップページにリダイレクト
        } catch (error) {
            console.error("Logout error", error);
        }
    };


    const toggleLeftMenu = () => {
        setLeftMenuOpen(prevState => !prevState);
    };

    const toggleRightMenu = () => {
        setRightMenuOpen(prevState => !prevState);
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
                                <li onClick={() => router.push('/event/management')}>イベントを管理する</li>
                                <li onClick={() => router.push('/event/list')}>イベントを閲覧する</li>
                                <li onClick={() => router.push('/article/management')}>記事を管理する</li>
                                <li onClick={() => router.push('/article/list')}>記事を閲覧する</li>
                            </>
                        ) : (
                            <>
                                <li onClick={() => router.push('/event/list')}>イベントを閲覧する</li>
                                <li onClick={() => router.push('/article/list')}>記事を閲覧する</li>
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
                                <li onClick={() => router.push('/profile')}>プロフィール</li>
                            </>
                        ) : (
                            <>
                                <li onClick={() => router.push('/login')}>ログイン</li>
                                <li onClick={() => router.push('/register')}>新規登録</li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Header;