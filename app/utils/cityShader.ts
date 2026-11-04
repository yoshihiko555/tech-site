/** GLSL for the muted rain city behind the top page. */
export const CITY_VERTEX = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'

export const CITY_FRAGMENT = [
  '#ifdef GL_FRAGMENT_PRECISION_HIGH',
  'precision highp float;',
  '#else',
  'precision mediump float;',
  '#endif',
  'uniform vec2 r;uniform float t;uniform vec2 m;uniform float g;uniform float k;uniform float v;uniform float sc;uniform float dim;uniform vec2 hp;uniform float hs;uniform vec3 cw;uniform float sw;uniform vec3 warm;',
  'float h1(float n){return fract(sin(n*127.1+.3)*43758.5453);}',
  'float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
  'float vn(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h2(i),h2(i+vec2(1.,0.)),u.x),mix(h2(i+vec2(0.,1.)),h2(i+vec2(1.,1.)),u.x),u.y);}',
  'vec3 pal(float x){if(x<.45)return warm;if(x<.8)return vec3(.36,.79,.74);return vec3(.89,.69,.29);}',
  'vec3 scene(vec2 uv){',
  ' float a=r.x/r.y;vec2 p=vec2(uv.x*a,uv.y);vec2 mo=m-.5;',
  ' vec3 col=mix(vec3(.07,.13,.14),vec3(.03,.06,.07),smoothstep(0.,1.,uv.y));',
  ' col+=warm*.18*pow(clamp(1.-uv.y,0.,1.),3.);',
  ' for(int L=0;L<2;L++){',
  '  float fl=float(L);float px=p.x+mo.x*(.02+fl*.04);float w=.07+fl*.06;float q=px/w+fl*7.3;float cx=floor(q);',
  '  float hgt=.42+.4*h1(cx+fl*13.)-fl*.22;float inB=1.-step(hgt,uv.y);',
  '  float wx=step(.3,fract(fract(q)*3.));float wy=step(.45,fract(uv.y*46.));',
  '  float lt=step(.86,h2(vec2(cx,floor(uv.y*46.))+fl*5.));',
  '  vec3 bcol=fl<.5?vec3(.04,.08,.09):vec3(.02,.04,.05);',
  '  col=mix(col,bcol,inB);col+=inB*wx*wy*lt*pal(h2(vec2(cx,fl+1.)))*(.2-fl*.07);',
  ' }',
  ' for(int i=0;i<4;i++){',
  '  float fi=float(i);float x0=(.08+fi*.26+.05*h1(fi+1.))*a;',
  '  float y0=.3+.3*h1(fi+4.);float y1=y0+.2+.15*h1(fi+9.);float dx=abs(p.x+mo.x*.035-x0);',
  '  float mask=smoothstep(y0-.015,y0,uv.y)*(1.-smoothstep(y1,y1+.015,uv.y));',
  '  col+=pal(h1(fi+2.))*mask*(exp(-dx*110.)*.9+exp(-dx*14.)*.18)*(.85+.15*sin(t*1.2+fi*1.7));',
  ' }',
  ' float fg=vn(vec2(p.x*1.3-t*.04,uv.y*4.))*.6+vn(vec2(p.x*2.7+t*.03,uv.y*7.+3.))*.4;',
  ' col+=vec3(.2,.32,.32)*fg*(1.-smoothstep(0.,.55,uv.y))*.16;',
  ' for(int L=0;L<3;L++){',
  '  float fl=float(L);float sc2=3.5+fl*3.;',
  '  vec2 qq=(p+mo*(.05+fl*.06))*sc2+vec2(fl*3.1,fl*1.7-t*.015*(fl+1.));vec2 id=floor(qq);vec2 f=fract(qq)-.5;',
  '  float rnd=h2(id+fl*17.);vec2 off2=vec2(h2(id+1.3),h2(id+7.7))-.5;',
  '  float d=length(f-off2*.45);float rad=.1+.16*h2(id+3.1);',
  '  float b=(1.-smoothstep(rad*.5,rad,d))*step(.74,rnd);',
  '  col+=pal(fract(rnd*7.3))*b*(.16-fl*.04);',
  ' }',
  ' vec2 mp=vec2(m.x*a,m.y+sc);float rd=p.x-mp.x;float dyy=uv.y-mp.y;',
  ' float push=k*.04*exp(-(rd*rd*60.+dyy*dyy*5.));',
  ' float rx=(p.x+sign(rd)*push)*70.;float cxr=floor(rx);',
  ' float drop=fract(uv.y*2.4+t*1.6+h1(cxr)*10.);',
  ' float streak=smoothstep(0.,.02,drop)*(1.-smoothstep(.02,.14,drop))*step(.64,h1(cxr*1.7))*(1.-smoothstep(0.,.4,abs(fract(rx)-.5)));',
  ' col+=vec3(.6,.72,.72)*streak*.1;',
  ' return col;',
  '}',
  'void main(){',
  ' vec2 uv=gl_FragCoord.xy/r;float a=r.x/r.y;',
  ' float age=t-sw;float by=1.-age*1.1;float inb=step(0.,age)*step(age,1.)*(1.-smoothstep(0.,.08,abs(uv.y-by)));',
  ' vec2 dh=(uv-hp)*vec2(a,1.);float dhl=length(dh)+1e-4;',
  ' uv+=dh/dhl*vec2(1./a,1.)*sin(dhl*60.-t*7.)*.003*hs*exp(-dhl*6.);',
  ' float cage=t-cw.z;vec2 dc=(uv-cw.xy)*vec2(a,1.);float dcl=length(dc)+1e-4;float rad=cage*.85;',
  ' float ring=step(0.,cage)*(1.-smoothstep(0.,1.4,cage))*exp(-pow((dcl-rad)*18.,2.));',
  ' uv+=dc/dcl*vec2(1./a,1.)*ring*.02;',
  ' vec2 suv=uv-vec2(0.,sc);',
  ' float ca=.0012+g*.006+inb*.004+ring*.006;',
  ' vec3 col;col.r=scene(suv+vec2(ca,0.)).r;col.g=scene(suv).g;col.b=scene(suv-vec2(ca,0.)).b;',
  ' col*=dim;',
  ' col+=vec3(.36,.79,.74)*ring*.3;',
  ' col+=vec3(.36,.79,.74)*inb*.08;',
  ' col*=1.-.45*pow(length(gl_FragCoord.xy/r-.5)*1.25,2.);',
  ' gl_FragColor=vec4(max(col,0.)*v,1.);',
  '}',
].join('\n')

export const CITY_UNIFORMS = ['r', 't', 'm', 'g', 'k', 'v', 'sc', 'dim', 'hp', 'hs', 'cw', 'sw', 'warm'] as const

export type CityUniform = (typeof CITY_UNIFORMS)[number]

function getContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  try {
    return canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: true })
  }
  catch {
    return null
  }
}

/** Compiles the program and binds a full-screen triangle. Null when WebGL is unavailable. */
export function createCityProgram(canvas: HTMLCanvasElement) {
  const gl = getContext(canvas)
  if (!gl) return null
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
  }
  const vertex = compile(gl.VERTEX_SHADER, CITY_VERTEX)
  const fragment = compile(gl.FRAGMENT_SHADER, CITY_FRAGMENT)
  const program = vertex && fragment ? gl.createProgram() : null
  if (!program || !vertex || !fragment) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'p')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  const uniforms = Object.fromEntries(
    CITY_UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]),
  ) as Record<CityUniform, WebGLUniformLocation | null>
  return { gl, uniforms }
}
