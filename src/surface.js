import * as THREE from 'three';
import cloneDeep from 'lodash/cloneDeep';
import {
    BufferGeometry,
    Vector3
} from 'three';

export class CustomGeometry {
    constructor(geometry) {
        this.initialGeometry = geometry;
        this.bufferGeometry = new BufferGeometry();
        this.bufferGeometry.fromGeometry(geometry);
        this.bufferGeometry.dynamic = true;
        this.bufferGeometry.position = new Vector3(0, 0, 50);
        this.originalVertices = cloneDeep(this.getVertices());
        this.bufferGeometry.computeBoundingSphere();
        this.bufferGeometry.computeFaceNormals();
    }

    getVertices() {
        return this.bufferGeometry.attributes.position.array;
    }
}


export class FlatSurface {
    constructor(width, height, camera) {
        this.rot = 1;
        this.camera = camera;
        this.SQUARE_SIZE = 45;
        this.state = 0;
        this.mouseActivityRateo = 0;
        this.waveBeginAmplitude = 25;
        this.waveDuration = 5;
        this.waveLength = 3;

        this.init(width, height);
    }
    init(width, height) {
        this.height = height;
        this.width = width;
        this.aspect = this.width / this.height;
        this.createFlatSurface();
    }
    createFlatSurface() {
        const vertices = [];
        const faces = [];
        const dx = -this.width / 2;
        const dy = -this.height / 2;
        const width = Math.ceil(this.width / this.SQUARE_SIZE);
        const height = Math.ceil(this.height / this.SQUARE_SIZE);
        let deltaSizeX = 0;
        let deltaSizeY = 0;
        for (let y = 0; y < height; y++) {
            deltaSizeX = 0;
            deltaSizeY = 0;
            for (let x = 0; x < width; x++) {
                let deltax;
                let deltay;
                if (x === 0) {
                    deltax = 0;
                } else if (x === width - 1) {
                    deltax = deltaSizeX;
                } else if (Math.abs(deltaSizeX) > this.SQUARE_SIZE / 4) {
                    deltax = -Math.sign(deltaSizeX) * this.SQUARE_SIZE / 4;
                } else {
                    deltax = Math.random() * this.SQUARE_SIZE / 4;
                }
                if (y === 0) {
                    deltay = 0;
                } else if (y === height - 1) {
                    deltay = deltaSizeX;
                } else if (Math.abs(deltaSizeY) > this.SQUARE_SIZE / 4) {
                    deltay = -Math.sign(deltaSizeY) * this.SQUARE_SIZE / 4;
                } else {
                    deltay = Math.random() * this.SQUARE_SIZE / 4;
                }
                deltaSizeX += deltax;
                deltaSizeY += deltay;
                vertices.push(new THREE.Vector3(dx + deltax + x * this.SQUARE_SIZE, dy + deltay + y * this.SQUARE_SIZE, Math.random() * this.waveBeginAmplitude));
            }
        }
        for (let i = 0; i < vertices.length; i++) {
            const _x = i % width;
            const _y = Math.floor(i / width);
            if (_x !== width - 1 && _y !== height - 1) {
                faces.push(new THREE.Face3(i, i + width + 1, i + 1));
                faces.push(new THREE.Face3(i, i + width, i + width + 1));
            }
        }
        const _geometry = new THREE.Geometry();
        _geometry.dynamic = true;
        _geometry.vertices = vertices;
        _geometry.faces = faces;
        _geometry.position = new THREE.Vector3(0, 0, 50);
        _geometry.computeFaceNormals();
        // _geometry.computeVertexNormals();
        _geometry.computeBoundingBox();
        // _geometry.mergeVertices();
        const max = _geometry.boundingBox.max;
        const min = _geometry.boundingBox.min;
        const _offset = new THREE.Vector2(0 - min.x, 0 - min.y);
        const uvScale = 1; // 0.7
        const range = new THREE.Vector2((max.x - min.x) / uvScale, (max.y - min.y) / uvScale);

        _geometry.faceVertexUvs[0] = [];

        for (let i = 0; i < faces.length; i++) {

            const v1 = _geometry.vertices[faces[i].a];
            const v2 = _geometry.vertices[faces[i].b];
            const v3 = _geometry.vertices[faces[i].c];

            _geometry.faceVertexUvs[0].push([
                new THREE.Vector2(((v1.x + _offset.x) / range.x) % 1, ((v1.y + _offset.y) / range.y) % 1),
                new THREE.Vector2(((v2.x + _offset.x) / range.x) % 1, ((v2.y + _offset.y) / range.y) % 1),
                new THREE.Vector2(((v3.x + _offset.x) / range.x) % 1, ((v3.y + _offset.y) / range.y) % 1)
            ]);
        }
        _geometry.uvsNeedUpdate = true;

        const geometry = new CustomGeometry(_geometry);
        this.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0, 0, 0),
            shading: THREE.SmoothShading, // THREE.FlatShading,
            side: THREE.DoubleSide,
            bumpScale: .2,
            emissiveIntensity: .6,
            roughness: .5, //.4
        });
        this.mesh = new THREE.Mesh(geometry.bufferGeometry, this.material);
        this.mesh.name = 'Fluid';
    }
    setPulses(pulse) {
        this.pulse = pulse;
    }

    updateRoutine() {
        this.pulse.forEach((p) => {            
            p.propagate(this.mouseActivityRateo);
        });
        return true;
    }
}
