document.addEventListener('DOMContentLoaded', () => {
    const typingTextElement = document.getElementById('typing-text');
    const titles = ["Rookie Techie", "Curious Coder", "Always Learning, Always Building"];
    const TYPING_SPEED = 150;
    const DELETING_SPEED = 75;
    const PAUSE_END = 2000;
    const PAUSE_BEFORE_NEXT = 500;
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentTitle = titles[titleIndex];
        let currentText = '';
        let speed = TYPING_SPEED;
        if (isDeleting) {
            speed = DELETING_SPEED;
            currentText = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            speed = TYPING_SPEED;
            currentText = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }
        typingTextElement.textContent = currentText;
        if (!isDeleting && charIndex === currentTitle.length) {
            speed = PAUSE_END;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            speed = PAUSE_BEFORE_NEXT;
        }
        setTimeout(type, speed);
    }
    type();
});

document.addEventListener('DOMContentLoaded', () => {
    const jokeButton = document.getElementById("jokeBtn");
    const jokeContainer = document.getElementById("joke");
    if (jokeButton && jokeContainer) {
        const setupSpan = jokeContainer.querySelector(".joke-setup");
        const punchlineSpan = jokeContainer.querySelector(".joke-punchline");
        jokeButton.addEventListener("click", () => {
            setupSpan.innerText = "Thinking...";
            punchlineSpan.innerText = "";
            jokeContainer.classList.add("loading-joke");
            fetch("https://official-joke-api.appspot.com/random_joke")
                .then(response => response.json())
                .then(data => {
                    jokeContainer.classList.remove("loading-joke");
                    setupSpan.innerText = data.setup;
                    punchlineSpan.innerText = "— " + data.punchline;
                })
                .catch(error => {
                    jokeContainer.classList.remove("loading-joke");
                    setupSpan.innerText = "Oops! Couldn't fetch a joke. Please try again. 😅";
                    punchlineSpan.innerText = "";
                    console.error("Error fetching joke:", error);
                });
        });
    }
});