import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { useRouter } from 'next/router';

function Home(): JSX.Element {
    const router = useRouter(); // リダイレクトのためのrouterインスタンスを取得
    return (
      <>
        <main>
          <h1>title</h1>
          <p>paragraph</p>
          <h2>title2</h2>
          <p>paragraph2</p>
          <h3>title3</h3>
          <p>paragraph3</p>
          <p>paragraph4</p>
        </main>
      </>
    );
}

export default Home;