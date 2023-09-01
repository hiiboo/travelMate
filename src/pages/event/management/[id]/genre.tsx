import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../../../../styles/eventManagementById.module.scss';
import { MdArrowBack } from 'react-icons/md';

function EventManagementGenre() {
    const router = useRouter();
    const { id } = router.query;
    const [eventGenre, setEventGenre] = useState<string>('');
// *** API設定する時にコメントアウト ***
    const genres = [
        { genre_id: 1, name: "ジャンル1" },
        { genre_id: 2, name: "ジャンル2" },
        { genre_id: 3, name: "ジャンル3" },
        { genre_id: 4, name: "ジャンル4" },
        { genre_id: 5, name: "ジャンル5" },
        { genre_id: 6, name: "ジャンル6" },
        { genre_id: 7, name: "ジャンル7" },
        { genre_id: 8, name: "ジャンル8" },
        { genre_id: 9, name: "ジャンル9" },
        { genre_id: 10, name: "ジャンル10" }
    ];
    // const [genres, setGenres] = useState<{ genre_id: number, name: string }[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

// *** API設定する時にコメントアウト解除 ***
    // useEffect(() => {
    //     const fetchGenres = async () => {
    //         try {
    //             const response = await axios.get('/api/get-genres');
    //             setGenres(response.data);
    //         } catch (error) {
    //             console.error("Error fetching genres", error);
    //         }
    //     };

    //     const fetchEventGenres = async () => {
    //         try {
    //             const response = await axios.get(`/api/get-event-genres/${id}`);
    //             setSelectedGenres(response.data.map((g: { genre_id: number }) => g.genre_id));
    //         } catch (error) {
    //             console.error("Error fetching event genres", error);
    //         }
    //     };

    //     fetchGenres();
    //     fetchEventGenres();
    // }, [id]);

    const saveGenre = async () => {
        try {
            await axios.patch(`/api/update-event-genre/${id}`, { genre: eventGenre });
        } catch (error) {
            console.error("Error updating event genre", error);
        }
    };

    const toggleGenreSelection = async (genre_id: number) => {
        let updatedSelection;
        if (selectedGenres.includes(genre_id)) {
            updatedSelection = selectedGenres.filter(id => id !== genre_id);
        } else {
            updatedSelection = [...selectedGenres, genre_id];
        }
        setSelectedGenres(updatedSelection);

        try {
            await axios.post(`/api/update-event-genres/${id}`, { genres: updatedSelection });
        } catch (error) {
            console.error("Error updating event genres", error);
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <MdArrowBack onClick={() => router.push('/event/management/${id}/')} />
                <h2>EventTopics</h2>
            </header>
            <main className={styles.main}>
                <div className={styles.genresBox}>
                    {genres.map(genre => (
                        <div key={genre.genre_id}>
                            <input
                                type="checkbox"
                                checked={selectedGenres.includes(genre.genre_id)}
                                onChange={() => toggleGenreSelection(genre.genre_id)}
                            />
                            {genre.name}
                        </div>
                    ))}
                </div>
            </main>
            <footer className={styles.footer}>
                <button className='bold' onClick={() => router.push('/event/management/${id}/')}>戻る（自動保存）</button>
            </footer>
        </div>
    );
}

export default EventManagementGenre;
