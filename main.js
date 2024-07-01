// Initialize Firebase
var firebaseConfig = {
    // Your Firebase configuration here
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Initialize Three.js
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create plane
var geometry = new THREE.PlaneGeometry(100, 100);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
var plane = new THREE.Mesh(geometry, material);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

// Create user cube
var userGeometry = new THREE.BoxGeometry();
var userMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var userCube = new THREE.Mesh(userGeometry, userMaterial);
scene.add(userCube);
userCube.position.set(0, 1, 0);

// PointerLockControls
var controls = new THREE.PointerLockControls(camera, document.body);
document.addEventListener('click', function() {
    controls.lock();
});
controls.addEventListener('lock', function() {
    console.log('Pointer locked');
});
controls.addEventListener('unlock', function() {
    console.log('Pointer unlocked');
});

// Movement controls
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'w':
            moveForward = true;
            break;
        case 's':
            moveBackward = true;
            break;
        case 'a':
            moveLeft = true;
            break;
        case 'd':
            moveRight = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
        case 'w':
            moveForward = false;
            break;
        case 's':
            moveBackward = false;
            break;
        case 'a':
            moveLeft = false;
            break;
        case 'd':
            moveRight = false;
            break;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (moveForward) userCube.position.z -= 0.1;
    if (moveBackward) userCube.position.z += 0.1;
    if (moveLeft) userCube.position.x -= 0.1;
    if (moveRight) userCube.position.x += 0.1;

    // Check collisions (to be implemented)
    checkCollisions();

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Collision detection and interaction (to be implemented)
function checkCollisions() {
    // Collision logic
}

// Fetch leaderboard data and update UI
db.ref('players').orderByChild('kills').limitToLast(10).on('value', function(snapshot) {
    var leaderboard = document.getElementById('stats');
    leaderboard.innerHTML = '<h3>Leaderboard</h3>';
    snapshot.forEach(function(player) {
        leaderboard.innerHTML += `<p>${player.val().name}: ${player.val().kills}</p>`;
    });
});
