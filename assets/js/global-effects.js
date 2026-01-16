
document.addEventListener('DOMContentLoaded', () => {
    // initLegacyCursor();
    
    // Only init global background if we are NOT on index.html
    // index.html has its own #particleCanvas for the big logo effect
    if (!document.getElementById('particleCanvas')) {
        initConstellationBackground();
    }
});

/* --- 1. Legacy DOM-based Sparkle Cursor (Restored from User Snippet) --- */
function initLegacyCursor() {
    var colour = "random"; 
    var sparkles = 100; // Match user snippet
    // Use client coordinates for tracking relative to viewport
    var clientX = 400;
    var clientY = 300;
    // Current page coordinates (updated in loop)
    var x = 400;
    var y = 300;
    // Old coordinates for movement detection
    var ox = 400;
    var oy = 300;
    
    var swide = window.innerWidth;
    var shigh = window.innerHeight;
    var sleft = 0;
    var sdown = 0;
    var tiny = [];
    var star = [];
    var starv = [];
    var starx = [];
    var stary = [];
    var tinyx = [];
    var tinyy = [];
    var tinyv = [];
    var colours = ['#ff0000','#00ff00','#ffffff','#ff00ff','#ffa500','#ffff00','#00ff00','#ffffff','ff00ff'];
    var n = 10;
    var dots = [];
    
    // Create Dots (Trail)
    for (let i = 0; i < n; i++) {
        let d = document.createElement('div');
        d.id = 'dots' + i;
        d.style.position = 'absolute';
        d.style.top = '0px';
        d.style.left = '0px';
        // Reduced size as requested
        d.style.width = (i + 1) + 'px';
        d.style.height = (i + 1) + 'px';
        d.style.background = '#ff0000'; // Initial color
        d.style.fontSize = (i + 1) + 'px';
        d.style.pointerEvents = 'none';
        d.style.zIndex = '10000'; // Ensure above navbar (2000)
        document.body.appendChild(d);
        dots.push(d);
    }

    // Create Sparkles (Stars)
    for (let i = 0; i < sparkles; i++) {
        // Reduced size as requested
        var rats = createDiv(3, 3);
        rats.style.visibility = "hidden";
        rats.style.zIndex = "9999"; // Ensure above navbar
        document.body.appendChild(tiny[i] = rats);
        starv[i] = 0;
        tinyv[i] = 0;
        
        // Reduced size as requested
        var rats2 = createDiv(5, 5);
        rats2.style.backgroundColor = "transparent";
        rats2.style.visibility = "hidden";
        rats2.style.zIndex = "9999"; // Ensure above navbar
        
        var rlef = createDiv(1, 5);
        var rdow = createDiv(5, 1);
        rats2.appendChild(rlef);
        rats2.appendChild(rdow);
        rlef.style.top = "2px";
        rlef.style.left = "0px";
        rdow.style.top = "0px";
        rdow.style.left = "2px";
        
        document.body.appendChild(star[i] = rats2);
    }

    // Helper: createDiv
    function createDiv(height, width) {
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.height = height + "px";
        div.style.width = width + "px";
        div.style.overflow = "hidden";
        div.style.pointerEvents = "none"; // Ensure clicks pass through
        return div;
    }

    // Helper: newColour
    function newColour() {
        var c = new Array();
        c[0] = 255;
        c[1] = Math.floor(Math.random() * 256);
        c[2] = Math.floor(Math.random() * (256 - c[1] / 2));
        c.sort(function() { return (0.5 - Math.random()); });
        return "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
    }

    // Mouse Move Listener - Track viewport coordinates
    document.addEventListener('mousemove', function(e) {
        clientY = e.clientY;
        clientX = e.clientX;
    });

    // Touch Listeners for Mobile
    document.addEventListener('touchstart', function(e) {
        if(e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
    });
    document.addEventListener('touchmove', function(e) {
        if(e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
    });

    // Scroll Listener
    function set_scroll() {
        if (typeof(self.pageYOffset) == 'number') {
            sdown = self.pageYOffset;
            sleft = self.pageXOffset;
        } else if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
            sdown = document.body.scrollTop;
            sleft = document.body.scrollLeft;
        } else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
            sleft = document.documentElement.scrollLeft;
            sdown = document.documentElement.scrollTop;
        } else {
            sdown = 0;
            sleft = 0;
        }
    }
    window.addEventListener('scroll', set_scroll);

    // Resize Listener
    function set_width() {
        var sw_min = 999999;
        var sh_min = 999999;
        if (document.documentElement && document.documentElement.clientWidth) {
            if (document.documentElement.clientWidth > 0) sw_min = document.documentElement.clientWidth;
            if (document.documentElement.clientHeight > 0) sh_min = document.documentElement.clientHeight;
        }
        if (typeof(self.innerWidth) == 'number' && self.innerWidth) {
            if (self.innerWidth > 0 && self.innerWidth < sw_min) sw_min = self.innerWidth;
            if (self.innerHeight > 0 && self.innerHeight < sh_min) sh_min = self.innerHeight;
        }
        if (document.body.clientWidth) {
            if (document.body.clientWidth > 0 && document.body.clientWidth < sw_min) sw_min = document.body.clientWidth;
            if (document.body.clientHeight > 0 && document.body.clientHeight < sh_min) sh_min = document.body.clientHeight;
        }
        if (sw_min == 999999 || sh_min == 999999) {
            sw_min = 800;
            sh_min = 600;
        }
        swide = sw_min;
        shigh = sh_min;
    }
    window.addEventListener('resize', set_width);
    set_width(); // Initial call

    // Animation Loop for Dots
    function animateDots() {
        // Calculate current document position based on scroll
        set_scroll();
        x = clientX + sleft;
        y = clientY + sdown;

        for (let i = 0; i < n; i++) {
            // Random color for dots
            let randcolours = colours[Math.floor(Math.random() * colours.length)];
            dots[i].style.background = randcolours;
            
            if (i < n - 1) {
                // Follow the next dot (snake effect)
                let nextTop = dots[i+1].style.top || "0px";
                let nextLeft = dots[i+1].style.left || "0px";
                
                dots[i].style.top = nextTop;
                dots[i].style.left = nextLeft;
            } else {
                // Head of snake follows mouse (updated x/y)
                dots[i].style.top = y + 'px';
                dots[i].style.left = x + 'px';
            }
        }
        setTimeout(animateDots, 10);
    }
    animateDots();

    // Animation Loop for Sparkles
    function sparkle() {
        var c;
        // Always calculate current document position
        set_scroll();
        let currentX = clientX + sleft;
        let currentY = clientY + sdown;
        
        // Determine how many to spawn
        let particlesToSpawn = 1; // Always spawn at least 1 when idle
        if (Math.abs(currentX - ox) > 1 || Math.abs(currentY - oy) > 1) {
            particlesToSpawn = 5; // Spawn more when moving
            ox = currentX;
            oy = currentY;
        }

        // Spawn new particles
        for (c = 0; c < sparkles && particlesToSpawn > 0; c++) {
            if (!starv[c]) {
                star[c].style.left = (starx[c] = currentX) + "px";
                star[c].style.top = (stary[c] = currentY + 1) + "px";
                star[c].style.clip = "rect(0px, 10px, 10px, 0px)"; // Adjusted for bigger size
                // Set color
                let newCol = (colour == "random") ? newColour() : colour;
                star[c].childNodes[0].style.backgroundColor = newCol;
                star[c].childNodes[1].style.backgroundColor = newCol;
                
                star[c].style.visibility = "visible";
                starv[c] = 50;
                particlesToSpawn--;
            }
        }

        // Update existing particles
        for (c = 0; c < sparkles; c++) {
            if (starv[c]) update_star(c);
            if (tinyv[c]) update_tiny(c);
        }
        setTimeout(sparkle, 40);
    }

    function update_star(i) {
        if (--starv[i] == 25) star[i].style.clip = "rect(1px, 4px, 4px, 1px)"; // Adjusted for reduced size
        if (starv[i]) {
            stary[i] += 1 + Math.random() * 3;
            starx[i] += (i % 5 - 2) / 5;
            
            // Fading despawn
            star[i].style.opacity = starv[i] / 50;

            if (stary[i] < shigh + sdown) {
                star[i].style.top = stary[i] + "px";
                star[i].style.left = starx[i] + "px";
            } else {
                star[i].style.visibility = "hidden";
                starv[i] = 0;
                return;
            }
        } else {
            tinyv[i] = 50;
            tiny[i].style.top = (tinyy[i] = stary[i]) + "px";
            tiny[i].style.left = (tinyx[i] = starx[i]) + "px";
            tiny[i].style.width = "2px"; // Reduced size
            tiny[i].style.height = "2px";
            tiny[i].style.backgroundColor = star[i].childNodes[0].style.backgroundColor;
            star[i].style.visibility = "hidden";
            tiny[i].style.visibility = "visible";
        }
    }

    function update_tiny(i) {
        if (--tinyv[i] == 25) {
            tiny[i].style.width = "1px"; // Reduced size
            tiny[i].style.height = "1px";
        }
        if (tinyv[i]) {
            tinyy[i] += 1 + Math.random() * 3;
            tinyx[i] += (i % 5 - 2) / 5;
            
            // Fading despawn
            tiny[i].style.opacity = tinyv[i] / 50;

            if (tinyy[i] < shigh + sdown) {
                tiny[i].style.top = tinyy[i] + "px";
                tiny[i].style.left = tinyx[i] + "px";
            } else {
                tiny[i].style.visibility = "hidden";
                tinyv[i] = 0;
                return;
            }
        } else {
            tiny[i].style.visibility = "hidden";
        }
    }
    
    sparkle();
}

/* --- 2. Global Constellation Background (Replicating index.html exactly) --- */
function initConstellationBackground() {
    let canvas = document.getElementById('globalBackgroundCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'globalBackgroundCanvas';
        // Fixed positioning to cover the whole screen like a background
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1'; // Behind content
        canvas.style.pointerEvents = 'none'; // Click-through
        document.body.appendChild(canvas);
        
        // Match index.html background color exactly
        document.body.style.backgroundColor = '#050505';
    }
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    
    // Mouse Interaction
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.clientX; // Use clientX for fixed canvas
        mouse.y = event.clientY;
    });

    // Touch Interaction for Mobile Cursor Effect
    window.addEventListener('touchstart', function(event) {
        if(event.touches.length > 0) {
            mouse.x = event.touches[0].clientX;
            mouse.y = event.touches[0].clientY;
        }
    });

    window.addEventListener('touchmove', function(event) {
        if(event.touches.length > 0) {
            mouse.x = event.touches[0].clientX;
            mouse.y = event.touches[0].clientY;
        }
    });

    window.addEventListener('touchend', function() {
        mouse.x = null;
        mouse.y = null;
    });

    // Colors from index.html
    const colors = ['#c9f31d', '#ffffff', '#00f0ff', '#bc13fe'];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wall bounce
            if (this.x > width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > height || this.y < 0) this.speedY = -this.speedY;

            // Mouse interaction (Repel)
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = forceDirectionX * force * 3;
                    const directionY = forceDirectionY * force * 3;
                    
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initParticles() {
        particles = [];
        // Same density formula as index.html
        let numberOfParticles = (width * height) / 9000;
        if (numberOfParticles < 80) numberOfParticles = 80; // Minimum

        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Constellation effect (Lines between particles)
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance/500})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Connect to mouse
            if (mouse.x != null) {
                let dx = particles[i].x - mouse.x;
                let dy = particles[i].y - mouse.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(201, 243, 29, ${0.5 - distance/300})`; // Lime connection
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    window.addEventListener('resize', resize);
    animate();

    // Fade in
    setTimeout(() => {
        canvas.classList.add('loaded');
    }, 100);
}
