import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import styles from '../../../../styles/profile.module.scss';
import { utils } from '../../../../utils/utils';
import GuideProfile from '../../../../components/GuideProfile';
import OfferForm from '../../../../components/OfferForm';

// <-- ---------- enum ---------- -->

enum LanguageLevel {
  Beginner,
  Elementary,
  Intermediate,
  UpperIntermediate,
  Advanced,
  Proficiency,
}

enum IsActive {
    active,
    inactive,
}


// <-- ---------- interface ---------- -->

interface PageProps {
  isLoggedIn: boolean;
  userData?: any;
}

interface GuideData {
  id: number;
  profile_image?: string;
  firstname: string;
  lastname: string;
  language_level: LanguageLevel;
  introduction: string;
  birthday: Date;
  status: IsActive;
  hourly_rate: number;
  review_rate: number;
  review_sum: number;
  latitude?: number;
  longitude?: number;
  created_at: Date;
}

function Home({ userData, isLoggedIn }: PageProps): JSX.Element | null {

// <-- ---------- useState ---------- -->
  const [guide, setGuide] = useState<GuideData | null>(null);

// <-- ---------- 定数の定義 ---------- -->

  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  // 原宿駅の緯度経度
  const HARAJUKU_STATION = {
    latitude: 35.6715,
    longitude: 139.7030,
  };

  const testGuideData = {
    id: 1,
    profile_image: '/image/user.jpeg', // テスト用の画像パス
    firstname: 'John',
    lastname: 'Doe',
    language_level: LanguageLevel.Advanced,
    introduction: 'Hello, I am John, a professional guide with a passion for helping people explore new places.',
    birthday: new Date('1990-01-01'),
    occupation: 'Tour Guide',
    status: IsActive.active,
    hourly_rate: 2000,
    review_rate: 4.5,
    review_sum: 10,
    latitude: 35.6720,
    longitude: 139.7040,
    created_at: new Date('2023-01-01'),
  };

// <-- ---------- 関数の定義 ---------- -->

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // 地球の半径（単位：km）
    const R = 6371;


    // 緯度と経度をラジアンに変換
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const deltaLat = (lat2 - lat1) * (Math.PI / 180);
    const deltaLon = (lon2 - lon1) * (Math.PI / 180);

    // ハバーサイン公式
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // 距離（単位：km）
    const distance = R * c;

    return distance;
  }

// <-- ---------- useEffect ---------- -->

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        // テストデータの使用
        setGuide(testGuideData);
      } catch (error) {
        console.error('Failed to fetch guide data', error);
      }
    };

    fetchGuide();
  }, []);

  // <-- ---------- 表示 ---------- -->

  if (!guide) {
    return <div>Loading...</div>; // ローディング表示
  }

  return (
    <>
      <main className={styles.main}>
          <GuideProfile isLoggedIn={isLoggedIn} userData={userData} GuideData={testGuideData} />
          <OfferForm isLoggedIn={isLoggedIn} userData={userData} />
      </main>
    </>
  );
}

export default Home;