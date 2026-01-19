// ===================================
// NEURAL NETWORK BACKGROUND
// ===================================

function initNeuralNetwork() {
    const canvas = document.getElementById('neuralNetworkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];
    let animationFrameId;
    let mouseX = -1000;
    let mouseY = -1000;

    // Configuration
    const config = {
        nodeCount: 100,
        maxDistance: 180,
        nodeRadius: 3,
        nodeSpeed: 0.5,
        mouseConnectionDistance: 250, // Distance for mouse connections
        colors: {
            node: 'rgba(56, 189, 248, 0.8)', // Sky Blue
            nodePurple: 'rgba(129, 140, 248, 0.8)', // Indigo
            connection: 'rgba(56, 189, 248, 0.15)',
            connectionPurple: 'rgba(129, 140, 248, 0.15)',
            mouseConnection: 'rgba(56, 189, 248, 0.4)' // Brighter for mouse connections
        }
    };

    // Set canvas size to fullscreen
    function resizeCanvas() {
        // Use document.documentElement for more reliable dimensions
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

        // Re-initialize nodes to fill the new canvas size
        if (nodes.length > 0) {
            initNodes();
        }
    }

    resizeCanvas();

    // Also resize after a delay to catch any layout changes
    setTimeout(resizeCanvas, 100);
    setTimeout(resizeCanvas, 500);

    window.addEventListener('resize', resizeCanvas);

    // Node class
    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.nodeSpeed;
            this.vy = (Math.random() - 0.5) * config.nodeSpeed;
            this.radius = config.nodeRadius;
            // Randomly assign cyan or purple color
            this.isCyan = Math.random() > 0.5;
            this.color = this.isCyan ? config.colors.node : config.colors.nodePurple;
        }

        update() {
            // Move node
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) {
                this.vx *= -1;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.vy *= -1;
            }

            // Keep within bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Initialize nodes
    function initNodes() {
        nodes = [];
        for (let i = 0; i < config.nodeCount; i++) {
            nodes.push(new Node());
        }
    }

    // Draw connections between close nodes
    function drawConnections() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.maxDistance) {
                    // Calculate opacity based on distance
                    const opacity = 1 - (distance / config.maxDistance);

                    // Use cyan or purple based on node colors
                    const connectionColor = nodes[i].isCyan && nodes[j].isCyan
                        ? `rgba(56, 189, 248, ${opacity * 0.15})`
                        : `rgba(129, 140, 248, ${opacity * 0.15})`;

                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = connectionColor;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    // Draw connections from nodes to mouse cursor
    function drawMouseConnections() {
        // Only draw if mouse is on screen
        if (mouseX < 0 || mouseY < 0 || mouseX > canvas.width || mouseY > canvas.height) {
            return;
        }

        nodes.forEach(node => {
            const dx = node.x - mouseX;
            const dy = node.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.mouseConnectionDistance) {
                // Calculate opacity based on distance
                const opacity = 1 - (distance / config.mouseConnectionDistance);

                // Brighter connection to mouse
                const connectionColor = node.isCyan
                    ? `rgba(56, 189, 248, ${opacity * 0.6})`
                    : `rgba(129, 140, 248, ${opacity * 0.6})`;

                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = connectionColor;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Add glow to the line
                ctx.shadowBlur = 5;
                ctx.shadowColor = connectionColor;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        });

        // Draw a glowing cursor point
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(56, 189, 248, 1)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Animation loop
    function animate() {
        // Clear canvas with slight fade for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw connections between nodes first (behind everything)
        drawConnections();

        // Draw mouse connections (on top of node connections)
        drawMouseConnections();

        // Update and draw nodes (on top)
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Mouse interaction - track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Reset mouse position when leaving the window
    document.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    // Start animation
    initNodes();
    animate();

    // Cleanup function
    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
    };
}
