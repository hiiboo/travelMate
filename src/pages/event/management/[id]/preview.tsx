import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../../styles/eventContents.module.scss';
import axios from 'axios';
import { MdArrowBack, MdOutlineInsertComment, MdOutlineDateRange, MdOutlineLocationOn } from 'react-icons/md';
import { formatDateToCustom } from '../../../../utils/formatDateToCustom';
import { useTranslation } from 'react-i18next';  // 追加
import i18n from '../../../../langages/i18nConfig';  // 追加

function EventManagementPreview() {
    const { t } = useTranslation();  // 追加: 翻訳関数の取得
    const router = useRouter();
    const { id } = router.query;
    const [eventData, setEventData] = useState<any>(null);
    const [embedMapUrl, setEmbedMapUrl] = useState<string | null>(null);
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;  // APIのURL
    const [language, setLanguage] = useState<string>('ja');  // 追加: 言語の状態


    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/events/${id}`);
                setEventData(response.data);
            } catch (error) {
                console.error("Error fetching event data", error);
            }
        };

        fetchEventData();

        const fetchLanguageSetting = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/language-setting`, {
                    withCredentials: true
                });
                setLanguage(response.data.language);
                i18n.changeLanguage(response.data.language);  // 言語の切り替え
            } catch (error) {
                console.error("Error fetching language setting", error);
            }
        };

        fetchLanguageSetting();  // 言語設定の取得

    }, [id]);

    const [otherEvents, setOtherEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchOtherEvents = async () => {
            try {
                const response = await axios.get('/api/get-public-events');
                setOtherEvents(response.data);
            } catch (error) {
                console.error("Error fetching other events", error);
            }
        };

        fetchOtherEvents();
    }, []);

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

    // ここでeventDataがまだ取得されていなければnullを返すか、ローディング表示を追加できます。
    if (!eventData) return null;

    // calendarUrl の変数を更新
    const calendarUrl = eventData ?
    `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventData.title}&dates=${formatDateToCustom(eventData?.start_date_time)}/${formatDateToCustom(eventData?.end_date_time)}&location=${eventData.location}&sf=true&output=xml`
        : '';

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const getPartialDescription = (description: string): string => {
        if (description.length <= 100) return description;
        return description.substr(0, 100) + '...';
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <MdArrowBack onClick={() => router.push(`/event/management/${id}/`)} />
                <h2>{t('preview')}</h2>
            </header>
            <main className={styles.main}>
                <img src={eventData?.event_image_path} alt={t('eventImageAlt')} className={styles.eventImage} />
                <div onClick={() => alert(t('inDevelopment'))} className={styles.commentCount}>
                    <MdOutlineInsertComment /> {t('zeroComments')}
                </div>

                <h1 className={styles.title}>{eventData?.title}</h1>

                <div className={styles.organizerInfo}>
                    <img src="/image/user.jpeg" alt={t('organizerIconAlt')} />
                    <span className='bold'>{t('user01')}</span>
                </div>

                <div className={styles.infoCardContainer}>
                    <div onClick={() => window.open(calendarUrl, '_blank')} className={styles.infoCard}>
                        <MdOutlineDateRange /> {formatDateToCustom(eventData?.start_date_time)} - {formatDateToCustom(eventData?.end_date_time)}
                    </div>

                    <div onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData?.location + ' ' + eventData?.address)}`, '_blank')} className={styles.infoCard}>
                        <MdOutlineLocationOn /> {eventData?.location} - {eventData?.address}
                    </div>
                </div>

                <div onClick={() => alert(t('inDevelopment'))} className={styles.chatCard}>
                    {t('eventChat')}
                </div>
                <div className={styles.articlePreviewContainer}>
                    <h2>{t('relatedArticles')}</h2>
                    <div className={styles.articlePreview} onClick={() => alert(t('inDevelopment'))}>
                        <img src="/image/article.jpeg" alt={t('articleThumbnailAlt')} />
                        <span>{t('sampleArticleText')}</span>
                    </div>
                </div>

                <div className={styles.descriptionContainer}>
                    <h2>{t('eventDescription')}</h2>
                    <p className={styles.description}>
                        {showFullDescription ? eventData?.description : getPartialDescription(eventData?.description || '')}
                    </p>
                    {eventData?.description && (
                        <button onClick={toggleDescription} className={styles.showFullDescription}>
                            {showFullDescription ? t('close') : t('viewMore')}
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

                <section className={styles.otherEvents}>
                    {otherEvents.map((event) => (
                        <div key={event.id} className={styles.eventCard}>
                            <img src={event.event_image_path} alt={t('eventImageAlt')} />
                            <h3>{event.title}</h3>
                            <p>{event.location}</p>
                            <p>{event.start_date_time} - {event.end_date_time}</p>
                        </div>
                    ))}
                </section>
            </main>
            <footer className={styles.footer}>
                <p>{t('participationFee')}</p>
                <button className='bold' onClick={() => alert(t('inDevelopment'))}>{t('participate')}</button>
            </footer>
        </div>
    );
}

export default EventManagementPreview;
