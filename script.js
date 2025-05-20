/* ------------------ Textarea & Compose Functions ------------------ */
const textarea = document.getElementById("postContent");
const charCount = document.getElementById("charCount");

textarea.addEventListener("input", () => {
  const len = textarea.value.length;
  charCount.textContent = `${len}/300`;
  if (len > 300) {
    charCount.classList.add("limit-exceeded");
    textarea.style.color = "red";
  } else {
    charCount.classList.remove("limit-exceeded");
    textarea.style.color = "#333";
  }
});

function getIntentLink() {
  const content = textarea.value;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  return isMobile
    ? "bluesky://intent/compose?text=" + encodeURIComponent(content)
    : "https://bsky.app/intent/compose?text=" + encodeURIComponent(content);
}

document.getElementById("composeForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const content = textarea.value.trim();
  if (!content) {
    alert("Please enter some text to post.");
    return;
  }
  if (content.length > 300) {
    alert("Your post exceeds the 300 character limit.");
    return;
  }
  const intentUrl = getIntentLink();
  window.location.href = intentUrl;
  setTimeout(() => {
    alert("If the BlueSky app did not open, please ensure it is installed on your device.");
  }, 1000);
});

document.getElementById("copyLinkButton").addEventListener("click", function() {
  const intentUrl = getIntentLink();
  if (!navigator.clipboard) {
    prompt("Copy the link:", intentUrl);
  } else {
    navigator.clipboard.writeText(intentUrl).then(() => {
      const copyMsg = document.getElementById("copyMessage");
      copyMsg.style.opacity = 1;
      setTimeout(() => {
        copyMsg.style.opacity = 0;
      }, 2000);
    }, () => {
      alert("Failed to copy link. Please try again.");
    });
  }
});

/* ------------------ Emoji Picker Functions ------------------ */
const emojiButton = document.getElementById("emojiButton");
const emojiPicker = document.getElementById("emojiPicker");
const emojiSearch = document.getElementById("emojiSearch");
const emojiGrid = document.getElementById("emojiGrid");
const loadMoreButton = document.getElementById("loadMoreButton");

// Full list of emoji objects (each with an emoji and a name)
const fullEmojiList = [
  {emoji: "😀", name: "grinning face"},
  {emoji: "😃", name: "smiley face"},
  {emoji: "😄", name: "smile"},
  {emoji: "😁", name: "beaming face"},
  {emoji: "😆", name: "laughing"},
  {emoji: "😅", name: "sweat smile"},
  {emoji: "😂", name: "tears of joy"},
  {emoji: "🤣", name: "rolling on the floor laughing"},
  {emoji: "😊", name: "blushing"},
  {emoji: "😇", name: "smiling face with halo"},
  {emoji: "🙂", name: "slight smile"},
  {emoji: "🙃", name: "upside down"},
  {emoji: "😉", name: "winking"},
  {emoji: "😌", name: "relieved"},
  {emoji: "😍", name: "heart eyes"},
  {emoji: "🥰", name: "smiling with hearts"},
  {emoji: "😘", name: "face blowing a kiss"},
  {emoji: "😗", name: "kissing"},
  {emoji: "😙", name: "kissing smiling eyes"},
  {emoji: "😚", name: "kissing closed eyes"},
  {emoji: "😋", name: "yum"},
  {emoji: "😛", name: "stuck out tongue"},
  {emoji: "😝", name: "squinting tongue"},
  {emoji: "😜", name: "winking tongue"},
  {emoji: "🤪", name: "zany"},
  {emoji: "🤨", name: "raised eyebrow"},
  {emoji: "🧐", name: "monocle"},
  {emoji: "🤓", name: "nerd"},
  {emoji: "😎", name: "sunglasses"},
  {emoji: "🥸", name: "disguised"},
  {emoji: "🤩", name: "starstruck"},
  {emoji: "🥳", name: "party"},
  {emoji: "😏", name: "smirk"},
  {emoji: "😒", name: "unamused"},
  {emoji: "😞", name: "disappointed"},
  {emoji: "😔", name: "pensive"},
  {emoji: "😟", name: "worried"},
  {emoji: "😕", name: "confused"},
  {emoji: "🙁", name: "slightly frowning"},
  {emoji: "☹️", name: "frowning face"},
  {emoji: "😣", name: "persevering"},
  {emoji: "😖", name: "confounded"},
  {emoji: "😫", name: "tired face"},
  {emoji: "😩", name: "weary"},
  {emoji: "🥺", name: "pleading"},
  {emoji: "😢", name: "crying"},
  {emoji: "😭", name: "sobbing"},
  {emoji: "😤", name: "triumph"},
  {emoji: "😠", name: "angry"},
  {emoji: "😡", name: "pouting"},
  {emoji: "🤬", name: "cursing"},
  {emoji: "🤯", name: "exploding head"},
  {emoji: "😳", name: "flushed"},
  {emoji: "🥵", name: "hot"},
  {emoji: "🥶", name: "cold"},
  {emoji: "😱", name: "screaming"},
  {emoji: "😨", name: "fearful"},
  {emoji: "😰", name: "anxious"},
  {emoji: "😥", name: "disappointed but relieved"},
  {emoji: "😓", name: "downcast"},
  {emoji: "🤗", name: "hugging"},
  {emoji: "🤔", name: "thinking"},
  {emoji: "🤭", name: "hand over mouth"},
  {emoji: "🤫", name: "shushing"},
  {emoji: "🤥", name: "lying"},
  {emoji: "😶", name: "speechless"},
  {emoji: "😐", name: "neutral face"},
  {emoji: "😑", name: "expressionless"},
  {emoji: "😬", name: "grimacing"},
  {emoji: "🙄", name: "rolling eyes"},
  {emoji: "😯", name: "hushed"},
  {emoji: "😦", name: "frowning"},
  {emoji: "😧", name: "anguished"},
  {emoji: "😮", name: "open mouth"},
  {emoji: "😲", name: "astonished"},
  {emoji: "🥱", name: "yawning"},
  {emoji: "😴", name: "sleeping"},
  {emoji: "🤤", name: "drooling"},
  {emoji: "😪", name: "sleepy"},
  {emoji: "😵", name: "dizzy"},
  {emoji: "🤐", name: "zipper mouth"},
  {emoji: "🥴", name: "woozy"},
  {emoji: "🤢", name: "nauseated"},
  {emoji: "🤮", name: "vomiting"},
  {emoji: "🤧", name: "sneezing"},
  {emoji: "😷", name: "mask"},
  {emoji: "🤒", name: "thermometer face"},
  {emoji: "🤕", name: "head bandage"},
  {emoji: "🤑", name: "money mouth"},
  {emoji: "🤠", name: "cowboy"},
  {emoji: "😈", name: "smiling devil"},
  {emoji: "👿", name: "angry devil"},
  {emoji: "👹", name: "ogre"},
  {emoji: "👺", name: "goblin"},
  {emoji: "🤡", name: "clown"},
  {emoji: "💩", name: "poop"},
  {emoji: "👻", name: "ghost"},
  {emoji: "💀", name: "skull"},
  {emoji: "☠️", name: "skull & crossbones"},
  {emoji: "👽", name: "alien"},
  {emoji: "👾", name: "space invader"},
  {emoji: "🤖", name: "robot"},
  {emoji: "🎃", name: "jack-o-lantern"},
  {emoji: "😺", name: "smiling cat"},
  {emoji: "😸", name: "grinning cat"},
  {emoji: "😹", name: "cat with tears of joy"},
  {emoji: "😻", name: "heart eyes cat"},
  {emoji: "😼", name: "wry cat"},
  {emoji: "😽", name: "kissing cat"},
  {emoji: "🙀", name: "weary cat"},
  {emoji: "😿", name: "crying cat"},
  {emoji: "😾", name: "pouting cat"},
  // Hand motion emojis
  {emoji: "👆", name: "pointing up"},
  {emoji: "👇", name: "pointing down"},
  {emoji: "👈", name: "pointing left"},
  {emoji: "👉", name: "pointing right"}
];

let filteredEmojiList = [...fullEmojiList];
const pageSize = 30;
let currentEmojiIndex = 0;

function renderEmojiGrid() {
  const endIndex = Math.min(currentEmojiIndex + pageSize, filteredEmojiList.length);
  for (let i = currentEmojiIndex; i < endIndex; i++) {
    const emojiObj = filteredEmojiList[i];
    const span = document.createElement("span");
    span.classList.add("emojiItem");
    span.textContent = emojiObj.emoji;
    span.title = emojiObj.name;
    emojiGrid.appendChild(span);
  }
  currentEmojiIndex = endIndex;
  loadMoreButton.style.display = (currentEmojiIndex >= filteredEmojiList.length) ? "none" : "block";
}

function initEmojiGrid() {
  currentEmojiIndex = 0;
  emojiGrid.innerHTML = "";
  renderEmojiGrid();
}

emojiSearch.addEventListener("input", () => {
  const query = emojiSearch.value.trim().toLowerCase();
  filteredEmojiList = fullEmojiList.filter(item => {
    return item.name.toLowerCase().includes(query);
  });
  initEmojiGrid();
});

emojiButton.addEventListener("click", function () {
  if (emojiPicker.style.display === "none" || emojiPicker.style.display === "") {
    emojiPicker.style.display = "block";
    initEmojiGrid();
  } else {
    emojiPicker.style.display = "none";
  }
});

loadMoreButton.addEventListener("click", () => {
  renderEmojiGrid();
});

emojiGrid.addEventListener("click", function (e) {
  if (e.target.classList.contains("emojiItem")) {
    const emoji = e.target.textContent;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    textarea.value = text.slice(0, start) + emoji + text.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    textarea.dispatchEvent(new Event("input"));
  }
});
