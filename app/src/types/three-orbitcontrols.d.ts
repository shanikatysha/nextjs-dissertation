declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera, MOUSE, TOUCH, EventDispatcher, Vector3 } from 'three';
  
    export class OrbitControls extends EventDispatcher {
      constructor(object: Camera, domElement?: HTMLElement);
  
      // Properties
      enabled: boolean;
      target: Vector3;
      minDistance: number;
      maxDistance: number;
      minPolarAngle: number;
      maxPolarAngle: number;
      minAzimuthAngle: number;
      maxAzimuthAngle: number;
      enableDamping: boolean;
      dampingFactor: number;
      enableZoom: boolean;
      zoomSpeed: number;
      enableRotate: boolean;
      rotateSpeed: number;
      enablePan: boolean;
      panSpeed: number;
      screenSpacePanning: boolean;
      keyPanSpeed: number;
      autoRotate: boolean;
      autoRotateSpeed: number;
      enabledKeys: string[];
      mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };
      touches: { ONE: TOUCH; TWO: TOUCH };
  
      // Methods
      update(): boolean;
      dispose(): void;
      reset(): void;
      saveState(): void;
      getPolarAngle(): number;
      getAzimuthalAngle(): number;
      listenToKeyEvents(domElement: HTMLElement): void;
  
      // Events
      addEventListener(type: string, listener: (event: any) => void): void;
      removeEventListener(type: string, listener: (event: any) => void): void;
      dispatchEvent(event: { type: string; [attachment: string]: any }): void;
    }
  }
  