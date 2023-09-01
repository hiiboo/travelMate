import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../../styles/eventManagementById.module.scss';
import { MdArrowBack } from 'react-icons/md';
import axios from 'axios';

declare var google: any;

function EventManagementLocation() {
    const router = useRouter();
    const { id } = router.query;
    const [location, setLocation] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [placeId, setPlaceId] = useState<string>('');

    const mapRef = useRef(null);
    const [map, setMap] = useState<any>(null);
    const [autocomplete, setAutocomplete] = useState<any>(null);

    useEffect(() => {
        const fetchEventLocation = async () => {
            try {
                const response = await axios.get(`/api/get-event-location/${id}`);
                if (response.data) {
                    setLocation(response.data.location || ''); // Assuming the field in the response is named 'name'
                    setAddress(response.data.address || ''); // Assuming the field in the response is named 'address'
                    setPlaceId(response.data.place_id || ''); // Assuming the field in the response is named 'placeId'
                }
            } catch (error) {
                console.error("Error fetching event location", error);
            }
        };

        fetchEventLocation();
    }, [id]);


    useEffect(() => {
        if (mapRef.current && !map) {
            const newMap = new google.maps.Map(mapRef.current, {
                center: { lat: 35.6895, lng: 139.6917 },  // 東京をデフォルトの中心に
                zoom: 8,
            });
            setMap(newMap);
        }
    }, []);  // 依存配列を空に

    useEffect(() => {
        if (map && !autocomplete) {
            const auto = new google.maps.places.Autocomplete(
                document.getElementById('location-input') as HTMLInputElement
            );
            auto.bindTo('bounds', map);
            setAutocomplete(auto);
        }
    }, [map]);

    const searchLocation = async (query: string) => {
        try {
            const response = await axios.post(`/api/search-location`, { query });
            if (response.data) {
                const place = response.data;

                setLocation(place.name || '');
                setAddress(place.formatted_address || '');
                setPlaceId(place.place_id || '');

                if (place.geometry && place.geometry.location) {
                    new google.maps.Marker({
                        position: {
                            lat: place.geometry.location.lat,
                            lng: place.geometry.location.lng
                        },
                        map: map,
                    });
                    map.setCenter({
                        lat: place.geometry.location.lat,
                        lng: place.geometry.location.lng
                    });
                }

                saveLocation(place);
            }
        } catch (error) {
            console.error("Error searching location", error);
        }
    };

    const saveLocation = async (place: { name: string, formatted_address: string, place_id: string }) => {
        try {
            await axios.patch(`/api/update-event-location/${id}`, {
                location: place.name,
                address: place.formatted_address,
                place_id: place.place_id
            });
        } catch (error) {
            console.error("Error saving location", error);
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <MdArrowBack onClick={() => router.push('/event/management/${id}/')} />
                <h2>イベントの場所</h2>
            </header>
            <main className={styles.main}>
                <div className={styles.inputLocationBox}>
                    <input
                        id="location-input"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="場所を入力"
                    />
                    <button onClick={() => searchLocation(location)}>場所を検索</button>
                </div>
                <div>
                    <strong>選択した場所:</strong> {location}
                </div>
                <div>
                    <strong>住所:</strong> {address}
                </div>
                <div>
                    <strong>ID:</strong> {placeId}
                </div>
                <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
            </main>
            <footer className={styles.footer}>
                <button className='bold' onClick={() => router.push('/event/management/${id}/')}>戻る（自動保存）</button>
            </footer>
        </div>
    );
}

export default EventManagementLocation;
