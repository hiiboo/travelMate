import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../styles/profile.module.scss';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import ReactStarsRating from 'react-awesome-stars-rating';
import { utils } from '../utils/utils';
import { image } from '@nextui-org/react';

// <-- ---------- interface ---------- -->

interface PageProps {
  isLoggedIn: boolean;
  userData?: any;
  GuestData?: any;
}

function GuestProfile({ isLoggedIn, userData, GuestData }: PageProps): JSX.Element | null {

// <-- ---------- 定数の定義 ---------- -->



// <-- ---------- 関数の定義 ---------- -->



// <-- ---------- 表示 ---------- -->

  return (
    <>
      <div className={styles.iconContainer}>
        <span className={styles.iconBox}>
          {GuestData && <Image
            src={GuestData.profile_image ? GuestData.profile_image : '/image/user.jpeg'}
            alt="icon"
            layout="fill"
            objectFit="cover"
            className={styles.icon}
          />}
        </span>
      </div>
      <h1>{GuestData ? GuestData.firstName : 'Loading...'} {GuestData ? GuestData.lastName : 'Loading...'}</h1>
      {GuestData && <p>{(GuestData.email)}</p>}
      {GuestData && <ReactStarsRating className={styles.stars} value={GuestData.review_rate} />}
      <p><small>{GuestData ? `${GuestData.review_rate}（${GuestData.review_sum} comments）` : 'Loading...'}</small></p>
    </>
  );
}

export default GuestProfile;