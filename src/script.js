import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let mouseX = 0, mouseY = 0;

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 2, 10)
camera.position.x = 1
camera.position.y = 10
camera.position.z = 5
camera.lookAt(scene.position)
scene.add(camera)

const light = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(light)



// MATERIALS
const rubyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xE0115F,
    metalness: 0.7,
    roughness: 0.4,
    opacity: 0.7,
    transparent: true,
    envMapIntensity: 1.5,
    side: THREE.DoubleSide,
    transmission: 0.75,
    ior: 2.2
})

const diamondMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    metalness: 1,
    opacity: 0.9,
    ior: 2.1,
    side: THREE.DoubleSide,
    envMapIntensity: 0.8,
    metalness: 0.7,
    roughness: 0,
} );

const frameMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 1,
    envMapIntensity: 3,
    clearcoatRoughness: 0.1
})


/**
 * IMport
 */
const rgbeLoader = new RGBELoader();

 const dracoLoader = new DRACOLoader();
 dracoLoader.setDecoderPath('/draco/');
 const gltfLoader = new GLTFLoader();
 gltfLoader.setDRACOLoader(dracoLoader);
 

 rgbeLoader.load(
     'christmas_texture.hdr',
     (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
    
        scene.environment = texture;
        
        gltfLoader.load(
            'bracelet.glb', 
            (gltf) => {
                console.log(gltf.scene.children[0].children[0])
                gltf.scene.scale.set(0.05, 0.05, 0.05)
                
                // gltf.scene.rotation.z = -Math.PI/4
                gltf.scene.rotation.y = Math.PI/3.5
                gltf.scene.rotation.x = Math.PI/3
                // gltf.scene.position.y = -1

                
                gltf.scene.children[0].children[0].material = diamondMaterial
                gltf.scene.children[0].children[1].material = rubyMaterial
                gltf.scene.children[0].children[2].material = frameMaterial
                scene.add(gltf.scene)
                camera.lookAt(scene.position)
  
            })
     }

 )



 const onDocumentMouseMove = (event) =>{
    mouseX = ( event.clientX - sizes.width/2 ) * 0.0005;
	mouseY = ( event.clientY - sizes.height/2 ) * 0.0005;
    console.log(mouseX, mouseY)
 }

 document.addEventListener('mousemove', onDocumentMouseMove)





/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x191919)
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.gammaOutput = true
/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    // controls.update()
    camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt(scene.position)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()