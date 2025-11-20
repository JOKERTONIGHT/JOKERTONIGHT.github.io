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
    var count = 150; 
    for (var i = 0; i < count; i++) {
      rainDrops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1, // Radius for droplets
        vy: Math.random() * 2 + 3, // Velocity Y
        alpha: Math.random() * 0.4 + 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    
    for (var i = 0; i < rainDrops.length; i++) {
      var d = rainDrops[i];
      
      // Draw Droplet
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 220, 255, ' + d.alpha + ')';
      ctx.fill();
      
      // Add a small reflection/highlight
      ctx.beginPath();
      ctx.arc(d.x - d.r/3, d.y - d.r/3, d.r/3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    }
    move();
    if (isRaining) {
      animationId = requestAnimationFrame(draw);
    }
  }

  function move() {
    for (var i = 0; i < rainDrops.length; i++) {
      var d = rainDrops[i];
      d.y += d.vy;
      
      // Reset if out of bounds
      if (d.y > h) {
        d.y = -10;
        d.x = Math.random() * w;
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
