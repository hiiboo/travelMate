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
            console.log("CSRF cookie set successfully");
            // ログインリクエストを送信
            const response = await axios.post(`${apiUrl}/auth/organizer/login`, {
                email,
                password
            }, {
                withCredentials: true
            });
            console.log(response);
            if (response.status === 200 && response.data.message === "Login successful") {
                // ログイン成功
                localStorage.setItem('organizer_token', response.data.token);  // この行を追加
                router.push('/');
                alert('Login successful');
            } else {
                // ログイン失敗
                alert('Login failed');
                console.error("Login failed", response.data.message);
                router.push('/login');
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
