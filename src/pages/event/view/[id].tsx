import { useState, useEffect } from 'react';
import styles from '../../../../styles/eventContents.module.scss';
import axios from 'axios';
import { MdOutlineInsertComment, MdOutlineDateRange, MdOutlineLocationOn } from 'react-icons/md';
import { formatDateToCustom } from '../../../utils/formatDateToCustom';
import { useRouter } from 'next/router';

function EventDetails() {
    const [eventData, setEventData] = useState<any>(null);
    const [embedMapUrl, setEmbedMapUrl] = useState<string | null>(null);
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

    const { id } = useRouter().query;

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await axios.get(`/api/events/${id}`);
                setEventData(response.data);
            } catch (error) {
                console.error("Error fetching event data", error);
            }
        };

        fetchEventData();
    }, [id]);

    useEffect(() => {
        const fetchEmbedMapUrl = async () => {
            try {
                const response = await axios.get(`/api/get-embed-map-url/${id}`);
                setEmbedMapUrl(response.data.embedUrl);
            } catch (error) {
                console.error("Error fetching embed map url", error);
            }
        };

        if (eventData) {
            fetchEmbedMapUrl();
        }
    }, [eventData, id]);

    if (!eventData) return null;

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventData.title}&dates=${formatDateToCustom(eventData?.start_date_time)}/${formatDateToCustom(eventData?.end_date_time)}&location=${eventData.location}&sf=true&output=xml`;

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const getPartialDescription = (description: string): string => {
        if (description.length <= 100) return description;
        return description.substr(0, 100) + '...';
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <img src={eventData?.event_image_path} alt="Event Image" className={styles.eventImage} />

                <div onClick={() => alert('開発中です')} className={styles.commentCount}>
                    <MdOutlineInsertComment /> 0件
                </div>

                <h1 className={styles.title}>{eventData?.title}</h1>

                <div className={styles.organizerInfo}>
                    <img src="/image/user.jpeg" alt="Organizer Icon" />
                    <span className='bold'>ユーザー01</span>
                </div>

                <div className={styles.infoCardContainer}>
                    <div onClick={() => window.open(calendarUrl, '_blank')} className={styles.infoCard}>
                        <MdOutlineDateRange /> {formatDateToCustom(eventData?.start_date_time)} - {formatDateToCustom(eventData?.end_date_time)}
                    </div>

                    <div onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData?.location + ' ' + eventData?.address)}`, '_blank')} className={styles.infoCard}>
                        <MdOutlineLocationOn /> {eventData?.location} - {eventData?.address}
                    </div>
                </div>

                <div onClick={() => alert('開発中です')} className={styles.chatCard}>
                    イベントチャット - 参加予定者は利用可能です
                </div>

                <div className={styles.descriptionContainer}>
                    <h2>イベントの説明</h2>
                    <p className={styles.description}>
                        {showFullDescription ? eventData?.description : getPartialDescription(eventData?.description || '')}
                    </p>
                    {eventData?.description && (
                        <button onClick={toggleDescription} className={styles.showFullDescription}>
                            {showFullDescription ? '閉じる' : 'もっと見る'}
                        </button>
                    )}
                </div>

                <div className={styles.embedMap}>
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={embedMapUrl || "about:blank"}
                        allowFullScreen
                    ></iframe>
                </div>
            </main>
            <footer className={styles.footer}>
                <p>参加費: $0</p>
                <button className='bold' onClick={() => alert('開発中です')}>参加する</button>
            </footer>
        </div>
    );
}

export default EventDetails;
