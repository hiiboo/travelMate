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

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/register`, {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            // 登録が成功したら、トップページにリダイレクト
            if (response.data.success) {
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
