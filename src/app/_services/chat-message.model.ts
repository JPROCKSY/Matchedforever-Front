// src/app/chat-message.model.ts
export interface ChatMessages {
    document_id: string,
    duration: string,
    is_delete: boolean,
    is_edit: boolean,
    message: string,
    message_type: string,
    name: string,
    profile_picture: string,
    replyTo: string,
    time: {
        seconds: number;
        nanoseconds: number;
    },
    upload_extension: string,
    upload_media: string,
    upload_name: string,
    user_id: string,
    video_thumbnail: string,
    delivered_to: string, // array of user IDs who received it
    read_by: string,
    
}