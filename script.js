(function(){
  "use strict";

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- floating petals ---------- */
  var field = document.getElementById('petal-field');
  var petalColors = ['#FF8FA3','#FFC93C','#FF6B5B','#FFD9DC'];
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
      var c = petalColors[i % petalColors.length];
      p.innerHTML = '<svg width="'+size+'" height="'+size+'" viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="6" ry="9" fill="'+c+'" transform="rotate('+Math.floor(Math.random()*360)+' 10 10)"/></svg>';
      field.appendChild(p);
    }
  }

  /* ---------- a reusable balloon SVG string ---------- */
  function balloonSVG(color){
    return '<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">'+
      '<ellipse cx="20" cy="20" rx="18" ry="20" fill="'+color+'"/>'+
      '<ellipse cx="14" cy="12" rx="5" ry="7" fill="rgba(255,255,255,.35)"/>'+
      '<path d="M20 40 L17 44 L23 44 Z" fill="'+color+'"/>'+
      '<path d="M20 44 C 24 50, 16 52, 20 58" stroke="#B99" stroke-width="1" fill="none" opacity=".6"/>'+
      '</svg>';
  }
  var balloonColors = ['#FF6B5B','#FFC93C','#FF8FA3','#6B9B37','#FFD9DC'];

  /* ---------- hero balloons, drifting up slowly and looping ---------- */
  var balloonField = document.getElementById('balloon-field');
  if(!reduced && balloonField){
    var heroBalloonCount = window.innerWidth < 560 ? 3 : 5;
    for(var b=0; b<heroBalloonCount; b++){
      var bal = document.createElement('div');
      bal.className = 'balloon';
      var bColor = balloonColors[b % balloonColors.length];
      bal.innerHTML = balloonSVG(bColor);
      bal.style.left = (8 + Math.random()*84) + '%';
      bal.style.animationDuration = (14 + Math.random()*8) + 's';
      bal.style.animationDelay = (Math.random()*-16) + 's';
      balloonField.appendChild(bal);
    }
  }

  /* ---------- gallery ----------
     Photos load from images/1.jpg or images/1.jpeg (etc.) in the repo.
     Edit GALLERY_CAPTIONS below — visitors cannot change photos or captions. */
  var GALLERY_CAPTIONS = [
    'jus u looking flawlessly pretty😍',
    'yoo kleiner kinder',
    'u da real silly psyduck, PSYYDUCk',
    'KATHIISAURASSSSSSSSSS',
    'SILLLY MONKEEEE (u da real zoo)',
    'u da real cool batman twin xoxoxoxoxoxo'
  ];
  var gallery = document.getElementById('gallery');
  var SLOTS = GALLERY_CAPTIONS.length;

  for(var s=0; s<SLOTS; s++){
    (function(idx){
      var slotNum = idx + 1;
      var card = document.createElement('div');
      card.className = 'polaroid';
      card.innerHTML =
        '<div class="tape"></div>'+
        '<div class="frame" data-idx="'+idx+'">'+
          '<div class="placeholder"><span>photo coming soon</span></div>'+
          '<img style="display:none" alt="'+GALLERY_CAPTIONS[idx]+'">'+
        '</div>'+
        '<div class="caption">'+GALLERY_CAPTIONS[idx]+'</div>';
      gallery.appendChild(card);

      var frame = card.querySelector('.frame');
      var img = card.querySelector('img');
      var placeholder = card.querySelector('.placeholder');

      function showPhoto(src){
        img.src = src;
        img.style.display = 'block';
        frame.classList.add('has-img');
      }

      var extensions = ['.jpg', '.jpeg', '.jpg.jpeg'];
      var extIndex = 0;

      function tryNextPhoto(){
        if(extIndex >= extensions.length){
          placeholder.querySelector('span').textContent = 'add images/'+slotNum+'.jpg';
          return;
        }
        var src = 'images/' + slotNum + extensions[extIndex];
        extIndex++;
        var probe = new Image();
        probe.onload = function(){ showPhoto(src); };
        probe.onerror = tryNextPhoto;
        probe.src = src;
      }
      tryNextPhoto();
    })(s);
  }

  /* ---------- envelope ---------- */
  var envelope = document.getElementById('envelope');
  var openHint = document.getElementById('open-hint');
  var opened = false;

  envelope.addEventListener('click', function(){
    opened = !opened;
    envelope.classList.toggle('open', opened);
    openHint.textContent = opened ? 'enjoy the note 💌' : 'tap the envelope to open it';
  });

  /* ---------- confetti + fireworks canvas ---------- */
  var canvas = document.getElementById('confetti-canvas');
  var ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  var particles = [];
  var confettiColors = ['#FF6B5B','#FFC93C','#FF8FA3','#6B9B37','#FFE1C7'];
  var animating = false;

  function confettiBurst(originX, originY){
    for(var i=0;i<70;i++){
      particles.push({
        shape:'rect',
        x: originX + (Math.random()*220-110),
        y: originY,
        vx: (Math.random()*6-3),
        vy: -(Math.random()*8+4),
        g: 0.18 + Math.random()*0.08,
        size: 5+Math.random()*6,
        rot: Math.random()*360,
        vr: Math.random()*10-5,
        color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
        life: 0, maxLife: 260
      });
    }
    kick();
  }

  function firework(x, y){
    var hue = confettiColors[Math.floor(Math.random()*confettiColors.length)];
    var count = 46;
    for(var i=0;i<count;i++){
      var angle = (Math.PI*2*i)/count + Math.random()*0.2;
      var speed = 2 + Math.random()*3.4;
      particles.push({
        shape:'circle',
        x:x, y:y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        g: 0.05,
        drag: 0.965,
        size: 2.4 + Math.random()*2,
        color: hue,
        life:0, maxLife: 70 + Math.random()*20
      });
    }
    kick();
  }

  function kick(){ if(!animating){ animating = true; requestAnimationFrame(tick); } }

  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var alive = false;
    for(var i=0;i<particles.length;i++){
      var pt = particles[i];
      if(!pt) continue;
      pt.life++;
      if(pt.drag){ pt.vx *= pt.drag; pt.vy *= pt.drag; }
      pt.x += pt.vx; pt.y += pt.vy; pt.vy += pt.g;
      if(pt.rot !== undefined) pt.rot += pt.vr;
      var fade = 1 - (pt.life / pt.maxLife);
      if(pt.life < pt.maxLife && fade > 0 && pt.y < canvas.height+30){
        alive = true;
        ctx.save();
        ctx.globalAlpha = pt.shape === 'circle' ? Math.max(fade,0) : 1;
        ctx.translate(pt.x,pt.y);
        if(pt.shape === 'circle'){
          ctx.beginPath();
          ctx.arc(0,0,pt.size,0,Math.PI*2);
          ctx.fillStyle = pt.color;
          ctx.fill();
        } else {
          ctx.rotate(pt.rot*Math.PI/180);
          ctx.fillStyle = pt.color;
          ctx.fillRect(-pt.size/2,-pt.size/4,pt.size,pt.size/2);
        }
        ctx.restore();
      } else {
        particles[i] = null;
      }
    }
    particles = particles.filter(Boolean);
    if(alive){ requestAnimationFrame(tick); } else { animating = false; ctx.clearRect(0,0,canvas.width,canvas.height); }
  }

  /* ---------- the big surprise: full celebration ---------- */
  var overlay = document.getElementById('celebration-overlay');
  var textEl = document.getElementById('celebration-text');
  var balloonLayer = document.getElementById('balloon-layer');
  var celebrating = false;

  function spawnCelebrationBalloons(count){
    for(var i=0;i<count;i++){
      (function(){
        var el = document.createElement('div');
        el.className = 'balloon';
        var color = balloonColors[Math.floor(Math.random()*balloonColors.length)];
        el.innerHTML = balloonSVG(color);
        el.style.left = (4 + Math.random()*92) + '%';
        el.style.setProperty('--sway', (Math.random()*100-50)+'px');
        el.style.animationDelay = (Math.random()*1.2) + 's';
        el.style.width = (38 + Math.random()*22) + 'px';
        balloonLayer.appendChild(el);
        el.addEventListener('animationend', function(){ el.remove(); });
      })();
    }
  }

  function setCelebrationText(str){
    textEl.innerHTML = '';
    var delay = 0;
    str.split('').forEach(function(ch){
      var span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      var palette = ['var(--coral)','var(--rose)','var(--yellow)','var(--leaf)'];
      span.style.color = palette[Math.floor(Math.random()*palette.length)];
      span.style.animationDelay = delay + 's';
      textEl.appendChild(span);
      delay += 0.045;
    });
  }

  function celebrate(){
    if(celebrating) return;
    celebrating = true;
    overlay.classList.add('active');
    setCelebrationText('HAPPY BIRTHDAY! 🎉');

    if(!reduced){
      spawnCelebrationBalloons(window.innerWidth < 560 ? 8 : 14);
      confettiBurst(canvas.width*0.5, canvas.height*0.4);
      confettiBurst(canvas.width*0.15, canvas.height*0.3);
      confettiBurst(canvas.width*0.85, canvas.height*0.3);

      var fireworkSpots = [
        [0.25,0.28],[0.75,0.24],[0.5,0.38],[0.35,0.5],[0.65,0.46]
      ];
      fireworkSpots.forEach(function(spot, idx){
        setTimeout(function(){
          firework(canvas.width*spot[0], canvas.height*spot[1]);
        }, 250 + idx*280 + Math.random()*150);
      });
    }

    setTimeout(function(){
      overlay.classList.remove('active');
      celebrating = false;
    }, 4200);
  }

  document.getElementById('surprise-btn').addEventListener('click', celebrate);

})();
