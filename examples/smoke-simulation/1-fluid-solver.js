
export class FluidSolver {
   constructor(size) {
      const worker = new Worker("./1-fluid-solver-worker.js");
      this.worker = worker;
      const buffers = new SharedArrayBuffer(size.dX * size.dY * 4 * 6 ); //3 input + 3 output
      this.io = new Float32Array(buffers);
      worker.postMessage({ size, buffers });
   }
};


