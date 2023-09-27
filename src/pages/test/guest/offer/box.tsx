import React, { useEffect, useState } from 'react';
import OfferBox from '../../../../components/OfferBox';
import { utils } from '../../../../utils/utils';

// <-- ---------- enum ---------- -->

enum BookingStatus {
  OfferPending,
  Accepted,
  Started,
  Finished,
  Reviewed,
  Cancelled,
}

// <-- ---------- interface ---------- -->

interface PageProps {
  isLoggedIn: boolean;
  userData?: any;
}

interface BookingData {
  id: number;
  guide_id: number;
  guide_firstName?: string;
  guide_lastName?: string;
  guide_image?: string;
  guest_id: number;
  guest_firstName?: string;
  guest_lastName?: string;
  guest_image?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  numberOfPeople: number;
  comment: string;
  created_at: Date;
  booking_status: BookingStatus;
}

function GuestOfferBox({ isLoggedIn, userData }: PageProps): JSX.Element | null {

  // <-- ---------- useState ---------- -->
  const [offers, setOffers] = useState<BookingData[]>([]);

// <-- ---------- 定数の定義 ---------- -->
  const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();
  const testUserData = {
    user_type: "guest",
    // 他の必要なプロパティもここに追加できます
  };
  const testBookings: BookingData[] = [
    {
      id: 1,
      guide_id: 101,
      guide_firstName: "John",
      guide_lastName: "Doe",
      guide_image: "guide_image_url_1",
      guest_id: 201,
      guest_firstName: "Jane",
      guest_lastName: "Smith",
      guest_image: "guest_image_url_1",
      startDate: "2023-10-01",
      startTime: "10:00",
      endDate: "2023-10-01",
      endTime: "14:00",
      numberOfPeople: 2,
      comment: "Looking forward to the tour!",
      created_at: new Date('2023-09-20T12:00:00Z'),
      booking_status: BookingStatus.OfferPending,
    },
    {
      id: 2,
      guide_id: 102,
      guide_firstName: "Michael",
      guide_lastName: "Johnson",
      guide_image: "guide_image_url_2",
      guest_id: 202,
      guest_firstName: "Emily",
      guest_lastName: "Taylor",
      guest_image: "guest_image_url_2",
      startDate: "2023-10-05",
      startTime: "09:00",
      endDate: "2023-10-05",
      endTime: "15:00",
      numberOfPeople: 4,
      comment: "Excited about the trip!",
      created_at: new Date('2023-09-22T12:00:00Z'),
      booking_status: BookingStatus.Accepted,
    },
    {
      id: 3,
      guide_id: 103,
      guide_firstName: "Chris",
      guide_lastName: "Lee",
      guide_image: "guide_image_url_3",
      guest_id: 203,
      guest_firstName: "Daniel",
      guest_lastName: "Brown",
      guest_image: "guest_image_url_3",
      startDate: "2023-10-10",
      startTime: "11:00",
      endDate: "2023-10-10",
      endTime: "16:00",
      numberOfPeople: 1,
      comment: "Can't wait!",
      created_at: new Date('2023-09-25T12:00:00Z'),
      booking_status: BookingStatus.Started,
    },
  ];

// <-- ---------- useEffect ---------- -->
  useEffect(() => {
      const fetchBookings = async () => {
          try {
              const securedAxios = createSecuredAxiosInstance();
              const response = await securedAxios.get(`/api/guest/bookings`);
              setOffers(response.data);
          } catch (error) {
              console.error('Failed to fetch guest offers data', error);
          }
      }
      fetchBookings();
  }, []);

 // <-- ---------- 表示 ---------- -->

  return (
    <main>
      <OfferBox isLoggedIn={isLoggedIn} userData={testUserData} offers={testBookings} />
    </main>
  );
};

export default GuestOfferBox;
