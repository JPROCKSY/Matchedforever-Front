import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminServiceService } from "../_services/admin-service.service";
import { PagerService } from "src/app/_services/pager-service";
import { ChatComponent } from "../chat/chat.component"; // adjust path
import { environment } from "../../environments/environment";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { ChatMessages } from "../_services/chat-message.model";
import { firestore } from "firebase";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
    selector: "app-user-chat",
    templateUrl: "./user-chat.component.html",
    styleUrls: ["./user-chat.component.css"],
})
export class UserChatComponent implements OnInit {
    @Output() messageSent = new EventEmitter<any>();

    constructor(
        private db: AngularFirestore,
        private cd: ChangeDetectorRef,
        public adminService: AdminServiceService,
        public pagerService: PagerService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.getLoggedInUser();
        this.chatList();
    }

    public loggedInUser: any = {};

    getLoggedInUser() {
        let user: any = this.adminService.getLoggedInUser();
        this.loggedInUser = user.value;
    }

    public chatUsers: any = [];
    chatList() {
        this.adminService
            .chatList({ user_id: this.loggedInUser.id, status: "accept" })
            .subscribe((response: any) => {
                if (response.success) {
                    this.chatUsers = response.data;
                    this.chatUsers.forEach((user: any) => {
                        if (user.user_id && user.candidate_id) {
                            const id1 = parseInt(user.user_id, 10);
                            const id2 = parseInt(user.candidate_id, 10);
                            const [smaller, larger] =
                                id1 < id2 ? [id1, id2] : [id2, id1];
                            this.main_doc_id = `${smaller}-${larger}`;
                            //this.loadChats();
                            this.getLastMessage(
                                user.candidate_id,
                                this.main_doc_id
                            );
                        } else {
                            console.warn("Sender or receiver ID missing");
                        }
                    });
                } else {
                    this.chatUsers = [];
                }
            });
    }

    public selectedUser: any = {};
    public senderId: any = "";
    public receiverId: any = "";
    public main_doc_id: any = "";
    public isChatLoaded: boolean = false;
    public isChatFound: boolean = false;
    public isLoadingChat: boolean = false;
    public existingChatList = [];
    public groupedChatList = {
        today: [],
        yesterday: [],
        other: {},
    };

    selectUsered(user: any) {
        this.selectedUser = user;
        if (this.selectedUser && this.loggedInUser) {
            this.senderId = this.loggedInUser.id;

            if (this.loggedInUser.id == this.selectedUser.candidate_id) {
                this.receiverId = this.selectedUser.user_id;
            } else {
                this.receiverId = this.selectedUser.candidate_id;
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

    handleMessageSent(event: any) {
        if (this.selectedUser) {
            this.selectedUser.last_message = event.message;

            // Also update it in the chatUsers list if needed:
            const index = this.chatUsers.findIndex(
                (user) =>
                    user.user_id === this.selectedUser.user_id &&
                    user.candidate_id === this.selectedUser.candidate_id
            );
            if (index !== -1) {
                this.chatUsers[index].last_message = event.message;
            }
        }
    }

    ngOnChanges(): void {
        // this.loadChats();
        // this.listenToTypingStatus();
    }

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
        } else {
            if (this.main_doc_id) {
                this.listenToTypingStatus();
            }
            this.updateTypingStatus(true); // User is typing
            this.cd.detectChanges();
        }
    }
    isTyping: boolean = false;
    updateTypingStatus(isTyping: boolean) {
        const typingRef = this.db
            .collection(environment.Conversation)
            .doc(this.main_doc_id)
            .update({
                [`typing.${this.receiverId}`]: isTyping,
            });
        // Set a timer to remove typing status after a delay (e.g., 2 seconds of inactivity)
        if (isTyping) {
            setTimeout(() => {
                this.updateTypingStatus(false);
            }, 2000); // 2 seconds timeout
        }
    }

    listenToTypingStatus() {
        this.db
            .collection(environment.Conversation)
            .doc(this.main_doc_id)
            .valueChanges()
            .subscribe((doc: any) => {
                if (doc && doc.typing) {
                    const otherUserTyping = doc.typing[this.senderId];
                    console.log(otherUserTyping, "doc.typing");
                    //this.isTyping = otherUserTyping === true;
                    this.showTypingIndicator(otherUserTyping);
                    //this.cd.detectChanges();
                }
            });
    }

    showTypingIndicator(isTyping: boolean) {
        if (isTyping) {
            this.isTyping = true; // Show "typing..." indicator
        } else {
            this.isTyping = false; // Hide "typing..." indicator
        }
        //this.cd.detectChanges();
    }

    public is_chat_loaded: boolean = false;
    private chatSubscription: Subscription | null = null;

    loadChats() {
        this.isLoadingChat = true;

        // Unsubscribe from previous chat snapshot
        if (this.chatSubscription) {
            this.chatSubscription.unsubscribe();
        }

        let tempChat = this.db
            .collection(environment.Conversation)
            .doc(this.main_doc_id) // Make sure this is correctly set before calling loadChats()
            .collection("Messages", (ref) => ref.orderBy("time", "asc"));

        // New Subscribe and store the subscription
        this.chatSubscription = tempChat.snapshotChanges().subscribe(
            (response) => {
                this.cd.detectChanges();

                this.existingChatList = [];
                this.groupedChatList = {
                    today: [],
                    yesterday: [],
                    other: {},
                };

                response.forEach((chat) => {
                    const docRef = chat.payload.doc.ref;
                    const chatData = chat.payload.doc.data() as ChatMessages;

                    if (chatData.is_delete === false) {
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
                    }
                });

                if (this.existingChatList.length > 0) {
                    const lastMessage =
                        this.existingChatList[this.existingChatList.length - 1];
                    this.messageSent.emit({
                        message: lastMessage.message,
                        user_id: this.senderId,
                        candidate_id: this.receiverId,
                    });
                }

                const sortedDates = Object.keys(
                    this.groupedChatList.other
                ).sort((a, b) => {
                    const dateA = new Date(a).getTime();
                    const dateB = new Date(b).getTime();
                    return dateA - dateB;
                });

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

                this.groupedChatList.other = orderedOther;
                this.cd.detectChanges();

                if (!this.is_chat_loaded && !this.isChatLoaded) {
                    setTimeout(() => {
                        this.isChatLoaded = true;
                    }, 100);
                }

                this.is_chat_loaded = true;
                this.markMessagesAsRead(this.existingChatList);
                this.isLoadingChat = false;
            },
            (error) => {
                console.error("Error fetching chat messages: ", error);
                this.is_chat_loaded = false;
                this.isLoadingChat = false;
            }
        );
    }

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
                messageRef.get().subscribe((docSnapshot) => {
                    if (docSnapshot.exists) {
                        messageRef.update({
                            read_by:
                                firestore.FieldValue.arrayUnion(currentUserId),
                        });
                    } else {
                        console.warn(
                            `Message ${msg.document_id} not found, skipping update.`
                        );
                    }
                });
            }
        });
    }

    // Check if a date is Today
    isToday(date: Date): boolean {
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    }

    // Check if a date is Yesterday
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

    async submitChat(form: NgForm) {
        if (
            !form.valid ||
            !(this.commentObj.message && this.commentObj.message.trim())
        )
            return;

        // this.senderId = "5000";
        let timestamp = firestore.Timestamp.fromDate(new Date());

        console.log(this.selectedUser);

        let commentObj: any = {
            document_id: "",
            duration: "",
            is_delete: false,
            is_edit: false,
            message: this.commentObj.message,
            message_type: "msg",
            name: this.loggedInUser.id == this.selectedUser.user_id ? this.selectedUser.candidate_info.first_name : this.loggedInUser.first_name,
            profile_picture: this.selectedUser.candidate_info.profile_pic,
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
                    this.selectedUser.candidate_info.first_name +
                    " " +
                    this.selectedUser.candidate_info.last_name,
                creation_time: timestamp,
                document_id: this.main_doc_id,
                group_image: "",
                group_name: "",
                lastMessage: "",
                last_message: {
                    content: this.commentObj.message,
                    senderId: this.senderId,
                    sender_name:
                        this.selectedUser.candidate_info.first_name +
                        " " +
                        this.selectedUser.candidate_info.last_name,
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
                    this.chatList();
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

            const messagesCollection = this.db
                .collection(environment.Conversation)
                .doc(this.main_doc_id)
                .collection("Messages");

            const docRef = await messagesCollection.add(commentObj);

            await docRef.update({ document_id: docRef.id });

            console.log("New message added successfully!");
        } catch (error) {
            console.error("Firestore Error: ", error);
        }
    }

    //TO SHOW LAST MESG
    formatRelativeTime(timestamp: number | string): string {
        // Ensure timestamp is in milliseconds
        const ts =
            typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
        const messageDate = new Date(ts * 1000); // convert seconds → milliseconds
        const now = new Date();

        const diffInMs = now.getTime() - messageDate.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

        const isToday = now.toDateString() === messageDate.toDateString();

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const isYesterday =
            yesterday.toDateString() === messageDate.toDateString();

        if (diffInMinutes < 1) {
            return "Just now";
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} min ago`;
        } else if (diffInHours < 12 && isToday) {
            return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        } else if (isToday) {
            return `Today, ${messageDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })}`;
        } else if (isYesterday) {
            return `Yesterday, ${messageDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })}`;
        } else {
            const day = messageDate.getDate().toString().padStart(2, "0");
            const month = (messageDate.getMonth() + 1)
                .toString()
                .padStart(2, "0");
            const year = messageDate.getFullYear();
            return `${day}-${month}-${year}`;
        }
    }

    public userLastMessages: {
        [userId: number]: { message: string; time: string };
    } = {};

    getLastMessage(userId: number, doc_id: string): void {
        const docId = doc_id;

        this.db
            .collection(environment.Conversation)
            .doc(docId)
            .collection("Messages", (ref) =>
                ref.orderBy("time", "desc").limit(1)
            )
            .valueChanges()
            .subscribe((messages: any[]) => {
                if (messages && messages.length > 0) {
                    const lastMessage = messages[0];

                    if (
                        lastMessage &&
                        lastMessage.message &&
                        lastMessage.time &&
                        lastMessage.time.seconds
                    ) {
                        const lastMesg = lastMessage.message;
                        const megsTime = this.formatRelativeTime(
                            lastMessage.time.seconds
                        );

                        this.userLastMessages[userId] = {
                            message: lastMesg,
                            time: megsTime,
                        };
                    } else {
                        this.userLastMessages[userId] = {
                            message: "",
                            time: "",
                        };
                    }
                } else {
                    this.userLastMessages[userId] = {
                        message: "",
                        time: "",
                    };
                }

                this.cd.detectChanges(); // make sure your component updates
            });
    }
}
