const button = document.querySelector(".advice-button");
const textField = document.querySelector(".advice");
const id = document.querySelector(".advice-id");
const t2 = gsap.timeline();
const quoteElement = document.getElementById("quote");
const neWords = quoteElement.textContent.trim().split(/\s+/);

window.addEventListener("load", function () {
  getAdvice();

  const tl = gsap.timeline();
  button.addEventListener("click", async () => {
    button.disabled = true;
    words = quoteElement.textContent.trim().split(/\s+/);
    gsap.to(".advice", {
      y: 0,
      opacity: 0,
      duration: 0.5,
      ease: "none",
      onComplete: fetchAndDisplayAdvice,
    });
  });

  tl.to(".container", { opacity: 1, duration: 0.5 });

  tl.from(".advice-header", { y: -100, opacity: 0, duration: 0.5 });
  tl.from(".advice", { y: 100, opacity: 0, duration: 0.5 }, "-=0.25");
  tl.to(".advice-button", { bottom: "-1.5rem", duration: 0 });
  tl.from(".advice-button", { opacity: 0, scale: 0.5, duration: 0.5 });
});

function fetchAndDisplayAdvice() {
  getAdvice().then(() => {
    gsap.set(".advice", { y: 0, opacity: 0 });
    gsap.to(".advice", {
      y: 0,
      opacity: 1,
      duration: 0.5,
      clearProps: "all",
      ease: "none",
      onComplete: () => {
        setTimeout(() => {
          button.disabled = false;
        }, 500);
      },
    });
  });
}

const getAdvice = () => {
  return axios
    .get("https://api.adviceslip.com/advice")
    .then((res) => {
      textField.innerHTML = res.data.slip.advice;
      id.innerHTML = res.data.slip.id;
      console.log(res);
      quoteElement.textContent = "";
      newWords = res.data.slip.advice.trim().split(/\s+/);
      newWords.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        if (index !== newWords.length - 1) {
          wordSpan.innerHTML = word + "&nbsp;";
        } else {
          wordSpan.textContent = word;
        }
        wordSpan.style.cursor = "pointer";
        wordSpan.style.display = "inline-block";
        wordSpan.style.transformOrigin = "center";

        wordSpan.addEventListener("mouseenter", handleWordHover);
        wordSpan.addEventListener("mouseleave", handleWordUnhover);

        quoteElement.appendChild(wordSpan);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

button.addEventListener("mouseover", () => {
  hoverAnimation(button);
});

button.addEventListener("mouseout", () => {
  unhoverAnimation(button);
});

function hoverAnimation(button) {
  gsap.to(button, {
    scale: 1.05,
    boxShadow: "0px 0px 30px 0px hsl(150, 100%, 66%)",
    duration: 0.3,
  });
}

function unhoverAnimation(button) {
  gsap.to(button, { scale: 1, boxShadow: "none", duration: 0.3 });
}

quoteElement.textContent = "";

function handleWordHover(event) {
  gsap.to(event.target, {
    overwrite: "auto",
    scale: "1.05",
    color: "hsl(150, 100%, 66%)",
    duration: 0.3,
  });
}

function handleWordUnhover(event) {
  gsap.to(event.target, {
    scale: "1",
    color: "hsl(193, 38%, 86%)",
    duration: 3,
  });
}
