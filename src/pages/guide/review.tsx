import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import * as React from "react"
import { cn } from "@/lib/utils"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { utils } from '../../utils/utils';
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// <-- ---------- interface ---------- -->

interface PageProps {
    isLoggedIn: boolean;
    userData?: any;
}

interface BookingData {
    id: number;
    guide_id: number;
    guide_firstName: string;
    guide_lastName: string;
    guide_image?: string;
    guest_id: number;
    guest_firstName: string;
    guest_lastName: string;
    guest_image?: string;
    total_guest: number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    startConfirmation: Date;
    endConfirmation: Date;
    hourly_rate: number;
    created_at: Date;
}

function Review({ isLoggedIn, userData }: PageProps): JSX.Element | null {
    const [bookingData, setBookingData] = useState<BookingData | null>(null);

// <-- ---------- 定数の定義 ---------- -->

    const reviewSchema = z.object({
        rating: z.number().min(1),
        content: z.string().optional(),
    });
    const { router, apiUrl, createSecuredAxiosInstance, formatDateToCustom } = utils();

// <-- ---------- useEffect ---------- -->

    useEffect(() => {

        const fetchBookingData = async () => {
            try {
              const securedAxios = createSecuredAxiosInstance();
              const response = await securedAxios.get(`/api/booking/`);
              setBookingData(response.data);
            } catch (error) {
              console.error('Failed to fetch booking data', error);
            }
        }
        fetchBookingData();
    },[]);

    // <-- ---------- 関数の定義 ---------- -->

    const form = useForm({
        resolver: zodResolver(reviewSchema),
         defaultValues: {
            rating: 5,
            content: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof reviewSchema>) => {
        try {
            if (bookingData) {
                const axiosInstance = createSecuredAxiosInstance();

                // フォームから取得したデータに、追加のデータをマージ
                const postData = {
                    ...data,
                    reviewer_id: bookingData.guide_id,
                    reviewee_id: bookingData.guest_id,
                    booking_id: bookingData.id,
                };

                // マージしたデータをPOSTリクエストのボディとして送信
                const response = await axiosInstance.post('/api/review', postData);
                console.log(response.data);
                // 予約が成功したら、適切なページにリダイレクトするなどの処理を行う
            } else {
                console.error("Booking data is not available.");
            }
        } catch (error) {
            console.error("Review Error:", error);
            // エラーハンドリングの処理を行う
        }
    };


    const calculateTotalAmount = () => {
        if (bookingData) {
            const start = new Date(bookingData.startConfirmation);
            const end = new Date(bookingData.endConfirmation);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            const baseAmount = bookingData.hourly_rate * hours;

            if (bookingData.total_guest > 1) {
                return baseAmount * bookingData.total_guest * 0.75;
            } else {
                return baseAmount;
            }
        }
        return 0;
    };


// <-- ---------- 表示 ---------- -->

    return (
        <>  <h2>Thank you so much!!<br/>Have a Best Day!</h2>
            <div className="flex flex-col items-center justify-content-between">
            <Image
                src={bookingData?.guest_image || '/image/user.jpeg'}
                alt="guest_image"
                width={200}
                height={200}
                className="rounded-full"
            />
                <p>{bookingData?.guest_firstName} {bookingData?.guest_lastName}</p>
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Value（Max:5）</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-[200px] justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value || "Select a Value"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandGroup>
                                {Array.from({ length: 4 }, (_, i) => i + 1).map((number) => (
                                    <CommandItem
                                    value={number.toString()}
                                    key={number}
                                    onSelect={() => {
                                        form.setValue("rating", number)
                                    }}
                                    >
                                    <Check
                                        className={cn(
                                        "mr-2 h-4 w-4",
                                        number === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                    />
                                    {number}
                                    </CommandItem>
                                ))}
                                </CommandGroup>
                            </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Review Comment</FormLabel>
                        <FormControl>
                        <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="">
                    <div className="flex flex-col items-center justify-content-between">
                        <div>
                            <h3>Total amount</h3>
                            <p><small>Inclusive of tax</small></p>
                        </div>
                        <p className='bold'>¥{calculateTotalAmount().toLocaleString()}</p>
                    </div>
                    <p><small>Include yourself in the total count, excluding children aged 12 and below.</small></p>
                </div>
                <Button type="submit">Complete</Button>
            </form>
        </Form>
        </>
    );
}

export default Review;