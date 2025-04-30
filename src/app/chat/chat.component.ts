import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { firestore } from "firebase";
import { NgForm } from "@angular/forms";
import { environment } from "../../environments/environment";
import { ChatMessages } from "../_services/chat-message.model";
import { AdminServiceService } from "../_services/admin-service.service";
import { Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit {
    @Input() user: any;
    @Input() loggedInUser: any;
    @Output() messageSent: EventEmitter<any> = new EventEmitter();

    constructor(
        private db: AngularFirestore,
        private cd: ChangeDetectorRef,
        private storage: AngularFireStorage,
        public adminService: AdminServiceService
    ) {}

    ngOnInit() {
        // this.loadChats();
    }

    public selectUser: any = {};
    public senderId: any = "";
    public receiverId: any = "";
    public main_doc_id: any = "";

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["user"] && changes["user"].currentValue) {
            this.selectUser = changes["user"].currentValue;
        }

        if (changes["loggedInUser"] && changes["loggedInUser"].currentValue) {
            this.loggedInUser = changes["loggedInUser"].currentValue;
        }

        if (this.selectUser && this.loggedInUser) {
            this.senderId = this.loggedInUser.id;

            if (this.loggedInUser.id == this.selectUser.candidate_id) {
                this.receiverId = this.selectUser.user_id;
            } else {
                this.receiverId = this.selectUser.candidate_id;
            }

            if (this.senderId && this.receiverId) {
                const id1 = parseInt(this.senderId, 10);
                const id2 = parseInt(this.receiverId, 10);

                const [smaller, larger] = id1 < id2 ? [id1, id2] : [id2, id1];
                this.main_doc_id = `${smaller}-${larger}`;

                this.loadChats();
            } else {
                console.warn("Sender or receiver ID missing");
            }
        }
    }

    // public loggedInUser: any = {};

    // getLoggedInUser() {
    //     let user: any = this.adminService.getLoggedInUser();
    //     this.loggedInUser = user.value;
    // }

    public isChatLoaded: boolean = false;
    public isChatFound: boolean = false;
    public isLoadingChat: boolean = false;

    public existingChatList = [];
    public groupedChatList = {
        today: [],
        yesterday: [],
        other: {},
    };
    handleKeydown(event: KeyboardEvent, form: NgForm) {
        if (event.key === "Enter") {
            if (event.shiftKey) {
                // Ctrl + Enter: Insert a new line
                const textarea = event.target as HTMLTextAreaElement;
                const cursorPos = textarea.selectionStart;
                const textBefore = textarea.value.substring(0, cursorPos);
                const textAfter = textarea.value.substring(cursorPos);

                textarea.value = textBefore + "\n" + textAfter;
                textarea.selectionStart = textarea.selectionEnd = cursorPos + 1;

                event.preventDefault(); // Prevent form submission
            } else {
                // Enter (without Ctrl): Send the message
                event.preventDefault(); // Prevent new line
                this.submitChat(form);
            }
        }
    }

    public is_chat_loaded: boolean = false;

    loadChats() {
        this.isLoadingChat = true;
        let tempChat = this.db
            .collection(environment.Conversation)
            .doc(this.main_doc_id)
            .collection("Messages", (ref) => ref.orderBy("time", "asc"));

        tempChat.snapshotChanges().subscribe(
            (response) => {
                this.cd.detectChanges();

                // const chatContainer = document.querySelector("#chatlistPage .chat-container-list") as HTMLElement;
                // if (chatContainer) {
                //     chatContainer.scrollTop = chatContainer.scrollHeight;
                // }

                this.existingChatList = [];
                this.groupedChatList = {
                    today: [],
                    yesterday: [],
                    other: {},
                };

                response.forEach((chat) => {
                    const docRef = chat.payload.doc.ref;
                    const chatData = chat.payload.doc.data() as ChatMessages;

                    if (chatData.is_delete == false) {
                        this.existingChatList.push(chatData);

                        const messageDate = this.convertTimestampToDate(
                            chatData.time.seconds
                        );

                        if (this.isToday(messageDate)) {
                            this.groupedChatList.today.push(chatData);
                        } else if (this.isYesterday(messageDate)) {
                            this.groupedChatList.yesterday.push(chatData);
                        } else {
                            const formattedDate = this.formatDate(messageDate);
                            if (!this.groupedChatList.other[formattedDate]) {
                                this.groupedChatList.other[formattedDate] = [];
                            }
                            this.groupedChatList.other[formattedDate].push(
                                chatData
                            );
                        }
                        // Mark as delivered
                        if (
                            !chatData.delivered_to ||
                            !chatData.delivered_to.includes(this.senderId)
                        ) {
                            docRef.update({
                                delivered_to: firestore.FieldValue.arrayUnion(
                                    this.senderId
                                ),
                            });
                        }

                        // console.log(this.groupedChatList);
                    }
                });

                if (this.existingChatList.length > 0) {
                    const lastMessage = this.existingChatList[this.existingChatList.length - 1];
                    this.messageSent.emit({
                        message: lastMessage.message,
                        user_id: this.senderId,
                        candidate_id: this.receiverId
                    });
                }

                // if (
                //     this.existingChatList.length > 0 &&
                //     this.existingChatList[this.existingChatList.length - 1].user_id === this.senderId // Only emit if current user sent the message
                // ) {
                //     const lastMessage = this.existingChatList[this.existingChatList.length - 1];
                
                //     this.messageSent.emit({
                //         message: lastMessage.message,
                //         user_id: this.senderId,
                //         candidate_id: this.receiverId
                //     });
                // }
                
                

                // Sort the keys (dates) in descending order
                const sortedDates = Object.keys(
                    this.groupedChatList.other
                ).sort((a, b) => {
                    const dateA = new Date(a).getTime();
                    const dateB = new Date(b).getTime();
                    return dateA - dateB; // Sort in descending order
                });

                // Create a new ordered object to hold the sorted messages
                let orderedOther = {};
                sortedDates.forEach((date) => {
                    let timestamp = Math.round(new Date(date).getTime() / 1000);

                    if (!orderedOther[timestamp]) {
                        orderedOther[timestamp] = {
                            formatted_date: "",
                            records: [],
                        };
                    }

                    orderedOther[timestamp]["formatted_date"] = date;
                    orderedOther[timestamp]["records"] =
                        this.groupedChatList.other[date];
                });

                // Assign the ordered other messages back to the groupedChatList
                this.groupedChatList.other = orderedOther;
                this.cd.detectChanges();

                // this.spinner.hide();
                this.isLoadingChat = false;

                this.cd.detectChanges();

                if (!this.is_chat_loaded && !this.isChatLoaded) {
                    setTimeout(() => {
                        // const chatContainer = document.querySelector("#chatlistPage .chat-container-list") as HTMLElement;
                        // if (chatContainer) {
                        //     chatContainer.scrollTop = chatContainer.scrollHeight;
                        // }
                        this.isChatLoaded = true;
                    }, 100);
                }

                this.is_chat_loaded = true;
                this.markMessagesAsRead(this.existingChatList);
            },
            (error) => {
                console.error("Error fetching chat messages: ", error);
                // this.spinner.hide();
                this.is_chat_loaded = false;
            }
        );
    }

    // scrollChatToBottom() {
    //     if (this.chatContainer) {
    //         setTimeout(() => {
    //             this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    //         }, 10); // Ensure it's after rendering
    //     }
    // }

    markMessagesAsRead(messages: ChatMessages[]) {
        const currentUserId = this.receiverId;

        if (!this.main_doc_id || this.main_doc_id.trim() === "") {
            console.warn(
                "main_doc_id is missing. Skipping markMessagesAsRead."
            );
            return;
        }

        messages.forEach((msg) => {
            if (!msg.document_id) return;

            const messageRef = this.db
                .collection(environment.Conversation)
                .doc(this.main_doc_id)
                .collection("Messages")
                .doc(msg.document_id);

            if (!msg.read_by || !msg.read_by.includes(currentUserId)) {
                messageRef.update({
                    read_by: firestore.FieldValue.arrayUnion(currentUserId),
                });
            }
        });
    }

    // Check if a date is today
    isToday(date: Date): boolean {
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    }

    isYesterday(date: Date): boolean {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return (
            date.getFullYear() === yesterday.getFullYear() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getDate() === yesterday.getDate()
        );
    }

    // Format date to readable string for "Other" dates
    formatDate(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        return date.toLocaleDateString("en-US", options); // e.g., "Friday, Oct 04, 2024"
    }

    convertTimestampToDate(seconds: number): Date {
        return new Date(seconds * 1000); // Convert Firestore timestamp to JS Date
    }

    public commentObj: any = {
        message: "",
    };

    public notification_msg: any = "";

    async submitChat(form: NgForm) {
        if (
            !form.valid ||
            !(this.commentObj.message && this.commentObj.message.trim())
        )
            return;

        // this.senderId = "5000";
        let timestamp = firestore.Timestamp.fromDate(new Date());

        let commentObj: any = {
            document_id: "",
            duration: "",
            is_delete: false,
            is_edit: false,
            message: this.commentObj.message,
            message_type: "msg",
            name: this.selectUser.candidate_info.first_name,
            profile_picture: this.selectUser.candidate_info.profile_pic,
            replyTo: "",
            time: timestamp,
            upload_extension: "",
            upload_media: "",
            upload_name: "",
            user_id: this.senderId,
            video_thumbnail: "",
            delivered_to: [],
            read_by: [],
        };

        try {
            let timestamp = firestore.Timestamp.fromDate(new Date());
            const data = {
                created_by_id: this.senderId,
                created_by_name:
                    this.selectUser.candidate_info.first_name +
                    " " +
                    this.selectUser.candidate_info.last_name,
                creation_time: timestamp,
                document_id: this.main_doc_id,
                group_image: "",
                group_name: "",
                lastMessage: "",
                last_message: {
                    content: this.commentObj.message,
                    senderId: this.senderId,
                    sender_name:
                        this.selectUser.candidate_info.first_name +
                        " " +
                        this.selectUser.candidate_info.last_name,
                    timestamp: timestamp,
                    type: "mgs",
                },
                loginProfilePic: "",
                loginUserID: "",
                loginUserName: "",
                otherProfilePic: "",
                otherUserID: "",
                otherUserName: "",
                participant: [this.senderId, this.receiverId],
            };

            this.db
                .collection(environment.Conversation)
                .doc(this.main_doc_id)
                .set(data)
                .then(() => {
                    this.updateLastMessage(
                        this.commentObj.message,
                        this.senderId,
                        this.receiverId
                    );

                    this.messageSent.emit({
                        message: this.commentObj.message,
                        user_id: this.senderId,
                        candidate_id: this.receiverId,
                    });

                    this.commentObj.message = "";

                })
                .catch((error) => {
                    console.error("Firestore Error: ", error);
                    this.commentObj.message = "";
                });
            // this.db
            //     .collection(environment.Conversation)
            //     .doc(this.main_doc_id)
            //     .set(data)
            //     .then(() => {
            //         this.updateLastMessage(this.commentObj.message, this.senderId, this.receiverId);
            //         this.commentObj.message = "";
            //         console.log("Chat sent!");
            //     })
            //     .catch((error) => {
            //         console.error("Firestore Error: ", error);
            //         this.commentObj.message = "";
            //     });

            const messagesCollection = this.db
                .collection(environment.Conversation)
                .doc(this.main_doc_id)
                .collection("Messages");

            const docRef = await messagesCollection.add(commentObj);

            // this.chat_comment_notification(commentObj.comment);

            await docRef.update({ document_id: docRef.id });

            console.log("New message added successfully!");
        } catch (error) {
            console.error("Firestore Error: ", error);
        }
    }

    updateLastMessage(message, userId, candidateId) {
        this.adminService
            .updateLastMessage({
                message: message,
                userId: userId,
                candidateId: candidateId,
                doc_id:this.main_doc_id
            })
            .subscribe((response) => {
                if (response.success) {
                } else {
                }
            });
    }
}
