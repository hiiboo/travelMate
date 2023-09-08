import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../../../../styles/eventManagementById.module.scss';
import { MdArrowBack } from 'react-icons/md';
import { uploadImage } from '../../../../utils/uploadImage';  // あなたのUploadImage.tsxのパスを適切に設定してください

function EventManagementThumbnail() {
    const [ThumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchEventThumbnail = async () => {
            try {
                const response = await axios.get(`/api/get-event-thumbnail-url`, {
                    withCredentials: true
                });
                setThumbnailUrl(response.data.url);
            } catch (error) {
                console.error("Error fetching event thumbnail URL", error);
            }
        };

        fetchEventThumbnail();
    }, []);

    const onThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            const objectUrl = URL.createObjectURL(uploadedFile);
            setThumbnailUrl(objectUrl);  // プレビュー用URL
        }
    };

    const saveEventThumbnail = async (url: string) => {
        try {
            await axios.patch(`/api/save-event-thumbnail-url`, { thumbnail_url: url }, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Error saving event thumbnail URL", error);
        }
    };

    useEffect(() => {
        if (file) {
            (async () => {
                const response = await uploadImage(file);
                if (response?.path) {
                    setThumbnailUrl(response.path);
                    saveEventThumbnail(response.path);  // サムネイルのURLをバックエンドに保存
                }
            })();
        }
    }, [file]);

    return (
        <div>
            <header className={styles.header}>
                <MdArrowBack onClick={() => router.push('/event/management/${id}/')} />
                <h2>イベントの画像</h2>
            </header>
            <main className={styles.main}>
                <img src={ThumbnailUrl || '/path-to-default-thumbnail.jpg'} alt="Event Thumbnail" />
                <input type="file" onChange={onThumbnailChange} />
            </main>
            <footer className={styles.footer}>
                <button className='bold' onClick={() => router.push('/event/management/${id}/')}>戻る（自動保存）</button>
            </footer>
        </div>
    );
}

export default EventManagementThumbnail;
