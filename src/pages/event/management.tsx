import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/eventManagement.module.scss';
import { MdOutlineDateRange, MdOutlineLocationOn, MdAddCircleOutline } from 'react-icons/md';
import i18n from '../../langages/i18nConfig';
import { utils } from '../../utils/utils';

function EventManagement(): JSX.Element {
    const { t, router, id, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

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
        name: string;
        address: string;
        created_at: Date | null;
        // updated_at: Date | null;
        genres: Genre[];
    };

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {

        const fetchEvents = async () => {
            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get('/api/my-events');
                console.log('API Response:', response.data);

                const formattedEvents = response.data.data.map((event: any) => ({
                    ...event,
                    start_date: new Date(event.start_date),
                    end_date: new Date(event.end_date),
                }));

                setEvents(formattedEvents);

            } catch (error) {
                console.error("Error fetching events", error);
            }
        };

        const fetchLanguageSetting = async () => {
            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get('/api/language-setting');
                i18n.changeLanguage(response.data.language);
            } catch (error) {
                console.error("Error fetching language setting", error);
            }
        };

        fetchEvents();
        fetchLanguageSetting();

    }, []);

    const handleCreateNewEvent = async () => {
        try {
            const securedAxios = createSecuredAxiosInstance();
            const response = await securedAxios.post('/api/create-event', {
                // 必要に応じて、ここに新しいイベントに関するデータを渡す
            });

            if (response.status === 200) {
                router.push(`/management/${response.data.id}`);
            }
        } catch (error) {
            console.error("Error creating new event", error);
        }
    };

    function getStatusClass(status: string): string {
        switch (status) {
            case 'published':
                return 'published';
            case 'draft':
                return 'draft';
            case 'ended':
                return 'ended';
            default:
                return '';
        }
    }

    return (
        <div>
            <ul>
                <li className={styles.listItem} onClick={handleCreateNewEvent}>
                    <h2 className={styles.eventCreate}><MdAddCircleOutline />{t('createNewEvent')}</h2>
                </li>
                {events.map(event => (
                    <Link href={`management/${event.id}`}>
                        <li key={event.id.toString()} className={styles.listItem}>
                            <img src={event.event_image_path || '/path/to/default/image.jpg'} alt="" />
                            <div className={styles.eventDetails}>
                                <div className={styles.eventDetailsHeader}>
                                    <div className={`${styles.status} ${styles[getStatusClass(event.status)]}`}>
                                        <p>{t(event.status)}</p>
                                    </div>
                                    <ul className={styles.genres}>
                                        {event.genres.map(genre => (
                                            <li key={genre.id}>#{genre.name}</li>
                                        ))}
                                    </ul>
                                </div>
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

export default EventManagement;
