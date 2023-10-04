var scene = null,
    camera = null,
    renderer = null,
    controls = null;

const size = 30,
    divisions = 30;
let timeLeft = 60; // Define el tiempo inicial en segundos

//Avatar 
var myPlayer = null,
    myPlayerMesh = null,
    input = { left: 0, right: 0, up: 0, down: 0 },
    rootSpeed = 0.05,
    speed = 0.5;
function startScene() {
    //Scene, camera, renderer

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xC8C8C8);
    camera = new THREE.PerspectiveCamera(
        75,                                 // ángulo de visión (abajo o arriba)
        window.innerWidth / window.innerHeight,   // relación de aspecto 16:9
        0.1,                                      // mas cerca(no renderiza)
        1000);                                   // mas lejos(no renderiza)
        
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('model') });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    //ORBIT CONTROLS
    //controls= new THREE.OrbitControls(camera,renderer.domElement);
    //camera.position.set(4.2,3.8,5);   //(4.2,3.8,-6.3);
    //controls.update();

    camera.position.set(0,2.7,-10);   //(4.2,3.8,-6.3);
    camera.rotation.y += Math.PI;

    const rende = new THREE.WebGLRenderer();
    rende.shadowMap.enabled = true;
    rende.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    //Create a PointLight and turn on shadows for the light
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, 4);
    light.castShadow = true; // default false
    scene.add(light);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default

    const lightt = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(lightt);



    //const light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
    //scene.add( light );


    animate();
    // Escenario
    loadModel_objMtl("../models/obj_mtl/escenario/", "Escenario.obj", "Escenario.mtl");
    // Duck Model
    loadGltf('../models/gltf/other/', 'Duck.gltf');

    createCollectibles();
    stateGame();

    // Establecer la duración del temporizador en segundos (por ejemplo, 60 segundos)
    const duration = 60;
    // Especificar el elemento donde se mostrará la cuenta regresiva
    const countdownElement = document.getElementById('countdown');
    startTimer(duration, countdownElement);

    createPlayer();
}

function animate() {

    requestAnimationFrame(animate);
    //controls.update();
    renderer.render(scene, camera);
    movementPlayer();
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function loadModel_objMtl() {
    // Load MTL
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath("../models/obj_mtl/escenario/");
    mtlLoader.setPath("../models/obj_mtl/escenario/");
    mtlLoader.load("Escenario.mtl", function (materials) {
        materials.preload();

        // Load OBJ
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath("../models/obj_mtl/escenario/");
        objLoader.setMaterials(materials);
        objLoader.load("Escenario.obj", function (object) {
            scene.add(object);
            // object.scale.set(3,3,3);

        });
    });
}


function loadGltf(path, nameGltfGet) {
    var nameGltf = path + nameGltfGet;

    // Instantiate a loader
    const loader = new THREE.GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath(path);
    loader.setDRACOLoader(dracoLoader);

    // Load a glTF resource
    loader.load(
        // resource URL
        nameGltf,
        // called when the resource is loaded
        function (gltf) {

            scene.add(gltf.scene);
           
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.position.set(0, 0, -3);
            
                myPlayerMesh = gltf.asset;
                myPlayerMesh.rotation.y = Math.PI;
                myPlayerMesh.position.set(camera.position.x,camera.position.y+3 ,camera.position.z-10);
        },
        // called while loading is progressing
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    );
}

function createCollectibles() {
    const min = -2;
    const max = 3;
    for (var i = 0; i < 3; i++) {
        var posx = Math.floor(Math.random() * (max - min + 1) + min);
        var posz = Math.floor(Math.random() * (max - min + 1) + min);

        const texture = new THREE.TextureLoader().load('../images/paperGift.jpg');
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(posx, 0.6, posz);
        scene.add(cube);

        console.log(i);
    }
}

function stateGame(state) {
    switch (state) {
        case 'win':
            // audio & show img
            document.getElementById("winpage").style.display = "block";
            break;
        case 'lose':
            // audio & show img
            document.getElementById("losepage").style.display = "block";

            break;
        default:
            document.getElementById("winpage").style.display = "none";
            document.getElementById("losepage").style.display = "none";
    }
}


// Define una función para iniciar el temporizador
function startTimer(duration, display) {
    let timer = duration;
    const countdown = document.getElementById('countdown');

    function updateTimer() {
        countdown.textContent = timer;
        if (timer <= 0) {
            // Detener el temporizador
            clearInterval(interval);
            // Mostrar #losepage
            const losepage = document.getElementById('losepage');
            losepage.style.display = 'block';
        }
        timer--;
    }

    // Actualizar el temporizador inicialmente
    updateTimer();

    // Establecer un intervalo para actualizar el temporizador cada 1000 milisegundos (1 segundo)
    const interval = setInterval(updateTimer, 1000);
}

function createPlayer() {

    console.log("create player");

    const geometry = new THREE.BoxGeometry(2.5, -3, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    myPlayer = new THREE.Mesh(geometry, material);
    scene.add(myPlayer);
    myPlayer.position.set(camera.position.x,camera.position.y,camera.position.z);


}

function movementPlayer() {

    console.log("VALORRRRR"+myPlayerMesh);


    if(input.right == 1){ // Rotation Right
        camera.rotation.y -= rootSpeed;
        myPlayer.rotation.y -= rootSpeed;
        // myPlayerMesh.rotation.y -= rootSpeed;
    } else if(input.left == 1) { // Rotation left
        camera.rotation.y += rootSpeed;
        myPlayer.rotation.y += rootSpeed;
        // myPlayerMesh.rotation.y += rootSpeed;
    } else if(input.up == 1){ // movement up
        camera.position.z -= Math.cos(camera.rotation.y) * speed;
        camera.position.z -= Math.sin(camera.rotation.y) * speed;
        myPlayer.position.z -= Math.cos(camera.rotation.y) * speed;
        myPlayer.position.z -= Math.sin(camera.rotation.y) * speed;
        // myPlayerMesh.position.z -= Math.cos(camera.rotation.y) * speed;
        // myPlayerMesh.position.z -= Math.sin(camera.rotation.y) * speed;
    } else if(input.down == 1){ // movement down
        camera.position.z += Math.cos(camera.rotation.y) * speed;
        camera.position.z += Math.sin(camera.rotation.y) * speed;
        myPlayer.position.z += Math.cos(camera.rotation.y) * speed;
        myPlayer.position.z += Math.sin(camera.rotation.y) * speed;
        // myPlayerMesh.position.z += Math.cos(camera.rotation.y) * speed;
        // myPlayerMesh.position.z += Math.sin(camera.rotation.y) * speed;
    }
}

document.addEventListener('keydown', (e) => {
    console.log("Undi: " + e.keyCode);

    switch (e.keyCode) {
        case 68: // Derecha
            input.right = 1;
            break;
        case 65: // Izquierda
            input.left = 1;
            break;
        case 87: // Ariba
            input.up = 1;
            break;
        case 83: // Abajo
            input.down = 1;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    console.log("Solte: " + e.keyCode);

    switch (e.keyCode) {
        case 68: // Derecha
            input.right = 0;
            break;
        case 65: // Izquierda
            input.left = 0;
            break;
        case 87: // Ariba
            input.up = 0;
            break;
        case 83: // Abajo
            input.down = 0;
            break;
    }
});

