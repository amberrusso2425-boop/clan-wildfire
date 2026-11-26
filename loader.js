/* Clan Wildfire sign-in (shared by the app page and the clan.mysanocare.com shell).
   One person per phone: tap your card, make a 4-number PIN the first time, then the phone keeps a device token.
   No family names live in this file: the cards come from the server after the Clan code or a valid token. */
(function(){
  if (window.CWA && window.CWA.v === 1) return;
  var A = { v: 1, mode: 'gas', native: null, url: '', me: null, code: '' };
  var TK = 'cwDevTok';
  var ICON = 'https:\/\/lh3.googleusercontent.com\/d\/1EQWJbE0-0cXKoKdiJqXOZ-Q6eFSQMqD-=w180#.png';
  var MSG = { CODE: 'That Clan code is not right. Try again.', CODELOCK: 'Too many wrong codes. Wait 15 minutes and try again.',
    NOCODE: 'The Clan code is not set up yet. Ask the Clan Chief.', PIN: 'That PIN is not right. Try again.', PINLOCK: 'Too many wrong tries. This PIN is locked for 15 minutes.',
    NOPIN: 'This card has no PIN yet. Go back and tap it to make one.', HASPIN: 'This card already has a PIN. Type that PIN, or ask the Clan Chief to reset it.',
    PIN4: 'The PIN must be 4 numbers.', CHIEF: 'Only the Clan Chief can do that.', SIGNIN: 'Please sign in again.', NOTYOU: 'You can only change your own things.',
    CODE6: 'The Clan code must be 6 to 20 letters or numbers.', NET: 'Could not reach Clan Wildfire. Check your connection and try again.' };
  A.msg = function(e){ var m = String((e && e.message) || e || ''); return MSG[m] || (m.indexOf('Failed to fetch') >= 0 || m.indexOf('NetworkError') >= 0 ? MSG.NET : 'Something went wrong. Try again.'); };
  A.tok = function(){ try { return localStorage.getItem(TK) || ''; } catch (e) { return A._t || ''; } };
  A.setTok = function(t){ A._t = t || ''; try { if (t) localStorage.setItem(TK, t); else localStorage.removeItem(TK); } catch (e) { } };
  A.setup = function(o){ for (var k in o) A[k] = o[k]; return A; };
  /* one API call. gas: the old link (google.script.run.cwApi). fetch: the new address (text/plain POST, follows the redirect). */
  A.call = function(fn, args){
    var req = JSON.stringify({ fn: fn, args: args || [], tok: A.tok() });
    var done = function(env){ if (typeof env === 'string') env = JSON.parse(env); if (!env || !env.ok) { var er = new Error((env && env.e) || 'ERR'); throw er; } return env.v; };
    if (A.mode === 'gas') return new Promise(function(res, rej){ A.native.withSuccessHandler(function(s){ try { res(done(s)); } catch (e) { rej(e); } }).withFailureHandler(function(e){ rej(e); }).cwApi(req); });
    return fetch(A.url, { method: 'POST', body: req, redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' } }).then(function(r){ return r.text(); }).then(function(t){ return done(t); });
  };
  A.auth = function(m){ return A.call('auth', [m]); };
  A.can = function(id){ return !!(A.me && A.me.can && A.me.can.indexOf(id) >= 0); };

  var CSS = '.cws{position:fixed;inset:0;z-index:2147483000;background:#120d1a;color:#f3e6cf;font-family:Nunito,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;overflow-y:auto;-webkit-overflow-scrolling:touch}' +
    '.cws *{box-sizing:border-box}.cws-box{max-width:440px;margin:0 auto;padding:calc(env(safe-area-inset-top) + 22px) 18px calc(env(safe-area-inset-bottom) + 28px);text-align:center}' +
    '.cws-logo{width:76px;height:76px;border-radius:18px;margin:0 auto 10px;display:block;box-shadow:0 0 26px rgba(242,164,58,.35)}' +
    '.cws h1{font-family:Cinzel,Georgia,serif;font-size:26px;margin:0 0 4px;color:#ffcf5a}.cws h2{font-size:20px;margin:14px 0 4px;color:#ffcf7a;line-height:1.3}' +
    '.cws p{margin:6px 0;line-height:1.45;color:#e6d6bb;font-size:15px}.cws-err{min-height:22px;color:#ff8f7f;font-weight:700}' +
    '.cws input{width:100%;margin:12px 0 4px;padding:14px;border-radius:14px;border:1px solid rgba(242,164,58,.35);background:#231a31;color:#f3e6cf;font-size:20px;text-align:center;letter-spacing:.08em}' +
    '.cws-btn{display:block;width:100%;margin:10px 0 0;padding:15px 14px;border:0;border-radius:14px;background:linear-gradient(180deg,#ffcf5a,#f2a43a);color:#2a1606;font-size:18px;font-weight:800;cursor:pointer}' +
    '.cws-btn.alt{background:#2c2140;color:#f3e6cf;border:1px solid rgba(242,164,58,.25);font-weight:700;font-size:16px}.cws-btn.red{background:#5a2330;color:#ffd9d2}.cws-btn:disabled{opacity:.5}' +
    '.cws-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}' +
    '.cws-card{background:#231a31;border:2px solid rgba(242,164,58,.18);border-radius:16px;padding:12px 4px 10px;color:#f3e6cf;cursor:pointer;min-width:0}' +
    '.cws-av{width:48px;height:48px;border-radius:50%;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;color:#1a1020}' +
    '.cws-nm{font-weight:800;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cws-st{font-size:12px;color:#b9a88f;min-height:16px}' +
    '.cws-dots{display:flex;justify-content:center;gap:14px;margin:16px 0 8px}.cws-dot{width:18px;height:18px;border-radius:50%;border:2px solid #ffcf7a}.cws-dot.on{background:#ffcf7a}' +
    '.cws-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:300px;margin:8px auto 0}' +
    '.cws-k{padding:16px 0;border-radius:16px;border:0;background:#2c2140;color:#f3e6cf;font-size:24px;font-weight:800;cursor:pointer}.cws-k.sm{font-size:15px}' +
    '.cws-row{display:flex;align-items:center;gap:10px;text-align:left;background:#231a31;border-radius:14px;padding:10px 12px;margin-top:8px}.cws-row b{display:block}.cws-row small{color:#b9a88f}' +
    '.cws-row .cws-btn{width:auto;margin:0 0 0 auto;padding:10px 12px;font-size:14px;flex:none}' +
    '.cwb{position:fixed;z-index:2147482000;right:8px;bottom:calc(env(safe-area-inset-bottom) + 92px);display:flex;align-items:center;gap:6px;max-width:46vw;padding:5px 10px 5px 5px;border-radius:999px;border:1px solid rgba(242,164,58,.35);background:rgba(28,20,40,.92);color:#f3e6cf;font:700 13px Nunito,system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35)}' +
    '.cwb i{font-style:normal;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#1a1020;font-weight:900;flex:none}.cwb span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cwt{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom) + 140px);z-index:2147483600;background:#2c2140;color:#ffe2b0;padding:10px 16px;border-radius:12px;font:700 14px Nunito,system-ui,sans-serif;max-width:86vw;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.4)}';
  function css(){ if (document.getElementById('cwsCss')) return; var s = document.createElement('style'); s.id = 'cwsCss'; s.textContent = CSS; (document.head || document.documentElement).appendChild(s); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(tag, cls, html){ var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  A.toast = function(m){ try { css(); var t = el('div', 'cwt'); t.textContent = m; document.body.appendChild(t); setTimeout(function(){ t.remove(); }, 3200); } catch (e) { } };

  var ov = null, body = null, err = null;
  function open(){
    css(); if (ov && ov.isConnected) return;
    ov = el('div', 'cws'); ov.id = 'cwSign';
    var box = el('div', 'cws-box', '<img class="cws-logo" alt="" src="' + ICON + '"><h1>Clan Wildfire</h1>');
    body = el('div'); err = el('p', 'cws-err'); box.appendChild(body); box.appendChild(err); ov.appendChild(box);
    (document.body || document.documentElement).appendChild(ov);
  }
  function close(){ if (ov) ov.remove(); ov = null; }
  function say(m){ if (err) err.textContent = m || ''; }
  function view(html){ open(); body.innerHTML = html; say(''); ov.scrollTop = 0; return body; }
  function busy(b, on){ if (b) b.disabled = !!on; }

  /* number pad. opt: { title, sub, min, max, auto, ok, back } -> calls ok(pin, again) */
  function pad(opt){
    var v = '', b = view('<h2>' + opt.title + '</h2><p>' + (opt.sub || '') + '</p><div class="cws-dots"></div><div class="cws-pad"></div>' +
      (opt.back ? '<button class="cws-btn alt" data-b="1">Back</button>' : ''));
    var dots = b.querySelector('.cws-dots'), P = b.querySelector('.cws-pad'), max = opt.max || 4;
    function draw(){ var h = ''; for (var i = 0; i < Math.max(opt.min || 4, v.length, 4); i++) h += '<span class="cws-dot' + (i < v.length ? ' on' : '') + '"></span>'; dots.innerHTML = h; }
    var go = function(){ if (v.length < (opt.min || 4)) { say('Type ' + (opt.min || 4) + ' numbers.'); return; } var x = v; v = ''; draw(); opt.ok(x); };
    ['1','2','3','4','5','6','7','8','9','c','0','g'].forEach(function(k){
      var t = el('button', 'cws-k' + (k === 'c' || k === 'g' ? ' sm' : ''), k === 'c' ? 'Clear' : (k === 'g' ? (opt.auto ? 'Back' : 'OK') : k));
      t.type = 'button'; t.setAttribute('data-k', k);
      t.onclick = function(){ say('');
        if (k === 'c') v = ''; else if (k === 'g') { if (opt.auto) v = v.slice(0, -1); else return go(); }
        else if (v.length < max) v += k;
        draw(); if (opt.auto && v.length === max) setTimeout(go, 120); };
      P.appendChild(t); });
    if (opt.back) b.querySelector('[data-b]').onclick = opt.back;
    draw(); return { say: say };
  }

  function cards(sw, done){
    var b = view('<h2>Who are you?</h2><p>Tap your own card.</p><div class="cws-grid"><p>Loading...</p></div>' + (sw ? '<button class="cws-btn alt" data-b="1">Back</button>' : ''));
    if (sw) b.querySelector('[data-b]').onclick = function(){ close(); };
    A.auth({ a: 'cards', code: A.code, tok: A.tok() }).then(function(r){
      var g = b.querySelector('.cws-grid'); g.innerHTML = '';
      r.cards.forEach(function(c){
        var t = el('button', 'cws-card', '<div class="cws-av" style="background:' + esc(c.color) + '">' + esc(c.name.charAt(0)) + '</div><div class="cws-nm">' + esc(c.name) + '</div><div class="cws-st">' + (c.lock ? 'Locked' : (c.pin ? '' : 'New')) + '</div>');
        t.type = 'button'; t.setAttribute('data-id', c.id);
        t.onclick = function(){ person(c, sw, done); }; g.appendChild(t); });
    }).catch(function(e){ var m = String((e && e.message) || e); if (m === 'CODE' || m === 'CODELOCK' || m === 'NOCODE') { A.code = ''; codeView(sw, done, A.msg(e)); } else say(A.msg(e)); });
  }
  function codeView(sw, done, m){
    var b = view('<h2>Welcome to Clan Wildfire</h2><p>Type the Clan code to set up this phone. Ask the Clan Chief if you do not know it.</p>' +
      '<input id="cwsCode" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Clan code"><button class="cws-btn" id="cwsNext">Next</button>');
    say(m || ''); var i = b.querySelector('#cwsCode'), n = b.querySelector('#cwsNext');
    var go = function(){ var c = i.value.trim(); if (!c) { say('Type the Clan code.'); return; } A.code = c; cards(sw, done); };
    n.onclick = go; i.onkeydown = function(e){ if (e.key === 'Enter') go(); };
  }
  function finish(r, done){ A.setTok(r.tok); delete r.tok; A.me = r; A.code = ''; close(); done(r); }
  function person(c, sw, done){
    var back = function(){ cards(sw, done); };
    if (!c.pin) {
      var first = '';
      var ask = function(){ pad({ title: 'Hi ' + esc(c.name) + '. Make your PIN', sub: 'Pick 4 numbers you will remember. Keep them secret.', min: 4, max: 4, auto: true, back: back, ok: function(p){ first = p; again(); } }); };
      var again = function(){ pad({ title: 'Type your new PIN again', sub: 'The same 4 numbers.', min: 4, max: 4, auto: true, back: ask, ok: function(p){
        if (p !== first) { ask(); say('Those did not match. Try again.'); return; }
        say('Saving...');
        A.auth({ a: 'setup', who: c.id, pin: p, code: A.code, tok: A.tok() }).then(function(r){ finish(r, done); }).catch(function(e){ ask(); say(A.msg(e)); }); } }); };
      ask(); return;
    }
    var ent = function(){ pad({ title: 'Hi ' + esc(c.name) + '. Type your PIN', sub: 'Your own secret numbers.', min: 4, max: 6, back: back, ok: function(p){
      say('Checking...');
      A.auth({ a: 'signin', who: c.id, pin: p, code: A.code, tok: A.tok() }).then(function(r){ finish(r, done); }).catch(function(e){ ent(); say(A.msg(e)); }); } }); };
    ent();
  }
  /* full sign-in. Resolves with the person. sw = Switch person (this phone is already signed in, no Clan code needed). */
  A.signIn = function(sw){ return new Promise(function(res){ if (sw && A.tok()) cards(true, res); else codeView(false, res); }); };
  /* first look: who is this phone? Resolves with hello ({ signin, moved, url, who }) */
  A.hello = function(){ return A.auth({ a: 'hello', tok: A.tok() }).then(function(h){ A.me = h.who || null; if (!h.who && A.tok()) A.setTok(''); return h; }); };

  /* the small "signed in as" button and its menu */
  A.badge = function(){
    if (!A.me || !document.body) return; css();
    var b = document.getElementById('cwBadge'); if (!b) { b = el('button', 'cwb'); b.id = 'cwBadge'; b.type = 'button'; b.onclick = A.menu; document.body.appendChild(b); }
    b.innerHTML = '<i style="background:' + esc(A.me.color) + '">' + esc(A.me.name.charAt(0)) + '</i><span>' + esc(A.me.name) + '</span>';
    b.setAttribute('aria-label', 'Signed in as ' + A.me.name);
  };
  A.menu = function(){
    if (!A.me) return;
    var pets = A.me.can.filter(function(x){ return x !== A.me.me; });
    var b = view('<h2>Signed in as ' + esc(A.me.name) + (A.me.chief ? ' (Clan Chief)' : '') + '</h2>' +
      (A.me.chief ? '<p>You can fix anyone in the clan.</p>' : (pets.length ? '<p>You also play for ' + esc(pets.map(function(p){ return p.charAt(0).toUpperCase() + p.slice(1); }).join(' and ')) + '.</p>' : '')) +
      '<button class="cws-btn" data-m="x">Back to the game</button><button class="cws-btn alt" data-m="sw">Not you? Switch person</button>' +
      '<button class="cws-btn alt" data-m="pin">Change my PIN</button>' + (A.me.chief ? '<button class="cws-btn alt" data-m="fam">Family sign-ins</button>' : '') +
      '<button class="cws-btn red" data-m="out">Sign out of this phone</button>');
    b.querySelector('[data-m="x"]').onclick = close;
    b.querySelector('[data-m="sw"]').onclick = function(){ A.signIn(true).then(function(){ location.reload(); }); };
    b.querySelector('[data-m="pin"]').onclick = pinChange;
    b.querySelector('[data-m="out"]').onclick = function(){ var t = this; busy(t, 1); A.auth({ a: 'signout', tok: A.tok() }).catch(function(){ }).then(function(){ A.setTok(''); A.me = null; location.reload(); }); };
    var f = b.querySelector('[data-m="fam"]'); if (f) f.onclick = fam;
  };
  function pinChange(){
    var old = '', nw = '';
    pad({ title: 'Type your PIN now', sub: 'Your current PIN.', min: 4, max: 6, back: A.menu, ok: function(p){ old = p;
      pad({ title: 'Pick a new PIN', sub: '4 numbers.', min: 4, max: 4, auto: true, back: A.menu, ok: function(p2){ nw = p2;
        pad({ title: 'Type the new PIN again', sub: 'The same 4 numbers.', min: 4, max: 4, auto: true, back: A.menu, ok: function(p3){
          if (p3 !== nw) { pinChange(); say('Those did not match. Try again.'); return; }
          A.auth({ a: 'pin', old: old, pin: nw, tok: A.tok() }).then(function(){ close(); A.toast('Your PIN is changed.'); }).catch(function(e){ pinChange(); say(A.msg(e)); }); } }); } }); } });
  }
  function fam(){
    var b = view('<h2>Family sign-ins</h2><p>Reset a PIN when someone forgets it. They make a new one next time.</p><div id="cwsFam"><p>Loading...</p></div>' +
      '<button class="cws-btn alt" data-m="code">Change the Clan code</button><button class="cws-btn alt" data-m="back">Back</button>');
    b.querySelector('[data-m="back"]').onclick = A.menu; b.querySelector('[data-m="code"]').onclick = codeChange;
    A.auth({ a: 'fam', tok: A.tok() }).then(function(r){
      var L = b.querySelector('#cwsFam'); L.innerHTML = '';
      r.fam.forEach(function(p){
        var row = el('div', 'cws-row', '<div><b>' + esc(p.name) + '</b><small>' + (p.lock ? 'Locked for now' : (p.pin ? 'PIN set' : 'No PIN yet')) + ' - ' + p.phones + (p.phones === 1 ? ' phone' : ' phones') + '</small></div>');
        if (p.pin || p.phones || p.lock) { var x = el('button', 'cws-btn alt', 'Reset PIN'); x.type = 'button'; x.setAttribute('data-r', p.id);
          x.onclick = function(){ pad({ title: 'Reset ' + esc(p.name) + '?', sub: 'Type your own PIN to say yes. ' + esc(p.name) + ' will be signed out and can make a new PIN.', min: 4, max: 6, back: fam, ok: function(pin){
            A.auth({ a: 'reset', target: p.id, pin: pin, tok: A.tok() }).then(function(){ fam(); A.toast(p.name + ' can make a new PIN now.'); if (p.id === A.me.me) { A.setTok(''); location.reload(); } }).catch(function(e){ fam(); setTimeout(function(){ say(A.msg(e)); }, 50); }); } }); };
          row.appendChild(x); }
        L.appendChild(row); });
    }).catch(function(e){ say(A.msg(e)); });
  }
  function codeChange(){
    var b = view('<h2>Change the Clan code</h2><p>New phones need this code once. 6 to 20 letters or numbers.</p><input id="cwsNew" autocomplete="off" autocapitalize="off" placeholder="New Clan code"><button class="cws-btn" id="cwsGo">Next</button><button class="cws-btn alt" id="cwsBk">Back</button>');
    b.querySelector('#cwsBk').onclick = fam;
    b.querySelector('#cwsGo').onclick = function(){ var c = b.querySelector('#cwsNew').value.trim(); if (!/^[A-Za-z0-9]{6,20}$/.test(c)) { say(MSG.CODE6); return; }
      pad({ title: 'Type your PIN to save it', sub: '', min: 4, max: 6, back: fam, ok: function(pin){ A.auth({ a: 'code', code2: c, pin: pin, tok: A.tok() }).then(function(){ close(); A.toast('The Clan code is changed.'); }).catch(function(e){ codeChange(); say(A.msg(e)); }); } }); };
  }
  window.CWA = A;
})();
/* Clan Wildfire home-screen shell. This public file holds no family data and no game code: after sign-in it asks the
   family's Apps Script for the app (?api app) and starts it. */
(function(){
  var EXEC = 'https:\/\/script.google.com\/macros\/s\/AKfycbwyAmWyIRizW4ywlZBbY_fX4rVEbUckiyx_szOifIVaGXCDPmC_4F-ZJYiX5_YmryZVYg\/exec';
  var A = window.CWA; window.CW_SHELL = true;
  try { localStorage.setItem('cwExec', EXEC); } catch (e) { }
  A.setup({ mode: 'fetch', url: EXEC });
  /* sign-in carried over from the old link: #cwt=<token> */
  try { var m = /[#&]cwt=([a-z]{2,12}\.[0-9a-f]{64})/.exec(location.hash || ''); if (m) { A.setTok(m[1]); history.replaceState(null, '', location.pathname + location.search); } } catch (e) { }
  var msg = function(t, retry){ var s = document.getElementById('cwMsg'); if (s) s.textContent = t; var b = document.getElementById('cwRetry'); if (b) b.style.display = retry ? 'block' : 'none'; };
  function boot(html){ document.open(); document.write(html); document.close(); }
  function load(){
    msg('Opening Clan Wildfire...');
    var h = '', c = ''; try { h = localStorage.getItem('cwAppH') || ''; c = localStorage.getItem('cwAppHtml') || ''; } catch (e) { }
    A.call('app', [c ? h : '']).then(function(r){
      if (r.same && c) { boot(c); return; }
      try { localStorage.setItem('cwAppHtml', r.html); localStorage.setItem('cwAppH', r.h); } catch (e) { try { localStorage.removeItem('cwAppHtml'); localStorage.removeItem('cwAppH'); } catch (x) { } }
      boot(r.html);
    }, function(e){ if (String((e && e.message) || e) === 'SIGNIN') { A.setTok(''); start(); return; } msg(A.msg(e), true); });
  }
  function start(){
    msg('Opening Clan Wildfire...');
    A.hello().then(function(hh){ if (hh.who) load(); else A.signIn(false).then(load); }, function(e){ msg(A.msg(e), true); });
  }
  document.getElementById('cwRetry').onclick = start;
  start();
})();
