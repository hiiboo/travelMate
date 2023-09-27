import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface PageProps {
  userData: {
    user_type: 'guest' | 'guide';
    lastBookingStatus: 'OfferPending' | 'Accepted' | 'Started' | 'Finished' | 'Reviewed' | 'Cancelled' | null;
    NumberOfPendingOffered: number;
  };
}

const StatusButton: React.FC<PageProps> = ({ userData }) => {

  const handleCancelNoFee = () => {
    alert('under development');
    // Execute the function to display modalCancelNoFee
  };

  const handleCancelApplyFee = () => {
    alert('under development');
    // Execute the function to display modalCancelApplyFee
  };

  const renderButton = () => {
    const { user_type, lastBookingStatus, NumberOfPendingOffered } = userData;

    if (user_type === 'guest') {
      switch (lastBookingStatus) {
        case 'OfferPending':
          return <Button onClick={handleCancelNoFee}>キャンセルする</Button>;
        case 'Accepted':
          return (
            <>
                <Link href="/guest/timer">
                    <Button>ガイド準備</Button>
                </Link>
                <Button onClick={handleCancelApplyFee}>キャンセルする</Button>
            </>
          );
        case 'Started':
          return (
            <>
                <Link href="/guest/timer">
                    <Button>ガイド中</Button>
                </Link>
            </>
          );
        case 'Finished':
          return (
            <>
                <Link href="/guest/review">
                    <Button>レビュー待ち</Button>
                </Link>
            </>
          );
        case 'Reviewed':
        case 'Cancelled':
        case null:
          return (
            <>
                <Link href="/guest/offer/box">
                    <Button>オファーボックスに戻る</Button>
                </Link>
            </>
          );
        default:
          return null;
      }
    } else if (user_type === 'guide') {
      switch (lastBookingStatus) {
        case 'Accepted':
          return (
            <>
                <Link href="/guide/timer">
                    <Button>ガイド準備</Button>
                </Link>
            </>
        );
        case 'Started':
          return (
            <>
                <Link href="/guide/timer">
                    <Button>ガイド中</Button>
                </Link>
            </>
          );
        case 'Finished':
          return (
                <>
                    <Link href="/guide/review">
                        <Button>レビュー待ち</Button>
                    </Link>

                </>
            );
        case 'Reviewed':
        case 'Cancelled':
        case null:
          return (
            <div>
                <Link href="/guide/offer/box">
                  <Badge color={NumberOfPendingOffered > 0 ? 'primary' : 'grey'}>
                    {NumberOfPendingOffered}
                  </Badge>
                  <Button>
                      オファーボックスに戻る
                  </Button>
                </Link>
            </div>
          );
        default:
          return null;
      }
    }

    return null;
  };

  return <div>{renderButton()}</div>;
};

export default StatusButton;
