self.importScripts('./0-fluid-solver-functional.js');


self.addEventListener('message', (event) => {
    const { size } = event.data;
    const io = new Float32Array(event.data.buffers); // half or input half for output u,v,dens
    let dt = 0;
    const buffers = createBuffers(size);
    const getInput = () => {
        const dB = size.dY * size.dX;
        for (let y = 0; y < size.dY; ++y) {
            for (let x = 0; x < size.dX; ++x) {
                const i = size.dX * y + x;
                buffers.uPreview[y][x] = io[i] || 0;
                if(buffers.uPreview[y][x]){
                    io[i] = 0;
                }
                buffers.vPreview[y][x] = io[dB + i] || 0;
                if(buffers.vPreview[y][x]){
                    io[dB + i] = 0;
                }
                buffers.densityPreview[y][x] = (io[2 * dB + i] || 0);
                if(buffers.densityPreview[y][x]){
                    io[2 * dB + i] = 0;
                }
                    
            }
        }
    };
    const setOutput = () => {
        const dB = size.dY * size.dX;
        for (let y = 0; y < size.dY; ++y) {
            for (let x = 0; x < size.dX; ++x) {
                const i = size.dX * y + x;
                io[3 * dB + i] = buffers.u[y][x] || 0;
                io[4 * dB + i] = buffers.v[y][x] || 0;
                io[5 * dB + i] = buffers.density[y][x] || 0;
            }
        }
    };

    const loop = () => {
        buffers.dt = dt;
        getInput();
        solver(buffers);
        setOutput();
        // console.log(dt);
    };
    let last = performance.now();
    const loopHandler = () => {
        const now = performance.now();
        dt = (now - last) / 1000;
        loop();
        last = now;
        setTimeout(loopHandler, 20);
    };
    setTimeout(loopHandler, 20);
});