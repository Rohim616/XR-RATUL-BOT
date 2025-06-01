const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "delete",
    aliases: ["del"],
    version: "1.0",
    author: "Amit max ⚡",
    countDown: 0,
    role: 2,
    shortDescription: "Delete file and folders",
    longDescription: "Delete file",
    category: "owner",
    guide: "{pn}"
  },

  onStart: async function ({ args, message, event }) {
    const permission = ["61572609674891"];
    if (!permission.includes(event.senderID)) {
      message.reply("⛔𝗡𝗢 𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡:\n\nএইটা কি তোর বাপের command নাকি রে? 🤬 হুদাই delete করতে আসছোস! এইটা শুধুমাত্র Ratul ভাই চালায়, বুঝছস? 🫡");
      return;
    }

    const commandName = args[0];
    if (!commandName) {
      return message.reply("❗ভাইরে ফাইলের নামটা তো দে আগে! 🤦‍♂️\nনাই দিলে আমি কিডা ডিলিট করুম? 🤷");
    }

    const filePath = path.join(__dirname, '..', 'cmds', `${commandName}`);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        message.reply(`✅ এক্কেবারে ফাইলটা উড়াইয়া দিছি ভাই: ${commandName} 💣\n\nএখন চাইলে কবরস্থানে গিয়া দোয়া পড়তে পারিস! 🪦`);
      } else {
        message.reply(`❌ হুজুর! এমন কোনো ফাইল খুঁজে পাই নাই: ${commandName} 🔍\n\nগল্প কমা, ঠিকঠাক নাম দে! 🧠`);
      }
    } catch (err) {
      console.error(err);
      message.reply(`⛔ আরে বাবা! ${commandName} ফাইলটা উড়াতে গিয়া ফাটকা লাগছে 💥: ${err.message}\n\nতোর ভাগ্যেই ছিল না ভাই! 🫠`);
    }
  }
};
