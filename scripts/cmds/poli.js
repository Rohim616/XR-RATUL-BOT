module.exports = {
  config: {
    name: "poli",
    aliases: ["ai5"],
    version: "1.0.0",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: "Generate image from prompt",
    longDescription: "Generate image from text prompt using Pollinations AI",
    category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
    guide: {
      en: "{pn} [prompt]\n\nExample:\n.poli A flying house with balloons"
    }
  },

  onStart: async function ({ message, args, api }) {
    const prompt = args.join(" ");
    if (!prompt)
      return message.reply("🖼️ Please provide a prompt!\n\nExample:\n.poli A flying house with balloons");

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    
    try {
      const img = await global.utils.getStreamFromURL(imageUrl);
      message.reply({
        body: `🎨 Image generated for:\n"${prompt}"`,
        attachment: img
      });
    } catch (err) {
      message.reply("❌ Failed to fetch image. Try again later.");
    }
  }
};
