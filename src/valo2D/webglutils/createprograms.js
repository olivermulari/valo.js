import { createShaderProgramFromScripts } from './createshader';
import { getVertexShader, getFragmentShader } from '../shaders/renderer2D';
import Program from './program';

export function createPrograms(gl) {
  const programs = {};

  // a basic shader program that works good with most stuff
  // coloring is per element and not per vertex
  const basicVert = getVertexShader('basic');
  const basicFrag = getFragmentShader('basic');
  const basic = createShaderProgramFromScripts(gl, basicVert, basicFrag);

  programs.basic = new Program(basic);
  programs.basic.setUniformLocationsBasic(gl);


  // a separate shader program that calculates parents rotations in GPU
  const childVert = getVertexShader('child');
  const childFrag = getFragmentShader('child');
  const child = createShaderProgramFromScripts(gl, childVert, childFrag);

  programs.child = new Program(child);
  programs.child.setUniformLocationsBasic(gl, true);


  // shader program for points data
  const pointsVert = getVertexShader('points');
  const pointsFrag = getFragmentShader('points');
  const points = createShaderProgramFromScripts(gl, pointsVert, pointsFrag);

  programs.points = new Program(points);
  programs.points.setUniformLocationsPoints(gl);


  // shader program for points data
  const linesVert = getVertexShader('lines');
  const linesFrag = getFragmentShader('lines');
  const lines = createShaderProgramFromScripts(gl, linesVert, linesFrag);

  programs.lines = new Program(lines);
  programs.lines.setUniformLocationsLines(gl);


  // shader program for texture
  const texVert = getVertexShader('texture');
  const texFrag = getFragmentShader('texture');
  const texture = createShaderProgramFromScripts(gl, texVert, texFrag);

  programs.texture = new Program(texture);
  programs.texture.setUniformLocationsBasic(gl, false, true);


  // shader program for coloring vertices individually
  const colVert = getVertexShader('vertexColor');
  const colFrag = getFragmentShader('vertexColor');
  const vertexColor = createShaderProgramFromScripts(gl, colVert, colFrag);

  programs.vertexColor = new Program(vertexColor);
  programs.vertexColor.setUniformLocationsBasic(gl, false, false, false);

  return programs;
}
