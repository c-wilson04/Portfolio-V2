declare module "three" {
  export type Vector3Like = {
    x: number
    y: number
    z: number
    set(x: number, y: number, z: number): void
  }

  export class Scene {
    add(...objects: any[]): void
    clear(): void
  }

  export class Object3D {
    rotation: { x: number; y: number; z: number }
    position: Vector3Like
    scale: Vector3Like
    constructor()
  }

  export class Group extends Object3D {}

  export class Mesh extends Object3D {
    constructor(geometry?: any, material?: any)
  }

  export class MeshBasicMaterial {
    constructor(params?: Record<string, unknown>)
  }

  export class TorusGeometry {
    constructor(radius: number, tube: number, radialSegments: number, tubularSegments: number)
  }

  export class PerspectiveCamera {
    aspect: number
    constructor(fov: number, aspect: number, near: number, far: number)
    position: Vector3Like & { setX(x: number): void; setZ(z: number): void }
    updateProjectionMatrix(): void
  }

  export class WebGLRenderer {
    constructor(options: Record<string, unknown>)
    setPixelRatio(value: number): void
    setClearColor(color: number, alpha?: number): void
    setSize(width: number, height: number): void
    render(scene: Scene, camera: PerspectiveCamera): void
    dispose(): void
  }

  export class PointLight {
    constructor(color: number, intensity?: number)
    position: Vector3Like & { set(x: number, y: number, z: number): void }
  }

  export class RectAreaLight {
    constructor(color: number, intensity: number, width: number, height: number)
    position: Vector3Like & { set(x: number, y: number, z: number): void }
    lookAt(x: number, y: number, z: number): void
  }

  export class AmbientLight {
    constructor(color: number, intensity?: number)
    position: Vector3Like & { set(x: number, y: number, z: number): void }
  }
}

declare module "three/examples/jsm/loaders/GLTFLoader.js" {
  export class GLTFLoader {
    load(
      url: string,
      onLoad: (gltf: { scene: any }) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (event: ErrorEvent) => void
    ): void
    parse(data: ArrayBuffer, path: string, onLoad: (gltf: { scene: any }) => void): void
  }
}

