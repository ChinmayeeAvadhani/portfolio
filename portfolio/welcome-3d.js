// Three.js 3D Welcome Animation
// Wireframe object flies towards camera and shatters into particles

class Welcome3D {
    constructor() {
        this.canvas = document.getElementById('welcome3DCanvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mainObject = null;
        this.particles = [];
        this.isShattered = false;
        this.animationFrame = null;

        this.init();
    }

    init() {
        // Setup scene
        this.scene = new THREE.Scene();

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Create main 3D object (wireframe icosahedron)
        this.createMainObject();

        // Add lighting
        this.addLights();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation
        this.animate();

        // Trigger shatter after delay
        setTimeout(() => this.triggerShatter(), 2500);
    }

    createMainObject() {
        // Large wireframe icosahedron for developer/tech vibes
        const geometry = new THREE.IcosahedronGeometry(5, 0);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            wireframe: true,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9
        });

        this.mainObject = new THREE.Mesh(geometry, material);
        this.mainObject.position.z = -150; // Start far away
        this.scene.add(this.mainObject);
    }

    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Point lights for dramatic effect
        const light1 = new THREE.PointLight(0x00ffff, 1, 100);
        light1.position.set(10, 10, 10);
        this.scene.add(light1);

        const light2 = new THREE.PointLight(0xb026ff, 1, 100);
        light2.position.set(-10, -10, 10);
        this.scene.add(light2);
    }

    animate() {
        this.animationFrame = requestAnimationFrame(() => this.animate());

        if (!this.isShattered && this.mainObject) {
            // Move object towards camera
            this.mainObject.position.z += 1.5;

            // Rotate for visual interest
            this.mainObject.rotation.x += 0.01;
            this.mainObject.rotation.y += 0.01;

            // Scale up as it approaches
            const scale = 1.5 + (this.mainObject.position.z + 150) / 80;
            this.mainObject.scale.set(scale, scale, scale);
        }

        // Animate particles
        if (this.isShattered) {
            this.particles.forEach(particle => {
                particle.position.add(particle.velocity);
                particle.rotation.x += particle.rotationSpeed.x;
                particle.rotation.y += particle.rotationSpeed.y;
                particle.rotation.z += particle.rotationSpeed.z;

                // Fade out
                particle.material.opacity -= 0.008;

                // Apply gravity
                particle.velocity.y -= 0.02;
            });

            // Remove faded particles
            this.particles = this.particles.filter(p => p.material.opacity > 0);
        }

        this.renderer.render(this.scene, this.camera);
    }

    triggerShatter() {
        if (!this.mainObject || this.isShattered) return;

        this.isShattered = true;

        // Get geometry vertices
        const geometry = this.mainObject.geometry;
        const positions = geometry.attributes.position;

        // Create massive amount of fragments for screen-filling effect
        const fragmentCount = 400;

        // Use the vertices to create fragments
        for (let i = 0; i < fragmentCount; i++) {
            // Random fragment size - varied sizes
            const sizeX = 0.5 + Math.random() * 3;
            const sizeY = 0.5 + Math.random() * 3;
            const sizeZ = 0.5 + Math.random() * 3;

            // Use triangle geometry for sharper, more "shattered glass" look
            const fragmentGeometry = new THREE.ConeGeometry(sizeX, sizeY, 3);

            const fragmentMaterial = new THREE.MeshPhongMaterial({
                color: Math.random() > 0.5 ? 0x00ffff : 0xb026ff,
                emissive: Math.random() > 0.5 ? 0x00ffff : 0xb026ff,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide,
                wireframe: Math.random() > 0.7 // Some wireframe fragments for tech vibe
            });

            const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);

            // Set initial position
            const spread = 60;
            fragment.position.copy(this.mainObject.position);
            fragment.position.x += (Math.random() - 0.5) * spread;
            fragment.position.y += (Math.random() - 0.5) * spread;
            fragment.position.z += (Math.random() - 0.5) * spread;

            fragment.rotation.copy(this.mainObject.rotation);
            fragment.scale.copy(this.mainObject.scale);

            // Calculate explosion velocity (outward from center)
            const direction = new THREE.Vector3(
                fragment.position.x - this.mainObject.position.x,
                fragment.position.y - this.mainObject.position.y,
                fragment.position.z - this.mainObject.position.z
            ).normalize();

            // Add random directional bias to spread across screen
            direction.x += (Math.random() - 0.5) * 2;
            direction.y += (Math.random() - 0.5) * 2;
            direction.z += (Math.random() - 0.5) * 1;
            direction.normalize();

            const velocity = direction.multiplyScalar(1.0 + Math.random() * 2.0);

            fragment.velocity = velocity;
            fragment.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.2
            };

            this.particles.push(fragment);
            this.scene.add(fragment);
        }

        // Remove main object
        this.scene.remove(this.mainObject);
        this.mainObject = null;

        // Trigger welcome screen fade out
        setTimeout(() => {
            const welcomeScreen = document.getElementById('welcomeScreen');
            if (welcomeScreen) {
                welcomeScreen.style.opacity = '0';
                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                    this.cleanup();
                }, 1000);
            }
        }, 1500);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    cleanup() {
        // Stop animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        // Clean up Three.js resources
        this.particles.forEach(p => {
            this.scene.remove(p);
            p.geometry.dispose();
            p.material.dispose();
        });

        if (this.renderer) {
            this.renderer.dispose();
        }

        window.removeEventListener('resize', () => this.onWindowResize());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Welcome3D();
    });
} else {
    new Welcome3D();
}
