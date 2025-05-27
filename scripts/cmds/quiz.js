const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "1.1",
    author: "Dipto (Romantic remix by Amit Max ⚡)",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "{p}quiz\n{p}quiz bn\n{p}quiz en",
  },

  onStart: async function ({ api, event, usersData, args }) {
    const input = args.join('').toLowerCase() || "bn";
    let timeout = 300;
    let category = "bangla";
    if (input === "bn" || input === "bangla") {
      category = "bangla";
    } else if (input === "en" || input === "english") {
      category = "english";
    }

    try {
      const response = await axios.get(
        `${await baseApiUrl()}/quiz?category=${category}&q=random`,
      );

      const quizData = response.data.question;
      const { question, correctAnswer, options } = quizData;
      const { a, b, c, d } = options;
      const namePlayer = await usersData.getName(event.senderID);
      const quizMsg = {
        body: `\n❤️‍🔥 প্রিয় ${namePlayer},\nতোমার মগজ আর মনের একটুখানি পরীক্ষা — 🧑‍🏫 \n\n╭─• প্রশ্ন:\n💭 ${question}\n├───✦ A) ${a}\n├───✦ B) ${b}\n├───✦ C) ${c}\n├───✦ D) ${d}\n╰─➤ উত্তর দিতে মেসেজটা রিপ্লাই করো, ! 💘\n\n⏳ সময় আছে মাত্র ${timeout} সেকেন্ড,  দেরি না করে — উত্তর দাও আর পুরস্কার জিতে নাও!`,
      };

      api.sendMessage(
        quizMsg,
        event.threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            type: "reply",
            commandName: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            dataGame: quizData,
            correctAnswer,
            nameUser: namePlayer,
            attempts: 0
          });
          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, timeout * 1000);
        },
        event.messageID,
      );
    } catch (error) {
      console.error("❌ | Error occurred:", error);
      api.sendMessage("😞 দুঃখিত, কিছু একটা ভুল হয়েছে...\nঅনুগ্রহ করে আবার চেষ্টা করো!", event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, Reply, usersData }) => {
    const { correctAnswer, nameUser, author } = Reply;
    if (event.senderID !== author)
      return api.sendMessage(
        `⛔️ ${nameUser} আর আমার মাঝে প্রেমের কুইজ চলছে…\nতুমি হঠাৎ মাঝখানে এসে বিঘ্ন কেন ঘটাচ্ছো, হুম? 😉`,
        event.threadID,
        event.messageID
      );
    const maxAttempts = 2;

    switch (Reply.type) {
      case "reply": {
        let userReply = event.body.toLowerCase();
        if (Reply.attempts >= maxAttempts) {
          await api.unsendMessage(Reply.messageID);
          return api.sendMessage(
            `😢 ${nameUser}, সব চেষ্টার পরেও সঠিক উত্তরটা মিস করেছো…\n✅ সঠিক উত্তর ছিল: ${correctAnswer}\n\n 💔`,
            event.threadID,
            event.messageID
          );
        }
        if (userReply === correctAnswer.toLowerCase()) {
          api.unsendMessage(Reply.messageID).catch(console.error);
          let rewardCoins = 300;
          let rewardExp = 100;
          let userData = await usersData.get(author);
          await usersData.set(author, {
            money: userData.money + rewardCoins,
            exp: userData.exp + rewardExp,
            data: userData.data,
          });
          return api.sendMessage(
            `✅ বাহ ${nameUser}!\nতুমি সঠিক উত্তর দিয়েছো — ! 🥰\n\n🎁 পুরস্কার:\n💰 ${rewardCoins} কয়েন\n⚡ ${rewardExp} এক্সপি\n\nতুমি সত্যিই একজনে অসাধারণ, আর আমি গর্বিত যে তুমি আমার কুইজ পার্টনার! 💖`,
            event.threadID,
            event.messageID
          );
        } else {
          Reply.attempts += 1;
          global.GoatBot.onReply.set(Reply.messageID, Reply);
          return api.sendMessage(
            `❌ ওহ নাহ! ভুল উত্তর…\nকিন্তু চিন্তা কোরো না ${nameUser},\nতোমার জন্য আরেকটা সুযোগ তো আছেই! 🌟\n\nচলো, আরেকবার ভালোবাসা মিশিয়ে উত্তর দাও — আমি অপেক্ষা করছি! ❤️`,
            event.threadID,
            event.messageID
          );
        }
      }
    }
  },
};
