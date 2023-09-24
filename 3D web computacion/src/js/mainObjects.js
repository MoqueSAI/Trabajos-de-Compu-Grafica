var scene = null,
    camera = null,
    renderer = null,
    controls= null;

    const size= 30,
    divisions = 30;

    function startScene() {
        //Scene, camera, renderer

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xC8C8C8);
        camera = new THREE.PerspectiveCamera( 
            75,                                 // ángulo de visión (abajo o arriba)
            window.innerWidth / window.innerHeight,   // relación de aspecto 16:9
            0.1,                                      // mas cerca(no renderiza)
            1000 );                                   // mas lejos(no renderiza)
        
        renderer = new THREE.WebGLRenderer({canvas: document.getElementById('model')});
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );
    
        //ORBIT CONTROLS
        controls= new THREE.OrbitControls(camera,renderer.domElement);
        camera.position.set(0,10,1);
        controls.update();

        
        camera.position.z = 7;
        //Grid Helper
        //const gridHelper = new THREE.GridHelper( size, divisions );
        //scene.add(gridHelper);

        //Axes helper
        //const axesHelper = new THREE.AxesHelper(5);
        //scene.add(axesHelper);

        const rende = new THREE.WebGLRenderer();
rende.shadowMap.enabled = true;
rende.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//Create a PointLight and turn on shadows for the light
const light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 0, 10, 4 );
light.castShadow = true; // default false
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

const lightt = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( lightt );


        
        //const light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        //scene.add( light );


        animate();
         // Escenario
        loadModel_objMtl("../models/obj_mtl/escenario/","Escenario.obj","Escenario.mtl");
    

    }

    function animate(){

        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene,camera);
        
        }

     window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function loadModel_objMtl(){
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


    //load GLTF
  
    const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load('../models/gltf/other/Duck.gltf', (gltf) => {   
    const duck = gltf.scene; // El objeto 3D del pato

    // position
    const newPosition = new THREE.Vector3(0, 0, -3); // Cambia x, y, z a las coordenadas deseadas

    // Aplly the position 
    duck.position.copy(newPosition);

    scene.add(duck);
});
    
