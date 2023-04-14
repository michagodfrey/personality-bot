import robotImg from '/images/robot-response.webp';
import superheroImg from "/images/superhero-response.webp";
import pirateImg from "/images/pirate-response.webp";
import hippieImg from "/images/hippie-response.webp";
import yodaImg from "/images/yoda-response.webp";
import userImg from "/images/user-svgrepo-com.svg";

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
const personalityInput = document.querySelector('input');

const personalities = [
  { name: "Robot", img: robotImg },
  { name: "Superhero", img: superheroImg },
  { name: "Pirate", img: pirateImg },
  { name: "Hippie", img: hippieImg },
  { name: "Yoda", img: yodaImg },
];

let botImg = robotImg;
let loadInterval;

personalityInput.value = "Robot";

personalities.forEach((personalityObj) => {
  const personalityButton = document.getElementById(personalityObj.name);
  personalityButton.addEventListener("click", () => {
    botImg = personalityObj.img;
    personalityInput.value = personalityObj.name;
  });
});

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === "....") {
      element.textContent = '';
    }
  }, 300)
}

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

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
  return (
    `<div class="w-full p-4 ${isAi && 'bg-[#40414f]'}">
      <div class="w-full max-w-screen-xl flex items-start gap-2.5">
        <div class="w-9 h-9 rounded-lg ${isAi ? 'bg-[#5436da]' : 'bg-[#10a37f]' }  flex justify-center items-center">
          <img class="object-contain w-[60%] h-[60%]" src="${isAi ? botImg : userImg}" alt="${isAi ? 'bot' : 'user'}" />
        </div>
        <div class="text-xl max-w-full overflow-x-scroll whitespace-pre-wrap" id="${uniqueId}">${value}</div>
      </div>
    </div>`
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // ai chatstrip
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const response = await fetch("https://personality-bot.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personality: data.get("personality"),
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData)
  } else {
    const error = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    console.log(error);
    alert(error);
  }
}

form.addEventListener('submit', handleSubmit);

form.addEventListener('keyup', (e) => {
  // 13 is the enter key
  if (e.keyCode === 13) {
    handleSubmit(e);  
  }
})