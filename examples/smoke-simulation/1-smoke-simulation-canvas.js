
import { FluidSolver } from './1-fluid-solver.js';

class SmokeSimulationCanvas extends HTMLElement {
   constructor() {
      super();

      this.size = { dX: 100, dY: 50 };
      this.fluidSolver = new FluidSolver(this.size);
      this.smokeFlag = false;
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
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

      this.loopHandler();
   }
   loopHandler = () => {
      this.renderLoop();
      setTimeout(this.loopHandler, 20);
   }
   renderLoop = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      const dB = this.size.dY * this.size.dX;
      const dx = this.canvas.width / this.size.dX;
      const dy = this.canvas.height / this.size.dY;
      const dAir = 2;
      for (let y = 0; y < this.size.dY; ++y) {
         for (let x = 0; x < this.size.dX; ++x) {
            const index = this.size.dX * y + x;
            const x0 = dx * x;
            const y0 = dy * y;
            if (this.showAir) {
               this.context.beginPath();
               this.context.lineWidth = '0.01px';
               this.context.strokeStyle = 'red';
               this.context.moveTo(x0, y0);
               this.context.lineTo(
                  x0 - dAir * this.fluidSolver.io[dB * 3 + index],
                  y0 - dAir * this.fluidSolver.io[dB * 4 + index],
               );
               this.context.closePath();
               this.context.stroke();
            }
            if (x >= this.size.dX - 1 || y >= this.size.dY - 1) { continue; }
            let density = this.fluidSolver.io[dB * 5 + index] || 0;
            density = Math.floor(!density ||  density < 0 ? 0 : density);
            density = Math.min(255, Math.max(0, density));
            const gradient = this.context.createRadialGradient(x0 + dx / 2, y0 + dy / 2, 0, x0 + dx / 2, y0 + dy / 2, dx * dy);
            gradient.addColorStop(0, `#${Array(3).fill(Number(density).toString(16)).join('')}`);
            gradient.addColorStop(1, "black");
            this.context.fillStyle = gradient;
            const xf = x0 + dx;
            const yf = y0 + dy;
            this.context.fillRect(x0, y0, xf, yf);

         }
      }
   }
   onMove = (event) => {
      const { size, canvas, fluidSolver } = this;
      const { pageX, pageY } = event.touches ? event.touches[0] : event;
      const xo = Math.floor(size.dX * Math.min(canvas.width - 1, Math.max(0, pageX / 2 - canvas.offsetLeft)) / canvas.width);
      const yo = Math.floor(size.dY * Math.min(canvas.height - 1, Math.max(0, pageY / 2 - canvas.offsetTop)) / canvas.height);
      const delta = 10;
      const dAir = 2 * 10 ** -8;
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
               continue;
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
   'smoke-simulation-canvas',
   SmokeSimulationCanvas,
);

