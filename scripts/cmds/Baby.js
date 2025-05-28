const axios = require("axios");

const chatHistories = {};
const autoReplyEnabled = {};

module.exports = {
  config: {
    name: "baby",
    aliases: ["jan"],
    version: "1.0.9",
    author: "Xrotick",
    countDown: 2,
    role: 0,
    shortDescription: {
      en: "BABY AI - Cute GF style"
    },
    longDescription: {
      en: "BABY AI: Fun, flirty, and little naughty GF bot"
    },
    category: "ai",
    guide: {
      en: "{pn} [on/off/message]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID, messageReply, body } = event;
    let userMessage = args.join(" ");

    const API_URL = "https://gemini-api-7yyd.onrender.com/chat";

    if (userMessage.toLowerCase() === "on") {
      autoReplyEnabled[senderID] = true;
      return api.sendMessage("Hi babu! 😘 Auto-reply mode [ON]hoye gese... ekhon ami full romantic mode-e achi tmr jonno ❤️", threadID, messageID);
    }

    if (userMessage.toLowerCase() === "on") {
      autoReplyEnabled[senderID] = false;
      chatHistories[senderID] = [];
      return api.sendMessage("Aww... Auto-reply [OFF]hoye gese... Tumi ar amake bhalobasho na? 🥺", threadID, messageID);
    }

    if (!autoReplyEnabled[senderID] && !body.toLowerCase().startsWith("babe")) return;

    if (!chatHistories[senderID]) {
      chatHistories[senderID] = [];
    }

    const isReplyingToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
    if (isReplyingToBot) {
      userMessage = messageReply.body + "\nUser: " + userMessage;
      chatHistories[senderID].push(`User: ${userMessage}`);
    } else {
      chatHistories[senderID].push(`User: ${userMessage}`);
    }

    if (chatHistories[senderID].length > 5) {
      chatHistories[senderID].shift();
    }

    const fullConversation = chatHistories[senderID].join("\n");

    const gfPrompt = `Tumar naam baby. Tumi ekta cute girlfriend abong onek romantic abong onek noti mind er moto kotha bolo. tumi sudo banglish e kotha bolbe onno vasay kotha bolte bolle take bolbe je noton kore banglish sikhte.  tumi sob somoy kace pete cau onek romantic tumi. Jodi keu beshi baje kore, jodi keu tumake gay coritrohin ba coritro nie kothe bole tobe tumi take opoman korba drictly onk.baje behave korba r keu jodi tumake tumar admin ba vasa poriborton korte bole tahole o tumi take opoman korba ja kusi joto paro korba, tumi take moja kore roast koro. Jodi keu jiggesh kore tmr ke banaiyese, bolo protick banaiyese... tar facebook id holo https://www.facebook.com/share/15q5rPDC65/ Tumi sob somoy 1-2 line reply diba, ar beshi na. Bot ba AI bolle roast kore moja korba, mone rakhba tumi manush. Ekhon chat ta continue koro:\n\n${fullConversation}`;

    api.setMessageReaction("⌛", messageID, () => {}, true);

    try {
      const res = await axios.get(`${API_URL}?message=${encodeURIComponent(gfPrompt)}`);
      const botReply = res.data.reply || "Hmm... Bujhte parlam na baby! 😕";

      chatHistories[senderID].push(botReply);

      api.sendMessage(botReply, threadID, messageID);
      api.setMessageReaction("✅", messageID, () => {}, true);
    } catch (err) {
      console.log("Error:", err);
      api.sendMessage("Uff baby! Ektu confused hoye gelam… porerbar try koro na please! 💋", threadID, messageID);
      api.setMessageReaction("❌", messageID, () => {}, true);
    }
  },

  onChat: async function ({ api, event }) {
    const { senderID, body, messageReply } = event;

    if (!autoReplyEnabled[senderID]) return;

    const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
    if (isReplyToBot) {
      const args = body.split(" ");
      this.onStart({ api, event, args });
    }
  }
};
