import Timeout from "./Timeout.js";

export default class Slide {

    container: Element; 
    elements: Element[]; 
    controls: Element; 
    time: number;
    index: number;
    element: Element;
    timeout: Timeout | null;
    paused: boolean;
    pausedTimeout: Timeout | null;
    thumbItems: HTMLElement[] | null;
    thumb: HTMLElement | null;

    constructor(
        container: Element, 
        elements: Element[], 
        controls: Element, 
        time: number = 5000) {
            this.container = container;
            this.elements = elements;
            this.controls = controls;
            this.time = time;
            this.index = localStorage.getItem("activeSlide") ? Number(localStorage.getItem("activeSlide")) : 0;
            this.timeout = null;
            this.element = this.elements[this.index];
            this.paused = false;
            this.pausedTimeout = null;
            this.thumbItems = null;
            this.thumb = null;
            this.init()
    }

    hide(el: Element) {
        el.classList.remove('active');
        if(el instanceof HTMLVideoElement) {
            el.currentTime = 0;
            el.pause();
        }
    }

    show(index: number) {
        this.index = index;
        this.element = this.elements[this.index]
        localStorage.setItem("activeSlide", String(this.index))

        if(this.thumbItems) {
            this.thumb = this.thumbItems[this.index];
            this.thumbItems.forEach(el => el.classList.remove('active'))
            this.thumb.classList.add('active')
        }

        this.elements.forEach(el => this.hide(el));
        this.elements[index].classList.add('active');
        if (this.element instanceof HTMLVideoElement) {
            this.autoVideo(this.element)
        } else {
            this.auto(this.time)
        }
    }

    autoVideo(video: HTMLVideoElement) {
        video.muted = true;
        video.play();
        let firstPlay = true;
        video.addEventListener('playing', () => {
            if (firstPlay) this.auto(video.duration * 1000);
            firstPlay = false;
        });
    }

    auto(time: number) {
        this.timeout?.clear();
        this.timeout = new Timeout(() => this.next(), time);
        if(this.thumb) this.thumb.style.animationDuration = `${time}ms`;
    }

    prev() {
        if(this.paused) return
        const prev = this.index > 0 ? this.index - 1 : this.elements.length - 1
        this.show(prev);
    }

    next() {
        if(this.paused) return
        const next = (this.index + 1) < this.elements.length ? this.index + 1 : 0 
        this.show(next);
    }

    pause() {
        document.body.classList.add('paused');
        this.pausedTimeout = new Timeout(() => {
            this.timeout?.pause();
            this.paused = true;
            this.thumb?.classList.add('paused');
            if (this.element instanceof HTMLVideoElement) this.element.pause();
        }, 300);
    }

    continue(){
        document.body.classList.remove('paused');
        this.pausedTimeout?.clear();
        if (this.paused) {
            this.paused = false;
            this.timeout?.continue();
            this.thumb?.classList.remove('paused');
            if (this.element instanceof HTMLVideoElement) this.element.play()
        }
    }

    private addControls() {
        const prevButton = document.createElement("button")
        const nextButton = document.createElement("button")
        this.controls.appendChild(prevButton)
        this.controls.appendChild(nextButton)
        this.controls.addEventListener("pointerdown", () => this.pause())
        document.addEventListener("pointerup", () => this.continue())
        document.addEventListener("touchend", () => this.continue())
        prevButton.addEventListener("pointerup", () => this.prev())
        nextButton.addEventListener("pointerup", () => this.next())
    }

    private addThumbItems() {
        const thumbContainer = document.createElement('div');
        thumbContainer.id = 'slide-thumb';
        for (let i = 0; i < this.elements.length; i++) {
            thumbContainer.innerHTML += `<span><span class="thumb-item"></span></span>`;
        };
        this.controls.appendChild(thumbContainer);
        this.thumbItems = Array.from(document.querySelectorAll(".thumb-item"))
    }

    private init() {
        this.addControls();
        this.addThumbItems();
        this.show(this.index)
    }
}