import { Program } from './Program';
import { Mesh } from '../../objects/Mesh';
import { WebGLRenderer } from '../WebGLRenderer';
import { WebGLUtils } from './WebGLUtils';
import { NaiveMaterial } from '../../materials/NaiveMaterial';
import { StandardMaterial } from '../../materials/StandardMaterial';
import { UBO } from './UBO';
import { Color } from '../../materials/Color';

/**
 * Creates custom WebGLPrograms and shaders according to needs and keeps track of them
 * 
 * Usually all of the programs used are alike.
 * ProgramManager gives small render time optimisations by using more memory
 */
export class ProgramManager {

  renderer: WebGLRenderer;
  programs: Array<Program>;
  helperBoxProgram: Program | null;

  constructor( renderer: WebGLRenderer ) {

    this.renderer = renderer;
    this.programs = [];

    this.helperBoxProgram = null;

  }

  /**
   * Makes sure that the same program is not created twice
   */
  programAndMeshMatches( prg: Program, mesh: Mesh ): boolean {

    const geometry = mesh.geometry;
    
    if (!geometry) {
      console.error('Mesh doesn\'t have geometry');
      return false;
    }

    return prg.targetMaterial === mesh.material.type;
    
  }

  createProgramForMesh( mesh: Mesh ): Program | undefined {

    let program = null;

    const gl = this.renderer.gl;
    if (!gl) return;

    const geometry = mesh.geometry;
    const normals = geometry.hasNormals;

    // here is room to define a custom shader program
    // one program for each need :)

    let vert;
    let frag;

    if ( mesh.material instanceof Color ) {
      
      vert = [

        '#version 300 es',

        'in vec4 a_position;',

        'uniform Transform{',
          'mat4 world;',
          'mat4 worldViewProjection;',
        '};',

        'void main() {',
          'gl_Position = worldViewProjection * world * a_position;',
        '}'

      ].join('\n');

      frag = [

        '#version 300 es',

        'precision mediump float;',
        
        'uniform vec4 u_color;',

        'out vec4 outColor;',

        'void main() {',

          'outColor = u_color;',
        '}'

      ].join('\n');

    } else if ( mesh.material instanceof NaiveMaterial ) {

      vert = [

        '#version 300 es',

        'in vec4 a_position;',

        normals ? 'in vec3 a_normal;' : '',
        normals ? 'out vec3 v_normal;' : '',

        'uniform mat4 u_worldViewProjection;',
        normals ? 'uniform mat4 u_world;' : '',

        'void main() {',
          'gl_Position = u_worldViewProjection * a_position;',

          normals ? 'v_normal = mat3(u_world) * a_normal;' : '',
        '}'

      ].join('\n');

      frag = [

        '#version 300 es',

        'precision mediump float;',

        normals ? 'in vec3 v_normal;' : '',
        normals ? 'uniform vec3 u_reverseLightDirection;' : '',
        
        'uniform vec4 u_color;',

        'out vec4 outColor;',

        'void main() {',
          normals ? 'vec3 normal = normalize(v_normal);' : '',
          normals ? 'float light = dot(normal, u_reverseLightDirection);' : '',

          'outColor = u_color;',

          normals ? 'outColor.rgb *= light;' : '',
        '}'

      ].join('\n');

    } else if ( mesh.material instanceof StandardMaterial && normals ) {

      vert = [

        '#version 300 es',
  
        'in vec4 a_position;',
        'in vec3 a_normal;',
        
        'uniform Transform{',
          'mat4 world;',
          'mat4 worldViewProjection;',
          'mat4 worldInverseTranspose;',
        '};',
        
        'uniform vec3 u_reverseLightDirection;',
        'uniform vec3 u_viewPosition;',

        'out vec3 v_surfaceToLight;',
        'out vec3 v_surfaceToView;',
        'out vec3 v_normal;',
  
        'void main() {',
          'vec3 surfaceWorldPosition = (world * a_position).xyz;',

          'v_surfaceToLight = u_reverseLightDirection;',

          'v_surfaceToView = u_viewPosition - surfaceWorldPosition;',

          'v_normal = mat3(worldInverseTranspose) * a_normal;',

          'gl_Position = worldViewProjection * a_position;',
        '}'
  
      ].join('\n');
  
      frag = [
  
        '#version 300 es',
  
        'precision mediump float;',
  
        'in vec3 v_normal;',
        'in vec3 v_surfaceToLight;',
        'in vec3 v_surfaceToView;',    
  
        'uniform Material {',
          'vec3 matAmbient;',
          'vec3 matDiffuse;',
          'vec4 matSpecular;',
        '};',

        'uniform Light {',
          'vec3 lightAmbient;',
          'vec3 lightDiffuse;',
          'vec3 lightSpecular;',
        '};',
  
        'out vec4 outColor;',
  
        'void main() {',
          'vec3 normal = normalize(v_normal);',
          'vec3 viewDir = normalize(v_surfaceToView);',
          'vec3 lightDir = normalize(v_surfaceToLight);',

          // ambient
          'vec3 ambient = lightAmbient * matAmbient;',
          
          // diffuse 
          'float diff = max(dot(normal, lightDir), 0.0);',
          'vec3 diffuse = lightDiffuse * (diff * matDiffuse);',
          
          // specular (unnecessary calculations away with lambert term)
          'float shininess = matSpecular.w;',
          'vec3 reflectDir = reflect(-lightDir, normal);',
          'float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);',
          'vec3 specular = lightSpecular * (spec * matSpecular.xyz);',
              
          'vec3 result = ambient + diffuse + specular;',
          'outColor = vec4(result, 1.0) * 1.5;',
        '}'
  
      ].join('\n');

    }

    if ( vert === undefined || frag === undefined ) { console.error('Incorrect material type OR normals missing');  return; }

    const shader = WebGLUtils.createShaderProgramFromScripts(gl, vert, frag);
    if (!shader) { console.error('ProgramManger.figureProgram();'); return;}

    program = new Program(gl, shader, mesh.material.type);
    program.prepareUniformBlocks(
      UBO.cache['Transform'], 0,
    );

    if (mesh.material instanceof Color) {
      
      program.setAttribLocations(gl, false);

      program.prepareUniforms(
        'u_color', 'vec4',
      );

    } else if (mesh.material instanceof StandardMaterial) {

      program.setAttribLocations(gl, true);

      program.prepareUniforms(
        'u_reverseLightDirection', 'vec3',
        'u_viewPosition', 'vec3',
      );
      program.prepareUniformBlocks(
        UBO.cache['Material'], 1,
        UBO.cache['Light'], 2,
      );

    }

    this.programs.push(program);

    return program;

  }

  setHelperBoxProgram( gl: WebGL2RenderingContext ): void {

    if (this.helperBoxProgram) { return; }

    const lineColor = [0.5, 0.5, 0.5, 1];

    const vert = [

      '#version 300 es',

      'in vec4 a_position;',

      'uniform Transform{',
        'mat4 world;',
        'mat4 worldViewProjection;',
        'mat4 worldInverseTranspose;',
      '};',

      'void main() {',
        'gl_Position = worldViewProjection * a_position;',
      '}'

    ].join('\n');

    const frag = [

      '#version 300 es',

      'precision mediump float;',

      'out vec4 outColor;',

      'void main() {',
        `outColor = vec4(${lineColor.join(', ')});`,
      '}'

    ].join('\n');

    const shader = WebGLUtils.createShaderProgramFromScripts( gl, vert, frag );
    if (!shader) { console.error('ProgramManger.figureProgram();'); return;}

    const program = new Program(gl, shader, 'helper');
    program.setAttribLocations(gl, false);
    program.prepareUniforms(
      'u_worldViewProjection', 'mat4',
    );

    this.helperBoxProgram = program;

  }

}
