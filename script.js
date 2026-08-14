(function(){
  "use strict";

  /* ---------- floating petals ---------- */
  var field = document.getElementById('petal-field');
  var colors = ['#FF8FA3','#FFC93C','#FF6B5B','#FFD9DC'];
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced){
    var n = window.innerWidth < 560 ? 10 : 18;
    for(var i=0;i<n;i++){
      var p = document.createElement('div');
      p.className='petal';
      var size = 10 + Math.random()*10;
      var left = Math.random()*100;
      var dur = 9 + Math.random()*10;
      var delay = Math.random()*-14;
      var drift = (Math.random()*80-40)+'px';
      p.style.left = left+'%';
      p.style.setProperty('--drift', drift);
      p.style.animationDuration = dur+'s';
      p.style.animationDelay = delay+'s';
      var c = colors[i % colors.length];
      p.innerHTML = '<svg width="'+size+'" height="'+size+'" viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="6" ry="9" fill="'+c+'" transform="rotate('+Math.floor(Math.random()*360)+' 10 10)"/></svg>';
      field.appendChild(p);
    }
  }

  /* ---------- storage helpers ----------
     Uses the browser's own localStorage, so saved photos/captions/note
     live in whichever browser opens the page (per-device, not synced
     between you and her). Safe no-ops if storage is blocked. */
  function hasStorage(){
    try{ return typeof window.localStorage !== 'undefined'; }catch(e){ return false; }
  }
  function saveVal(key, value){
    if(!hasStorage()) return;
    try{ window.localStorage.setItem(key, value); }catch(e){ console.warn('save failed', key, e); }
  }
  function loadVal(key){
    if(!hasStorage()) return null;
    try{ return window.localStorage.getItem(key); }catch(e){ return null; }
  }
  function delVal(key){
    if(!hasStorage()) return;
    try{ window.localStorage.removeItem(key); }catch(e){}
  }

  /* ---------- gallery ----------
     Load priority for each slot, so the photos you add show up for HER too
     (not just in your own browser):
       1. a photo uploaded via the UI in THIS browser (cached in localStorage)
       2. a real file at images/1.jpg, images/2.jpg, ... images/6.jpg in the repo
       3. the empty "add a photo" placeholder
     To permanently add a photo, drop a file named e.g. images/1.jpg into the
     images/ folder (matching the slot number below) and commit it — that's
     what everyone who opens the link will see. */
  var captions = ['the day it all started','you, mid laugh','my favorite view','us, being ridiculous','that one perfect trip','just because'];
  var gallery = document.getElementById('gallery');
  var SLOTS = 6;

  for(var s=0; s<SLOTS; s++){
    (function(idx){
      var slotNum = idx + 1;
      var card = document.createElement('div');
      card.className = 'polaroid';
      card.innerHTML =
        '<div class="tape"></div>'+
        '<div class="frame" data-idx="'+idx+'">'+
          '<div class="placeholder"><div class="plus">+</div><span>add a photo</span></div>'+
          '<img style="display:none" alt="a memory">'+
          '<input type="file" accept="image/*">'+
        '</div>'+
        '<div class="caption" contenteditable="true" spellcheck="false">'+captions[idx]+'</div>';
      gallery.appendChild(card);

      var frame = card.querySelector('.frame');
      var img = card.querySelector('img');
      var input = card.querySelector('input[type=file]');
      var captionEl = card.querySelector('.caption');

      function showPhoto(src){
        img.src = src;
        img.style.display='block';
        frame.classList.add('has-img');
      }

      input.addEventListener('change', function(e){
        var file = e.target.files && e.target.files[0];
        if(!file) return;
        var reader = new FileReader();
        reader.onload = function(ev){
          var image = new Image();
          image.onload = function(){
            var maxW = 900;
            var scale = Math.min(1, maxW/image.width);
            var canvas = document.createElement('canvas');
            canvas.width = image.width*scale;
            canvas.height = image.height*scale;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image,0,0,canvas.width,canvas.height);
            var dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            showPhoto(dataUrl);
            saveVal('birthday-photo-'+idx, dataUrl);
          };
          image.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });

      captionEl.addEventListener('blur', function(){
        saveVal('birthday-caption-'+idx, captionEl.textContent);
      });

      // 1) locally-uploaded photo cached in this browser
      var savedPhoto = loadVal('birthday-photo-'+idx);
      if(savedPhoto){
        showPhoto(savedPhoto);
      } else {
        // 2) fall back to a real committed file, e.g. images/1.jpg
        var probe = new Image();
        probe.onload = function(){ showPhoto('images/'+slotNum+'.jpg'); };
        probe.onerror = function(){ /* no file yet — leave placeholder showing */ };
        probe.src = 'images/'+slotNum+'.jpg';
      }

      var savedCaption = loadVal('birthday-caption-'+idx);
      if(savedCaption){ captionEl.textContent = savedCaption; }
    })(s);
  }

  /* ---------- envelope ---------- */
  var envelope = document.getElementById('envelope');
  var openHint = document.getElementById('open-hint');
  var letterText = document.getElementById('letter-text');
  var opened = false;

  envelope.addEventListener('click', function(e){
    if(opened && e.target.closest('#letter-text')) return; // allow editing once open
    opened = !opened;
    envelope.classList.toggle('open', opened);
    openHint.textContent = opened ? 'tap the letter to edit these words — make them yours' : 'tap the envelope to open it';
  });

  letterText.addEventListener('blur', function(){
    saveVal('birthday-note', letterText.innerHTML);
  });
  var savedNote = loadVal('birthday-note');
  if(savedNote){ letterText.innerHTML = savedNote; }

  /* ---------- confetti ---------- */
  var canvas = document.getElementById('confetti-canvas');
  var ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  var particles = [];
  var confettiColors = ['#FF6B5B','#FFC93C','#FF8FA3','#6B9B37','#FFE1C7'];
  var animating = false;

  function burst(){
    if(reduced){ return; }
    for(var i=0;i<90;i++){
      particles.push({
        x: canvas.width/2 + (Math.random()*260-130),
        y: canvas.height*0.35,
        vx: (Math.random()*6-3),
        vy: -(Math.random()*8+4),
        g: 0.18 + Math.random()*0.08,
        size: 5+Math.random()*6,
        rot: Math.random()*360,
        vr: Math.random()*10-5,
        color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
        life: 0
      });
    }
    if(!animating){ animating = true; requestAnimationFrame(tick); }
  }

  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var alive = false;
    for(var i=0;i<particles.length;i++){
      var p = particles[i];
      if(!p) continue;
      p.life++;
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.rot += p.vr;
      if(p.life < 260 && p.y < canvas.height+30){
        alive = true;
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);
        ctx.restore();
      } else {
        particles[i] = null;
      }
    }
    particles = particles.filter(Boolean);
    if(alive){ requestAnimationFrame(tick); } else { animating = false; ctx.clearRect(0,0,canvas.width,canvas.height); }
  }
  document.getElementById('surprise-btn').addEventListener('click', burst);

  /* ---------- reset ---------- */
  document.getElementById('reset-btn').addEventListener('click', function(){
    if(!confirm('Clear all uploaded photos, captions and the note back to defaults?')) return;
    for(var i=0;i<SLOTS;i++){
      delVal('birthday-photo-'+i);
      delVal('birthday-caption-'+i);
    }
    delVal('birthday-note');
    location.reload();
  });

})();
