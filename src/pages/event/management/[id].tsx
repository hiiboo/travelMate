import styles from '../../../styles/eventManagementById.module.scss';
import { MdAddCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import path from 'path';
import { useTranslation } from 'react-i18next';
import '../../../langages/i18nConfig';  // i18nConfig.tsのパスを正しく指定してください。

function EventManagementById() {
    const { t } = useTranslation();  // 翻訳関数の取得
    const router = useRouter();
    const { id } = router.query;
    const [eventStatus, setEventStatus] = useState<string | null>(null);

    type Genre = {
        id: number;
        name: string;
    };

    type Event = {
        id: bigint;
        title: string;
        description: string;
        status: string;
        event_image_path: string | null;
        organizer_id: bigint;
        start_date: Date;
        end_date: Date;
        start_time: string;
        end_time: string;
        name: string;
        city: string;
        street: string;
        building: string;
        zip_code: string;
        created_at: Date | null;
        updated_at: Date | null;
        genres: Genre[];
    };


    useEffect(() => {
        const fetchEventStatus = async () => {
            try {
                const response = await axios.get(`/api/get-event-status/${id}`);
                setEventStatus(response.data.status);
            } catch (error) {
                console.error("Error fetching event status", error);
            }
        };

        fetchEventStatus();

    }, [id]);

    const handleButtonAction = (actionKey: string) => {
        switch (actionKey) {
            case 'delete':
                try {
                    axios.delete(`/api/deleteEvent?id=${id}`);
                    router.push('/event/management/');
                    alert(t('articleDeleted')); // 翻訳関数を使用
                } catch (error) {
                    console.error("Error deleting event", error);
                }
                break;
            case 'preview':
                router.push(`/event/management/${id}/preview`);
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
            case 'description':
                router.push(`/event/management/${id}/description`);
                break;
            case 'eventTopics':
                router.push(`/event/management/${id}/genre`);
                break;
            default:
                alert(t('underDevelopment')); // 翻訳関数を使用
                break;
        }
    };

    const handlePublishEvent = () => {
        if (eventStatus === 'publish' || eventStatus === 'end') {
            try {
                axios.patch(`/api/update-event-status/${id}`, { status: 'draft' });
                setEventStatus('draft');
                alert('Updating event status.');
            } catch (error) {
                console.error("Error updating event status", error);
            }
        } else {
            try {
                axios.patch(`/api/update-event-status/${id}`, { status: 'publish' });
                setEventStatus('publish');
                router.push('/event/management/${id}/congratulations')
            } catch (error) {
                console.error("Error updating event status", error);
            }
        }
    };

    const handleEndEvent = () => {
        try {
            axios.patch(`/api/update-event-status/${id}`, { status: 'end' });
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
                    <button onClick={() => handleButtonAction('delete')}>{t('delete')}</button>
                    <button onClick={() => handleButtonAction('preview')}>{t('preview')}</button>
                </div>
            </header>
            <main className={styles.main}>
                {[
                    'thumbnail', 'title', 'changeOrganizer', 'dateTime', 'location',
                    'articleRegistration', 'eventDescription', 'otherPhotos',
                    'participationFee', 'eventTopics', 'maxParticipants',
                    'guestLimitation', 'questionFeature'
                ].map(actionKey => (
                    <button key={actionKey} onClick={() => handleButtonAction(actionKey)}>
                        {t(actionKey)} <MdAddCircle />
                    </button>
                ))}
            </main>
            <footer className={styles.footer}>
                <button className='bold' onClick={handlePublishEvent}>
                    {eventStatus === 'publish' || eventStatus === 'end' ? t('draft') : t('publish')}
                </button>
                <button className='bold' onClick={handleEndEvent}>{t('endEvent')}</button>
                <button className='bold' onClick={() => router.push('/event/management/')}>{t('back')}</button>
            </footer>
        </div>
    );
}

export default EventManagementById;