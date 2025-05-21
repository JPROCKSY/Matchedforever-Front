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
import { Subscription } from "rxjs";

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
    }


}
