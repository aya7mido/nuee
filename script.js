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