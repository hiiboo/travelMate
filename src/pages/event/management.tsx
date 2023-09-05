import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import styles from '../../styles/eventManagement.module.scss';
import { MdOutlineDateRange, MdOutlineLocationOn, MdAddCircleOutline } from 'react-icons/md';

function EventManagement(): JSX.Element {
    type Genre = {
        id: number;
        name: string;
    };

    type Event = {
        id: bigint;
        title: string;
        // description: string;
        status: string;
        event_image_path: string | null;
        organizer_id: bigint;
        start_date: Date;
        end_date: Date;
        // start_time: string;
        // end_time: string;
        // name: string;
        city: string;
        // street: string;
        // building: string;
        // zip_code: string;
        created_at: Date | null;
        // updated_at: Date | null;
        genres: Genre[];
    };

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

// TODO：utilに設定する
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

        const fetchEvents = async () => {
            try {
// TODO：backendの設定が必要
                const response = await axios.get(`${apiUrl}/api/events-for-logged-in-user`, {
                    withCredentials: true
                });
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleCreateNewEvent = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/create-event`, {
                // 必要に応じて、ここに新しいイベントに関するデータを渡す
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                router.push(`/management/${response.data.id}`); // 作成されたイベントのIDにリダイレクト
            }
        } catch (error) {
            console.error("Error creating new event", error);
        }
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
                        <li key={event.id.toString()} className={styles.listItem}>
                            <img src={event.event_image_path || '/path/to/default/image.jpg'} alt="" />
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
                                <p className={styles.location}><MdOutlineLocationOn />{event.city}</p>
                                <p className={styles.date}>
                                    <MdOutlineDateRange />
                                    {formatDateToCustom(event.start_date.toISOString())} -
                                    {formatDateToCustom(event.end_date.toISOString())}
                                </p>
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );

}

export default EventManagement;
