// Firebase 配置
var firebaseConfig = {
  // 你的 Firebase 配置
};
firebase.initializeApp(firebaseConfig);

// 初始化 Firebase 服务
var auth = firebase.auth();
var database = firebase.database();

// 登录逻辑
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in:", user.displayName);
        // 你可以在这里加载用户数据并显示在游戏中
    } else {
        auth.signInAnonymously().catch(error => {
            console.error("Anonymous login failed:", error);
        });
    }
});

// 初始化 Three.js
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建平面
var geometry = new THREE.PlaneGeometry(100, 100);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
var plane = new THREE.Mesh(geometry, material);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

// 创建用户
var userGeometry = new THREE.BoxGeometry();
var userMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var userCube = new THREE.Mesh(userGeometry, userMaterial);
scene.add(userCube);
userCube.position.set(0, 1, 0);

// 控制器
var controls = new THREE.PointerLockControls(camera, document.body);
document.addEventListener('click', () => {
    controls.lock();
});
controls.addEventListener('lock', () => {
    console.log('Pointer locked');
});
controls.addEventListener('unlock', () => {
    console.log('Pointer unlocked');
});

// 移动控制
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

document.addEventListener('keydown', (event) => {
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

document.addEventListener('keyup', (event) => {
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

// 动画循环
function animate() {
    requestAnimationFrame(animate);

    if (moveForward) userCube.position.z -= 0.1;
    if (moveBackward) userCube.position.z += 0.1;
    if (moveLeft) userCube.position.x -= 0.1;
    if (moveRight) userCube.position.x += 0.1;

    controls.update();
    renderer.render(scene, camera);
}

animate();

// 假设有一个数组 `players` 存储所有玩家的 Mesh 对象和相关数据
var players = [];

// 假设用户 ID 存储在 `userId` 变量中
var userId;

// 碰撞检测和击退逻辑
function checkCollisions() {
    players.forEach(player => {
        if (player.id !== userId && userCube.position.distanceTo(player.mesh.position) < 1) {
            // 执行击退逻辑
            player.mesh.position.y -= 10; // 简单的击退效果
            if (player.mesh.position.y < -10) {
                // 玩家被击杀
                player.kills++;
                database.ref('players/' + player.id + '/kills').set(player.kills);
            }
        }
    });
}

// 动画循环中的碰撞检测调用
function animate() {
    requestAnimationFrame(animate);

    if (moveForward) userCube.position.z -= 0.1;
    if (moveBackward) userCube.position.z += 0.1;
    if (moveLeft) userCube.position.x -= 0.1;
    if (moveRight) userCube.position.x += 0.1;

    checkCollisions();
    controls.update();
    renderer.render(scene, camera);
}

animate();

// 获取排行榜数据并更新显示
database.ref('players').orderByChild('kills').limitToLast(10).on('value', (snapshot) => {
    var leaderboard = document.getElementById('stats');
    leaderboard.innerHTML = '<h3>Leaderboard</h3>';
    snapshot.forEach(player => {
        leaderboard.innerHTML += `<p>${player.val().name}: ${player.val().kills}</p>`;
    });
});
