import JapaneseFontAdjustment from '../styles/japaneseFontAdjustment';
import '../styles/japaneseFontAdjustment.scss';
import '../styles/font.scss';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import "ress";
import Header from '../components/Header'; // Headerコンポーネントのインポート

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Header />  {/* Headerコンポーネントのレンダリング */}
            <JapaneseFontAdjustment />
            <Component {...pageProps} />
        </>
    );
}
