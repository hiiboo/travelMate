import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

function Register(): JSX.Element {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchCsrfToken = async () => {
        try {
            await axios.get(`${apiUrl}/sanctum/csrf-cookie`);
        } catch (error) {
            console.error("Error fetching CSRF token", error);
        }
    };


    const handleRegister = async () => {
        try {
            // CSRFトークンを取得
            await fetchCsrfToken();
            const response = await axios.post(`${apiUrl}/auth/organizer/register`, {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            }, {
                withCredentials: true
            });
            console.log(response);
            // 登録が成功したら、トップページにリダイレクト
            if (response.data.message === "User registered successfully!") {
                router.push('/');
            } else {
                // 例えば、Laravelからのエラーメッセージを表示する
                console.error("Registration error", response.data.message);
            }
        } catch (error) {
            console.error("Registration error", error);
        }
    };

    return (
        <div>
            <div>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <input type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} placeholder="Confirm Password" />
                <button onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
}

export default Register;
