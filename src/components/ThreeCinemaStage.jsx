import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * ThreeCinemaStage: The core 3D WebGL engine for the Disney / Pixar-style experience.
 * Features:
 *  - 1,200 dynamic twinkling stars & drifting golden embers
 *  - 3D Interlocking Golden Rings (PBR metallic gold with specular gleams)
 *  - 3D Royal Mandap (fluted columns, domed canopy, sacred fire altar)
 *  - 3D Sacred 7 Diyas with glowing flame shaders
 *  - 3D Tangled Sky Lantern constellation (60+ lanterns floating upward with bloom)
 *  - Dynamic guest lantern launcher that releases custom glowing lanterns
 *  - UnrealBloomPass post-processing for that signature Disney/Pixar magical glow
 */
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

    let disposed = false;
    let renderer, scene, camera, composer;
    let rafId = 0;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Renderer setup
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.className = 'three-cinema-canvas';
    container.appendChild(renderer.domElement);

    // 2. Scene & Camera
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0714, 0.018);

    camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 300);
    camera.position.set(0, 1.5, 14);

    // 3. Post-processing Composer (Unreal Bloom for magical Disney glow)
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.18, // bloom strength
      0.72, // bloom radius
      0.28  // bloom threshold
    );
    composer.addPass(bloomPass);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x2d1a33, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffdfa8, 2.2);
    sunLight.position.set(5, 12, 8);
    scene.add(sunLight);

    const sacredFireLight = new THREE.PointLight(0xff9922, 2.4, 25);
    sacredFireLight.position.set(0, 0.5, 0);
    scene.add(sacredFireLight);

    // ==========================================
    // GROUP A: Twinkling Celestial Starfield & Embers
    // ==========================================
    const starCount = 1000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starScales = new Float32Array(starCount);

    const goldPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xffe6a3),
      new THREE.Color(0xffcf70),
      new THREE.Color(0xff8c69),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 25 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = Math.abs(radius * Math.cos(phi)) - 5; // mostly above horizon
      starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const col = goldPalette[Math.floor(Math.random() * goldPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;

      starScales[i] = Math.random() * 2.8 + 0.8;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('scale', new THREE.BufferAttribute(starScales, 1));

    const starMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
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
      roughness: 0.16,
      metalness: 0.94,
      emissive: 0x482a00,
      emissiveIntensity: 0.25,
    });

    const ringGeo = new THREE.TorusGeometry(1.4, 0.12, 32, 90);
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
    const gemGeo = new THREE.OctahedronGeometry(0.32, 2);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 2.4, // diamond refractive index
      emissive: 0xffeccc,
      emissiveIntensity: 0.4,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.set(-0.7, 1.45, 0);
    gem.scale.set(1, 1.3, 1);
    ringsGroup.add(gem);

    scene.add(ringsGroup);

    // ==========================================
    // GROUP C: The Royal Mandap
    // ==========================================
    const mandapGroup = new THREE.Group();
    mandapGroup.position.set(0, -1.8, -4);

    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0xebd08a,
      roughness: 0.25,
      metalness: 0.8,
    });
    const pillarGeo = new THREE.CylinderGeometry(0.12, 0.16, 4.8, 24);

    const pillarPositions = [
      [-2.4, 2.4, -2.4],
      [2.4, 2.4, -2.4],
      [-2.4, 2.4, 2.4],
      [2.4, 2.4, 2.4],
    ];

    pillarPositions.forEach(([px, py, pz]) => {
      const p = new THREE.Mesh(pillarGeo, pillarMat);
      p.position.set(px, py, pz);

      // Ornate pillar capital & base
      const capGeo = new THREE.TorusGeometry(0.24, 0.08, 16, 32);
      const capTop = new THREE.Mesh(capGeo, goldMat);
      capTop.rotation.x = Math.PI / 2;
      capTop.position.set(px, py + 2.3, pz);
      const capBot = new THREE.Mesh(capGeo, goldMat);
      capBot.rotation.x = Math.PI / 2;
      capBot.position.set(px, py - 2.3, pz);

      mandapGroup.add(p, capTop, capBot);
    });

    // Mandap Domed Canopy
    const domeGeo = new THREE.SphereGeometry(3.6, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xa8203c, // Royal Maroon velvet
      roughness: 0.4,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 4.8, 0);
    mandapGroup.add(dome);

    // Golden Kalash at the apex
    const kalashGeo = new THREE.ConeGeometry(0.35, 0.9, 16);
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

    const diyaMeshes = [];
    const flameMeshes = [];

    const diyaBowlGeo = new THREE.CylinderGeometry(0.28, 0.14, 0.18, 24);
    const diyaMat = new THREE.MeshStandardMaterial({
      color: 0xd4a359,
      roughness: 0.3,
      metalness: 0.85,
    });

    const flameGeo = new THREE.ConeGeometry(0.08, 0.32, 16);
    flameGeo.translate(0, 0.16, 0);

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffbb33,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < 7; i++) {
      const angle = ((i - 3) / 3) * 0.75; // arc spread
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
      diyaMeshes.push(singleDiya);
      flameMeshes.push(flame);
    }
    scene.add(diyasGroup);

    // ==========================================
    // GROUP E: Tangled Sky Lanterns Constellation
    // ==========================================
    const lanternsGroup = new THREE.Group();
    scene.add(lanternsGroup);

    const lanternCount = 65;
    const lanterns = [];

    const lanternBodyGeo = new THREE.CylinderGeometry(0.24, 0.19, 0.62, 16, 1, true);
    const lanternRingGeo = new THREE.TorusGeometry(0.24, 0.02, 12, 24);

    const lanternGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffaa33,
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

      const body = new THREE.Mesh(lanternBodyGeo, lanternGlowMat.clone());
      const topRing = new THREE.Mesh(lanternRingGeo, lanternWoodMat);
      topRing.rotation.x = Math.PI / 2;
      topRing.position.y = 0.31;
      const botRing = new THREE.Mesh(lanternRingGeo, lanternWoodMat);
      botRing.rotation.x = Math.PI / 2;
      botRing.position.y = -0.31;

      group.add(body, topRing, botRing);

      if (custom) {
        // Extra point light for guest-spawned wish lantern
        const pLight = new THREE.PointLight(0xffbb44, 2.5, 12);
        group.add(pLight);
        group.scale.set(1.4, 1.4, 1.4);
      }

      lanternsGroup.add(group);

      return {
        mesh: group,
        baseY: y,
        speed: 0.008 + Math.random() * 0.016,
        swaySpeed: 0.8 + Math.random() * 1.2,
        swayAmp: 0.12 + Math.random() * 0.22,
        offset: Math.random() * Math.PI * 2,
        isCustom: custom,
      };
    }

    for (let i = 0; i < lanternCount; i++) {
      const lx = (Math.random() - 0.5) * 36;
      const ly = -4 + Math.random() * 32;
      const lz = -18 + Math.random() * 24;
      lanterns.push(createLantern(lx, ly, lz));
    }

    // Expose API
    stageApiRef.current = {
      spawnLantern: (name, message) => {
        // Spawn right in front of camera view
        const customLantern = createLantern(
          (Math.random() - 0.5) * 4,
          camera.position.y - 1.5,
          camera.position.z - 4.5,
          true
        );
        customLantern.speed = 0.035; // rises faster initially
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

    // Initialize diyas
    stageApiRef.current.updateDiyas(litDiyasRef.current);

    // Pointer Parallax
    function onPointerMove(e) {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.targetX = cx;
      mouse.targetY = cy;
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Resize handler
    function onResize() {
      if (!container || !renderer || !camera || !composer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // Main 60/120 FPS Animation Loop
    const startTime = performance.now();

    function renderLoop(time) {
      if (disposed) return;
      rafId = requestAnimationFrame(renderLoop);

      const elapsed = (time - startTime) * 0.001;
      const p = scrollRef.current; // 0 to 1 scroll progress

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // 1. Starfield Twinkle & Drift
      starField.rotation.y = elapsed * 0.018;
      starField.rotation.x = elapsed * 0.008;

      // 2. Golden Rings Animation
      ringsGroup.rotation.y = elapsed * 0.35 + mouse.x * 0.25;
      ringsGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.15 + mouse.y * 0.15;
      gem.rotation.y = elapsed * 1.2;

      // 3. Sacred Fire Flicker
      sacredFireLight.intensity = 2.0 + Math.sin(elapsed * 14.0) * 0.45 + Math.cos(elapsed * 23.0) * 0.35;
      flameMeshes.forEach((flame, i) => {
        if (flame.visible) {
          const s = 1.0 + Math.sin(elapsed * 12.0 + i * 1.5) * 0.18;
          flame.scale.set(s, s * (1.0 + Math.cos(elapsed * 16.0 + i) * 0.15), s);
        }
      });

      // 4. Lanterns Floating Dynamics
      lanterns.forEach((l) => {
        l.mesh.position.y += l.speed;
        l.mesh.position.x += Math.sin(elapsed * l.swaySpeed + l.offset) * 0.008;
        l.mesh.rotation.y = elapsed * 0.2 + l.offset;
        l.mesh.rotation.z = Math.sin(elapsed * l.swaySpeed + l.offset) * 0.05;

        // Reset if floating too high
        if (l.mesh.position.y > 28) {
          l.mesh.position.y = -6;
        }
      });

      // 5. Cinematic Scroll-Driven Camera Path
      // Different acts smoothly transform camera position and target
      let targetCamX = mouse.x * 0.8;
      let targetCamY = 1.5 - p * 6.5 - mouse.y * 0.6;
      let targetCamZ = 13.5 - p * 3.5;

      // Stage weights based on scroll:
      // p in [0.0 - 0.2]: Focus on Rings / Opening
      // p in [0.2 - 0.5]: Focus on Mandap
      // p in [0.5 - 0.75]: Focus on Diyas
      // p in [0.75 - 1.0]: Tilt up to Lantern Galaxy
      if (p > 0.72) {
        // Looking up into the Tangled Lantern sky
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

      composer.render();
    }

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);

      try {
        renderer.dispose();
        renderer.domElement.remove();
        composer.dispose();
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
