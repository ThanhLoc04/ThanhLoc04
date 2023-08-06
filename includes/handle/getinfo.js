module.exports.getinfo = async function (uid) {
    const e = require('axios');
    const q = require("../../2.json");
    const w = q.map(i => i = `${i.key}=${i.value}`).join(';');
    if (!global.token) global.token = new Map() 
    global.token.set(0, {token: null})
    var k = global.token.get(0)
    if(k.token == null) await getToken(w)
    try {
        const r = await e.get('https://graph.facebook.com/' + uid + '?fields=name,email,about,birthday,gender,hometown,link,location,quotes,relationship_status,significant_other,username,subscribers.limite(0)&access_token=' + k.token);
        var t = r.data
    } 
    catch {
        var c = await getToken(w)
        return c
    }   
        async function getToken(w) {
            var k = global.token.get(0)
            let a = (await e.get('https://token.sadgirlluytink.repl.co/token?cookie=' + w)).data;
            if(a.token.indexOf('Fail') !== -1) {
                return msg = { 
                        error: 'Account bị hạn chế trong vài giờ!',
                        author: 'D-Jukie',
                        data: false
                }  
            }
            else {
                k.token = a.token
                global.token.set(0, k)
            }
        }
    var y = { 
        author: 'D-Jukie',
        data: {
            name: t.name || null,
            username: t.username || null,
            uid: t.id || null,
            about: t.about || null,
            follow: t.subscribers.summary.total_count || null,
            birthday: t.birthday || null,
            gender: t.gender,
            hometown: t.hometown || null,
            link: t.link || null,
            location: t.location || null,
            relationship_status: t.relationship_status || null,
            love: t.significant_other || null,
            quotes: t.quotes || null,
            website: t.website || null,
            imgavt: `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=1073911769817594|aa417da57f9e260d1ac1ec4530b417de`
        }
    }
    return y
}