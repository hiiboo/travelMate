import styles from '../../../styles/eventManagementById.module.scss';
import { MdAddCircle } from 'react-icons/md';
import { useEffect, useState } from 'react';
import i18n from '../../../langages/i18nConfig'; // i18nConfig.tsのパスを正しく指定してください。
import { utils } from '../../../utils/utils';

const ACTION_KEYS = [
    'thumbnail', 'title', 'changeOrganizer', 'dateTime', 'location',
    'articleRegistration', 'eventDescription', 'otherPhotos',
    'participationFee', 'eventTopics', 'maxParticipants',
    'guestLimitation', 'questionFeature'
];

function EventManagementById() {
    const { t, router, id, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
    const [eventStatus, setEventStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventStatus = async () => {
            if (!id) return; // ここでidがundefinedなら処理を止める

            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get(`/api/event-status/${id}`);
                setEventStatus(response.data.data.status);
                console.log('Event status', response.data.data.status);
            } catch (error) {
                console.error("Error fetching event status", error);
            }
        };

        const fetchLanguageSetting = async () => {
            try {
                const securedAxios = createSecuredAxiosInstance();
                const response = await securedAxios.get(`/api/language-setting`);
                i18n.changeLanguage(response.data.language);
            } catch (error) {
                console.error("Error fetching language setting", error);
            }
        };

        fetchEventStatus();
        fetchLanguageSetting();

    }, [id]);

    const handleHeaderAction = async (actionKey: string) => {
        switch (actionKey) {
            case 'delete':
                try {
                    const securedAxios = createSecuredAxiosInstance();
                    await securedAxios.delete(`/api/events/${id}`);
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
        if (eventStatus === 'published' || eventStatus === 'end') {
            try {
                const securedAxios = createSecuredAxiosInstance();
                await securedAxios.patch(`/api/events/${id}`, { status: 'draft' });
                setEventStatus('draft');
                alert('Updating event status.');
            } catch (error) {
                console.error("Error updating event status", error);
            }
        } else {
            try {
                const securedAxios = createSecuredAxiosInstance();
                await securedAxios.patch(`${apiUrl}/api/events/${id}`, { status: 'published' });
                setEventStatus('published');
                router.push(`/event/management/${id}/congratulations`)
            } catch (error) {
                console.error("Error updating event status", error);
            }
        }
    };

    const handleEndEvent = async () => {
        try {
            const securedAxios = createSecuredAxiosInstance();
            await securedAxios.patch(`/api/events/${id}`, { status: 'end' });
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
                    {eventStatus === 'published' || eventStatus === 'end' ? t('returnDraft') : t('publish')}
                </button>
                <button className='bold' onClick={handleEndEvent}>{t('endEvent')}</button>
                <button className='bold' onClick={() => handleFooterAction('back')}>{t('back')}</button>
            </footer>
        </div>
    );
}

export default EventManagementById;