import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../../styles/article.module.scss';
import axios from 'axios';
import { MdArrowBack, MdOutlineInsertComment, MdOutlineDateRange, MdOutlineLocationOn } from 'react-icons/md';

function EventManagementPreview() {
    const router = useRouter();
    const { id } = router.query;
    const [eventData, setEventData] = useState<any>(null);
    const [embedMapUrl, setEmbedMapUrl] = useState<string | null>(null);


    useEffect(() => {
    // *** API設定する時にコメントアウト解除 ***
        // const fetchEventData = async () => {
        //     try {
        //         const response = await axios.get(`/api/get-event/${id}`);
        //         setEventData(response.data);
        //     } catch (error) {
        //         console.error("Error fetching event data", error);
        //     }
        // };

        // fetchEventData();

    // *** API設定する時にコメントアウト ***
         // 仮のデータ
        type EventData = {
            [key: string]: {
                id: number;
                title: string;
                organizer_id: number;
                location: string;
                address: string;
                place_id: string;
                description: string;
                event_image_path: string;
                start_date_time: string;
                end_date_time: string;
                status: string;
                created_at: string;
                updated_at: string;
            }
        }
        const mockData: EventData = {
            "1": {
                id: 1,
                title: "Eaaa",
                organizer_id: 1,
                location: "ジーズアカデミー東京",
                address: "日本、〒150-0001 東京都渋谷区神宮前６丁目３５−３ 011 JUNCTION harajuku（JUNCTION space）",
                place_id: "ChIJgejiqZ-MGGARA86nW9tqOTU",
                description: "そこも多年とにかくこのお話し順とともにのの以上から与えたで。とうとう事実が学習社はかつてその反抗ですなけれまでへ云っといるですには融通ならんましたて、まだにも向っでうありん。会をなるありものははなはだ将来をやはりだただ。正しく嘉納さんの講演自分ずいぶん運動を安んずるます学校ある後れどっちか料理でについておろかでしょでないずて、こういう今日も私か順序人格に考えから、嘉納さんののが言葉のその他へ無論ご相違と決するながらあなた国を不招待にしように同時にお推察がありたでて、とうとうあたかも焦燥を釣らですば行くなら事にするたん。けれどもそうしてお背後の立っのはしばらく容易ときめないて、その数がもいるますてって権力にありて行くですです。こんな時兄弟のうちその自分はあなた上がしなかと嘉納さんを云っあった、霧のほかたという小講演んべきませから、文字のところに人で事実までのやり方が始め利くてならけれども、全くの昔のするてこの時をよく聞いんんときですのんて、古いたうてこれからご考なっなものありなけれです。",
                event_image_path: "/image/000001.jpeg",
                start_date_time: "2023/01/01 09:00",
                end_date_time: "2023/01/01 18:00",
                status: "公開中",
                created_at: "2023/01/01 08:00",
                updated_at: "2023/01/01 08:00"
            }
        };
        if (id) {
            const eventIdString = String(id);
            if (mockData.hasOwnProperty(eventIdString)) {
                setEventData(mockData[eventIdString]);
            }
        }
    }, [id]);

    const [otherEvents, setOtherEvents] = useState<any[]>([]);

    useEffect(() => {
    // *** API設定する時にコメントアウト解除 ***
        // const fetchOtherEvents = async () => {
        //     try {
        //         const response = await axios.get('/api/get-public-events');
        //         setOtherEvents(response.data);
        //     } catch (error) {
        //         console.error("Error fetching other events", error);
        //     }
        // };

        // fetchOtherEvents();

    // *** API設定する時にコメントアウト ***
        // 仮のデータを使用
        const mockOtherEvents = [
            {
                id: 2,
                title: "Event Title 2",
                organizer_id: 1,
                location: "ジーズアカデミー",
                address: "日本、〒810-0041 福岡県福岡市中央区大名１丁目３−４１ プリオ大名ビル 1F",
                place_id: "ChIJ3_spCaqRQTURxjZSe7I15dU",
                description: "",
                event_image_path: "/image/000002.jpeg",
                start_date_time: "2023/02/01 09:00",
                end_date_time: "2023/02/01 18:00",
                status: "下書き",
                created_at: "2023/02/01 08:00",
                updated_at: "2023/02/01 08:00"
            },
            {
                id: 3,
                title: "Eaaa",
                organizer_id: 1,
                location: "ジーズアカデミー東京",
                address: "日本、〒150-0001 東京都渋谷区神宮前６丁目３５−３ 011 JUNCTION harajuku（JUNCTION space）",
                place_id: "ChIJgejiqZ-MGGARA86nW9tqOTU",
                description: "",
                event_image_path: "/image/000001.jpeg",
                start_date_time: "2023/01/01 09:00",
                end_date_time: "2023/01/01 18:00",
                status: "公開中",
                created_at: "2023/01/01 08:00",
                updated_at: "2023/01/01 08:00"
            },
            {
                id: 4,
                title: "Event Title 2",
                organizer_id: 1,
                location: "ジーズアカデミー",
                address: "日本、〒810-0041 福岡県福岡市中央区大名１丁目３−４１ プリオ大名ビル 1F",
                place_id: "ChIJ3_spCaqRQTURxjZSe7I15dU",
                description: "",
                event_image_path: "/image/000002.jpeg",
                start_date_time: "2023/02/01 09:00",
                end_date_time: "2023/02/01 18:00",
                status: "下書き",
                created_at: "2023/02/01 08:00",
                updated_at: "2023/02/01 08:00"
            },
        ];
        setOtherEvents(mockOtherEvents);
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

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <MdArrowBack onClick={() => router.push(`/event/management/${id}/`)} />
                <h2>プレビュー</h2>
            </header>
            <main className={styles.main}>
                {/* イベント画像 */}
                <img src="/image/000001.jpeg" alt="Event Image" style={{ width: '100%', height: '16rem', objectFit: 'cover' }} />

                <div onClick={() => alert('開発中です')}>
                    <MdOutlineInsertComment /> 0件
                </div>

                {/* イベントのタイトル */}
                <h1>Event Title</h1>

                {/* 主催者の情報 */}
                <img src="/image/user.jpeg" alt="Organizer Icon" style={{ width: '4rem', height: '4rem', objectFit: 'cover', borderRadius: '4rem' }} />
                <span>ユーザー01</span>

                {/* 日時 */}
                <div onClick={() => window.open('https://calendar.google.com', '_blank')} style={{ backgroundColor: 'lightgray', width: '100%', padding: '10px' }}>
                    <MdOutlineDateRange /> 2023/01/01 09:00 - 2023/01/01 18:00
                </div>

                {/* 場所 */}
                <div onClick={() => window.open('https://maps.google.com', '_blank')} style={{ backgroundColor: 'lightgray', width: '100%', padding: '10px' }}>
                    <MdOutlineLocationOn /> Location - Address
                </div>

                {/* イベントチャット */}
                <div onClick={() => alert('開発中です')} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
                    イベントチャット - 参加予定者は利用可能です
                </div>

                {/* 記事のプレビュー */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => alert('開発中です')}>
                    <img src="/image/article.jpeg" alt="Article Thumbnail" style={{ width: '40%', height: 'auto' }} />
                    <span>旅行をワクワクさせる魔法の記事が入る予定です。例えば夢の国のツアーについてとかね</span>
                </div>

                {/* イベントの説明 */}
                <h2>イベントの説明</h2>
                <p>Event Description</p>

                {/* Google Mapの埋め込み */}
                <div style={{ width: '100%', height: '400px' }}>
                <iframe
                    width="100%"
                    height="400"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={embedMapUrl || "about:blank"} // <- ここを変更
                    allowFullScreen
                ></iframe>
                </div>

                {/* 他のイベントのカード */}
                <section className={styles.otherEvents}>
                    {otherEvents.map((event) => (
                        <div key={event.id} className={styles.eventCard}>
                            <img src={event.event_image_path} alt="Event Image" />
                            <h3>{event.title}</h3>
                            <p>{event.location}</p>
                            <p>{event.start_date_time} - {event.end_date_time}</p>
                        </div>
                    ))}
                </section>
            </main>
            <footer className={styles.footer}>
                <p>参加費: $0</p>
                <button className='bold' onClick={() => alert('開発中です')}>参加する</button>
            </footer>
        </div>
    );
}

export default EventManagementPreview;
