import { Engine } from './src/engine';
import { Vector2 } from 'three';
import { Pulse } from './src/pulse';

let engine;

export const createEngine = () => {
    // document.addEventListener('DOMContentLoaded', (event) => {
    const container = document.getElementById('container');
    engine = new Engine();
    engine.init(window.innerWidth, window.innerHeight, container);
    const pulse = [
        new Pulse(
            Date.now(),
            new Vector2(0, 0),
            engine.getMainModel().mesh
        )
    ];
    engine.setPulses(pulse);
    return engine;
};

export function startEngine() {
    if (engine === undefined) {
        startEngine();
    }
    engine.start();
}

createEngine();
startEngine();