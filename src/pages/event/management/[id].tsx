import styles from '../../../styles/eventManagementById.module.scss';
import { MdAddCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import path from 'path';


function EventManagementById() {
    const router = useRouter();
    const { id } = router.query;
    const [eventStatus, setEventStatus] = useState<string | null>(null);

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
        // ここでAPIからイベントの状態を取得する
        // 以下は仮のコードで、実際のAPIエンドポイントや方法に合わせて変更する必要がある
        // const fetchEventStatus = async () => {
        //     try {
        //         const response = await axios.get(`/api/get-event-status/${id}`);
        //         setEventStatus(response.data.status);
        //     } catch (error) {
        //         console.error("Error fetching event status", error);
        //     }
        // };

        // fetchEventStatus();

    // *** API設定する時にコメントアウト ***
        const fetchEventStatus = async () => {
            try {
                const response = await fetch('/events.csv');
                const csvData = await response.text();

                const parsedData = Papa.parse<Event>(csvData, { header: true });
                const event = parsedData.data.find((e: Event) => e.id === id);

                if (event) {
                    setEventStatus(event.status);
                }
            } catch (error) {
                console.error("Error fetching event status", error);
            }
        };

        fetchEventStatus();
    }, [id]);

    const handleButtonAction = (buttonText: string) => {
        switch (buttonText) {
            case '削除':
            // *** API設定する時にコメントアウト解除 ***
                // このeventを削除するAPIを叩く
                // axios.delete(`/api/delete-event/${id}`);
                // break;
            // *** API設定する時にコメントアウト ***
            try {
                    axios.delete(`/api/deleteEvent?id=${id}`);
                    router.push('/event/management/');
                    alert('記事を削除しました');
                } catch (error) {
                    console.error("Error deleting event", error);
                }
                break;
            case 'プレビュー':
                router.push(`/event/management/${id}/preview`);
                break;
            case 'タイトル':
                router.push(`/event/management/${id}/title`);
                break;
            case '日時':
                router.push(`/event/management/${id}/date`);
                break;
            case '場所':
                router.push(`/event/management/${id}/location`);
                break;
            case 'イベントの説明':
                router.push(`/event/management/${id}/description`);
                break;
            case 'EventTopics':
                router.push(`/event/management/${id}/genre`);
                break;
            default:
                alert('開発中です');
                break;
        }
    };

    const handlePublishEvent = () => {
        if (eventStatus === '公開中' || eventStatus === '終了') {
            // 下書きにするAPIを叩く
            // *** API設定する時にコメントアウト解除 ***
            // axios.patch(`/api/update-event-status/${id}`, { status: '下書き' });

            // *** API設定する時にコメントアウト ***
            try {
                axios.patch(`/api/updateEventStatus?id=${id}`, { status: '下書き' });
                setEventStatus('下書き');
                alert('下書きに戻しました');
            } catch (error) {
                console.error("Error updating event status", error);
            }
        } else {
            // 公開にするAPIを叩く
            // *** API設定する時にコメントアウト解除 ***
            // axios.patch(`/api/update-event-status/${id}`, { status: '公開中' });

            // *** API設定する時にコメントアウト ***
            try {
                axios.patch(`/api/updateEventStatus?id=${id}`, { status: '公開中' });
                setEventStatus('公開中');
                router.push('/event/management/${id}/congratulations')
            } catch (error) {
                console.error("Error updating event status", error);
            }
        }
    };

    const handleEndEvent = () => {
        // イベントのstatusを「終了」にするAPIを叩く
        // *** API設定する時にコメントアウト解除 ***
        // axios.patch(`/api/update-event-status/${id}`, { status: '終了' });

        // *** API設定する時にコメントアウト ***
        try {
            axios.patch(`/api/updateEventStatus?id=${id}`, { status: '終了' });
            router.push('/event/management/');
        } catch (error) {
            console.error("Error updating event status", error);
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <h2>イベントを編集</h2>
                <div>
                    {/* 「削除」ボタンにonClickイベントハンドラを追加 */}
                    <button onClick={() => handleButtonAction('削除')}>削除</button>
                    {/* 「プレビュー」ボタンにonClickイベントハンドラを追加 */}
                    <button onClick={() => handleButtonAction('プレビュー')}>プレビュー</button>
                </div>
            </header>
            <main className={styles.main}>
                {['サムネイル画像', 'タイトル', '主催者の追加/変更', '日時', '場所', '記事の登録', 'イベントの説明', 'その他写真の登録', 'イベント参加費', 'EventTopics', '参加人数の上限', 'ゲスト可否/人数上限', '質問機能'].map(buttonText => (
                    <button key={buttonText} onClick={() => handleButtonAction(buttonText)}>
                        {buttonText} <MdAddCircle />
                    </button>
                ))}
            </main>
            <footer className={styles.footer}>
                {/* ボタンのテキストと動作を現在のイベントの状態に基づいて動的に変更 */}
                <button className='bold' onClick={handlePublishEvent}>
                    {eventStatus === '公開中' || eventStatus === '終了' ? '下書きに戻す' : 'イベントを公開する'}
                </button>
                <button className='bold' onClick={handleEndEvent}>イベントを終了にする</button>
                <button className='bold' onClick={() => router.push('/event/management/')}>戻る（自動保存）</button>
            </footer>
        </div>
    );
}

export default EventManagementById;
