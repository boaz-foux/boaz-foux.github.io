
import { FluidSolver } from './1-fluid-solver.js';

class SmokeSimulationCanvasGLSL extends HTMLElement {
   constructor() {
      super();

      this.size = { dX: 51, dY: 20 };
      const fluidSolver = new FluidSolver(this.size);
      this.fluidSolver = fluidSolver;
      this.smokeFlag = false;
      const canvas = document.createElement('canvas');
      this.canvas = canvas;
      this.showAir = false;
      const style = document.createElement('style');
      style.textContent = `
      :host canvas {
         width: 100%;
         height: 100%;
      }
      `;

      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(this.canvas);
      const dB = this.size.dX*this.size.dY;

      const fragment = `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;

      #define DX ${this.size.dX}
      #define DY ${this.size.dY}

      struct Cell {
         float density;
       };

      uniform Cell cells [${dB}];
      void main () {
         vec2 p = gl_FragCoord.xy / resolution.xy;
         vec2 pos = vec2(DX,DY*DX) * p;
         float density = 0.0;
         for (int y = 0;  y < DY -1 ; ++y) {
            if(y * DX > int(pos.y)) break;

            float ydf = pos.y - float(int(pos.y));
            float ydo = 1.0 - ydf;

            for (int x = 0;  x < DX-1 ; ++x) {
               if(x > int(pos.x)) break;

               float xdf = pos.x - float(int(pos.x));
               float xdo = 1.0 - xdf;

               float dens_xo_yo = cells[x + y *DX].density;
               float dens_xf_yo = cells[x + 1 + y *DX ].density;
               float dens_xo_yf = cells[x + (y+1) *DX].density;
               float dens_xf_yf = cells[x + 1 + (y+1) *DX ].density;

               density = 0.0 +
                  dens_xo_yo * xdo * ydo + 
                  dens_xf_yo * xdf  * ydo +
                  dens_xo_yf * xdo  * ydf + 
                  dens_xf_yf * xdf * ydf;
               density = density + density;
               density = density > 0.8 ? 1.0 : density < 0.2 ? 0.0 : density;
            }
         }
         float z = 0.5+ 0.5 * smoothstep(-1.0, 1.0, cos(time * 0.005));
         density = smoothstep(0.0, 1.0, density);
         gl_FragColor = vec4(z*(1.0-density), p.x * (1.0-density), p.y*(1.0-density), density);
      }
      `;
      Glsl({
         canvas,
         fragment,
         variables: {
            time: 0,
            cells: Array(this.size.dX*this.size.dY).fill(0).map(() => ({ density : 0.0})),
         },
       init() {},
       update(time){
         this.set("time", time);
         this.variables.cells.forEach((cell,index) => {
            let density = fluidSolver.io[dB * 5 + index] || 0;
            density = Math.floor(!density ||  density < 0 ? 0 : density);
            density = Math.min(255, Math.max(0, density));
            cell.density = density/ 255;
         });
         this.sync("cells");
       }
         
       }).start();
      

   }
   onMove = (event) => {
      const { size, canvas, fluidSolver } = this;
      const { pageX, pageY } = event.touches ? event.touches[0] : event;
      const xo = Math.floor(size.dX * Math.min(canvas.width - 1, Math.max(0, pageX / 2 - canvas.offsetLeft)) / canvas.width);
      const yo = size.dY - Math.floor(size.dY * Math.min(canvas.height - 1, Math.max(0, pageY / 2 - canvas.offsetTop)) / canvas.height);
      const delta = this.smokeFlag ? 5 :10;
      const dAir = 2.5 * 10 ** -8;
      const dSmoke = 10 ** 5;
      const dB = size.dX * size.dY;
      for (let y = -delta; y <= delta; ++y) {
         const yr = yo + y;
         if (yr < 0 || yr > size.dY - 1) {
            continue;
         }
         for (let x = -delta; x <= delta; ++x) {
            const xr = xo + x;
            if ((x ** 2 + y ** 2) > delta ** 2 || xr < 0 || xr > size.dX - 1) {
               continue;
            }
            const index = yr * size.dX + xr;
            if (this.smokeFlag) {
               fluidSolver.io[2 * dB + index] = dSmoke;
               // continue;
            }

            fluidSolver.io[index] = x * dAir;
            fluidSolver.io[dB + index] = y * dAir;

         }
      }
   }
   static get observedAttributes() {
      return ['show-air'];
   }
   attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) { return; }
      switch (name) {
         case 'show-air': this.showAir = newValue != null; break;
         default:
      }
   }
   onSmokeStart = () => {
      this.smokeFlag = true;
   }
   onSmokeStop = () => {
      this.smokeFlag = false;
   }
   onSmokeToggle = () => {
      this.smokeFlag = !this.smokeFlag;
   }
   connectedCallback() {
      const { canvas } = this;
      canvas.addEventListener('mousedown', this.onSmokeStart);
      canvas.addEventListener('mouseup', this.onSmokeStop);
      canvas.addEventListener('mouseenter', this.onSmokeStop)
      canvas.addEventListener('mousemove', this.onMove);
      canvas.addEventListener('touchstart', this.onSmokeToggle);
      canvas.addEventListener('touchmove', this.onMove);
   }
   disconnectedCallback() {
      const { canvas } = this;
      canvas.removeEventListener('mousedown', this.onSmokeStart);
      canvas.removeEventListener('mouseup', this.onSmokeStop);
      canvas.removeEventListener('mouseenter', this.onSmokeStop)
      canvas.removeEventListener('mousemove', this.onMove);
      canvas.removeEventListener('touchstart', this.onSmokeToggle);
      canvas.removeEventListener('touchmove', this.onMove);
   }
};

customElements.define(
   'smoke-simulation-canvas-glsl',
   SmokeSimulationCanvasGLSL,
);

