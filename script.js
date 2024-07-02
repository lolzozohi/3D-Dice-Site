// script.js

let scene, camera, renderer, diceArray = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Initial dice setup
    addDice();
    addDice();

    camera.position.z = 5;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
}

function rollDice() {
    diceArray.forEach(dice => {
        const targetRotation = getRandomRotation();
        new TWEEN.Tween(dice.rotation)
            .to(targetRotation, 2000)
            .easing(TWEEN.Easing.Quartic.Out)
            .onComplete(updateDiceFace)
            .start();
    });
}

function getRandomRotation() {
    const sides = [
        { x: 0, y: 0, z: 0 }, // Side 1
        { x: 0, y: Math.PI / 2, z: 0 }, // Side 2
        { x: Math.PI / 2, y: 0, z: 0 }, // Side 3
        { x: -Math.PI / 2, y: 0, z: 0 }, // Side 4
        { x: 0, y: -Math.PI / 2, z: 0 }, // Side 5
        { x: Math.PI, y: 0, z: 0 } // Side 6
    ];

    const randomSide = sides[Math.floor(Math.random() * sides.length)];

    // Add extra rotations to simulate a roll
    return {
        x: randomSide.x + Math.random() * 4 * Math.PI,
        y: randomSide.y + Math.random() * 4 * Math.PI,
        z: randomSide.z + Math.random() * 4 * Math.PI
    };
}

function updateDiceFace() {
    diceArray.forEach(dice => {
        // Determine which face is most visible to the camera
        const vector = new THREE.Vector3(0, 0, 1);
        vector.applyQuaternion(dice.quaternion);
        const faces = [
            { normal: new THREE.Vector3(0, 0, 1), index: 0 },  // Side 1
            { normal: new THREE.Vector3(0, 1, 0), index: 1 },  // Side 2
            { normal: new THREE.Vector3(1, 0, 0), index: 2 },  // Side 3
            { normal: new THREE.Vector3(-1, 0, 0), index: 3 }, // Side 4
            { normal: new THREE.Vector3(0, -1, 0), index: 4 }, // Side 5
            { normal: new THREE.Vector3(0, 0, -1), index: 5 }  // Side 6
        ];

        let bestMatch = faces[0];
        let maxDot = vector.dot(faces[0].normal);

        for (let i = 1; i < faces.length; i++) {
            const dot = vector.dot(faces[i].normal);
            if (dot > maxDot) {
                maxDot = dot;
                bestMatch = faces[i];
            }
        }

        // Rotate the dice to align the most visible face to the top
        const targetRotation = {
            x: bestMatch.normal.x * Math.PI / 2,
            y: bestMatch.normal.y * Math.PI / 2,
            z: bestMatch.normal.z * Math.PI / 2
        };

        new TWEEN.Tween(dice.rotation)
            .to(targetRotation, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    });
}

function addDice() {
    const geometry = new THREE.BoxGeometry();
    const textureLoader = new THREE.TextureLoader();
    const texture =['https://i.imgur.com/5Pk9VxN.png' ,'https://i.imgur.com/L1KhYda.png','https://i.imgur.com/lakDWQt.png','https://i.imgur.com/35IaQaK.png','https://i.imgur.com/aH3j7oV.png','https://i.imgur.com/40Jwirj.png']  

    const materials = [
        new THREE.MeshBasicMaterial({ map: textureLoader.load(texture[0]) }),
        new THREE.MeshBasicMaterial({ map: textureLoader.load(texture[1]) }),
        new THREE.MeshBasicMaterial({ map: textureLoader.load(texture[2])}),
        new THREE.MeshBasicMaterial({ map: textureLoader.load(texture[3]) }),
        new THREE.MeshBasicMaterial({ map: textureLoader.load(texture[4]) }),
        new THREE.MeshBasicMaterial({ map: textureLoader.load(texture[5]) })
    ];

    const diceMaterial = new THREE.MeshFaceMaterial(materials);
    const newDice = new THREE.Mesh(geometry, diceMaterial);

    // Random initial position
    newDice.position.x = Math.random() * 4 - 2;
    newDice.position.y = Math.random() * 4 - 2;
    newDice.position.z = Math.random() * 4 - 2;

    diceArray.push(newDice);
    scene.add(newDice);
}

function removeDice() {
    if (diceArray.length > 0) {
        const removedDice = diceArray.pop();
        scene.remove(removedDice);
    }
}

window.onload = init;

