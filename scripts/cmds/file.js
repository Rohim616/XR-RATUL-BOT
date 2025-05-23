const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "file",
    aliases: ["files", "sendfile"],
    version: "1.1",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: "Send bot script",
    longDescription: "Send bot specified file",
    category: "𝗢𝗪𝗡𝗘𝗥",
    guide: "{pn} ফাইল নাম দে। যেমন: .{pn} filename",
  },

  onStart: async function ({ message, args, api, event }) {
    const permission = ["100092029284179","61572609674891"];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("This file is secret", event.threadID, event.messageID);
    }

    const fileName = args[0];
    if (!fileName) {
      return api.sendMessage("File এর নাম লেখো জান, 😘", event.threadID, event.messageID);
    }

    const safeFileName = path.basename(fileName); 
    const filePath = path.join(__dirname, `${safeFileName}.js`);
    if (!fs.existsSync(filePath)) {
      return api.sendMessage(`এই নামে কোনো File নেই তোমার 🥲: ${safeFileName}.js`, event.threadID, event.messageID);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    api.sendMessage({ body: fileContent }, event.threadID);
  }
};
