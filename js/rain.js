(function() {
  // --- Rain Effect Logic ---
  var canvas = document.getElementById('rain-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var w, h;
  var rainDrops = [];
  var isRaining = false;
  var animationId;

  function initRain() {
    resize();
    window.addEventListener('resize', resize);
    createRainDrops();
    // Initial state check is handled by the Dark Mode Observer
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createRainDrops() {
    rainDrops = [];
    var count = 200; // Increased count
    for (var i = 0; i < count; i++) {
      rainDrops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 4 + 2,
        ys: Math.random() * 10 + 20 // Faster speed
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(174,194,224,0.6)'; // More visible
    ctx.lineWidth = 1.0;
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

  // --- Switch & Dark Mode Logic ---
  function toggleMode() {
    // Trigger the default darkmode-js button
    var defaultBtn = document.querySelector('.darkmode-toggle');
    if (defaultBtn) {
      defaultBtn.click();
    }
  }

  function updateSwitchUI(isDark) {
    var btn = document.getElementById('rain-switch');
    if (btn) {
      if (isDark) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa fa-cloud-showers-heavy"></i> Rainy';
        startRain();
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fa fa-sun"></i> Sunny';
        stopRain();
      }
    }
  }

  function initSwitch() {
    // Observer for Dark Mode class on body
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === "class") {
          var isDark = document.body.classList.contains('darkmode--activated');
          updateSwitchUI(isDark);
        }
      });
    });

    observer.observe(document.body, {
      attributes: true
    });

    // Initial check
    var isDark = document.body.classList.contains('darkmode--activated');
    updateSwitchUI(isDark);
  }

  // --- Navigation Logic ---
  function initNav() {
    var path = window.location.pathname;
    // Check if Home (About) page
    // Assuming Home is '/' or '/index.html'
    var isHome = path === '/' || path === '/index.html';
    
    if (isHome) {
      // Hide extra menu items, keep Home and Blog
      var itemsToHide = [
        '.menu-item-movies',
        '.menu-item-categories',
        '.menu-item-archives',
        '.menu-item-search',
        '.menu-item-tags',
        '.menu-item-about' // Hide about if it exists in menu
      ];
      
      itemsToHide.forEach(function(selector) {
        var el = document.querySelector(selector);
        if (el) el.style.display = 'none';
      });
    } else {
      // Show everything on other pages (like /blog/)
      var itemsToHide = [
        '.menu-item-movies',
        '.menu-item-categories',
        '.menu-item-archives',
        '.menu-item-search',
        '.menu-item-tags',
        '.menu-item-about'
      ];
      itemsToHide.forEach(function(selector) {
        var el = document.querySelector(selector);
        if (el) el.style.display = ''; // Reset to default (block/list-item)
      });
    }
  }

  // Expose toggle function globally
  window.toggleRain = toggleMode;

  // Initialize
  initRain();
  initSwitch();
  // Run nav logic after DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
  
  // Handle PJAX
  document.addEventListener('pjax:success', initNav);

})();
