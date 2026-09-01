const collectionItems = document.querySelectorAll(".collection-item");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
        }

    });

});

collectionItems.forEach((item) => {
    observer.observe(item);
});

const scrollDot = document.querySelector(".scroll-dot");

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    const scrollableHeight = pageHeight - windowHeight;

    const scrollProgress = scrollTop / scrollableHeight;

const lineSize = 170;

scrollDot.style.transform =
    `translateX(-50%) translateY(${scrollProgress * lineSize}px)`;
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