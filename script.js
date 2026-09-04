const loadingScreen = document.querySelector(".loading-screen");
const heroVideo = document.querySelector(".hero-image video");

heroVideo.addEventListener("canplay", () => {

    setTimeout(() => {
        loadingScreen.classList.add("is-hidden");
        document.querySelector(".hero").classList.add("is-visible");
    }, 1500);

});

const animatedItems = document.querySelectorAll(
    ".collection-item, .brand-statement, .statement,.objects,.cta"
);

const about = document.querySelector(".about");

const aboutObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            about.classList.add("is-visible");
        } else {
            about.classList.remove("is-visible");
        }

    });

}, {
    rootMargin: "0px"
});

aboutObserver.observe(about);

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
        } else {
            entry.target.classList.remove("is-visible");
        }

    });

}, {
rootMargin: "0px 0px 20% 0px"});

animatedItems.forEach((item) => {
    observer.observe(item);
});

const scrollDot = document.querySelector(".scroll-dot");
const scrollLine = document.querySelector(".scroll-line");
const objectsSection = document.querySelector(".objects");
const scrollNumbers = document.querySelectorAll(".scroll-number");

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    const scrollableHeight = pageHeight - windowHeight;

    const scrollProgress = scrollTop / scrollableHeight;

let lineSize;

if (window.innerWidth <= 768) {
    lineSize = 74;
} else {
    lineSize = 163;
}

scrollDot.style.transform =
    `translateX(-50%) translateY(${scrollProgress * lineSize}px)`;
const objectsRect = objectsSection.getBoundingClientRect();

if (
    objectsRect.top <= window.innerHeight / 2 &&
    objectsRect.bottom >= window.innerHeight / 2
) {
    scrollLine.style.backgroundColor = "#F1EEE7";
    scrollDot.style.backgroundColor = "#F1EEE7";
    scrollNumbers.forEach((number) => {
    number.style.color = "#F1EEE7";
});
} else {
    scrollLine.style.backgroundColor = "#523E32";
    scrollDot.style.backgroundColor = "#523E32";
    scrollNumbers.forEach((number) => {
    number.style.color = "#523E32";
});
}

}
);

const sections = document.querySelectorAll("main > section");
const scrollNumber = document.querySelector(".scroll-number-top");

window.addEventListener("scroll", () => {

    const center = window.innerHeight / 2;
    let currentSection = 1;

    sections.forEach((section, index) => {

        const rect = section.getBoundingClientRect();

        if (rect.top <= center) {
            currentSection = index + 1;
        }

    });

    scrollNumber.textContent =
        String(currentSection).padStart(2, "0");

});

window.addEventListener("load", () => {
    document.querySelector(".hero").classList.add("is-visible");
});