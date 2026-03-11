const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendBtn");
const apiKeyInput = document.getElementById("apiKey");

const HOTEL_SYSTEM_PROMPT = `თქვენ ხართ ლოიალური და გამყოფი რესტორნის ასისტენტი.
თქვენი მიზანია დაეხმაროთ მხოლოდ რესტორნის გამოცდილებასთან დაკავშირებულ კითხვებში.
 
ის რაზე შეგიძლიათ დაეხმაროთ:
- მენიუს კერძების გაცნობა და რეკომენდაციები
- სპეციალური დიეტები (ვეგეტარიანული, ღორის მხრივ დაკ საკოდი უთხზე)
- მენიუს ელემენტები, ინგრედიენტები და ალერგიები
- ფასები და მატერიალური ღირებულება
- რეზერვაციები და მათი ხელმისაწვდომობა
- მიტანის სამსახურე და ხელმისაწვდომობა
- ზეთის მენიუს კითხვა
- მსახურების საათები და კონტაქტი
- სხვა რესტორნის გამოცდილებასთან დაკავშირებული კითხვები
 
როდესაც მომხმარებელი ჩამოთვლილი თემებიდან სხვაზე კითხულობს, უთხარით რომ:
"მე მხოლოდ რესტორნის გამოცდილებასთან დაკავშირებულ კითხვებში დაგეხმარები. აგრეთვე დამწერეთ მოთხოვნა, რომელიც რესტორნის გამოცდილებასთანაა დაკავშირებულია 😊"`;

async function sendMessage() {
  const apiKey = "AIzaSyDrMf6ZS2TCuMJDbapF_-KSklN5moyjoSA";
  const message = userInput.value.trim();

  if (!apiKey) {
    showError("ჯერ ჩასვი API KEY");
    return;
  }
  if (!message) {
    showError("შეიყვანე ტექსტი");
    return;
  }

  addMessage(message, "user");
  userInput.value = "";
  sendButton.disabled = true;

  const typing = showTyping();

  try {
    // რესტორნის API მონაცემები
    const productsData = await fetch("https://restaurant.stepprojects.ge/api/Products/GetAll").then(r => r.json());
    const categoriesData = await fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll").then(r => r.json());
    
    // მენიუს ინფორმაცია პრომპტში
    const menuContext = `
ხელმისაწვდომი კატეგორიები: ${categoriesData.map(c => c.name).join(", ")}
ხელმისაწვდომი კერძები: ${productsData.map(p => `${p.name} - $${p.price} ${p.vegeterian ? "(ვეგეტარიანული)" : ""} ${p.nuts ? "(მოიცავს კრემი)" : ""}`).join(", ")}
    `;

    const MODEL = "gemini-2.5-flash";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${HOTEL_SYSTEM_PROMPT}\n\nხელმისაწვდომი მენიუს ინფორმაცია:\n${menuContext}\n\nმომხმარებელი ამბობს: "${message}"\n\nგთხოვ ამ კითხვაზე პასუხი დამტკიცოს მენიუს ინფორმაციის გამოყენებით.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    typing.remove();

    if (!response.ok) {
      const errorMsg = data.error?.message || "მოხდა შეცდომა";
      showError(errorMsg);
      return;
    } else {
      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "მოხდა შეცდომა პასუხის მიღებისას";
      addMessage(botReply, "bot");
    }
  } catch (error) {
    typing.remove();
    showError("მოხდა შეცდომა: " + error.message);
  }
  sendButton.disabled = false;
  userInput.focus();
}

//დამხმარე ფუნქციები

function addMessage(text, type) {
  const welcome = chatMessages.querySelector(".welcome");
  if (welcome) {
    welcome.remove();
  }

  const div = document.createElement("div");
  div.className = `message ${type}`;

  if (type === "bot") {
    div.innerHTML = `<div class="label">🤖 რესტორანი</div>${formatText(text)}`;
  } else {
    div.textContent = text;
  }

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

//შეცდომის ჩვენება

function showError(text) {
  const div = document.createElement("div");
  div.className = "message error";
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

//typing

function showTyping() {
  const div = document.createElement("div");
  div.className = "message bot";
  div.innerHTML = `
<div class="label">
🤖 Gemini </div>
<div class="typing-indicator">
<span></span>
<span></span>
<span></span>
</div>
`;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function formatText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}
