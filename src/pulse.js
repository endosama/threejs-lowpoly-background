import {
    Vector3
} from 'three';
import cloneDeep from 'lodash/cloneDeep';

const waveAmplitude = 25;
const waveLength = 3;

export class Pulse {
    constructor(gametime, position, item) {
        this.time = gametime;
        this.position = position;
        this.duration = 5000;
        this.item = item;
        this.originalVertices = cloneDeep(item.geometry.attributes.position.array);
        this.originalVerticesV3 = [];
        this.distances = [];
        for (let i = 0; i < this.originalVertices.length / 3; i++) {
            this.originalVerticesV3[i] = new Vector3(
                this.originalVertices[i * 3],
                this.originalVertices[i * 3 + 1],
                this.originalVertices[i * 3 + 2]
            );
            this.distances[i] = this.originalVerticesV3[i].distanceTo(new Vector3(this.position.x, this.position.y, this.originalVerticesV3[i].z));
        }
    }
    propagate(mouseActivityRateo) {
        const vertices = this.item.geometry.attributes.position.array;
        for (let i = 0; i < vertices.length / 3; i++) {
            const vertex = this.originalVerticesV3[i];
            const distance = this.distances[i];
            const delta = (Date.now() - this.time) / this.duration; // if (delta <= 1 && distance < 600 * delta) {
            const dz = Math.cos((waveLength * (delta + distance)) % 360) * (waveAmplitude + mouseActivityRateo / 10);
            vertices[i * 3] = vertex.x;
            vertices[i * 3 + 1] = vertex.y;
            vertices[i * 3 + 2] = vertex.z + dz;
        }
        this.item.geometry.attributes.position.needsUpdate = true;
        this.item.geometry.computeFaceNormals();
        this.item.geometry.computeVertexNormals();
    }
}
