/*Autor: Nicolás Toro Echeverri
Fecha de creación: 23/08/2023 9:33 am
Ultima modificación:30/08/2023 9:22 am */

var scene = null,
    camera = null,
    renderer = null,
    controls= null;
    /*cube= null,torus = null, mesh = null*/
    var geometry, material, mesh, figures= [], light=null;

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
        
        camera.position.z = 7;
        //Grid Helper

        const gridHelper = new THREE.GridHelper( size, divisions );
        scene.add(gridHelper);

        //Axes helper

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        createLight("ambient");
        // createLight("spotLight");
        createLight("pointLight");
        animate();
    }

    //Function createLight -- crea las luces

    function createLight(typeLight){

        switch (typeLight) {
            case "ambient":
                light = new THREE.AmbientLight( 0xffffff); // soft white light
                scene.add( light );
              break;
            case "pointLight":
                light = new THREE.PointLight( 0xffffff, 0.3, 100 );
                light.position.set( 0, 10, 0 );
                scene.add( light );
    
                const sphereSize = 1;
                const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
               // scene.add( pointLightHelper );
              break;
            case "spotLight":
                light = new THREE.SpotLight( 0xffffff, 0.5 );
                light.position.set( 10, 10, 10 );
                scene.add( light );
    
                const spotLightHelper = new THREE.SpotLightHelper( light );
               // scene.add( spotLightHelper );
              break;
          }


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
     
        const texture = new THREE.TextureLoader().load('../images/animals/face1.jpg' ); 
        material = [new THREE.MeshStandardMaterial({color: 0xFFFFFF, 
            map:texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1, 
            wireframe: false,
            wireframeLinewidth: 6}),
            new THREE.MeshStandardMaterial ({map:new THREE.TextureLoader().load('../images/animals/face1.jpg')}),
            new THREE.MeshStandardMaterial ({map:new THREE.TextureLoader().load('../images/animals/face2.png')}),
            new THREE.MeshStandardMaterial ({map:new THREE.TextureLoader().load('../images/animals/face3.jpg')}),
            new THREE.MeshStandardMaterial ({map:new THREE.TextureLoader().load('../images/animals/face4.jpg')}),
            new THREE.MeshStandardMaterial ({map:new THREE.TextureLoader().load('../images/animals/face5.png')}),
            new THREE.MeshStandardMaterial ({map:new THREE.TextureLoader().load('../images/animals/face6.jpg')})];

        
        
        
            
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
