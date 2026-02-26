import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#00ffff', 3, 3)
ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 3, 3)
ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#00ffff', 3, 3)
ghost3.castShadow = true
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
scene.add(ghost3)

const ghost4 = new THREE.PointLight('#00ffff', 3, 3)
ghost4.castShadow = true
ghost4.shadow.mapSize.width = 256
ghost4.shadow.mapSize.height = 256
ghost4.shadow.camera.far = 7
scene.add(ghost4)

// Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * Temple
 */
const stlLoader = new STLLoader()
stlLoader.load(
    '/models/Prambanan/prambanan.stl',
    (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: '#ffffff' })
        material.shadowSide = true
        const mesh = new THREE.Mesh(geometry, material)

        mesh.rotation.x = -Math.PI / 2;

        mesh.position.set(0, 2, 0) 
        mesh.scale.set(0.013, 0.013, 0.013) 

        scene.add(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.error('An error occurred while loading the STL model', error)
    }
)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5
floor.position.y = -1.9
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.castShadow = true
moonLight.position.set(4, 5, -2)

gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Temple light
const templeLight = new THREE.PointLight('#fff', 0, 7)
templeLight.position.set(1, 1.4, 1.5)
scene.add(templeLight);

setTimeout(() => {
    templeLight.intensity = 1.7; 
}, 2700);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = -1.6
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#262837')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4.5
    ghost1.position.z = Math.sin(ghost1Angle) * 4.5
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.5
    ghost3.position.x = Math.cos(ghost3Angle) * (6 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (8 + Math.sin(elapsedTime * 0.1))
    ghost3.position.y = Math.sin(elapsedTime * 3)
    const ghost4Angle = - elapsedTime * 0.18
    ghost4.position.x = Math.cos(ghost4Angle) * (6 + Math.sin(elapsedTime * 0.32))
    ghost4.position.z = Math.sin(ghost4Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost4.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 1.5)
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// Background music
const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();
const backgroundSound = new THREE.Audio(listener);

const userGesturePromise = () => {
    return new Promise((resolve) => {
        document.addEventListener('click', () => {
            alert('UNDER CONSTRUCTION');
            resolve();
        }, { once: true });
    });
};

userGesturePromise().then(() => {
    audioLoader.load('/audio/gamelan.mp3', function(buffer) {
        backgroundSound.setBuffer(buffer);
        backgroundSound.setLoop(true);
        backgroundSound.setVolume(0.4);
        backgroundSound.play();
    });
});