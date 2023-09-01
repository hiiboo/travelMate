import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../../../../styles/eventManagementById.module.scss';
import { MdArrowBack } from 'react-icons/md';
import Papa from 'papaparse';

function EventManagementTitle() {
    const router = useRouter();
    const { id } = router.query;
    const [eventTitle, setEventTitle] = useState<string>('');
    type Event = {
        id: string;
        title: string;
        organizer_id: string;
        location: string;
        description: string;
        event_image_path: string;
        start_date_time: string;
        end_date_time: string;
        status: string;
        created_at: string;
        updated_at: string;
    };

    useEffect(() => {
    // *** API設定する時にコメントアウト解除 ***
        // APIからイベントのタイトルを取得する
        // const fetchEventTitle = async () => {
        //     try {
        //         const response = await axios.get(`/api/get-event-title/${id}`);
        //         setEventTitle(response.data.title);
        //     } catch (error) {
        //         console.error("Error fetching event title", error);
        //     }
        // };

        // fetchEventTitle();

    // *** API設定する時にコメントアウト ***
        // CSVからイベントのタイトルを取得する
        const fetchEventTitle = async () => {
            try {
                const response = await fetch('/events.csv');
                const csvData = await response.text();
                const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
                const event = (parsedData.data as Array<Event>).find(e => e.id === id);
                if (event) {
                    setEventTitle(event.title);
                }
            } catch (error) {
                console.error("Error fetching event title", error);
            }
        };

        fetchEventTitle();
    }, [id]);

    const saveTitle = async () => {
    // *** API設定する時にコメントアウト解除 ***
        // try {
        //     await axios.patch(`/api/update-event-title/${id}`, { title: eventTitle });
        //     alert('タイトルが更新されました');
        // } catch (error) {
        //     console.error("Error updating event title", error);
        // }

    // *** API設定する時にコメントアウト ***
        // 注意: CSVを直接更新するのは推奨されませんが、デモの目的のためにここに含めています。
        try {
            await axios.patch(`/api/updateEventTitle?id=${id}`, { title: eventTitle });
        } catch (error) {
            console.error("Error updating event title", error);
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <MdArrowBack onClick={() => router.push('/event/management/${id}/')} />
                <h2>タイトル</h2>
            </header>
            <main className={styles.main}>
                <div className={styles.inputTitleBox}>
                    <textarea
                        value={eventTitle}
                        onChange={(e) => {
                            setEventTitle(e.target.value);
                            saveTitle();
                        }}
                        className={styles.inputTitle}
                    />
                </div>
            </main>
            <footer className={styles.footer}>
                <button className='bold' onClick={() => router.push('/event/management/${id}/')}>戻る（自動保存）</button>
            </footer>
        </div>
    );
}

export default EventManagementTitle;