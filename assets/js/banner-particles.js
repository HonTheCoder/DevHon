document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('bannerLeftParticles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    // Configuration
    const config = {
        color: '#c9f31d', // Neon Green matching theme
        particleCount: 30, // Density
        speed: 1.2, // Upward speed
        connectionDistance: 60 // Max distance for lines
    };

    let particles = [];

    function resize() {
        // Parent container dimensions
        const container = canvas.parentElement;
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        
        // Handle HiDPI
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        // Update width/height for calculations to match CSS pixels
        // (context scaling handles the rendering resolution)
    }

    class Particle {
        constructor(reset = false) {
            this.init(reset);
        }

        init(reset = false) {
            this.x = Math.random() * width;
            // If resetting, start at bottom. If initial, random Y.
            this.y = reset ? height + 10 : Math.random() * height;
            
            this.size = Math.random() * 2 + 1; // Size 1-3px
            this.speedY = Math.random() * config.speed + 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            
            // Slight horizontal drift (sine wave movement simulation)
            this.driftOffset = Math.random() * Math.PI * 2;
            this.driftSpeed = 0.05;
        }

        update() {
            this.y -= this.speedY;
            
            // Wavy motion
            this.driftOffset += this.driftSpeed;
            this.x += Math.sin(this.driftOffset) * 0.3;

            // Reset if out of bounds (top)
            if (this.y < -10) {
                this.init(true);
            }
        }

        draw() {
            ctx.fillStyle = config.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw faint tail
            ctx.beginPath();
            ctx.strokeStyle = config.color;
            ctx.lineWidth = 0.5;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.speedY * 4);
            ctx.stroke();
            
            ctx.globalAlpha = 1.0;
        }
    }

    function initParticles() {
        particles = [];
        // Adjust particle count based on width (responsive density)
        const density = Math.floor(width * height / 1000); // 1 particle per 1000px area approx
        const count = Math.min(config.particleCount, density);
        
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Connect nearby particles for "network" feel
        connectParticles();

        requestAnimationFrame(animate);
    }

    function connectParticles() {
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 0.2;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < config.connectionDistance) {
                    ctx.globalAlpha = (1 - (dist / config.connectionDistance)) * 0.5; // Max opacity 0.5
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1.0;
    }

    // Init
    resize();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
});
