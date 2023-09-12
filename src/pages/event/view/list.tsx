import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import styles from '../../styles/eventList.module.scss'; // モジュールの名前を変更する場合は、ファイル名も変更してください
import { MdOutlineDateRange, MdOutlineLocationOn } from 'react-icons/md';
import { formatDateToCustom } from '../../../utils/formatDateToCustom';

function EventList(): JSX.Element {
    type Genre = {
        id: number;
        name: string;
    };

    type Event = {
        id: bigint;
        title: string;
        status: string;
        event_image_path: string | null;
        start_date: Date;
        end_date: Date;
        name: string;
        address: string;
        created_at: Date | null;
        genres: Genre[];
    };

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    useEffect(() => {

        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/events`, {  // APIのエンドポイントの変更
                    withCredentials: true
                });
                const publishedEvents = response.data.filter((event: Event) => event.status === '公開');
                setEvents(publishedEvents);
            } catch (error) {
                console.error("Error fetching events", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ul>
                {events.sort((a, b) => (new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())) // 新しい順
                    .map(event => (
                        <Link href={`management/${event.id}`} key={event.id.toString()}>
                            <li className={styles.listItem}>
                                <img src={event.event_image_path || '/path/to/default/image.jpg'} alt="" />
                                <div className={styles.eventDetails}>
                                    <ul className={styles.genres}>
                                        {event.genres.map(genre => (
                                            <li key={genre.id}>#{genre.name}</li>
                                        ))}
                                    </ul>
                                    <h2>{event.title}</h2>
                                    <p className={styles.location}><MdOutlineLocationOn />{event.name}{event.address}</p>
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

export default EventList;
