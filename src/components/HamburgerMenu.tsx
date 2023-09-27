import React from 'react';
import { PiUserCircle } from 'react-icons/pi';
import { MdClose } from 'react-icons/md';
import styles from '../styles/header.module.scss';
import Link from 'next/link';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/shadcnui/menubar"

interface HamburgerMenuProps {
    isLoggedIn: boolean;
    handleLogout: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isLoggedIn, handleLogout }) => {
    return (
        <>
            <MenubarTrigger className={styles.hamburger} style={{ padding:0 }}>
                <PiUserCircle size="2rem" />
            </MenubarTrigger>
            <MenubarContent>
                {isLoggedIn ? (
                    <>
                        <MenubarItem onClick={handleLogout}>ログアウト</MenubarItem>
                        <MenubarSeparator />
                        <Link href="/profile">
                            <MenubarItem>プロフィール</MenubarItem>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <MenubarItem>ログイン</MenubarItem>
                        </Link>
                        <MenubarSeparator />
                        <Link href="/register">
                            <MenubarItem>新規登録</MenubarItem>
                        </Link>
                    </>
                )}
            </MenubarContent>
        </>
    );
}

export default HamburgerMenu;
