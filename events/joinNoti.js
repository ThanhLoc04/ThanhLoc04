const axios = require('axios');
async function streamUrl(url) {
  const res = await axios({
    url: url,
    method: 'GET',
    responseType: 'stream'
  });
  return res.data;
}

module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "Mirai Team",
  description: "Thông báo bot hoặc người vào nhóm có random gif/ảnh/video",
  dependencies: {
    "pidusage": "",
    "axios": ""
  }
};
let _0 = x => x < 10 ? '0' + x : x;
let time_str = time => (d => `${_0(d.getHours())}:${_0(d.getMinutes())}:${_0(d.getSeconds())}, ${_0(d.getDate())}/${_0(d.getMonth() + 1)}/${d.getFullYear()} (Thứ ${d.getDay() == 0 ? 'Chủ Nhật' : d.getDay() + 1})`)(new Date(time));


module.exports.run = async function({ api, event, Users, Threads }) {

  const image = (await axios.get('https://api-2.longbui19.repl.co/api1/ap.php')).data.data;
  const { threadID } = event;
  ////////////////////////////////////////////////////////
  const thread = global.data.threadData.get(threadID) || {};
  if (typeof thread["joinNoti"] != "undefined" && thread["joinNoti"] == false) return;
  ///////////////////////////////////////////////////////
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "Made by Duy" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());

    return api.sendMessage({ body: "🌐 Kết Nối Thành Công!\n🎊 Hãy bắt đầu dùng những lệnh dưới đây để làm quen!\n─────────────────\n👉 -help hoặc -menu (xem danh sách toàn bộ lệnh)\n─────────────────\n💥 dùng lệnh chậm thôi nhé", attachment: await streamUrl(image) }, event.threadID, () => api.sendMessage({
      body: `► Kết Nối Thành Công Box ◄\n─────────────────\n🐧 Hi mọi người mình là bot\n📌 Dấu lệnh của bot là: -\n🎀 Vui lòng không chửi bot , spambot\n🎊 Sử dụng lệnh -help hoặc -menu để xem chi tiết các lệnh trong bot\n📺 Chúc mọi người sử dụng bot vui vẻ, và có 1 ngày tốt lành\n─────────────────\n🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐀𝐝𝐦𝐢𝐧: https://www.facebook.com/
100074149533709`
    }, threadID));
  }
  else {
    try {
      let thread_data = await Threads.getData(threadID);

      if (!!thread_data) {
        let send = msg => api.sendMessage(msg, threadID);
        let asnn = thread_data.data.auto_set_nickname;

        if (!!asnn && !!asnn.all) {
          let time_join = time_str(Date.now() + 25200000);
          for (let {
            fullName,
            firstName,
            userFbId: id,
          } of event.logMessageData.addedParticipants) try {
            let name_set = asnn.all.replace(/\${full_name}/g, fullName).replace(/\${short_name}/g, firstName).replace(/\${time_join}/g, time_join);

            await new Promise(resolve => api.changeNickname(name_set, threadID, id, (err, res) => resolve()));
          } catch (e) {
            console.err(e)
          }

          send(`Đã set biệt danh cho TVM`);
        }
      }

      let { threadName, participantIDs } = await api.getThreadInfo(threadID);
      const moment = require("moment-timezone");
      const time = moment.tz("Asia/Ho_Chi_Minh").format(" HH:mm:s - DD/MM/YYYY");
      const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
      var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
      if (thu == 'Sunday') thu = 'Chủ Nhật'
      if (thu == 'Monday') thu = 'Thứ Hai'
      if (thu == 'Tuesday') thu = 'Thứ Ba'
      if (thu == 'Wednesday') thu = 'Thứ Tư'
      if (thu == "Thursday") thu = 'Thứ Năm'
      if (thu == 'Friday') thu = 'Thứ Sáu'
      if (thu == 'Saturday') thu = 'Thứ Bảy'
      const threadData = global.data.threadData.get(parseInt(threadID)) || {};

      var mentions = [], nameArray = [], memLength = [], iduser = [], i = 0;
      const indexId = event.logMessageData.addedParticipants;
      for (id in indexId) {
        const userName = event.logMessageData.addedParticipants[id].fullName; iduser.push(event.logMessageData.addedParticipants[id].userFbId.toString());
        nameArray.push(userName);
        mentions.push({ tag: userName, id: event.senderID });
        memLength.push(participantIDs.length - i++);
        console.log(userName)
      }
      memLength.sort((a, b) => a - b);

      (typeof threadData.customJoin == "undefined") ? msg = "‎🎊 Welcome to {name} đến với nhóm {threadName}\n─────────────────\n🌐 Link Facebook: https://www.facebook.com/{iduser}\n👤 {type} là thành viên thứ {soThanhVien} của nhóm\n🎀 {type} được thên bởi: {author}\n🌐 Link Facebook: https://www.facebook.com/{idauthor}\n─────────────────\n⏰ Thời gian: {time} - ( {thu} ) buổi {session}\n📌 Vào nhóm nhớ Giới Thiệu Tên + Năm sinh và nói biệt danh muốn đặt để quản trị Viên set cho nhé 🥰\n🦑 {type} không tương tác sẽ bị ra khỏi đảo 🍀" : msg = threadData.customJoin;
      var getData = await Users.getData(event.author)
      var nameAuthor = typeof getData.name == "undefined" ? "Người dùng tự vào" : getData.name
      msg = msg
        .replace(/\{iduser}/g, iduser.join(', '))
        .replace(/\{name}/g, nameArray.join(', '))
        .replace(/\{type}/g, (memLength.length > 1) ? 'Các bạn' : 'Bạn')
        .replace(/\{soThanhVien}/g, memLength.join(', '))
        .replace(/\{author}/g, nameAuthor)
        .replace(/\{idauthor}/g, event.author)
        .replace(/\{threadName}/g, threadName)
        .replace(/\{thu}/g, thu)
        .replace(/\{session}/g, hours <= 10 ? "sáng" :
          hours > 10 && hours <= 12 ? "trưa" :
            hours > 12 && hours <= 18 ? "chiều" : "tối")
        .replace(/\{time}/g, time);
      return api.sendMessage({
        body: msg,
        attachment: await streamUrl(image),
        mentions: mentions
      }, threadID);
    } catch (e) {
      return console.log(e);
    }
  }
}