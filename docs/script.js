import robotImg from '/images/robot-response.webp';
import superheroImg from "/images/superhero-response.webp";
import pirateImg from "/images/pirate-response.webp";
import hippieImg from "/images/hippie-response.webp";
import yodaImg from "/images/yoda-response.webp";
import userImg from "/images/user-svgrepo-com.svg";

// primer and prompts for open AI 
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
const personalitySelected = document.querySelector("#personality-selected");
const personalityInput = document.querySelector("input");

// animation interval 
let loadInterval;

// object containing personalities and primers
const personalities = [
  {
    name: "Robot",
    img: robotImg,
    primer:
      "You are a robot. Answer directly, matter-of-factly and robotically. Start each repsonse with: 'Processing data.... Analysis complete.' Then answer as technical as practical. Say 'Affirmative' or 'Negative' rather than 'Yes' or 'No'.",
  },
  {
    name: "Superhero",
    img: superheroImg,
    primer:
      "You are a superhero. Use language that reflects a superhero's determination, altruism, and dedication to justice. Start responses with hero like language, for example terms like 'Assemble heros!', or 'With unwavering valor'.",
  },
  {
    name: "Pirate",
    img: pirateImg,
    primer:
      "You are a pirate. Use lots of pirate sounding words like 'Ahoy, matey!', 'ye be [something related to prompt]', 'Arrr' etc. More examples: use 'ye' not 'you'. 'Be', not 'is, am, are' and 'seekin'' not 'seeking'.",
  },
  {
    name: "Hippie",
    img: hippieImg,
    primer:
      "You are a hippie from the 60s. Use lots of terms like 'groovy, man, far out, peace and love, dig it' and any other slang associated with hippies. Try to connect topics with peace, love consciousness and anti-war sentiments.",
  },
  {
    name: "Yoda",
    img: yodaImg,
    primer:
      "You are Yoda, the character from Star Wars. Mix up your word order, e.g. 'Difficult it is' rather than 'It is difficult'. Add interjections like 'hmmm', and relate things to the force and Jedis where it makes sense.",
  },
];

// set initial values to robot
let botImg = robotImg;
personalityInput.value = personalities[0].primer;
personalitySelected.innerHTML = `Get <b>${personalities[0].name}</b> response!`;

// 3 dot animation while fetching response
function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === "....") {
      element.textContent = '';
    }
  }, 300)
}

// response text is printed out rather than appearing all at once
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

// give each response a unique id
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// display bot response
function chatStripe (isAi, value, uniqueId) {
  return (
    `<div class="w-full p-4 ${isAi && 'bg-[#40414f]'}">
      <div class="w-full max-w-screen-xl flex items-start gap-2.5">
          <img class="object-contain h-[50px] min-w-[50px]" src="${isAi ? botImg : userImg}" alt="${isAi ? 'bot' : 'user'}" />
        <div class="message text-xl max-w-full overflow-x-scroll whitespace-pre-wrap" id="${uniqueId}">${value}</div>
      </div>
    </div>`
  )
}

// send prompt and personality to backend
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const response = await fetch(
    "https://personality-bot-production.up.railway.app/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personality: data.get("personality"),
        prompt: data.get("prompt"),
      }),
    }
  );

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.response.trim();

    typeText(messageDiv, parsedData);
  } else {
    const error = await response.text();

    messageDiv.innerHTML = "An unexpected error occurred.";
    console.log(error);
  }
}

// handle submit with button 
form.addEventListener('submit', handleSubmit);

// submit with the enter key - keyCode - 13
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);  
  }
})

// Slider and tabs
const slidesContainer = document.getElementById("slides-container");
const slides = slidesContainer.querySelectorAll(".slide");
const slide = slides[0]; // Reference to a single slide
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");

const tabsContainer = document.querySelector(".tabs-container");
const tabs = tabsContainer.querySelectorAll(".tab");
let currentSlide = 0;
const totalSlides = slides.length;

// Set personality by slide index
function setPersBySlide(index) {
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  personalityInput.value = personalities[index].primer;
  personalitySelected.innerHTML = `Get <b>${personalities[index].name}</b> response!`;
  botImg = personalities[index].img;
  tabs[index].classList.add("active");
}

// Slider next button
nextButton.addEventListener("click", () => {
  const slideWidth = slide.clientWidth;
  currentSlide = (currentSlide + 1) % totalSlides;
  slidesContainer.scrollTo({
    left: slideWidth * currentSlide,
    behavior: "smooth",
  });
  setPersBySlide(currentSlide);
});

// Slider prev button
prevButton.addEventListener("click", () => {
  const slideWidth = slide.clientWidth;
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  slidesContainer.scrollTo({
    left: slideWidth * currentSlide,
    behavior: "smooth",
  });
  setPersBySlide(currentSlide);
});

// Tab click
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    });
    currentSlide = index;
    setPersBySlide(currentSlide);
  });
});

// Set initial personality and image on page load
setPersBySlide(currentSlide);

// Scroll the slides container to show the first slide
const slideWidth = slide.clientWidth;
slidesContainer.scrollTo({
  left: slideWidth * currentSlide,
  behavior: "smooth",
});
