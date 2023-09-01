import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

function Login(): JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const handleLogin = async () => {
        try {
            // CSRF cookieを取得
            await axios.get(`${apiUrl}/sanctum/csrf-cookie`, {
                withCredentials: true
            });

            // ログインリクエストを送信
            const response = await axios.post(`${apiUrl}/api/login`, {
                email,
                password
            }, {
                withCredentials: true
            });
            console.log(response.data);

            // ログインが成功した場合、トップページにリダイレクト
            if (response.data.message === "Login successful") {
                router.push('/');
            }

        } catch (error) {
            console.error("Login error", error);
        }
    };


    return (
        <div>
            <div>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default Login;
