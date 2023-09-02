// i18nConfig.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                editEvent: "Edit Event",
                delete: "Delete",
                preview: "Preview",
                draft: "Return to Draft",
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
                // ... more translations
            }
        },
        ja: {
            translation: {
                editEvent: "イベントを編集",
                delete: "削除",
                preview: "プレビュー",
                draft: "下書きに戻す",
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
                // ... more translations
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
