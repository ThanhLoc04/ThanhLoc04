const crypto = require('crypto');
const os = require("os");
const axios = require("axios");
const config = require('../config.json');
const package = require('../package.json');
const FormData = require('form-data');
const { resolve, basename } = require('path')
const { writeFileSync, createReadStream, unlinkSync } = require('fs');
const aes = require("aes-js");

module.exports.getYoutube = async function(t, e, i) {
    require("ytdl-core");
    const o = require("axios");
    if ("search" == e) {
      const e = require("youtube-search-api");
      return t ? a = (await e.GetListByKeyword(t, !1, 6)).items : console.log("Thiếu dữ liệu")
    }
    if ("getLink" == e) {
      var a = (await o.post("https://aiovideodl.ml/wp-json/aio-dl/video-data/", {
        url: "https://www.youtube.com/watch?v=" + t
      })).data;
        return "video" == i ? {
          title: a.title,
          duration: a.duration,
          download: {
            SD: a.medias[1].url,
            HD: a.medias[2].url
          }
        } : "audio" == i ? {
          title: a.title,
          duration: a.duration,
          download: a.medias[3].url
        } : void 0
      }
};
module.exports.throwError = function (command, threadID, messageID) {
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	return global.client.api.sendMessage(global.getText("utils", "throwError", ((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX), command), threadID, messageID);
}

module.exports.getGUID = function() {
    var sectionLength = Date.now();
    var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.floor((sectionLength + Math.random() * 16) % 16);
        sectionLength = Math.floor(sectionLength / 16);
        var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
        return _guid;
    });
    return id;
}

module.exports.encryptState = async function (data, key) {
  let hashEngine = crypto.createHash("sha256");
  let hashKey = hashEngine.update(key).digest();

  let bytes = aes.utils.utf8.toBytes(data);
  let aesCtr = new aes.ModeOfOperation.ctr(hashKey);
  let encryptedData = aesCtr.encrypt(bytes);

  return aes.utils.hex.fromBytes(encryptedData);
}

module.exports.decryptState = function(data, key) {
  let hashEngine = crypto.createHash("sha256");
  let hashKey = hashEngine.update(key).digest();

  let encryptedBytes = aes.utils.hex.toBytes(data);
  let aesCtr = new aes.ModeOfOperation.ctr(hashKey);
  let decryptedData = aesCtr.decrypt(encryptedBytes);

  return aes.utils.utf8.fromBytes(decryptedData);
}

module.exports.convertHMS = function(value) {
    const sec = parseInt(value, 10); 
    let hours   = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60); 
    let seconds = sec - (hours * 3600) - (minutes * 60); 
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return (hours != '00' ? hours +':': '') + minutes+':'+seconds;
}

module.exports.removeSpecialChar = async(str) => {
	if (str === null || str === '') return false;
	else str = str.toString();

	return str.replace(/[^\x20-\x7E]/g, '');
};

module.exports.cleanAnilistHTML = function (text) {
	text = text
		.replace('<br>', '\n')
		.replace(/<\/?(i|em)>/g, '*')
		.replace(/<\/?b>/g, '**')
		.replace(/~!|!~/g, '||')
		.replace("&amp;", "&")
		.replace("&lt;", "<")
		.replace("&gt;", ">")
		.replace("&quot;", '"')
		.replace("&#039;", "'");
	return text;
}

module.exports.downloadFile = async function (url, path) {
	const { createWriteStream } = require('fs');

	const response = await axios({
		method: 'GET',
		responseType: 'stream',
		url
	});

	const writer = createWriteStream(path);

	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
};

module.exports.getContent = async function(url) {
	try {
		const response = await axios({
			method: 'GET',
			url
		});

		const data = response;

		return data;
	} catch (e) { return console.log(e); };
}

module.exports.randomString = function (length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var charactersLength = characters.length || 5;
	for ( var i = 0; i < length; i++ ) result += characters.charAt(Math.floor(Math.random() * charactersLength));
	return result;
}

module.exports.AES = {
	encrypt (cryptKey, crpytIv, plainData) {
		var encipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(cryptKey), Buffer.from(crpytIv));
        var encrypted = encipher.update(plainData);
		encrypted = Buffer.concat([encrypted, encipher.final()]);
		return encrypted.toString('hex');
	},
	decrypt (cryptKey, cryptIv, encrypted) {
		encrypted = Buffer.from(encrypted, "hex");
		var decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(cryptKey), Buffer.from(cryptIv, 'binary'));
		var decrypted = decipher.update(encrypted);
	
		decrypted = Buffer.concat([decrypted, decipher.final()]);
	
		return String(decrypted);
	},
	makeIv () { return Buffer.from(crypto.randomBytes(16)).toString('hex').slice(0, 16); }
}

module.exports.homeDir = function () {
	var returnHome, typeSystem;
	const home = process.env["HOME"];
	const user = process.env["LOGNAME"] || process.env["USER"] || process.env["LNAME"] || process.env["USERNAME"];

	switch (process.platform) {
		case "win32": {
			returnHome = process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || home || null;
			typeSystem = "win32"
			break;
		}
		case "darwin": {
			returnHome = home || (user ? '/Users/' + user : null);
			typeSystem = "darwin";
			break;
		}
		case "linux": {
			returnHome =  home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : null));
			typeSystem = "linux"
			break;
		}
		default: {
			returnHome = home || null;
			typeSystem = "unknow"
			break;
		}
	}

	return [typeof os.homedir === 'function' ? os.homedir() : returnHome, typeSystem];
}

module.exports.removeBackground = async(image) => {
	if(!image) return console.log('RemoveBG: thiếu dữ liệu');
	var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

	const path = resolve(__dirname, 'cache', `${Date.now()}.jpg`);
	const newPath = resolve(__dirname, 'cache', `${Date.now() + 1000}.jpg`);
	await global.utils.downloadFile(image, path);
	var formData = new FormData();
		formData.append('size', 'auto');
		formData.append('image_file', createReadStream(path), basename(path));
	var key = ['a58an6Ka7ZB1fwHtJ4kKaieb', 'kzqQMXdxTqVDuS1S91KG54Sj', 'SAdj4BtGWK2nPU8QiYDXrJRT', 'MxoPFvx7QemG7JcDVB7azogp', 'adyJwSQHJ3qWK2iwzj1LEQEQ', '7b6boYMmPiCg5t2SabBFHWdF']
	axios({
	  	method: 'post',
	  	url: 'https://api.remove.bg/v1.0/removebg',
	  	data: formData,
	  	responseType: 'arraybuffer',
	  	headers: {
	    	...formData.getHeaders(),
	    	'X-Api-Key': key[Math.floor(Math.random() * key.length)],
	  	},
	  	encoding: null
	})
	.then((response) => {
	  	if(response.status != 200) return rejectFunc()
	  	writeFileSync(newPath, response.data);
	  	unlinkSync(path)
			resolveFunc(newPath)
	})
	.catch((error) => {
		return rejectFunc(error)
	});
	return returnPromise;
}

module.exports.formatEventReminders =  function (reminder) {
  return {
    reminderID: reminder.id,
    eventCreatorID: reminder.lightweight_event_creator.id,
    time: reminder.time,
    eventType: reminder.lightweight_event_type.toLowerCase(),
    locationName: reminder.location_name,
    // @TODO verify this
    locationCoordinates: reminder.location_coordinates,
    locationPage: reminder.location_page,
    eventStatus: reminder.lightweight_event_status.toLowerCase(),
    note: reminder.note,
    repeatMode: reminder.repeat_mode.toLowerCase(),
    eventTitle: reminder.event_title,
    triggerMessage: reminder.trigger_message,
    secondsToNotifyBefore: reminder.seconds_to_notify_before,
    allowsRsvp: reminder.allows_rsvp,
    relatedEvent: reminder.related_event,
    members: reminder.event_reminder_members.edges.map(function (member) {
      return {
        memberID: member.node.id,
        state: member.guest_list_state.toLowerCase()
      };
    })
  };
}

module.exports.formatThreadGraphQLResponse =  function (data) {
  var messageThread = data.o0.data.message_thread;
  var threadID = messageThread.thread_key.thread_fbid ? messageThread.thread_key.thread_fbid : messageThread.thread_key.other_user_id;

  // Remove me
  var lastM = messageThread.last_message;
  var snippetID = lastM && lastM.nodes && lastM.nodes[0] && lastM.nodes[0].message_sender && lastM.nodes[0].message_sender.messaging_actor ? lastM.nodes[0].message_sender.messaging_actor.id : null;
  var snippetText = lastM && lastM.nodes && lastM.nodes[0] ? lastM.nodes[0].snippet : null;
  var lastR = messageThread.last_read_receipt;
  var lastReadTimestamp = lastR && lastR.nodes && lastR.nodes[0] && lastR.nodes[0].timestamp_precise ? lastR.nodes[0].timestamp_precise : null;

  return {
    threadID: threadID,
    threadName: messageThread.name,
    participantIDs: messageThread.all_participants.edges.map(d => d.node.messaging_actor.id),
    userInfo: messageThread.all_participants.edges.map(d => ({
      id: d.node.messaging_actor.id,
      name: d.node.messaging_actor.name,
      firstName: d.node.messaging_actor.short_name,
      vanity: d.node.messaging_actor.username,
      thumbSrc: d.node.messaging_actor.big_image_src.uri,
      profileUrl: d.node.messaging_actor.big_image_src.uri,
      gender: d.node.messaging_actor.gender,
      type: d.node.messaging_actor.__typename,
      isFriend: d.node.messaging_actor.is_viewer_friend,
      isBirthday: !!d.node.messaging_actor.is_birthday //not sure?
    })),
    unreadCount: messageThread.unread_count,
    messageCount: messageThread.messages_count,
    timestamp: messageThread.updated_time_precise,
    muteUntil: messageThread.mute_until,
    isGroup: messageThread.thread_type == "GROUP",
    isSubscribed: messageThread.is_viewer_subscribed,
    isArchived: messageThread.has_viewer_archived,
    folder: messageThread.folder,
    cannotReplyReason: messageThread.cannot_reply_reason,
    eventReminders: messageThread.event_reminders ? messageThread.event_reminders.nodes.map(this.formatEventReminders) : null,
    emoji: messageThread.customization_info ? messageThread.customization_info.emoji : null,
    color: messageThread.customization_info && messageThread.customization_info.outgoing_bubble_color ? messageThread.customization_info.outgoing_bubble_color.slice(2) : null,
    nicknames:
      messageThread.customization_info &&
        messageThread.customization_info.participant_customizations
        ? messageThread.customization_info.participant_customizations.reduce(function (res, val) {
          if (val.nickname) res[val.participant_id] = val.nickname;
          return res;
        }, {})
        : {},
    adminIDs: messageThread.thread_admins,
    approvalMode: Boolean(messageThread.approval_mode),
    approvalQueue: messageThread.group_approval_queue.nodes.map(a => ({
      inviterID: a.inviter.id,
      requesterID: a.requester.id,
      timestamp: a.request_timestamp,
      request_source: a.request_source // @Undocumented
    })),

    // @Undocumented
    reactionsMuteMode: messageThread.reactions_mute_mode.toLowerCase(),
    mentionsMuteMode: messageThread.mentions_mute_mode.toLowerCase(),
    isPinProtected: messageThread.is_pin_protected,
    relatedPageThread: messageThread.related_page_thread,

    // @Legacy
    name: messageThread.name,
    snippet: snippetText,
    snippetSender: snippetID,
    snippetAttachments: [],
    serverTimestamp: messageThread.updated_time_precise,
    imageSrc: messageThread.image ? messageThread.image.uri : null,
    isCanonicalUser: messageThread.is_canonical_neo_user,
    isCanonical: messageThread.thread_type != "GROUP",
    recipientsLoadable: true,
    hasEmailParticipant: false,
    readOnly: false,
    canReply: messageThread.cannot_reply_reason == null,
    lastMessageTimestamp: messageThread.last_message ? messageThread.last_message.timestamp_precise : null,
    lastMessageType: "message",
    lastReadTimestamp: lastReadTimestamp,
    threadType: messageThread.thread_type == "GROUP" ? 2 : 1
  };
}