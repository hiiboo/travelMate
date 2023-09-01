import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../../../../styles/eventManagementById.module.scss';
import { MdArrowBack } from 'react-icons/md';

function EventManagementDateTime() {
    const router = useRouter();
    const { id } = router.query;
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        const fetchEventDates = async () => {
            try {
                const response = await axios.get(`/api/get-event-dates/${id}`);
                setStartDate(response.data.start_date_time);
                setEndDate(response.data.end_date_time);
            } catch (error) {
                console.error("Error fetching event dates", error);
            }
        };

        fetchEventDates();
    }, [id]);

    const saveDates = async () => {
        try {
            await axios.patch(`/api/update-event-dates/${id}`, { start_date_time: startDate, end_date_time: endDate });
        } catch (error) {
            console.error("Error updating event dates", error);
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <MdArrowBack onClick={() => router.push('/event/management/${id}/')} />
                <h2>イベントの日時</h2>
            </header>
            <main className={styles.main}>
                <div className={styles.inputDateBox}>
                    <label>開始日時:</label>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            saveDates();
                        }}
                        className={styles.inputDate}
                    />
                </div>
                <div className={styles.inputDateBox}>
                    <label>終了日時:</label>
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            saveDates();
                        }}
                        className={styles.inputDate}
                    />
                </div>
            </main>
            <footer className={styles.footer}>
                <button className='bold' onClick={() => router.push('/event/management/${id}/')}>戻る（自動保存）</button>
            </footer>
        </div>
    );
}

export default EventManagementDateTime;
