// Sample a tube around a trefoil, then paint back-to-front for depth.
const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");
const tau = 2 * Math.PI;
function center(t) {
  return [Math.sin(t) + 2 * Math.sin(2*t), Math.cos(t) - 2 * Math.cos(2*t), -Math.sin(3*t)];
}
const points = [];
for (let i = 0; i < 250; i++) {
  const t = tau * i / 250;
  const [x,y,z] = center(t);
  const [dx,dy,dz] = center(t + .001).map((v,n) => v - [x,y,z][n]);
  const h = Math.hypot(dx,dy), len = Math.hypot(h,dz);
  for (let j = 0; j < 52; j++) {
    const a = tau*j/52, c = .54*Math.cos(a), s = .54*Math.sin(a);
    const u = x - c*dy/h - s*dx*dz/(h*len);
    const v = y + c*dx/h - s*dy*dz/(h*len);
    const w = z + s*h/len;
    const yy = .83*v - .558*w, depth = .558*v + .83*w;
    points.push([300 + 62*(.94*u-.34*yy), 213 + 62*(.34*u+.94*yy), depth]);
  }
}
points.sort((a,b) => a[2]-b[2]);
function draw() {
  const ratio = canvas.clientWidth * devicePixelRatio / 600;
  canvas.width = Math.round(600*ratio);
  canvas.height = Math.round(420*ratio);
  ctx.setTransform(ratio,0,0,ratio,0,0);
  for (const [x,y,z] of points) {
    const light = Math.max(0, Math.min(1,(z+2.6)/5));
    ctx.fillStyle = `rgb(${53+168*light},${99+156*light},${45+93*light})`;
    ctx.beginPath();
    ctx.arc(x,y,.75+.63*light,0,tau);
    ctx.fill();
  }
}
draw();
window.addEventListener("resize",draw);
