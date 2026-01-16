document.addEventListener("DOMContentLoaded", function () {
    // Only activate on non-touch devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursorCanvas = document.getElementById('cursorCanvas');
    if (!cursorCanvas) return;

    const ctx = cursorCanvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Resize handler
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        cursorCanvas.width = width;
        cursorCanvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    const mouse = { x: width / 2, y: height / 2, moved: false };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.moved = true;
        
        // Spawn more particles when moving fast
        spawnParticles(3);
    });

    // Brand Colors
    const colors = ['#c9f31d', '#ffffff', '#00f0ff', '#bc13fe'];

    // Particle System
    let particles = [];

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // Random velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            
            this.life = 1.0; // Life 1.0 -> 0.0
            this.decay = Math.random() * 0.03 + 0.02; // How fast it fades
            
            this.size = Math.random() * 3 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.95; // Shrink
        }

        draw() {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            // Add neon glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0; // Reset
            ctx.globalAlpha = 1.0;
        }
    }

    function spawnParticles(count) {
        for (let i = 0; i < count; i++) {
            // Spawn slightly randomly around mouse for softness
            const offsetX = (Math.random() - 0.5) * 5;
            const offsetY = (Math.random() - 0.5) * 5;
            particles.push(new Particle(mouse.x + offsetX, mouse.y + offsetY));
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Spawn a particle even if not moving, for "alive" feel, but less freq
        if (mouse.moved && Math.random() < 0.2) {
            spawnParticles(1);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            
            if (p.life <= 0 || p.size <= 0.1) {
                particles.splice(i, 1);
            }
        }
        
        // Connect nearby particles for a "web" effect (optional, adds "premium" feel)
        // Only if particle count is low to avoid lag
        if (particles.length < 100) {
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = dx*dx + dy*dy;
                    
                    if (dist < 900) { // 30px distance
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * particles[i].life})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        requestAnimationFrame(animate);
    }
    
    animate();
});
