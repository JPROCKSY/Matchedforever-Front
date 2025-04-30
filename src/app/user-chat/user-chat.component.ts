import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminServiceService } from "../_services/admin-service.service";
import { PagerService } from "src/app/_services/pager-service";
import { ChatComponent } from "../chat/chat.component"; // adjust path

@Component({
    selector: "app-user-chat",
    templateUrl: "./user-chat.component.html",
    styleUrls: ["./user-chat.component.css"],
})
export class UserChatComponent implements OnInit {
    constructor(
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
                } else {
                    this.chatUsers = [];
                }
            });
    }

    selectedUser: any;

    selectUser(user: any) {
        this.selectedUser = user;
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

    // handleMessageSent(event: any) {
    //     const eventDocId = [event.user_id, event.candidate_id].sort().join("-");

    //     // Update last message in the chat list
    //     const index = this.chatUsers.findIndex((u) => {
    //         const chatDocId = [u.user_id, u.candidate_id].sort().join("-");
    //         return chatDocId === eventDocId;
    //     });

    //     if (index !== -1) {
    //         this.chatUsers[index].last_message = event.message;
    //     }

    //     // Update last message in the currently selected chat (if it's the same conversation)
    //     if (this.selectedUser) {
    //         const selectedDocId = [
    //             this.selectedUser.user_id,
    //             this.selectedUser.candidate_id,
    //         ]
    //             .sort()
    //             .join("-");
    //         if (eventDocId === selectedDocId) {
    //             this.selectedUser.last_message = event.message;
    //         }
    //     }
    // }
}
