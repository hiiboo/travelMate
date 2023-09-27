import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/header.module.scss';
import UserMenu from './UserMenu';
import HamburgerMenu from './HamburgerMenu';
import Image from "next/image"
import Link from 'next/link';
import { useAuth } from './AuthContext'
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/shadcnui/menubar"
import {Spacer} from "@nextui-org/react";


interface HeaderProps {
    isLoggedIn: boolean;
    userData?: any;
}

function Header({ isLoggedIn, userData }: HeaderProps): JSX.Element {
    const { checkAuth } = useAuth();
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // ログアウト関数内の一部を変更
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${apiUrl}/auth/organizer/logout`, {}, {
                withCredentials: true
            });
            if (response.status === 200 && response.data.message === "Logout successful") {
                localStorage.removeItem('organizer_token');
                alert('Logout successful');
                await checkAuth();
                console.log("Logout successful", response);

                // ログアウト後に再度ログイン状態をチェック
                checkAuth();
            } else {
                alert('Logout failed');
                console.error("Logout failed", response);
            }
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return (
        <div>
            <Menubar className={styles.header}>
                <MenubarMenu>
                    <MenubarTrigger style={{ padding:0 }}>
                        <Link href="/">
                            <div className={styles.logoContainer}>
                                <div className={styles.logoBox}>
                                    <Image
                                        src="/logo_3.png"
                                        alt="Logo"
                                        objectFit="contain"
                                        className={styles.logo}
                                        onClick={() => router.push('/')}
                                        height={175}
                                        width={754}
                                    />
                                </div>
                                <p className={styles.logoText}>For Guide</p>
                            </div>
                        </Link>
                    </MenubarTrigger>
                </MenubarMenu>
                <Spacer x={16} />
                <MenubarMenu>
                    <UserMenu
                        isLoggedIn={isLoggedIn}
                    />
                </MenubarMenu>
                <MenubarMenu>
                    <HamburgerMenu
                        isLoggedIn={isLoggedIn}
                        handleLogout={handleLogout}
                    />
                </MenubarMenu>
            </Menubar>
        </div>
    );
}

export default Header;