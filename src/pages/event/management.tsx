import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Papa from 'papaparse';
import Link from 'next/link';
import styles from '../../styles/eventManagement.module.scss';
import { MdOutlineDateRange, MdOutlineLocationOn, MdAddCircleOutline } from 'react-icons/md';

function EventManagement(): JSX.Element {
    type Genre = {
        id: number;
        name: string;
    };

    type Event = {
        id: number;
        event_image_path: string;
        status: string;
        start_date_time: string;
        end_date_time: string;
        location: string;
        title: string;
        genres: Genre[];
    };

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    function formatDateToCustom(dateString: string): string {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    useEffect(() => {
    // *** API設定する時にコメントアウト ***
    const fetchEventsFromCsv = async () => {
        try {
            const eventsResponse = await fetch('/events.csv');
            const eventsCsv = await eventsResponse.text();
            const parsedEvents = Papa.parse(eventsCsv, { header: true, skipEmptyLines: true });

            const genreResponse = await fetch('/genre.csv');
            const genreCsv = await genreResponse.text();
            const parsedGenres = Papa.parse(genreCsv, { header: true, skipEmptyLines: true });

            const eventGenreResponse = await fetch('/eventgenre.csv');
            const eventGenreCsv = await eventGenreResponse.text();
            const parsedEventGenres = Papa.parse(eventGenreCsv, { header: true, skipEmptyLines: true });

            const eventsWithGenres: Event[] = parsedEvents.data.map((event: any) => {
                const eventGenres = parsedEventGenres.data.filter((eg: any) => eg.event_id === event.id);
                const genres = eventGenres.map((eg: any) => parsedGenres.data.find((genre: any) => genre.id === eg.genre_id));
                return {
                    ...event,
                    genres
                };
            });

            setEvents(eventsWithGenres);
        } catch (error) {
            console.error("Error fetching events from CSV", error);
        } finally {
            setLoading(false);
        }
    };

    fetchEventsFromCsv();
    // *** API設定する時にコメントアウト解除 ***
        // const fetchEvents = async () => {
        //     try {
        //         const response = await axios.get(`${apiUrl}/api/events-for-logged-in-user`, {
        //             withCredentials: true
        //         });
        //         setEvents(response.data);
        //     } catch (error) {
        //         console.error("Error fetching events", error);
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // fetchEvents();
    }, []);


    // 新しいイベントを生成するヘルパーメソッド
    // *** API設定する時にコメントアウト ***
    const createNewEvent = (): Event => {
        const newId = events.length ? Math.max(...events.map(event => event.id)) + 1 : 1;
        return {
            id: newId,
            event_image_path: "/image/000001.jpeg", // デフォルトのイメージパス
            status: "下書き",
            start_date_time: new Date().toISOString(),
            end_date_time: new Date().toISOString(),
            location: "tokyo",
            title: "新しいイベントタイトル",
            genres: []
        };
    };

    const handleCreateNewEvent = async () => {
        const newEvent = createNewEvent();
        // 新しいイベントデータをCSV形式の文字列として変換
        // *** API設定する時にコメントアウト ***
        const csvData = [
            newEvent.id,
            newEvent.title,
            1, // organizer_id
            newEvent.location,
            "", // description
            newEvent.event_image_path,
            newEvent.start_date_time,
            newEvent.end_date_time,
            newEvent.status,
            new Date().toISOString(), // created_at
            new Date().toISOString() // updated_at
          ].join(",");

        try {
            const response = await fetch('/api/saveEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: csvData,
            });

            if (response.ok) {
                // イベントリストの状態を更新して新しいイベントを追加
                setEvents(prevEvents => [...prevEvents, newEvent]);
                // 新しいイベントのページにリダイレクト
                router.push(`/event/management/${newEvent.id}`);
            } else {
                console.error('Failed to save event to CSV.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    // *** API設定する時にコメントアウト解除 ***
        // 以下のコードはブラウザの制限で実際には動作しませんが、
        // バックエンドAPIが利用可能な場合の例としてコメントアウトしています。
        /*
        try {
            const response = await axios.post(`${apiUrl}/api/create-event`, newEvent, {
                withCredentials: true
            });
            if (response.status === 200) {
                router.push(`/management/${newEvent.id}`);
            }
        } catch (error) {
            console.error("Error creating new event", error);
        }
        */
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    function getStatusClass(status: string): string {
        switch (status) {
            case '公開中':
                return 'published';
            case '下書き':
                return 'draft';
            case '終了':
                return 'ended';
            default:
                return '';
        }
    }

    return (
        <div>
            <ul>
                <li className={styles.listItem} onClick={handleCreateNewEvent}>
                    <h2 className={styles.eventCreate}><MdAddCircleOutline />記事を新規作成する</h2>
                </li>
                {events.map(event => (
                    <Link href={`management/${event.id}`}>
                        <li key={event.id} className={styles.listItem}>
                            <img src={event.event_image_path} alt="" />
                            <div className={styles.eventDetails}>
                                <div className={styles.eventDetailsHeader}>
                                    <div className={`${styles.status} ${styles[getStatusClass(event.status)]}`}>
                                        <p>{event.status}</p>
                                    </div>
                                    <ul className={styles.genres}>
                                        {event.genres.map(genre => (
                                            <li key={genre.id}>#{genre.name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <h2>{event.title}</h2>
                                <p className={styles.location}><MdOutlineLocationOn />{event.location}</p>
                                <p className={styles.date}><MdOutlineDateRange />{formatDateToCustom(event.start_date_time)} - {formatDateToCustom(event.end_date_time)}</p>
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );

}

export default EventManagement;
