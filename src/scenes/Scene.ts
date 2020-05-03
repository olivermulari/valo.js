import { Object3D } from '../objects/Object3D';
import { RenderList } from '../renderers/webgl/RenderList';
import { Matrix4 } from '../math/Matrix4';
import { Camera } from '../cameras/Camera';
import { Frustum } from '../math/Frustum';
import { HelperManager } from '../helpers/HelperManager';
import { Mesh } from '../objects/Mesh';

let _sceneID = 0;

export class Scene {

  id: number;
  meshes: Array<Mesh>;
  cameras: Array<Camera>;
  activeCamera: Camera | null;
  viewProjectionMatrix: Matrix4;
  viewFrustum: Frustum;
  viewMatrixNeedsUpdate: boolean;
  //renderLists: Array<RenderList>;
  renderList: RenderList;
  meshListDidUpdate: boolean;
  buffersNeedUpdate: boolean;
  helperManager?: HelperManager;

  constructor() {

    this.id = _sceneID++;

    this.meshes = [];

    this.cameras = [];
    this.activeCamera = null;

    this.viewProjectionMatrix = new Matrix4();
    this.viewFrustum = new Frustum();
    this.viewMatrixNeedsUpdate = true; // TODO: check when it is necessary

    //this.renderLists = [];
    this.renderList = new RenderList();
    
    this.meshListDidUpdate = false;
    this.buffersNeedUpdate = false;
    
  }

  add( obj: Object3D ): void {

    if (obj instanceof Camera) {

      this.cameras.push(obj);

    } else if (obj instanceof Mesh) {

      this.addMesh(obj);

    }

  }

  addMesh( mesh: Mesh ): void {

    if ( !this.meshes.includes(mesh) ) {

      this.meshes.push(mesh);

      this._onListUpdate();

    }

  }

  deleteMesh( mesh: Mesh ): void {

    const idx = this.meshes.indexOf(mesh);

    if (idx !== -1) {

      this.meshes.splice(idx, 1);

      this.renderList.delete(mesh);

      this._onListUpdate();

    }

  }

  /**
   * Updates viewProjectionMatrix and viewFrustum
   */
  updateProjectionView( camera: Camera ): void {

    this.viewProjectionMatrix.multiply( camera.perspective, camera.inverseWorldMatrix );

    this.viewFrustum.setFromProjectionMatrix( this.viewProjectionMatrix );
  
  }

  setAspectToActiveCamera( aspect: number ): void {
    
    if (this.activeCamera) {

      this.activeCamera.setAspect(aspect);

    }

  }

  onBeforeRender(): void {

    // UPDATE PROJECTION MATRIXES

    const camera = this.activeCamera;

    if (camera) {

      if (camera.perspectiveNeedsUpdate) {

        camera.updatePerspective();

      }

      if (camera.worldMatrixNeedsUpdate) {

        camera.updateWorldMatrix();

      }

      if (this.viewMatrixNeedsUpdate) {

        this.updateProjectionView( camera );

      }

    }

    // UPDATE BOUNDING BOXES

    this.meshes.forEach(obj => {

      if (obj.boundingBox.positionsNeedsUpdate) {

        obj.boundingBox.uptadePositions();
        
      }

    });

    // UPDATE WORLD MATRIXES

    this.meshes.forEach( obj => obj.updateWorldMatrix() );

    // CHECK FRUSTUM

    this.meshes.forEach( obj => obj.checkIsInFrustum( this ) );

    // UPDATE VIEW MATRIXES

    this.meshes.forEach( obj => {

      if (obj.isInFrustum) {

        obj.updateViewMatrix( this );

      }
      
    });

  }

  onAfterRender(): void {

    this.meshListDidUpdate = false;
    
    this.buffersNeedUpdate = false;

  }

  /**
   * When scene state is changed
   */
  _onListUpdate(): void {

    this.meshListDidUpdate = true;
    
    this.buffersNeedUpdate = true;

  }

  /**
   * Destroys the scene with all of it's objects
   */
  destroy(): void {

    this.meshes.forEach( mesh => mesh.destroy() );

  }

}