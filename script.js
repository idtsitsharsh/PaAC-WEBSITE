// script.js
// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🌌 Load the star background texture
const textureLoader = new THREE.TextureLoader();
const starsTexture = textureLoader.load('textures/star.jpg', function(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);  // Increased density of stars
});

// Create a LARGE starfield sphere
const starGeometry = new THREE.SphereGeometry(500, 64, 64); // Adjusted size
const starMaterial = new THREE.MeshBasicMaterial({
    map: starsTexture,
    side: THREE.BackSide,  // Ensures the texture is visible from inside the sphere
    transparent: true      // Make sure it's transparent if you have any overlap issues
});
const starField = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starField);

// ✅ Move the starfield further back to avoid overlap with planets
starField.position.set(0, 0, -100);

// Function to create planets (example: moon, earth, mars)
function createPlanet(size, texture, position) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = texture
        ? new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(texture) })
        : new THREE.MeshStandardMaterial({ color: 0xffffff });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(...position);
    scene.add(planet);
    return planet;
}

// Adding planets
const moon = createPlanet(2, 'textures/mars.jpg', [0, 0, 0]);
const earth = createPlanet(5, 'textures/venus.jpg', [0, 0, -30]);
const mars = createPlanet(4, 'textures/jupiter.jpg', [0, 0, -60]);

// Add lights
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(50, 50, 50);
light.intensity = 1.5; // Increase intensity
scene.add(light);

// Position camera at the moon
camera.position.z = 15;

// GSAP ScrollTrigger Animation for moving through planets
gsap.registerPlugin(ScrollTrigger);

gsap.to(camera.position, {
    z: -60, // Moves camera back to reveal planets
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// 🔄 Animation loop
function animate() {
    requestAnimationFrame(animate);
    starField.rotation.y += 0.0002; // Slow rotation of starfield for realism
    moon.rotation.y += 0.0002;
    earth.rotation.y += 0.0002;
    mars.rotation.y += 0.0002;
    renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

window.addEventListener("scroll", () => {
    let scrollY = window.scrollY;

    // Define key scroll positions
    let startScroll = 150;  // When animation starts
    let endScroll = 250;    // When animation reaches final state
    let endScroll2 = 350;

    // Normalize scroll progress between 0 and 1
    let progress = Math.min(Math.max((scrollY - startScroll) / (endScroll - startScroll), 0), 1);
    let progress2 = Math.min(Math.max((scrollY - 250) / (endScroll2 - 250), 0), 1);

    let event1Scale = 1 - (progress * 0.2); // Shrinks from 1 to 0.8
    let event1Opacity = 1 - (progress * 0.5); // Opacity from 1 to 0.5
    let event2Scale = 0.8 + (progress * 0.2); // Grows from 0.8 to 1
    let event2Opacity = 0.5 + (progress * 0.5); // Opacity from 0.5 to 1
    let event1Margin = (window.innerWidth * 0.5 - 200) - (progress * 450);
    let headingTranslate = -progress2 * 200;

    let event1 = document.getElementById("event1");
    event1.style.transform = `scale(${event1Scale})`;
    event1.style.opacity = event1Opacity;
    event1.style.marginLeft = `${event1Margin}px`;

    let event2 = document.getElementById("event2");
    event2.style.transform = `scale(${event2Scale})`;
    event2.style.opacity = event2Opacity;
    event2.style.marginLeft = 0;

    let heading = document.getElementById("heading");
    heading.style.transform = `translateX(-50%) translateY(${headingTranslate}px)`;

    if(scrollY>=endScroll2){
        event1.style.display='none';
        event2.style.display='none';
        heading.style.display='none';
    }
    else{
        event1.style.display='inline-block';
        event2.style.display='inline-block';
        heading.style.display='inline-block';
    }

    let events = document.querySelectorAll(".main-event-card");
    events.forEach(event => {
        if (scrollY > 375) {
            event.style.opacity = "1";
        }
        else{
            event.style.opacity = "0";
        }
    });
});
