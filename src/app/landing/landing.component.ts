import {
    Component,
    OnInit,
    OnDestroy,
    ElementRef,
    Renderer2,
    ViewChild,
} from "@angular/core";

import {
    trigger,
    state,
    style,
    transition,
    animate,
} from "@angular/animations";

@Component({
    selector: "app-landing",
    templateUrl: "./landing.component.html",
    styleUrls: ["./landing.component.css"],
    animations: [
        trigger("slideToggle", [
            state(
                "closed",
                style({ height: "0px", overflow: "hidden", opacity: 0 })
            ),
            state("open", style({ height: "*", opacity: 1 })),
            transition("closed <=> open", [animate("300ms ease-in-out")]),
        ]),
    ],
})
export class LandingComponent implements OnInit, OnDestroy {
    @ViewChild("timelineContainer", { static: false })
    timelineContainer!: ElementRef;
    @ViewChild("timelineWrapper", { static: false })
    timelineWrapper!: ElementRef;

    private legacySection: HTMLElement | null = null;
    private legacyWrapper: HTMLElement | null = null;

    constructor(private renderer: Renderer2, private el: ElementRef) {}

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        // Access elements using @ViewChild
        this.legacySection = this.timelineContainer.nativeElement;
        this.legacyWrapper = this.timelineWrapper.nativeElement;

        // Debugging with console logs
        console.log("Timeline Container:", this.legacySection);
        console.log("Timeline Wrapper:", this.legacyWrapper);

        if (this.legacySection && this.legacyWrapper) {
            // Debugging the scroll event setup
            console.log("Setting up scroll event listener.");
            window.addEventListener("scroll", this.onScroll);
        }
    }

    ngOnDestroy(): void {
        console.log("ngOnDestroy: Removing scroll event listener.");
        if (this.legacySection && this.legacyWrapper) {
            window.removeEventListener("scroll", this.onScroll);
        }
    }

    private onScroll = (): void => {
        // Debugging the scroll event firing
        // console.log("Scroll event fired.");

        if (!this.legacySection || !this.legacyWrapper) {
            console.log("Legacy section or wrapper is not available!");
            return;
        }

        const legacySectionRect = this.legacySection.getBoundingClientRect();
        const legacyWrapperRect = this.legacyWrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        console.log("Legacy Section Rect:", legacySectionRect);
        console.log("Legacy Wrapper Rect:", legacyWrapperRect);
        console.log("Viewport Height:", viewportHeight);

        // Checking if the timeline container is in the viewport
        if (legacySectionRect.top <= viewportHeight) {
            const scrollProgress = Math.min(
                Math.max(
                    (viewportHeight - legacySectionRect.top) /
                        legacySectionRect.height,
                    0
                ),
                1
            );
            console.log("Scroll Progress:", scrollProgress);

            // Adjust the height of legacySection based on the legacyWrapper's width
            this.legacySection.style.height = `${this.legacyWrapper.clientWidth}px`;

            const maxTranslateX =
                this.legacyWrapper.clientWidth - window.innerWidth + 500;
            this.legacyWrapper.style.transform = `translateX(-${
                maxTranslateX * scrollProgress - 500
            }px)`;
        } else {
            console.log(
                "Legacy section is not in the viewport. Resetting transform."
            );
            this.legacyWrapper.style.transform = `translateX(350px)`;
        }
    };
    public Activebuilding: string = "";

    buildingClick = function (id) {
        if (this.Activebuilding == id) {
            this.Activebuilding = "";
        } else {
            this.Activebuilding = id;
        }
    };

    faqs = [
        {
            question:
                "What makes Matched Forever different from other matchmaking services?",
            answer: "Lorem ipsum dolor sit amet...",
        },
        {
            question: "How does the matchmaking process work?",
            answer: "The process involves analyzing profiles...",
        },
        {
            question: "Is my personal information secure?",
            answer: "Yes, we ensure top-level encryption and security...",
        },
        {
            question: "What are the membership plans available?",
            answer: "We offer basic and premium plans...",
        },
    ];
    public activeFaq: number | null = null;

    toggleFaq(faqIndex: number): void {
        this.activeFaq = this.activeFaq === faqIndex ? null : faqIndex;
    }
}
