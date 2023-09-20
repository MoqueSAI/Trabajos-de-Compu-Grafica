/*Autor: Nicolás Toro Echeverri
Fecha de creación: 23/08/2023 9:33 am
Ultima modificación:30/08/2023 9:22 am */

var scene = null,
    camera = null,
    renderer = null,
    controls= null;
    /*cube= null,torus = null, mesh = null*/
    var geometry, material, mesh, figures= [];

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
        
        renderer = new THREE.WebGLRenderer({canvas: document.getElementById('app')});
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );
    
        //ORBIT CONTROLS
        controls= new THREE.OrbitControls(camera,renderer.domElement);
        camera.position.set(0,10,1);
        controls.update();

       /* // ----OBJECTS----
        // figura Cube
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0xFF0000, wireframe: true} );
         cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        // figrua Torus
        const geometrytorus = new THREE.TorusGeometry( 0.8, 0.1, 5, 20 ); 
        const materialtorus = new THREE.MeshBasicMaterial( { color: 0xFF0000, wireframe: true } ); 
        torus = new THREE.Mesh( geometrytorus, materialtorus ); 
        scene.add( torus );
        // figura mesh
        const geometrymesh = new THREE.RingGeometry( 1, 4, 1 ); 
        const materialmesh = new THREE.MeshBasicMaterial( { color: 0xFF0000, side: THREE.DoubleSide, wireframe: true } );
         mesh = new THREE.Mesh( geometrymesh, materialmesh ); 
        scene.add( mesh ); 

        torus.position.x = -8;
        mesh.position.x= 8;
        cube.position.x=0;
        
        */
        
        camera.position.z = 7;
        //Grid Helper

        const gridHelper = new THREE.GridHelper( size, divisions );
        scene.add(gridHelper);

        //Axes helper

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        animate();
    }

 //function createGeometry -- switch case (cube,torus,mesh), que genere la figura en un lugar random

   function CreateGeometry(shape){
    
    switch (shape){
    case 'cube':
        geometry = new THREE.BoxGeometry( 1, 1, 1 );
        break;

    case 'torus':
         geometry = new THREE.TorusGeometry( 0.8, 0.1, 5, 20 ); 
        break;

    case 'ring':
        geometry = new THREE.RingGeometry( 1, 1.5, 1 ); 
        break;

        default:
            console.error('Figura no encontrada');
            return;
     }

        material = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true});
        mesh = new THREE.Mesh(geometry,material);
        mesh.position.x = (Math.random() -  0.5)* size ;
        mesh.position.z = (Math.random() -  0.5)* size ;
        scene.add (mesh);

        figures.push(mesh);

       
   }

    function animate(){

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);

    for(let i=0; i<figures.length; i++){  /* Se creó un arreglo con la variable figures=[] para almacenar la animacion de la figura anterior y así no se detenga (arreglo) */
        figures[i].rotation.x += 0.03;
        figures[i].rotation.y += 0.03;
    }
    
    }

   
    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
