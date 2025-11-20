(function() {
  var canvas = document.getElementById('rain-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var w, h;
  var rainDrops = [];
  var isRaining = false; // Default state, controlled by switch
  var animationId;

  function init() {
    resize();
    window.addEventListener('resize', resize);
    createRainDrops();
    
    // Check local storage for preference
    var savedState = localStorage.getItem('rainEffect');
    if (savedState === 'true') {
      startRain();
      updateSwitch(true);
    } else {
      updateSwitch(false);
    }
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createRainDrops() {
    rainDrops = [];
    var count = 100; // Number of drops
    for (var i = 0; i < count; i++) {
      rainDrops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 4 + 2,
        ys: Math.random() * 10 + 10
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(174,194,224,0.5)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    for (var i = 0; i < rainDrops.length; i++) {
      var p = rainDrops[i];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
      ctx.stroke();
    }
    move();
    if (isRaining) {
      animationId = requestAnimationFrame(draw);
    }
  }

  function move() {
    for (var i = 0; i < rainDrops.length; i++) {
      var p = rainDrops[i];
      p.x += p.xs;
      p.y += p.ys;
      if (p.x > w || p.y > h) {
        p.x = Math.random() * w;
        p.y = -20;
      }
    }
  }

  function startRain() {
    if (!isRaining) {
      isRaining = true;
      draw();
    }
  }

  function stopRain() {
    isRaining = false;
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, w, h);
  }

  function toggleRain() {
    if (isRaining) {
      stopRain();
      localStorage.setItem('rainEffect', 'false');
      updateSwitch(false);
    } else {
      startRain();
      localStorage.setItem('rainEffect', 'true');
      updateSwitch(true);
    }
  }

  function updateSwitch(active) {
    var btn = document.getElementById('rain-switch');
    if (btn) {
      if (active) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa fa-cloud-showers-heavy"></i> ON';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fa fa-sun"></i> OFF';
      }
    }
  }

  // Expose toggle function globally
  window.toggleRain = toggleRain;

  init();
})();
