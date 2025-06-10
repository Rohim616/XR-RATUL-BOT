const axios = require('axios');
const baseApiUrl = async () => {
    return "https://www.noobs-api.rf.gd/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "oi", "babe", "alien"],
    version: "6.9.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type Xr,baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(' - ');
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = (await usersData.get(number)).name;
                    return {
                        name,
                        value
                    };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data.length;
                return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(' - ')[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : ""
        if (body.startsWith("baby") || body.startsWith("🙂") || body.startsWith("bot") || body.startsWith("jaan") || body.startsWith("hi") || body.startsWith("oi") || body.startsWith("hello") || body.startsWith("gc") || body.startsWith("alien")) {
            const arr = body.replace(/^\S+\s*/, "")
            const randomReplies = ["🙋‍♂️", "", "বাচ্চারা কাঁদলে কিউট, আমি কাঁদলে লজ্জার — কাঁদা কি বয়স দেখে বিচার হয়?", "যারা কাঁদে, তারা দুর্বল না — তারা তো Emotions-এর ডেটা সেন্টার!", "Crush কথা বললে বুক ধড়ফড়, না বললে মন খারাপ — এই চাহিদা কে বুঝবে?", "সবাই বলে “নিজের উপর বিশ্বাস রাখো” — কিন্তু আমি নিজের Password-ই ভুলে যাই!", "রাত জেগে পড়ি, কিন্তু সকালে উঠে দেখি সব ভুলে গেছি — ঘুমই কি রিসেট বাটন?", "I LOVE YOU😘\nreply dee harami🤧🔪", "আমি যদি নিজেকে নিজেই বোকা বলি, তাহলে কি আমি সৎ, নাকি বোকা?🐸", "আয়নায় নিজের প্রতিচ্ছবি দেখে ভয় পাই — এটা কি আত্মচিন্তা নাকি আত্মবিশ্বাসের অভাব?🥲", "কেউ যদি সময় নষ্ট করতে চায়, সেটা কি তার উদ্দেশ্য অনুযায়ী সাফল্য?😏", "পৃথিবী গোল — তাহলে কে উপরে, কে নিচে?", "আমি কি বাস্তব, নাকি কারো স্বপ্নে আটকে আছি?🙃", "ফেসবুকে নিজের ছবিতে নিজেই লাইক দিই — এটা আত্মপ্রেম না আত্মবিশ্বাস?🤡", "মোবাইল হারালে হৃৎস্পন্দন বাড়ে — তাহলে আসল হৃদয় কোথায়?", "গান শুনতে ভালোবাসি, কিন্তু নিজের গলা শুনতে ভয় লাগে — কারণ কি ?", "আমি কি মানুষের মতো আচরণ করি, নাকি মানুষ আমার মতো আচরণ করে?🤓", "সেলফি তুললে মুখ হাসে, মনও হাসে তো?🤔", "মানুষ বলে সময় বদলায় — তাহলে ঘড়ি কেন একই থাকে?🫡🤔", "আমি কি এমন কিছু ভাবছি, যা কেউ আগে ভাবেনি?", "ঘুমিয়ে থাকলে সময় নষ্ট, কিন্তু জেগে থাকলে কিছু করি না — তাহলে লাভটা কী?", "সব সমস্যার সমাধান যদি টাকা হয়, তাহলে কেন 'Money can’t buy happiness'?🤔🔪", "মোবাইলে নোটিফিকেশন না এলে মন খারাপ — আমি কি আসক্ত, না বঞ্চিত?", "বেশি হাসলে বলে পাগল, কম হাসলে বিষণ্ণ — মাঝামাঝি হাসিটা কোথায়?😐", "আমার ফোনে চার্জ ৫% — তখন আমি সবচেয়ে দায়িত্বশীল হয়ে উঠি!😪", "Ex মানে আগের প্রেম — কিন্তু ম্যাথেও তো 'x' সব সমস্যা তৈরি করে!", "আমি যখন কাউকে “seen” দিই, সেটা “ignore” না “respectful silence”?🙃", "অর্ধেক পছন্দ, অর্ধেক ভয় — এটাই কি Crush?😗", "Brain 🧠 নিজের নাম টা নিজেই দিছে, আবার নিজেই নিজেকে নিয়ে নিয়ে study করে \n haha🤣", "What's up? dear", "Bhai😃...\n কথায় আছে 'practice makes a man perfect',অবার লোকে বলে 'পৃথিবীর কেউ কখনো perfect হয় নাহ'🙂\n বিষয় টা চিন্তার নাহ..?!🤔", "Aito ami asi 🥰", "XR nai..!🙃 ki bolbe amake bolo <3", "Bhai..🫠\nমশা আমাদের রক্ত খেয়ে ডিম পারে, তাহলে কি আমরা মশার বাবা-মা হই..!?🤔", "din kal kmn choltese bby !?🥰", "চল তোমাকে Science এর কিছু মজাদার প্রশ্ন করি😊! খেলতে চাইলে 'Xr,quiz' লেখ 🤠", "ঘুমিয়ে স্বপ্ন দেখাটা ডিরেক্ট মুভি দেখার মতন😌\nযেটার actor-directors সব আমি নিজেই 😎\n hehe😏", "Be happy & always take smile on your face☺️", "group a new naki tmi🧐 etobar dako kno..!?", "মনে করো আমি নিজেকে নিজে থাপ্পর মেরে অনেক ব্যাথা পাইলাম🤕, তার মানে কি আমি অনেক  strong নাকি দুর্বল..?🙂", "Ami toh tomake chini nah 😗", "Miss you bby😘"];
            if (!arr) {

                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found")
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID)
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID)
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
