import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { PhysicsController } from './physics';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class main {
    async init() {
        this.marsDistance = 227940;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1000, this.marsDistance * 20);
        this.camera.position.z = -100000;
        this.clock = new THREE.Clock();
        this.planets = [];
        this.AnimationMixers = [];
        this.pointer = { x: 0, y: 0 };
        this.raycaster = new THREE.Raycaster();

        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xEEEEEE);
        renderer.shadowMap.enabled = true;
        this.renderer = renderer;
        document.body.appendChild(renderer.domElement);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        var gui = new dat.GUI({ name: 'My GUI' });
        const config = { radius: 6000, mass: 400, impulse: 100000 }
        gui.add(config, 'radius', 1000, 20000);
        gui.add(config, 'mass', 40, 10000);
        gui.add(config, 'impulse', 40, 100000000);
        gui.add({
            add: () => {
                const planet = this.createPlanet('earth', "2k_earth.jpg", 0, config.radius);
                const vector = new THREE.Vector3(0, 0, -1);
                vector.applyQuaternion(this.camera.quaternion);
                const cameraPos = this.camera.position.clone();
                const newPos = cameraPos.addScaledVector(vector, 24000);
                planet.position.copy(newPos);
                const body = this.physicsCtrl.createPlanet(planet, config.radius, config.mass, planet.position, planet.quaternion);
                this.physicsCtrl.applyImpulse(body, vector.multiplyScalar(config.impulse));
            }
        }, 'add');
        this.physicsCtrl = new PhysicsController();
        await this.physicsCtrl.init();

        this.setupEvents();
        this.createWorld();
        this.createLights();
        this.animate();
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    }


    onPointerMove(event) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    createWorld() {
        this.createSun();

        var geometry = new THREE.SphereGeometry(this.marsDistance * 9 + 10000, 32, 32);
        var material = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load("stars_milky_way.jpg"),
            side: THREE.DoubleSide
        });
        this.skysphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.skysphere);
    }

    createPlanet(name, texture_name, distance, radius) {
        var geometry = new THREE.SphereGeometry(radius, 32, 32);
        var material = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(texture_name),
            metalness: 0
        });

        let planet = new THREE.Mesh(geometry, material);
        let system = new THREE.Object3D();
        system.add(planet);
        this.planets.push(system);
        this.scene.add(system);
        planet.castShadow = true;
        planet.receiveShadow = true;

        const loader = new GLTFLoader();
        loader.load('dino/scene.gltf', (gltf) => {
            const model = gltf.scene;
            const dinoSystem = new THREE.Object3D();
            dinoSystem.add(model);
            system.add(dinoSystem);
            model.position.y = radius;
            model.scale.set(1000, 1000, 1000);

            // Create an AnimationMixer, and get the list of AnimationClip instances
            const mixer = new THREE.AnimationMixer(model);
            const clips = gltf.animations;
            this.AnimationMixers.push(mixer);

            // Play a specific animation
            const clip = THREE.AnimationClip.findByName(clips, 'run');
            const action = mixer.clipAction(clip);
            action.timeScale = 4;
            action.play();

            // Play all animations
            // clips.forEach((clip) => {
            //     mixer.clipAction(clip).play();
            // });
        }, undefined, (error) => {
            console.error(error);
        });

        return system;
    }

    createMoon(name, texture_name, distance, radius, system) {

    }

    createSun() {
        var geometry = new THREE.SphereGeometry(69700 / 2, 32, 32);
        var material = new THREE.MeshStandardMaterial({
            emissive: 0xEEEE99,
            emissiveIntensity: 0.8,
            map: new THREE.TextureLoader().load("2k_sun.jpg")
        });
        this.sun = new THREE.Mesh(geometry, material);
        this.scene.add(this.sun);
        const body = this.physicsCtrl.createPlanet(this.sun, 69700 / 2, 10000000, this.sun.position, this.sun.quaternion);
    }

    createLights() {
        var sunLight = new THREE.PointLight(0xffffff, 1, this.marsDistance * 20, 1);
        this.scene.add(new THREE.AmbientLight(0x404040));
        this.scene.add(sunLight);

        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 1024;
        sunLight.shadow.mapSize.height = 1024;
        sunLight.shadow.camera.near = this.camera.near;
        sunLight.shadow.camera.far = this.camera.far;
    }

    animate() {
        this.controls.update();
        const deltaSeconds = this.clock.getDelta();
        for (let planet of this.planets) {
            if (planet.children.length > 1) {
                planet.children[1].rotation.x += 0.01;
            }
        }
        for (let mixer of this.AnimationMixers) {
            mixer.update(deltaSeconds);
        }
        // update the picking ray with the camera and pointer position
        this.raycaster.setFromCamera(this.pointer, this.camera);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.planets.map((system) => system.children[0]));

        for (let i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0xff0000);
        }
        requestAnimationFrame(() => this.animate());
        this.physicsCtrl.animate(deltaSeconds);
        this.renderer.render(this.scene, this.camera);
    }
}
const module = new main();
module.init();
