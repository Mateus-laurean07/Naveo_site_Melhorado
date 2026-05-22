// =============================================================
// Hero 3D scene · Naveo Creative Engineering
// Tech wireframe — leve, geometrico, futurista
// =============================================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.querySelector("#hero-canvas");
if (canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  const ACCENT = new THREE.Color(0xc6ff00);

  // ============================================================
  // 1) WIREFRAME ICOSAHEDRON — centro da cena
  // ============================================================
  const icoGeom = new THREE.IcosahedronGeometry(2.6, 1);
  const icoEdges = new THREE.EdgesGeometry(icoGeom);
  const icoMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.55 });
  const ico = new THREE.LineSegments(icoEdges, icoMat);
  ico.position.x = 5;
  scene.add(ico);

  // Versão sólida quase invisível pra dar profundidade
  const icoSolid = new THREE.Mesh(
    icoGeom,
    new THREE.MeshBasicMaterial({ color: 0x0a0e08, transparent: true, opacity: 0.5, depthWrite: false })
  );
  icoSolid.position.copy(ico.position);
  scene.add(icoSolid);

  // ============================================================
  // 2) TORUS — anel orbital sutil
  // ============================================================
  const torusGeom = new THREE.TorusGeometry(3.6, 0.012, 6, 120);
  const torusMat = new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.18 });
  const torus = new THREE.Mesh(torusGeom, torusMat);
  torus.rotation.x = Math.PI / 2.6;
  torus.position.x = 5;
  scene.add(torus);

  // ============================================================
  // 3) GRID PLANE — chão de circuito (tech vibe)
  // ============================================================
  const gridSize = 28;
  const gridDiv = 28;
  const grid = new THREE.GridHelper(gridSize, gridDiv, 0xc6ff00, 0x1a3a0a);
  grid.material.transparent = true;
  grid.material.opacity = 0.15;
  grid.position.y = -3.8;
  grid.rotation.x = 0; // grid já é horizontal
  scene.add(grid);

  // ============================================================
  // 4) LOGO ORBITANDO NO ANEL
  // ============================================================
  const orbitPivot = new THREE.Group();
  orbitPivot.position.copy(ico.position);
  orbitPivot.rotation.x = Math.PI / 2.6; // mesmo tilt do torus
  scene.add(orbitPivot);

  const logoTex = new THREE.TextureLoader().load("/assets/logo-verde.webp", (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  });
  // Sprite = sempre olha pra câmera, logo sempre legível
  const logoSpriteMat = new THREE.SpriteMaterial({
    map: logoTex,
    transparent: true,
    depthWrite: false,
  });
  const logoSprite = new THREE.Sprite(logoSpriteMat);
  logoSprite.scale.set(2.4, 0.6, 1); // 4:1 ratio do logo, um pouco maior pra leitura
  orbitPivot.add(logoSprite);

  const ORBIT_R = 3.6; // mesmo raio do torus

  // ============================================================
  // 5) REDE DE PONTOS — nodes que se movem, linhas conectam quando perto
  // ============================================================
  const NODES = 60;
  const MAX_DIST = 2.6;          // distância máxima pra ter linha
  const MAX_DIST_SQ = MAX_DIST * MAX_DIST;
  const MAX_LINES = 500;          // limite seguro de linhas simultâneas

  // Vetores de posição e velocidade
  const nodePos = [];
  const nodeVel = [];
  for (let i = 0; i < NODES; i++) {
    nodePos.push(new THREE.Vector3(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 11,
      (Math.random() - 0.5) * 7
    ));
    nodeVel.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.35,
      (Math.random() - 0.5) * 0.28,
      (Math.random() - 0.5) * 0.18
    ));
  }

  // Pontos (nodes)
  const nodePosArr = new Float32Array(NODES * 3);
  const nodeGeom = new THREE.BufferGeometry();
  nodeGeom.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
  const nodeMat = new THREE.PointsMaterial({
    color: ACCENT,
    size: 0.09,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const nodes = new THREE.Points(nodeGeom, nodeMat);
  scene.add(nodes);

  // Linhas dinâmicas
  const linePosArr = new Float32Array(MAX_LINES * 2 * 3);  // 2 vértices por linha, 3 coords
  const lineAlphaArr = new Float32Array(MAX_LINES * 2);     // alpha por vértice
  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3));
  lineGeom.setAttribute('alpha', new THREE.BufferAttribute(lineAlphaArr, 1));
  lineGeom.setDrawRange(0, 0);

  const lineMat = new THREE.ShaderMaterial({
    vertexShader: /* glsl */`
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(0.776, 1.0, 0.0, vAlpha * 0.55);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const networkLines = new THREE.LineSegments(lineGeom, lineMat);
  scene.add(networkLines);

  function updateNetwork(dt) {
    // Move e clampa nodes
    for (let i = 0; i < NODES; i++) {
      const p = nodePos[i];
      const v = nodeVel[i];
      p.x += v.x * dt;
      p.y += v.y * dt;
      p.z += v.z * dt;
      // Reflete nas bordas
      if (p.x >  9.5 || p.x < -9.5) v.x = -v.x;
      if (p.y >  6.0 || p.y < -6.0) v.y = -v.y;
      if (p.z >  4.0 || p.z < -4.0) v.z = -v.z;
      const i3 = i * 3;
      nodePosArr[i3] = p.x;
      nodePosArr[i3 + 1] = p.y;
      nodePosArr[i3 + 2] = p.z;
    }
    nodeGeom.attributes.position.needsUpdate = true;

    // Calcula linhas entre pontos próximos
    let lineCount = 0;
    for (let i = 0; i < NODES; i++) {
      const pi = nodePos[i];
      for (let j = i + 1; j < NODES; j++) {
        if (lineCount >= MAX_LINES) break;
        const pj = nodePos[j];
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const dz = pi.z - pj.z;
        const distSq = dx*dx + dy*dy + dz*dz;
        if (distSq < MAX_DIST_SQ) {
          const dist = Math.sqrt(distSq);
          const fade = 1 - dist / MAX_DIST; // 1=perto, 0=longe
          const li6 = lineCount * 6;
          const li2 = lineCount * 2;
          linePosArr[li6]     = pi.x;
          linePosArr[li6 + 1] = pi.y;
          linePosArr[li6 + 2] = pi.z;
          linePosArr[li6 + 3] = pj.x;
          linePosArr[li6 + 4] = pj.y;
          linePosArr[li6 + 5] = pj.z;
          lineAlphaArr[li2]     = fade;
          lineAlphaArr[li2 + 1] = fade;
          lineCount++;
        }
      }
    }
    lineGeom.attributes.position.needsUpdate = true;
    lineGeom.attributes.alpha.needsUpdate = true;
    lineGeom.setDrawRange(0, lineCount * 2);
  }

  // ============================================================
  // 5) MOUSE PARALLAX
  // ============================================================
  const targetMouse = new THREE.Vector2(0, 0);
  const lerpedMouse = new THREE.Vector2(0, 0);
  window.addEventListener("mousemove", (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  // ============================================================
  // 6) ANIMATE
  // ============================================================
  const clock = new THREE.Clock();
  let frameId;
  let prevT = 0;
  function tick() {
    const t = clock.getElapsedTime();
    const dt = Math.min(t - prevT, 0.05); // cap delta pra evitar saltos quando tab volta
    prevT = t;
    lerpedMouse.x += (targetMouse.x - lerpedMouse.x) * 0.05;
    lerpedMouse.y += (targetMouse.y - lerpedMouse.y) * 0.05;

    ico.rotation.x = t * 0.1 + lerpedMouse.y * 0.25;
    ico.rotation.y = t * 0.16 + lerpedMouse.x * 0.25;
    icoSolid.rotation.copy(ico.rotation);

    torus.rotation.z = t * 0.06;
    torus.rotation.x = Math.PI / 2.6 + lerpedMouse.y * 0.1;

    // Logo orbitando no anel — Sprite sempre olha pra câmera = sempre legível
    orbitPivot.rotation.x = Math.PI / 2.6 + lerpedMouse.y * 0.1;
    const angle = t * 0.45;
    logoSprite.position.x = Math.cos(angle) * ORBIT_R;
    logoSprite.position.y = Math.sin(angle) * ORBIT_R;

    grid.position.z = ((t * 0.6) % 2) - 1;

    // Rede de pontos + linhas dinâmicas
    updateNetwork(dt);

    camera.position.x = lerpedMouse.x * 0.8;
    camera.position.y = lerpedMouse.y * 0.4;
    camera.lookAt(3, 0, 0);

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  }
  tick();

  // ============================================================
  // 7) RESIZE
  // ============================================================
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);

  // Pause quando tab esconde
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frameId);
    else tick();
  });
}
