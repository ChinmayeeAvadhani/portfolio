// ===================================
// MATRIX CODE RAIN EFFECT
// ===================================

function initCodeRain() {
    const canvas = document.getElementById('codeRainCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let drops = [];

    // Configuration
    const config = {
        fontSize: 16,
        characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`ｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ',
        colors: {
            primary: '#38bdf8',      // Sky Blue
            secondary: '#818cf8',    // Indigo
            fade: 'rgba(0, 0, 0, 0.05)'
        },
        speed: {
            min: 0.5,
            max: 1.5
        }
    };

    // Set canvas size to fullscreen
    function resizeCanvas() {
        const width = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
        );
        const height = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
        );

        canvas.width = width;
        canvas.height = height;

        // Initialize drops
        initDrops();
    }

    // Initialize drops (columns of falling text)
    function initDrops() {
        drops = [];
        const columns = Math.floor(canvas.width / config.fontSize);

        for (let i = 0; i < columns; i++) {
            drops.push({
                x: i * config.fontSize,
                y: Math.random() * -canvas.height, // Start above screen
                speed: config.speed.min + Math.random() * (config.speed.max - config.speed.min),
                chars: []
            });
        }
    }

    // Draw the code rain
    function draw() {
        // Create fade effect
        ctx.fillStyle = config.colors.fade;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set font
        ctx.font = `${config.fontSize}px 'JetBrains Mono', monospace`;

        drops.forEach((drop, index) => {
            // Pick random character
            const char = config.characters.charAt(
                Math.floor(Math.random() * config.characters.length)
            );

            // Alternate between cyan and green for variety
            const color = Math.random() > 0.5 ? config.colors.primary : config.colors.secondary;
            ctx.fillStyle = color;

            // Draw character
            ctx.fillText(char, drop.x, drop.y);

            // Move drop down
            drop.y += drop.speed * config.fontSize;

            // Reset drop when it goes off screen
            if (drop.y > canvas.height) {
                drop.y = Math.random() * -100;
                drop.speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
            }
        });
    }

    // Animation loop
    function animate() {
        draw();
        animationFrameId = requestAnimationFrame(animate);
    }

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    animate();

    // Cleanup function
    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
    };
}

// Export for use in script.js
window.initCodeRain = initCodeRain;
