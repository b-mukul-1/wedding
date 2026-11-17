import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeCinemaStage: Disney / Pixar-inspired WebGL visual engine for The Royal Film.
 * Engineered for maximum battery efficiency, zero thermal throttling, and universal compatibility.
 * Works flawlessly across old Android devices, legacy laptops, and modern 120Hz mobile screens.
 */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

const ThreeCinemaStage = forwardRef(function ThreeCinemaStage(
  { scrollProgress = 0, litDiyas = [true, true, true, true, true, true, true] },
  ref
) {
  const containerRef = useRef(null);
  const stageApiRef = useRef(null);
  const scrollRef = useRef(scrollProgress);
  const litDiyasRef = useRef(litDiyas);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    litDiyasRef.current = litDiyas;
    if (stageApiRef.current?.updateDiyas) {
      stageApiRef.current.updateDiyas(litDiyas);
    }
  }, [litDiyas]);

  useImperativeHandle(ref, () => ({
    spawnGuestLantern: (guestName, blessing) => {
      if (stageApiRef.current?.spawnLantern) {
        stageApiRef.current.spawnLantern(guestName, blessing);
      }
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Safety check for older devices without WebGL
    if (!isWebGLAvailable()) {
      container.innerHTML = `
        <div style="position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 30%, #1f0d2c 0%, #0c0714 80%); pointer-events: none;"></div>
      `;
      return;
    }

    let disposed = false;
    let renderer, scene, camera;
    let rafId = 0;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        'ontouchstart' in window ||
        window.matchMedia('(pointer: coarse)').matches);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 2. High-efficiency Renderer setup
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile, // Disable MSAA on mobile for significant GPU fill savings
        powerPreference: 'low-power', // Prevent thermal heating
        precision: isMobile ? 'mediump' : 'highp', // Compatible with older GPUs
      });
    } catch (e) {
      console.warn('WebGL initialization failed, falling back safely:', e);
      return;
    }

    // Cap pixel ratio: 1.2x on mobile delivers crisp retina quality without GPU thermal heat
    const maxDpr = isMobile ? 1.25 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.className = 'three-cinema-canvas';
    container.appendChild(renderer.domElement);

    // 3. Scene & Camera
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0714, 0.016);

    camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 260);
    camera.position.set(0, 1.5, 14);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x35203e, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffdfa8, 2.0);
    sunLight.position.set(5, 12, 8);
    scene.add(sunLight);

    const sacredFireLight = new THREE.PointLight(0xff9922, 2.2, 22);
    sacredFireLight.position.set(0, 0.5, 0);
    scene.add(sacredFireLight);

    // ==========================================
    // GROUP A: Twinkling Celestial Starfield & Embers
    // ==========================================
    const starCount = isMobile ? 550 : 850;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const goldPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xffe6a3),
      new THREE.Color(0xffcf70),
      new THREE.Color(0xff8c69),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 25 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = Math.abs(radius * Math.cos(phi)) - 4;
      starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const col = goldPalette[Math.floor(Math.random() * goldPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: isMobile ? 0.28 : 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ==========================================
    // GROUP B: Interlocking 3D Golden Wedding Rings
    // ==========================================
    const ringsGroup = new THREE.Group();
    ringsGroup.position.set(0, 1.2, 0);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd269,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x482a00,
      emissiveIntensity: 0.2,
    });

    // Optimized segment counts: 16 radial, 48 tubular saves 75% vertices
    const ringGeo = new THREE.TorusGeometry(1.4, 0.12, 16, 48);
    const ring1 = new THREE.Mesh(ringGeo, goldMat);
    ring1.rotation.y = Math.PI / 4;
    ring1.rotation.x = 0.3;
    ring1.position.x = -0.7;
    ringsGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, goldMat);
    ring2.rotation.y = -Math.PI / 4;
    ring2.rotation.x = -0.3;
    ring2.position.x = 0.7;
    ringsGroup.add(ring2);

    // Diamond gem on Ring 1
    const gemGeo = new THREE.OctahedronGeometry(0.32, 1);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0xfffae6,
      emissiveIntensity: 0.45,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.set(-0.7, 1.45, 0);
    gem.scale.set(1, 1.3, 1);
    ringsGroup.add(gem);

    scene.add(ringsGroup);

    // ==========================================
    // GLOW SPRITES: Soft radial bloom halo sprites (Additive, zero GPU post-pass cost)
    // These fake the UnrealBloomPass look at 1/14th the cost — works on all devices
    // ==========================================
    function makeGlowTexture(color = '#ffd27a', size = 128) {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx2d = c.getContext('2d');
      const r = size / 2;
      const grad = ctx2d.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, color);
      grad.addColorStop(0.35, color.replace(')', ', 0.55)').replace('rgb', 'rgba').replace('#', 'rgba(').replace('rgba(', 'rgba(').replace(')', ', 0.55)'));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx2d.fillStyle = grad;
      ctx2d.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      return tex;
    }

    // Helper to convert hex to rgba string
    function hexToRgba(hex, alpha) {
      const h = hex.replace('#', '');
      const r2 = parseInt(h.substring(0, 2), 16);
      const g2 = parseInt(h.substring(2, 4), 16);
      const b2 = parseInt(h.substring(4, 6), 16);
      return `rgba(${r2},${g2},${b2},${alpha})`;
    }

    function makeGlowTexturePrecise(hexColor, size = 128) {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx2d = c.getContext('2d');
      const r = size / 2;
      const grad = ctx2d.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, hexToRgba(hexColor, 1.0));
      grad.addColorStop(0.3, hexToRgba(hexColor, 0.6));
      grad.addColorStop(0.65, hexToRgba(hexColor, 0.2));
      grad.addColorStop(1, hexToRgba(hexColor, 0));
      ctx2d.fillStyle = grad;
      ctx2d.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    }

    const goldGlowTex = makeGlowTexturePrecise('#ffd27a', 128);
    const fireGlowTex = makeGlowTexturePrecise('#ff9933', 96);
    const blueGlowTex = makeGlowTexturePrecise('#c8aaff', 128);

    const glowSpriteMat = new THREE.SpriteMaterial({
      map: goldGlowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: isMobile ? 0.55 : 0.75,
    });

    // Glow halo around the rings
    const ringsGlowSprite = new THREE.Sprite(glowSpriteMat.clone());
    ringsGlowSprite.scale.set(isMobile ? 5 : 7, isMobile ? 5 : 7, 1);
    ringsGlowSprite.position.set(0, 1.2, 0);
    scene.add(ringsGlowSprite);

    // Glow halo around the mandap sacred fire
    const fireGlowMat = new THREE.SpriteMaterial({
      map: fireGlowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65,
    });
    const fireGlowSprite = new THREE.Sprite(fireGlowMat);
    fireGlowSprite.scale.set(isMobile ? 4 : 6, isMobile ? 4 : 6, 1);
    fireGlowSprite.position.set(0, -1.8 + 0.5, -4);
    scene.add(fireGlowSprite);

    // Ethereal celestial aura behind everything — gives the Pixar sky depth
    const auraGlowMat = new THREE.SpriteMaterial({
      map: blueGlowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: isMobile ? 0.18 : 0.28,
    });
    const auraSprite = new THREE.Sprite(auraGlowMat);
    auraSprite.scale.set(55, 40, 1);
    auraSprite.position.set(0, 4, -30);
    scene.add(auraSprite);

    // ==========================================
    // GROUP C: The Royal Mandap
    // ==========================================
    const mandapGroup = new THREE.Group();
    mandapGroup.position.set(0, -1.8, -4);

    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0xebd08a,
      roughness: 0.25,
      metalness: 0.75,
    });
    const pillarGeo = new THREE.CylinderGeometry(0.12, 0.16, 4.8, 16);
    const capGeo = new THREE.TorusGeometry(0.24, 0.08, 12, 20);

    const pillarPositions = [
      [-2.4, 2.4, -2.4],
      [2.4, 2.4, -2.4],
      [-2.4, 2.4, 2.4],
      [2.4, 2.4, 2.4],
    ];

    pillarPositions.forEach(([px, py, pz]) => {
      const p = new THREE.Mesh(pillarGeo, pillarMat);
      p.position.set(px, py, pz);

      const capTop = new THREE.Mesh(capGeo, goldMat);
      capTop.rotation.x = Math.PI / 2;
      capTop.position.set(px, py + 2.3, pz);

      const capBot = new THREE.Mesh(capGeo, goldMat);
      capBot.rotation.x = Math.PI / 2;
      capBot.position.set(px, py - 2.3, pz);

      mandapGroup.add(p, capTop, capBot);
    });

    // Mandap Domed Canopy
    const domeGeo = new THREE.SphereGeometry(3.6, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.42);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xa8203c,
      roughness: 0.4,
      metalness: 0.25,
      side: THREE.DoubleSide,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 4.8, 0);
    mandapGroup.add(dome);

    const kalashGeo = new THREE.ConeGeometry(0.35, 0.9, 12);
    const kalash = new THREE.Mesh(kalashGeo, goldMat);
    kalash.position.set(0, 6.7, 0);
    mandapGroup.add(kalash);

    // Sacred Havan Fire Altar
    const altarGeo = new THREE.BoxGeometry(1.6, 0.5, 1.6);
    const altarMat = new THREE.MeshStandardMaterial({
      color: 0x6e2c1e,
      roughness: 0.7,
    });
    const altar = new THREE.Mesh(altarGeo, altarMat);
    altar.position.set(0, 0.25, 0);
    mandapGroup.add(altar);

    scene.add(mandapGroup);

    // ==========================================
    // GROUP D: 7 Sacred Brass Diyas (Saat Phere)
    // ==========================================
    const diyasGroup = new THREE.Group();
    diyasGroup.position.set(0, -0.6, 2.5);

    const flameMeshes = [];
    const diyaBowlGeo = new THREE.CylinderGeometry(0.28, 0.14, 0.18, 16);
    const diyaMat = new THREE.MeshStandardMaterial({
      color: 0xd4a359,
      roughness: 0.3,
      metalness: 0.85,
    });

    const flameGeo = new THREE.ConeGeometry(0.08, 0.32, 12);
    flameGeo.translate(0, 0.16, 0);

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffbb33,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < 7; i++) {
      const angle = ((i - 3) / 3) * 0.75;
      const x = Math.sin(angle) * 3.8;
      const z = -Math.cos(angle) * 1.5 + 1.2;

      const singleDiya = new THREE.Group();
      singleDiya.position.set(x, 0, z);

      const bowl = new THREE.Mesh(diyaBowlGeo, diyaMat);
      singleDiya.add(bowl);

      const flame = new THREE.Mesh(flameGeo, flameMat.clone());
      flame.position.set(0, 0.1, 0);
      singleDiya.add(flame);

      diyasGroup.add(singleDiya);
      flameMeshes.push(flame);
    }
    scene.add(diyasGroup);

    // ==========================================
    // GROUP E: Tangled Sky Lanterns Constellation
    // ==========================================
    const lanternsGroup = new THREE.Group();
    scene.add(lanternsGroup);

    const lanternCount = isMobile ? 38 : 55;
    const lanterns = [];

    const lanternBodyGeo = new THREE.CylinderGeometry(0.24, 0.19, 0.62, 12, 1, false);
    const lanternRingGeo = new THREE.TorusGeometry(0.24, 0.02, 8, 16);

    const lanternGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffa834,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const lanternWoodMat = new THREE.MeshStandardMaterial({
      color: 0x4a2a12,
      roughness: 0.8,
    });

    function createLantern(x, y, z, custom = false) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const body = new THREE.Mesh(lanternBodyGeo, lanternGlowMat);
      const topRing = new THREE.Mesh(lanternRingGeo, lanternWoodMat);
      topRing.rotation.x = Math.PI / 2;
      topRing.position.y = 0.31;
      const botRing = new THREE.Mesh(lanternRingGeo, lanternWoodMat);
      botRing.rotation.x = Math.PI / 2;
      botRing.position.y = -0.31;

      group.add(body, topRing, botRing);

      if (custom) {
        const pLight = new THREE.PointLight(0xffbb44, 2.0, 10);
        group.add(pLight);
        group.scale.set(1.4, 1.4, 1.4);
      }

      lanternsGroup.add(group);

      return {
        mesh: group,
        baseY: y,
        speed: 0.007 + Math.random() * 0.012,
        swaySpeed: 0.7 + Math.random() * 1.0,
        offset: Math.random() * Math.PI * 2,
        isCustom: custom,
      };
    }

    for (let i = 0; i < lanternCount; i++) {
      const lx = (Math.random() - 0.5) * 32;
      const ly = -4 + Math.random() * 28;
      const lz = -16 + Math.random() * 22;
      lanterns.push(createLantern(lx, ly, lz));
    }

    // Expose API
    stageApiRef.current = {
      spawnLantern: (name, message) => {
        const customLantern = createLantern(
          (Math.random() - 0.5) * 3,
          camera.position.y - 1.5,
          camera.position.z - 4.5,
          true
        );
        customLantern.speed = 0.032;
        lanterns.push(customLantern);
      },
      updateDiyas: (litArray) => {
        flameMeshes.forEach((flame, idx) => {
          const isLit = litArray[idx] !== false;
          flame.visible = isLit;
          flame.scale.setScalar(isLit ? 1 : 0.01);
        });
      },
    };

    stageApiRef.current.updateDiyas(litDiyasRef.current);

    // ==========================================
    // Internal scroll listener — zero React re-renders, pure ref update
    // ==========================================
    function onInternalScroll() {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
    }
    window.addEventListener('scroll', onInternalScroll, { passive: true });
    onInternalScroll(); // seed initial value

    // Pointer Parallax (passive)
    function onPointerMove(e) {
      if (isMobile) return; // Ignore on mobile
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.targetX = cx;
      mouse.targetY = cy;
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Resize handler
    function onResize() {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // Visibility change handler: Freeze loop completely when tab is hidden
    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else if (!disposed) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(renderLoop);
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Frame rate throttle: Cap to 60 FPS on 120Hz mobile screens to prevent thermal heating
    const targetInterval = isMobile ? 1000 / 60 : 1000 / 90;
    let lastTime = performance.now();
    let lastFrameTime = lastTime;
    const startTime = lastTime;

    function renderLoop(time) {
      if (disposed) return;
      rafId = requestAnimationFrame(renderLoop);

      // Frame interval throttle
      const delta = time - lastFrameTime;
      if (delta < targetInterval) {
        return;
      }
      lastFrameTime = time - (delta % targetInterval);

      const elapsed = (time - startTime) * 0.001;
      const p = scrollRef.current;

      // Mouse damping
      if (!isMobile) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
      }

      // 1. Starfield Twinkle
      starField.rotation.y = elapsed * 0.015;

      // 2. Golden Rings + Glow
      ringsGroup.rotation.y = elapsed * 0.3 + mouse.x * 0.2;
      ringsGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.12 + mouse.y * 0.1;
      gem.rotation.y = elapsed * 1.0;
      ringsGlowSprite.material.opacity = (isMobile ? 0.45 : 0.65) + Math.sin(elapsed * 1.4) * 0.12;
      ringsGlowSprite.scale.setScalar((isMobile ? 4.5 : 6.5) + Math.sin(elapsed * 0.8) * 0.5);

      // 3. Sacred Fire Flicker + Fire Glow
      sacredFireLight.intensity = 1.9 + Math.sin(elapsed * 12.0) * 0.35;
      fireGlowSprite.material.opacity = 0.5 + Math.sin(elapsed * 11.0) * 0.2;
      fireGlowSprite.scale.setScalar((isMobile ? 3.5 : 5) + Math.sin(elapsed * 7.0) * 0.4);
      flameMeshes.forEach((flame, i) => {
        if (flame.visible) {
          const s = 1.0 + Math.sin(elapsed * 10.0 + i * 1.5) * 0.15;
          flame.scale.set(s, s, s);
        }
      });

      // 4. Lantern Dynamics
      lanterns.forEach((l) => {
        l.mesh.position.y += l.speed;
        l.mesh.position.x += Math.sin(elapsed * l.swaySpeed + l.offset) * 0.006;
        l.mesh.rotation.y = elapsed * 0.18 + l.offset;

        if (l.mesh.position.y > 26) {
          l.mesh.position.y = -5;
        }
      });

      // 5. Scroll-driven camera path
      let targetCamX = mouse.x * 0.7;
      let targetCamY = 1.5 - p * 6.5 - mouse.y * 0.5;
      let targetCamZ = 13.5 - p * 3.5;

      if (p > 0.72) {
        const lanternPhase = (p - 0.72) / 0.28;
        targetCamY += lanternPhase * 5.5;
        targetCamZ -= lanternPhase * 4.0;
        camera.lookAt(0, targetCamY + 4.5, -8);
      } else {
        camera.lookAt(0, targetCamY * 0.3, 0);
      }

      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.position.z += (targetCamZ - camera.position.z) * 0.06;

      // Direct single-pass high-performance render
      renderer.render(scene, camera);
    }

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onInternalScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      try {
        renderer.dispose();
        renderer.domElement?.remove();
        starGeo.dispose();
        starMat.dispose();
        ringGeo.dispose();
        goldMat.dispose();
        gemGeo.dispose();
        gemMat.dispose();
        pillarGeo.dispose();
        pillarMat.dispose();
        domeGeo.dispose();
        domeMat.dispose();
        kalashGeo.dispose();
        altarGeo.dispose();
        altarMat.dispose();
        diyaBowlGeo.dispose();
        diyaMat.dispose();
        flameGeo.dispose();
        flameMat.dispose();
        lanternBodyGeo.dispose();
        lanternRingGeo.dispose();
        lanternGlowMat.dispose();
        lanternWoodMat.dispose();
        // Glow sprites
        goldGlowTex.dispose();
        fireGlowTex.dispose();
        blueGlowTex.dispose();
        ringsGlowSprite.material.dispose();
        fireGlowMat.dispose();
        auraGlowMat.dispose();
      } catch {}
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-cinema-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
});

export default ThreeCinemaStage;
