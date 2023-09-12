// i18nConfig.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                // event/management/[id].tsx
                editEvent: "Edit Event",
                delete: "Delete",
                preview: "Preview",
                returnDraft: "Return to Draft",
                publish: "Publish Event",
                endEvent: "End Event",
                back: "Back (Auto-save)",
                thumbnail: "Thumbnail Image",
                title: "Title",
                changeOrganizer: "Add/Change Organizer",
                dateTime: "Date and Time",
                location: "Location",
                articleRegistration: "Article Registration",
                eventDescription: "Event Description",
                otherPhotos: "Register Other Photos",
                participationFee: "Event Participation Fee",
                eventTopics: "Event Topics",
                maxParticipants: "Maximum Number of Participants",
                guestLimitation: "Guest Allowance/Maximum Number",
                questionFeature: "Question Feature",
                // event/management.tsx
                createNewEvent: "Create a new event",
                published: "Published",
                draft: "Draft",
                ended: "Ended",
                // event/management/[id]/preview.tsx
                previewLabel: "Preview",
                eventImage: "Event Image",
                comments: "Comments",
                organizer: "Organizer",
                relatedArticles: "Related Articles",
                eventDescriptionTitle: "Event Description",
                readMore: "Read More",
                close: "Close",
                otherEventsTitle: "Other Events",
                eventLocation: "Event Location",
                eventDate: "Event Date",
                participationFeeLabel: "Participation Fee",
                participate: "Participate"
            }
        },
        ja: {
            translation: {
                // event/management/[id].tsx
                editEvent: "イベントを編集",
                delete: "削除",
                preview: "プレビュー",
                returnDraft: "下書きに戻す",
                publish: "イベントを公開する",
                endEvent: "イベントを終了にする",
                back: "戻る（自動保存）",
                thumbnail: "サムネイル画像",
                title: "タイトル",
                changeOrganizer: "主催者の追加/変更",
                dateTime: "日時",
                location: "場所",
                articleRegistration: "記事の登録",
                eventDescription: "イベントの説明",
                otherPhotos: "その他写真の登録",
                participationFee: "イベント参加費",
                eventTopics: "EventTopics",
                maxParticipants: "参加人数の上限",
                guestLimitation: "ゲスト可否/人数上限",
                questionFeature: "質問機能",
                // event/management.tsx
                createNewEvent: "イベントを新規作成する",
                published: "公開中",
                draft: "下書き",
                ended: "終了",
                // event/management/[id]/preview.tsx
                previewLabel: "プレビュー",
                eventImage: "イベント画像",
                comments: "コメント",
                organizer: "主催者",
                relatedArticles: "関連記事",
                eventDescriptionTitle: "イベントの説明",
                readMore: "もっと見る",
                close: "閉じる",
                otherEventsTitle: "他のイベント",
                eventLocation: "イベントの場所",
                eventDate: "イベントの日時",
                participationFeeLabel: "参加費",
                participate: "参加する"
            }
        }
    },
    lng: "ja", // default language
    fallbackLng: "ja",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
