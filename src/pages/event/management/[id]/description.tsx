import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../../../../styles/eventManagementById.module.scss';
import { MdArrowBack } from 'react-icons/md';

function EventManagementDescription() {
    const router = useRouter();
    const { id } = router.query;
    const [eventDescription, setEventDescription] = useState<string>('');

    useEffect(() => {
        const fetchEventDescription = async () => {
            try {
                const response = await axios.get(`/api/get-event-description/${id}`, {
                    withCredentials: true
                });
                setEventDescription(response.data.description);
            } catch (error) {
                console.error("Error fetching event description", error);
            }
        };

        fetchEventDescription();
    }, [id]);

    const saveDescription = async () => {
        try {
            await axios.patch(`/api/update-event-description/${id}`, { description: eventDescription }, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Error updating event description", error);
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <MdArrowBack onClick={() => router.push('/event/management/${id}/')} />
                <h2>イベントの説明</h2>
            </header>
            <main className={styles.main}>
                <div className={styles.inputDescriptionBox}>
                    <textarea
                        value={eventDescription}
                        onChange={(e) => {
                            setEventDescription(e.target.value);
                            saveDescription();
                        }}
                        className={styles.inputDescription}
                    />
                </div>
            </main>
            <footer className={styles.footer}>
                <button className='bold' onClick={() => router.push('/event/management/${id}/')}>戻る（自動保存）</button>
            </footer>
        </div>
    );
}

export default EventManagementDescription;