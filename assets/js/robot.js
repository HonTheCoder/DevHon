
document.addEventListener('DOMContentLoaded', () => {
    const robotHead = document.querySelector('.robot-head');
    const pupils = document.querySelectorAll('.pupil'); // Target pupils instead of eyes
    const container = document.querySelector('.robot-container');

    if (!container || !robotHead) return;

    document.addEventListener('mousemove', (e) => {
        const rect = robotHead.getBoundingClientRect();
        const headCenterX = rect.left + rect.width / 2;
        const headCenterY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate angle and distance for pupils
        const maxEyeMove = 8; // Movement radius inside the eye
        const dx = mouseX - headCenterX;
        const dy = mouseY - headCenterY;
        const angle = Math.atan2(dy, dx);
        
        // Calculate distance
        const distance = Math.min(maxEyeMove, Math.hypot(dx, dy) / 10);

        const eyeX = Math.cos(angle) * distance;
        const eyeY = Math.sin(angle) * distance;

        pupils.forEach(pupil => {
            // Keep -50% translate for centering, then add movement
            pupil.style.transform = `translate(calc(-50% + ${eyeX}px), calc(-50% + ${eyeY}px))`;
        });

        // Head tilt logic (same as before)
        const windowCenterX = window.innerWidth / 2;
        const windowCenterY = window.innerHeight / 2;
        
        const tiltX = (mouseY - windowCenterY) / 30; 
        const tiltY = (mouseX - windowCenterX) / 30;
        
        const clampedTiltX = Math.max(-20, Math.min(20, -tiltX));
        const clampedTiltY = Math.max(-20, Math.min(20, tiltY));

        robotHead.style.transform = `perspective(1000px) rotateX(${clampedTiltX}deg) rotateY(${clampedTiltY}deg)`;
    });
});
