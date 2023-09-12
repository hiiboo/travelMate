import styles from '../../../styles/eventManagementById.module.scss';
import { MdAddCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../langages/i18nConfig'; // i18nConfig.tsのパスを正しく指定してください。

const ACTION_KEYS = [
    'thumbnail', 'title', 'changeOrganizer', 'dateTime', 'location',
    'articleRegistration', 'eventDescription', 'otherPhotos',
    'participationFee', 'eventTopics', 'maxParticipants',
    'guestLimitation', 'questionFeature'
];

function EventManagementById() {
    const { t } = useTranslation();  // 翻訳関数の取得
    const router = useRouter();
    const { id } = router.query;
    const [eventStatus, setEventStatus] = useState<string | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [language, setLanguage] = useState<string>('ja');


    useEffect(() => {
        const fetchEventStatus = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/event-status/${id}`, {
                    withCredentials: true
                });
                setEventStatus(response.data.status);
            } catch (error) {
                console.error("Error fetching event status", error);
            }
        };

        fetchEventStatus();

        const fetchLanguageSetting = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/language-setting`, {
                    withCredentials: true
                });
                setLanguage(response.data.language);
                i18n.changeLanguage(response.data.language);
            } catch (error) {
                console.error("Error fetching language setting", error);
            }
        };

        fetchLanguageSetting();

    }, [id]);

    const handleHeaderAction = async (actionKey: string) => {
        switch (actionKey) {
            case 'delete':
                try {
                    await axios.delete(`${apiUrl}/api/events/${id}`, {
                        withCredentials: true
                    });
                    router.push('/event/management/');
                    alert(t('articleDeleted')); // 翻訳関数を使用
                } catch (error) {
                    console.error("Error deleting event", error);
                }
                break;
            case 'preview':
                router.push(`/event/management/${id}/preview`);
                break;
            default:
                alert(t('underDevelopment'));
                break;
        }
    };

    const handleMainAction = (actionKey: string) => {
        switch (actionKey) {
            case 'thumbnail':
                router.push(`/event/management/${id}/thumbnail`);
                break;
            case 'title':
                router.push(`/event/management/${id}/title`);
                break;
            case 'dateTime':
                router.push(`/event/management/${id}/date`);
                break;
            case 'location':
                router.push(`/event/management/${id}/location`);
                break;
            case 'eventDescription':
                router.push(`/event/management/${id}/description`);
                break;
            case 'eventTopics':
                router.push(`/event/management/${id}/genre`);
                break;
            default:
                alert(t('underDevelopment'));
                break;
        }
    };
    const handleFooterAction = (actionKey: string) => {
        switch (actionKey) {
            case 'back':
                router.push('/event/management/');
                break;
            default:
                alert(t('underDevelopment'));
                break;
        }
    };

    const handlePublishEvent = async () => {
        if (eventStatus === 'publish' || eventStatus === 'end') {
            try {
                await axios.patch(`${apiUrl}/api/events/${id}`, { status: 'draft' }, {
                    withCredentials: true
                });
                setEventStatus('draft');
                alert('Updating event status.');
            } catch (error) {
                console.error("Error updating event status", error);
            }
        } else {
            try {
                await axios.patch(`${apiUrl}/api/events/${id}`, { status: 'publish' }, {
                    withCredentials: true
                });
                setEventStatus('publish');
                router.push(`/event/management/${id}/congratulations`)
            } catch (error) {
                console.error("Error updating event status", error);
            }
        }
    };

    const handleEndEvent = async () => {
        try {
            await axios.patch(`${apiUrl}/api/events/${id}`, { status: 'end' }, {
                withCredentials: true
            });
            router.push('/event/management/');
        } catch (error) {
            console.error("Error updating event status", error);
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <h2>{t('editEvent')}</h2>
                <div>
                    <button onClick={() => handleHeaderAction('delete')}>{t('delete')}</button>
                    <button onClick={() => handleHeaderAction('preview')}>{t('preview')}</button>
                </div>
            </header>
            <main className={styles.main}>
                {ACTION_KEYS.map(actionKey => (
                    <button key={actionKey} onClick={() => handleMainAction(actionKey)}>
                        {t(actionKey)} <MdAddCircle />
                    </button>
                ))}
            </main>
            <footer className={styles.footer}>
                <button className='bold' onClick={handlePublishEvent}>
                    {eventStatus === 'publish' || eventStatus === 'end' ? t('returnDraft') : t('publish')}
                </button>
                <button className='bold' onClick={handleEndEvent}>{t('endEvent')}</button>
                <button className='bold' onClick={() => handleFooterAction('back')}>{t('back')}</button>
            </footer>
        </div>
    );
}

export default EventManagementById;