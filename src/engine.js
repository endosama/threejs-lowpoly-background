import {
    PerspectiveCamera,
    Scene,
    AmbientLight,
    WebGLRenderer,
} from 'three';

import * as THREE from 'three';
import {
    FlatSurface
} from './surface';
import { windowResizeSuscribe } from './windowResizeService';
import { DeviceDetector } from './deviceDetector';

export class Engine {
    constructor() {
        this.rot = 1;
        this.state = 0;
        this.cpuPerformanceMeasuresCount = 0;
        this.cpuPerformanceMeasures = 0;
    }
    init(width, height, c) {
        this.SCREEN_HEIGHT = height;
        this.SCREEN_WIDTH = width;
        this.container = c;
        this.viewport = {
            x: width,
            y: height,
        };
        this.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
        this.createScene();
    }
    getMainModel() {
        return this.plane;
    }
    setupLights() {
        // this.light = new PointLight(0x666666, 1, 0);
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(1, 1, 1).normalize();
        const lightTargetObject = new THREE.Object3D();
        lightTargetObject.position.set(0, 0, -400);
        this.scene.add(lightTargetObject);
        this.light.target = lightTargetObject;
        const ambient = new AmbientLight(0xffffff, 0.7);
        this.scene.add(this.light);
        this.scene.add(ambient);
    }
   
    createScene() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(30, this.aspect, 1, 1500);

        // Tablet
        if (DeviceDetector.isSmartphone) {
            this.camera.position.z = 800;
        } else if (DeviceDetector.isTablet) {
            this.camera.position.z = 1000;
        } else {
            this.camera.position.z = 1300;
        }

        this.plane = new FlatSurface(this.SCREEN_WIDTH, this.SCREEN_HEIGHT, this.camera);
        this.scene.add(this.plane.mesh);
        this.setupLights();

        this.renderer = new WebGLRenderer({
            antialias: true,
        });
        this.renderer.setClearColor(0xeeeeee, 1);
        this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.container.appendChild(this.renderer.domElement);
        this.subscriber = windowResizeSuscribe(() => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            if (newWidth !== this.SCREEN_WIDTH || newHeight !== this.SCREEN_HEIGHT) {
                this.SCREEN_HEIGHT = newHeight;
                this.SCREEN_WIDTH = newWidth;
                this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
            }
        });
        this._internalUpdate();
    }

    start() {
        this.fps = 0;
        this.updateRoutine();
    }
    setPulses(pulse) {
        this.plane.setPulses(pulse);
    }

    _internalUpdate() {
        this.renderer.render(this.scene, this.camera);
        this.lastUpdateTime = Date.now();
        this.fps++;
    }

    updateRoutine() {
        if (this.pauseUpdate) {
            return;
        }
        this.plane.updateRoutine();
        this._internalUpdate();
        requestAnimationFrame(() => this.updateRoutine());
    }

}


