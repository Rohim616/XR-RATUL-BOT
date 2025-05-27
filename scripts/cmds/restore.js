const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "restore",
    aliases: ["rs"],
    version: "1.0",
    author: "Amit Max ⚡",
    countDown: 0,
    role: 2,
    shortDescription: "Restore deleted command",
    longDescription: "Restore a command file from trash folder",
    category: "owner",
    guide: "{pn} <filename>"
  },

  onStart: async function ({ args, message, event }) {
    const permission = ["61572609674891"];
    if (!permission.includes(event.senderID)) {
      return message.reply("⛔ আপনার অনুমতি নেই এই কমান্ড চালানোর জন্য।");
    }

    const fileName = args[0];
    if (!fileName) return message.reply("⚠️ রিস্টোর করার জন্য ফাইলের নাম দিন: `{pn} filename.js`");

    const trashPath = path.join(__dirname, '..', 'trash', fileName);
    const restorePath = path.join(__dirname, '..', 'cmds', fileName);

    if (!fs.existsSync(trashPath)) {
      return message.reply(`❌ trash ফোল্ডারে *${fileName}* ফাইলটি পাওয়া যায়নি।`);
    }

    try {
      fs.renameSync(trashPath, restorePath);
      return message.reply(`✅ সফলভাবে *${fileName}* ফাইলটি পুনরুদ্ধার করা হয়েছে!`);
    } catch (err) {
      return message.reply(`❌ পুনরুদ্ধার করতে সমস্যা হয়েছে: ${err.message}`);
    }
  }
};
