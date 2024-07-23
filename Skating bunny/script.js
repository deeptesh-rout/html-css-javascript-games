import * as THREE from "https://esm.sh/three@0.156.1";
import { OrbitControls } from "https://esm.sh/three@0.156.1/addons/controls/OrbitControls.js";
import { GLTFLoader } from "https://esm.sh/three@0.156.1/examples/jsm/loaders/GLTFLoader";
import gsap from "https://esm.sh/gsap";
import { Reflector } from "https://esm.sh/three@0.156.1/examples/jsm/objects/Reflector";

document.addEventListener("DOMContentLoaded", () => new App());

class App {
  constructor() {
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.gltfFile = "https://assets.codepen.io/264161/rabbit6.glb";
    this.loadAssets();
  }

  loadAssets() {
    const loaderModel = new GLTFLoader();
    loaderModel.load(this.gltfFile, gltf => {
      this.model = gltf.scene;
      this.setUpScene();
    });
  }

  setUpScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.bgrColor = 0x332e2e;
    this.fog = new THREE.Fog(this.bgrColor, 13, 20);
    this.scene.fog = this.fog;
    this.camera = new THREE.PerspectiveCamera(
    60,
    this.winWidth / this.winHeight,
    1,
    100);

    this.camera.position.set(0, 4, 8);
    this.camera.lookAt(new THREE.Vector3());
    this.scene.add(this.camera);

    // Hero params
    this.heroAngularSpeed = 0;
    this.heroOldRot = 0;
    this.heroDistance = 0;
    this.heroOldUVPos = new THREE.Vector2(0.5, 0.5);
    this.heroNewUVPos = new THREE.Vector2(0.5, 0.5);
    this.heroSpeed = new THREE.Vector2(0, 0);
    this.heroAcc = new THREE.Vector2(0, 0);
    this.targetHeroUVPos = new THREE.Vector2(0.5, 0.5);
    this.targetHeroAbsMousePos = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isJumping = this.isLanding = false;
    this.jumpParams = { jumpProgress: 0, landProgress: 0 };

    // Clock
    this.clock = new THREE.Clock();
    this.time = 0;
    this.deltaTime = 0;

    // Core
    this.createRenderer();
    this.createSim();
    //this.createControls();
    this.createListeners();

    // Environment
    this.floorSize = 30;
    this.createMaterials();
    this.processModel();
    this.createFloor();
    this.createLine();
    this.createLight();
    this.createParticles();

    // Render loop
    this.draw();
  }

  processModel() {
    this.rabbit = this.model.getObjectByName("Rabbit");
    this.rabbitBody = this.model.getObjectByName("body");
    this.earRight = this.model.getObjectByName("earRight");
    this.earLeft = this.model.getObjectByName("earLeft");
    this.tail = this.model.getObjectByName("tail");
    this.footLeft = this.model.getObjectByName("footLeft");
    this.footRight = this.model.getObjectByName("footRight");
    this.eyeLeft = this.model.getObjectByName("eyeLeft");
    this.eyeRight = this.model.getObjectByName("eyeRight");
    this.carrot = this.model.getObjectByName("carrot");
    this.carrotLeaf = this.model.getObjectByName("carrotLeaf");
    this.carrotLeaf2 = this.model.getObjectByName("carrotLeaf2");
    this.carrot.rotation.z = 0.2;
    this.carrot.rotation.x = 0.2;
    this.rabbitBody.material = this.primMat;
    this.earRight.material = this.primMat;
    this.earLeft.material = this.primMat;
    this.tail.material = this.primMat;
    this.footLeft.material = this.secMat;
    this.footRight.material = this.secMat;
    this.eyeLeft.material = this.secMat;
    this.eyeRight.material = this.secMat;
    this.carrot.material = this.bonusMat;
    this.carrotLeaf.material = this.primMat;
    this.carrotLeaf2.material = this.primMat;

    this.addOutline(this.rabbitBody);
    this.addOutline(this.earRight);
    this.addOutline(this.earLeft);
    this.addOutline(this.tail);
    this.addOutline(this.carrot);

    this.rabbit.traverse(object => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    this.carrot.traverse(object => {
      if (object.isMesh) {
        object.castShadow = true;
      }
    });

    this.scene.add(this.rabbit);
    this.scene.add(this.carrot);
  }

  createFloor() {

    this.floor = new Reflector(
    new THREE.PlaneGeometry(this.floorSize, this.floorSize),
    {
      color: new THREE.Color(this.bgrColor),
      textureWidth: 1024,
      textureHeight: 1024 });


    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.modifyFloorShader();

    this.scene.add(this.floor);
  }

  createLine() {
    const material = new THREE.LineDashedMaterial({
      color: 0x7beeff,
      linewidth: 1,
      scale: 1,
      dashSize: 0.2,
      gapSize: 0.1 });


    const points = [];
    points.push(new THREE.Vector3(0, 0.2, 0));
    points.push(new THREE.Vector3(3, 0.2, 3));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.line = new THREE.Line(geometry, material);
    this.scene.add(this.line);
  }

  createParticles() {
    let bodyCount = 20;
    let tailCount = 5;
    let particleGeom = new THREE.BoxGeometry(.2, .2, .2, 1, 1, 1);
    this.particles1 = [];
    this.particles2 = [];

    let i = 0;

    for (i = 0; i < bodyCount; i++) {
      let m = new THREE.Mesh(particleGeom, this.bonusMat);
      this.particles1.push(m);
      m.scale.set(0, 0, 0);
      this.scene.add(m);
    }

    for (i = 0; i < tailCount; i++) {
      let m = new THREE.Mesh(particleGeom, this.primMat);
      this.particles2.push(m);
      m.scale.set(0, 0, 0);
      this.scene.add(m);
    }
  }

  createLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.ambientLight);

    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(1, 5, 1);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 512;
    this.light.shadow.mapSize.height = 512;
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = 12;
    this.light.shadow.camera.left = -12;
    this.light.shadow.camera.right = 12;
    this.light.shadow.camera.bottom = -12;
    this.light.shadow.camera.top = 12;
    this.light.shadow.radius = 3;
    this.light.shadow.blurSamples = 4;
    this.scene.add(this.light);

    const helper = new THREE.CameraHelper(this.light.shadow.camera);
    //this.scene.add(helper);
  }

  createRenderer() {
    const canvas = document.querySelector("canvas.webgl");
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true });

    this.renderer.setClearColor(new THREE.Color(this.bgrColor));

    this.renderer.setPixelRatio(this.pixelRatio = window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;
    this.renderer.localClippingEnabled = true;
  }

  createSim() {
    const fragmentShader = document.getElementById('simulationFragmentShader').textContent;
    const vertexShader = document.getElementById('simulationVertexShader').textContent;

    this.floorSimMat = new THREE.ShaderMaterial({
      uniforms: {
        inputTexture: { type: "t", value: null },
        time: { value: 0.0 },
        blade1PosOld: { value: new THREE.Vector2(.5, .5) },
        blade1PosNew: { value: new THREE.Vector2(.5, .5) },
        strength: { value: 0.0 } },

      vertexShader,
      fragmentShader });

    this.bufferSim = new BufferSim(this.renderer, 1024, 1024, this.floorSimMat);
  }

  createMaterials() {
    // Materials
    this.primMat = new THREE.MeshToonMaterial({ color: 0x7beeff });
    this.secMat = new THREE.MeshToonMaterial({ color: this.bgrColor });
    this.bonusMat = new THREE.MeshToonMaterial({ color: 0xff3434 });

    // outline Material
    const fragmentShader = document.getElementById('outlineFragmentShader').textContent;
    const vertexShader = document.getElementById('outlineVertexShader').textContent;
    this.outlineMat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x000000) },
        size: { type: "f", value: .02 } },

      vertexShader,
      fragmentShader,
      side: THREE.BackSide });

  }

  addOutline(origin) {
    let outline = origin.clone();
    outline.children = [];
    outline.position.set(0, 0, 0);
    outline.rotation.x = 0;
    outline.rotation.y = 0;
    outline.rotation.z = 0;
    outline.scale.set(1, 1, 1);
    outline.material = this.outlineMat;
    origin.add(outline);
    return outline;
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 0;
    this.controls.maxDistance = 20;
    this.controls.enabled = true;
  }

  createListeners() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    document.addEventListener("touchmove", this.onTouchMove.bind(this), false);
    document.addEventListener("mousedown", this.onMouseDown.bind(this), false);
  }

  draw() {
    this.updateGame();
    this.renderer.render(this.scene, this.camera);
    if (this.controls) this.controls.update();
    window.requestAnimationFrame(this.draw.bind(this));
  }

  updateGame() {
    this.dt = Math.min(this.clock.getDelta(), 0.3);
    this.time += this.dt;

    if (this.rabbit && this.line) {
      // Elastic string simulation
      let constrainUVPosX = this.constrain(this.targetHeroUVPos.x - 0.5, -0.3, 0.3);
      let constrainUVPosY = this.constrain(this.targetHeroUVPos.y - 0.5, -0.3, 0.3);
      this.targetHeroAbsMousePos.x = constrainUVPosX * this.floorSize;
      this.targetHeroAbsMousePos.y = -constrainUVPosY * this.floorSize;

      let dx = this.targetHeroAbsMousePos.x - this.rabbit.position.x;
      let dy = this.targetHeroAbsMousePos.y - this.rabbit.position.z;

      let angle = Math.atan2(dy, dx);
      this.heroDistance = Math.sqrt(dx * dx + dy * dy);
      let ax = dx * this.dt * 0.5;
      let ay = dy * this.dt * 0.5;

      this.heroSpeed.x += ax;
      this.heroSpeed.y += ay;

      this.heroSpeed.x *= Math.pow(this.dt, 0.005);
      this.heroSpeed.y *= Math.pow(this.dt, 0.005);

      this.rabbit.position.x += this.heroSpeed.x;
      this.rabbit.position.z += this.heroSpeed.y;
      let targetRot = -angle + Math.PI / 2;

      if (this.heroDistance > 0.3)
      this.rabbit.rotation.y += this.getShortestAngle(targetRot - this.rabbit.rotation.y) * 3 * this.dt;
      this.heroAngularSpeed = this.getShortestAngle(this.rabbit.rotation.y - this.heroOldRot);

      this.heroOldRot = this.rabbit.rotation.y;
      if (!this.isJumping) {
        this.earLeft.rotation.x = this.earRight.rotation.x = -this.heroSpeed.length() * 2;
      }

      let p = this.line.geometry.attributes.position.array;
      p[0] = this.targetHeroAbsMousePos.x;
      p[2] = this.targetHeroAbsMousePos.y;
      p[3] = this.rabbit.position.x;
      p[4] = this.rabbit.position.y;
      p[5] = this.rabbit.position.z;

      this.line.geometry.attributes.position.needsUpdate = true;
      this.line.computeLineDistances();

      this.heroNewUVPos = new THREE.Vector2(
      0.5 + this.rabbit.position.x / this.floorSize,
      0.5 - this.rabbit.position.z / this.floorSize);


      this.floorSimMat.time += this.dt;
      this.floorSimMat.uniforms.blade1PosNew.value = this.heroNewUVPos;
      this.floorSimMat.uniforms.blade1PosOld.value = this.heroOldUVPos;
      this.floorSimMat.uniforms.strength.value = this.isJumping ?
      0 :
      1 / (1 + this.heroSpeed.length() * 10);
      this.bufferSim.render();
      this.renderer.setRenderTarget(null);

      this.floor.material.uniforms.tScratches.value = this.bufferSim.output.texture;

      this.heroOldUVPos = this.heroNewUVPos.clone();
      this.carrot.rotation.y += this.dt;

      this.testCollision();
    }
  }

  onWindowResize() {
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.camera.aspect = this.winWidth / this.winHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.winWidth, this.winHeight);
  }

  onMouseMove(event) {
    const x = event.clientX / this.winWidth * 2 - 1;
    const y = -(event.clientY / this.winHeight * 2 - 1);
    this.updateMouse(x, y);
  }

  onTouchMove(event) {
    if (event.touches.length == 1) {
      event.preventDefault();
      const x = event.touches[0].pageX / this.winWidth * 2 - 1;
      const y = -(event.touches[0].pageY / this.winHeight * 2 - 1);
      this.updateMouse(x, y);
    }
  }

  updateMouse(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
    if (this.floor) this.raycast();
  }

  onMouseDown() {
    if (this.rabbit && !this.isJumping) this.jump();
  }

  jump() {
    this.isJumping = true;
    let turns = Math.floor(this.heroSpeed.length() * 5) + 1;
    let jumpDuration = .5 + turns * .2;
    let targetRot = this.heroAngularSpeed > 0 ? Math.PI * 2 * turns : -Math.PI * 2 * turns;

    gsap.to(this.rabbitBody.rotation, {
      duration: jumpDuration,
      ease: "linear.none",
      y: targetRot,
      onComplete: () => {
        this.rabbitBody.rotation.y = 0;
      } });


    gsap.to([this.earLeft.rotation, this.earRight.rotation], {
      duration: jumpDuration * .8,
      ease: "power4.out",
      x: Math.PI / 4 });

    gsap.to([this.earLeft.rotation, this.earRight.rotation], {
      duration: jumpDuration * .2,
      delay: jumpDuration * .8,
      ease: "power4.in",
      x: 0 });


    gsap.to(this.jumpParams, {
      duration: jumpDuration * .5,
      ease: "power2.out",
      jumpProgress: .5,
      onUpdate: () => {
        let sin = Math.sin(this.jumpParams.jumpProgress * Math.PI);
        this.rabbit.position.y = Math.pow(sin, 4) * turns;
      } });

    gsap.to(this.jumpParams, {
      duration: jumpDuration * .5,
      ease: "power2.in",
      delay: jumpDuration * .5,
      jumpProgress: 1,
      onUpdate: () => {
        let sin = Math.sin(this.jumpParams.jumpProgress * Math.PI);
        this.rabbit.position.y = Math.pow(sin, 1) * turns;
      },
      onComplete: () => {
        this.rabbit.position.y = 0;
        this.jumpParams.jumpProgress = 0;
        this.isJumping = false;
      } });

  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects([this.floor]);

    if (intersects.length > 0) {
      this.targetHeroUVPos.x = intersects[0].uv.x;
      this.targetHeroUVPos.y = intersects[0].uv.y;
    }
  }

  getShortestAngle(v) {
    let a = v % (Math.PI * 2);
    if (a < -Math.PI) a += Math.PI * 2;else
    if (a > Math.PI) a -= Math.PI * 2;
    return a;
  }

  constrain(v, vMin, vMax) {
    return Math.min(vMax, Math.max(vMin, v));
  }

  testCollision() {
    if (this.isExploding) return;
    let distVec = this.rabbit.position.clone();
    distVec.sub(this.carrot.position);
    let l = distVec.length();
    if (l <= 1) {
      this.carrot.visible = false;
      this.explode(this.carrot.position);
    }
  }

  explode(pos) {
    this.isExploding = true;
    let p1Count = this.particles1.length;
    let p2Count = this.particles2.length;
    let i = 0;
    for (i = 0; i < p1Count; i++) {
      let m = this.particles1[i];
      m.position.x = pos.x;
      m.position.y = pos.y;
      m.position.z = pos.z;
      m.scale.set(2, 2, 2);

      gsap.to(m.position, {
        x: pos.x + (-.5 + Math.random()) * 1.5,
        y: pos.y + (.5 + Math.random()) * 1.5,
        z: pos.z + (-.5 + Math.random()) * 1.5,
        duration: 1,
        ease: "power4.out" });

      gsap.to(m.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: "power4.out",
        onComplete: () => {
          this.spawnCarrot();
          this.isExploding = false;
        } });

    }
    for (i = 0; i < p2Count; i++) {
      let m = this.particles2[i];
      m.position.x = pos.x;
      m.position.y = pos.y;
      m.position.z = pos.z;
      m.scale.set(2, 2, 2);

      gsap.to(m.position, {
        x: pos.x + (-.5 + Math.random()) * 1.5,
        y: pos.y + (.5 + Math.random()) * 1.5,
        z: pos.z + (-.5 + Math.random()) * 1.5,
        duration: 1,
        ease: "power4.out" });

      gsap.to(m.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: "power4.out",
        onComplete: () => {
          this.spawnCarrot();
          this.isExploding = false;
        } });

    }
  }

  spawnCarrot() {

    let px = (Math.random() - .5) * .3;
    let py = (Math.random() - .5) * .3;
    let h = .2 + Math.random() * 1;
    this.carrot.position.x = px * this.floorSize;
    this.carrot.position.z = py * this.floorSize;
    this.carrot.position.y = -1;

    this.carrot.scale.set(0, 0, 0);
    this.carrot.visible = true;


    gsap.to(this.carrot.scale, {
      duration: 1.5,
      ease: "elastic.out",
      x: 1,
      y: 1,
      z: 1 });

    gsap.to(this.carrot.position, {
      duration: 1.5,
      ease: "elastic.out",
      y: h });

  }

  modifyFloorShader() {

    // the floor is currently a Reflector which reacts as a mirror
    // in order to make it a bit more interesting (adding blur, displacement and shadows)
    // we will supercharge its shaders with custom code.

    // get the renderTarget and texture Matrix from the unaltered reflector
    let renderTarget = this.floor.getRenderTarget();
    const textureMatrix = this.floor.material.uniforms.textureMatrix;

    // get the custom shaders
    const fragmentShader = document.getElementById('reflectorFragmentShader').textContent;
    const vertexShader = document.getElementById('reflectorVertexShader').textContent;

    // merge the uniforms of the reflector with additional shadow and light uniforms
    const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib['common'],
    THREE.UniformsLib['shadowmap'],
    THREE.UniformsLib['lights'],
    this.floor.material.uniforms,
    {
      tScratches: { value: this.bufferSim.output.texture } }]);



    // apply to the reflector
    this.floor.material.lights = true;
    this.floor.material.uniforms = uniforms;
    this.floor.material.uniforms.tDiffuse.value = renderTarget.texture;
    this.floor.material.uniforms.textureMatrix.value = textureMatrix.value;
    this.floor.material.vertexShader = vertexShader;
    this.floor.material.fragmentShader = fragmentShader;
  }}


class BufferSim {
  constructor(renderer, width, height, shader) {

    this.renderer = renderer;
    this.shader = shader;
    this.orthoScene = new THREE.Scene();
    var fbo = new THREE.WebGLRenderTarget(width, height, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false,
      depthBuffer: false });


    fbo.texture.generateMipmaps = false;

    this.fbos = [fbo, fbo.clone()];
    this.current = 0;
    this.output = this.fbos[0];
    this.orthoCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, .00001, 1000);
    this.orthoQuad = new THREE.Mesh(new THREE.PlaneGeometry(width, height), this.shader);
    this.orthoScene.add(this.orthoQuad);
  }

  render() {
    this.shader.uniforms.inputTexture.value = this.fbos[this.current].texture;
    this.input = this.fbos[this.current];
    this.current = 1 - this.current;
    this.output = this.fbos[this.current];
    this.renderer.setRenderTarget(this.output);
    this.renderer.render(this.orthoScene, this.orthoCamera);
    this.renderer.setRenderTarget(null);
  }}