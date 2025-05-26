const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "age",
    aliases: [],
    version: "1.1",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: "Check age with style",
    longDescription: "Check your age in years, months, weeks, hours, etc.",
    category: "utility",
    guide: {
      en: "{pn} [DD-MM-YYYY]"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID } = event;

    if (!args[0]) {
      return api.sendMessage("⚠️ Please provide your birthdate in DD-MM-YYYY format.\n\nExample: `.age 27-02-2005`", threadID, messageID);
    }

    const birthDate = moment.tz(args[0], "DD-MM-YYYY", true, "Asia/Dhaka");

    if (!birthDate.isValid()) {
      return api.sendMessage("❌ Invalid date format.\nPlease use DD-MM-YYYY format.", threadID, messageID);
    }

    const now = moment.tz("Asia/Dhaka");
    const ageDuration = moment.duration(now.diff(birthDate));

    const years = ageDuration.years();
    const months = ageDuration.months();
    const days = ageDuration.days();
    const totalDays = now.diff(birthDate, "days");
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = now.diff(birthDate, "hours");
    const totalMinutes = now.diff(birthDate, "minutes");
    const totalSeconds = now.diff(birthDate, "seconds");

    // Calculate next birthday
    const nextBirthday = birthDate.clone().year(now.year());
    if (nextBirthday.isBefore(now)) {
      nextBirthday.add(1, 'year');
    }
    const daysLeft = nextBirthday.diff(now, 'days');

    // Get gender (with fallback)
    let genderRaw = await usersData.get(senderID, "gender");
    let gender = (typeof genderRaw === 'string') ? genderRaw.toUpperCase() : "MALE";

    const maleRatings = [
      "10/10 Handsome", "8/10 Cutie", "9/10 Dashing", "7/10 Smart guy",
      "11/10 Sexy beast", "100/10 Dream boy", "Too hot to rate"
    ];

    const femaleRatings = [
      "10/10 Beautiful", "9/10 Pretty", "8/10 Cute", "11/10 Angelic",
      "100/10 Queen", "Too adorable", "Unreal Beauty"
    ];

    const rating = gender === "FEMALE"
      ? femaleRatings[Math.floor(Math.random() * femaleRatings.length)]
      : maleRatings[Math.floor(Math.random() * maleRatings.length)];

    const ageText =
      `🌸 Your Age Details:\n` +
      `──────────────\n` +
      `🎂 Years: ${years} years\n` +
      `🗓️ Months: ${months} months\n` +
      `📅 Days: ${days} days\n` +
      `📆 Total: ${totalDays} days | ${totalWeeks} weeks\n` +
      `⏰ ${totalHours} hours | ${totalMinutes} minutes | ${totalSeconds} seconds\n` +
      `──────────────\n` +
      `🎉 Next Birthday in: ${daysLeft} days\n` +
      `✨ Cute Rating: ${rating}`;

    return api.sendMessage(ageText, threadID, messageID);
  }
};
