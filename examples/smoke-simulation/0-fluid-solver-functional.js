
const createBuffer = ({ dY, dX }) => Array(dY).fill(0).map(() => Array(dX).fill(0));

const createBuffers = (dimension) => `
        u,v,uPreview,vPreview,density,densityPreview,theta,thetaPreview,curl
    `.trim()
    .split(',')
    .reduce((obj, key) => (obj[key] = createBuffer(dimension)) && obj, { dimension });


const onBadValueDebugger = (...values) => {
    for (const value of values) {
        if (Number.isNaN(value)) { debugger; }
    }
};

const repletionBlock = (callback) => {
    for (let i = 0; i < 25; ++i) {
        callback();
    }
};

const runningIndex = ({ dimension, centralOnly }, callback) => {
    for (let i = centralOnly ? 1 : 0; i < dimension.dX - (centralOnly ? 1 : 0); ++i) {
        for (let j = centralOnly ? 1 : 0; j < dimension.dY - (centralOnly ? 1 : 0); ++j) {
            callback(j, i);
        }
    }
};

const buoyantForce = ({ buoyancy, theta, qh, dimension }) => {
    const a = 0.000625;
    const b = 0.025;
    let ambient = 0.0;
    runningIndex({ dimension }, (j, i) => {
        ambient += qh[j][i];
    });
    ambient /= dimension.dY * dimension.dX;
    runningIndex({ dimension }, (j, i) => {
        buoyancy[j][i] = (a * qh[j][i]) + b * (theta[j][i] - ambient);
    });
};
const vorticityConfinement = ({ u, v, curl, dimension }) => {
    const calculateCurl = (i, j) => {
        const dUy = (u[j + 1][i] - u[j - 1][i]) * 0.5;
        const dVx = (v[j][i + 1] - v[j][i - 1]) * 0.5;
        return dUy - dVx;
    };
    runningIndex({ dimension, centralOnly: true }, (j, i) => {
        curl[j][i] = Math.abs(calculateCurl(i, j));
    });
    runningIndex({ dimension, centralOnly: true }, (j, i) => {
        let dWx = (curl[j][i + 1] - curl[j][i - 1]) * 0.5;
        let dWy = (curl[j + 1][i] - curl[j - 1][i]) * 0.5;
        const length = Math.sqrt(dWx ** 2 + dWy ** 2) + 0.000001;
        dWx /= length;
        dWy /= length;
        const curlWork = calculateCurl(i, j);
        u[j][i] = dWy * -curlWork * dimension.dY * 10.0;
        v[j][i] = dWx * curlWork * dimension.dX * 10.0;
    });
}

const addSource = ({ destination, source, dimension, dt }) => {
    runningIndex({ dimension }, (j, i) => {
        destination[j][i] += dt * source[j][i];
    });
}

const setBoundaries = ({ boundaryType, x, dimension }) => {
    for (i = 1; i <= dimension.dY - 2; i++) {
        x[i][0] = boundaryType == 1 ? -x[i][1] : x[i][1];
        x[i][dimension.dX - 1] = boundaryType == 1 ? -x[i][dimension.dX - 2] : x[i][dimension.dX - 2];
    }

    for (i = 1; i <= dimension.dX - 2; i++) {
        x[0][i] = boundaryType == 2 ? -x[1][i] : x[1][i];
        x[dimension.dY - 1][i] = boundaryType == 2 ? -x[dimension.dY - 2][i] : x[dimension.dY - 2][i];
    }
    x[0][0] = 0.5 * (x[0][1] + x[1][0]);
    x[dimension.dY - 1][0] = 0.5 * (x[dimension.dY - 1][1] + x[dimension.dY - 1][0]);
    x[0][dimension.dX - 1] = 0.5 * (x[0][dimension.dX - 1] + x[1][dimension.dX - 1]);
    x[dimension.dY - 1][dimension.dX - 1] = 0.5 * (
        x[dimension.dY - 1][dimension.dX - 2] + x[dimension.dY - 2][dimension.dX - 1]
    );
}

const diffuse = ({ boundaryType, x, x0, diff, dimension, dt }) => {
    const a = dt * diff * dimension.dX * dimension.dY;
    repletionBlock(() => {
        runningIndex({ dimension, centralOnly: true }, (j, i) => {
            x[j][i] = (x0[j][i] + a * (x[j][i - 1] + x[j][i + 1] +
                x[j - 1][i] + x[j + 1][i])) / (1 + 4 * a);
        });
        setBoundaries({ boundaryType, x, dimension });
    });
}
const advection = ({ boundaryType, density, density0, u, v, dimension, dt }) => {
    const dt0 = dt * Math.sqrt(dimension.dX * dimension.dY);
    runningIndex({ dimension, centralOnly: true }, (j, i) => {
        let x = i - dt0 * u[j][i];
        let y = j - dt0 * v[j][i];
        if (x < 0.5) {
            x = 0.5;
        }
        if (x > dimension.dX - 1.5) {
            x = dimension.dX - 1.5;
        }
        i0 = Math.floor(x);
        i1 = i0 + 1;
        if (y < 0.5) {
            y = 0.5;
        }
        if (y > dimension.dY - 1.5) {
            y = dimension.dY - 1.5;
        }
        j0 = Math.floor(y);
        j1 = j0 + 1;

        let s1 = x - i0;
        let s0 = 1 - s1;
        let t1 = y - j0;
        let t0 = 1 - t1;
        onBadValueDebugger(s1, s0, t1, t0);
        density[j][i] = 0 +
            s0 * t0 * density0[j0][i0] +
            s0 * t1 * density0[j1][i0] +
            s1 * t0 * density0[j0][i1] +
            s1 * t1 * density0[j1][i1];
        onBadValueDebugger(density[j][i]);
    });
    setBoundaries({ boundaryType, x: density, dimension });
}

const densityStep = ({ x, x0, u, v, diff, dimension, dt }) => {
    const boundaryType = 0;
    addSource({ destination: x, source: x0, dimension, dt });
    diffuse({ boundaryType, x: x0, x0: x, diff, dimension, dt });
    advection({ boundaryType, density: x, density0: x0, u, v, dimension, dt });
}

const projection = ({ u, v, p, divergence, dimension }) => {
    const h = 1.0 / Math.sqrt(dimension.dX * dimension.dY);
    runningIndex({ dimension, centralOnly: true }, (j, i) => {
        divergence[j][i] = -0.5 * h * (u[j][i + 1] - u[j][i - 1] +
            v[j + 1][i] - v[j - 1][i]);
        p[j][i] = 0;
    });
    setBoundaries({ boundaryType: 0, x: divergence, dimension });
    setBoundaries({ boundaryType: 0, x: p, dimension });
    repletionBlock(() => {
        runningIndex({ dimension, centralOnly: true }, (j, i) => {

            p[j][i] = (divergence[j][i] + p[j][i - 1] + p[j][i + 1] +
                p[j - 1][i] + p[j + 1][i]) / 4;
        });
        setBoundaries({ boundaryType: 0, x: p, dimension });
    });
    runningIndex({ dimension, centralOnly: true }, (j, i) => {
        u[j][i] -= 0.5 * (p[j][i + 1] - p[j][i - 1]) / h;
        v[j][i] -= 0.5 * (p[j + 1][i] - p[j - 1][i]) / h;
    });
    setBoundaries({ boundaryType: 1, x: u, dimension });
    setBoundaries({ boundaryType: 2, x: v, dimension });
}

const velocityStep = ({ u, v, u0, v0, theta, density, curl, diff, dimension, dt }) => {
    // addSource({ destination: u, source: u0, dimension, dt });
    // addSource({ destination: v, source: v0, dimension, dt });
    vorticityConfinement({ u: u0, v: v0, curl, dimension });
    addSource({ destination: u, source: u0, dimension, dt });
    addSource({ destination: v, source: v0, dimension, dt });
    buoyantForce({ buoyancy: v0, theta, qh: density, dimension });
    addSource({ destination: v, source: v0, dimension, dt });
    diffuse({ boundaryType: 1, x: u0, x0: u, diff, dimension, dt });
    diffuse({ boundaryType: 2, x: v0, x0: v, diff, dimension, dt });
    projection({ u: u0, v: v0, p: u, divergence: v, dimension });
    advection({ boundaryType: 1, density: u, density0: u0, u: u0, v: v0, dimension, dt });
    advection({ boundaryType: 2, density: v, density0: v0, u: u0, v: v0, dimension, dt });
    projection({ u, v, p: u0, divergence: v0, dimension });
}
const solver = ({
    u, v,
    uPreview, vPreview,
    density, densityPreview,
    theta, thetaPreview,
    curl,
    diff,
    dimension,
    dt,
}) => {
    diff = diff || 0.3;
    dt = !dt || dt < 0.0005 ? 0.0005 : dt;
    dt = Math.min(0.001, dt);
    velocityStep({
        u, v,
        u0: uPreview, v0: vPreview,
        theta,
        density,
        curl,
        diff,
        dimension,
        dt,
    });
    densityStep({
        x: density, x0: densityPreview,
        u, v,
        diff,
        dimension,
        dt,
    });
    densityStep({
        x: theta, x0: thetaPreview,
        u, v,
        diff,
        dimension,
        dt,
    });
    runningIndex({ dimension }, (j, i) => {
        density[j][i] = density[j][i] ? density[j][i] - density[j][i] * 5 * dt : 0; // auto fade
        vPreview[j][i] = 0;
        uPreview[j][i] = 0;
        densityPreview[j][i] = 0;
        thetaPreview[j][i] = 0; // for the auto increased heat bug
    });
}