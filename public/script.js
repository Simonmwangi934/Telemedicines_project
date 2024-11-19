document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll(".side-menu ul li a");
    const dynamicContent = document.getElementById("dynamic-content");

    function loadContent(url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                dynamicContent.innerHTML = data;
            })
            .catch(error => console.error("Error loading content:", error));
    }

    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const url = this.getAttribute("href");
            loadContent(url);
        });
    });
});