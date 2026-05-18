
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// ---- UI Layout (persisted) ----
const UI_LAYOUT_KEY = 'dnd.character.editor.layout.v2';
var DEFAULT_LAYOUT = {
  version: 2,
  columns: 4,
  tiles: {
    identity:  { visible: true, colSpan: 2 },
    combat:    { visible: true, colSpan: 2 },
    abilities: { visible: true, colSpan: 4 },
    skills:    { visible: true, colSpan: 2 },
    attacks:   { visible: true, colSpan: 2 },
    spells:    { visible: true, colSpan: 2 },
    inventory: { visible: true, colSpan: 2 },
    notes:     { visible: true, colSpan: 4 },
    journal:   { visible: true, colSpan: 4 },
  },
  order: ['identity','combat','abilities','skills','attacks','spells','inventory','journal','notes'],
};
var TILE_MIN_SPAN = {
  identity: 1, combat: 1, abilities: 1,
  skills: 1, attacks: 2, spells: 2,
  inventory: 1, notes: 1, journal: 1,
};
function loadLayout(){
  try {
    var saved = JSON.parse(localStorage.getItem(UI_LAYOUT_KEY) || '');
    if (saved && saved.version === 2) return saved;
    return null;
  } catch { return null; }
}
function migrateV1Layout(){
  try {
    var old = JSON.parse(localStorage.getItem('dnd.character.editor.layout.v1') || '');
    if (!old) return null;
    var v2 = JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
    var bottomTiles = ['skills','attacks','spells','inventory','notes'];
    bottomTiles.forEach(function(id){
      if (old.tiles && old.tiles[id]) {
        v2.tiles[id].visible = !!old.tiles[id].visible;
      }
    });
    if (Array.isArray(old.order)) {
      var bottomOrder = old.order.filter(function(id){ return bottomTiles.indexOf(id) !== -1; });
      v2.order = ['identity','combat','abilities'].concat(bottomOrder);
    }
    return v2;
  } catch { return null; }
}
let layout = loadLayout() || migrateV1Layout() || JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
function saveLayout(){ try{ localStorage.setItem(UI_LAYOUT_KEY, JSON.stringify(layout)); }catch{} }

// ---- Color Themes ----
var THEMES = {
  light: {
    '--bd':'#d0d4db','--tx':'#101216','--mut':'#5a6270',
    '--bg':'#ffffff','--chip':'#f5f7fa','--card-bg':'#ffffff',
    '--dot-on-bg':'#222','--dot-on-tx':'#fff',
    '--btn-hover':'#f9fafb','--tab-active-bg':'#eef3ff','--tab-active-bd':'#88aaff',
  },
  dark: {
    '--bd':'#3a3f4b','--tx':'#e0e2e6','--mut':'#8a8f9a',
    '--bg':'#1e2028','--chip':'#2a2d36','--card-bg':'#25272f',
    '--dot-on-bg':'#e0e2e6','--dot-on-tx':'#1e2028',
    '--btn-hover':'#2f323c','--tab-active-bg':'#2a3550','--tab-active-bd':'#5577cc',
  },
  parchment: {
    '--bd':'#c4a96a','--tx':'#3b2e1a','--mut':'#7a6840',
    '--bg':'#f5e6c8','--chip':'#ecdab0','--card-bg':'#faf0d8',
    '--dot-on-bg':'#3b2e1a','--dot-on-tx':'#f5e6c8',
    '--btn-hover':'#ecdab0','--tab-active-bg':'#e0c890','--tab-active-bd':'#a08030',
  },
  darkDungeon: {
    '--bd':'#4a3828','--tx':'#d4c4a0','--mut':'#8a7a5a',
    '--bg':'#1a1410','--chip':'#2a2018','--card-bg':'#221a12',
    '--dot-on-bg':'#d4c4a0','--dot-on-tx':'#1a1410',
    '--btn-hover':'#2a2018','--tab-active-bg':'#3a2a18','--tab-active-bd':'#8a6a30',
  },
  forest: {
    '--bd':'#4a7a50','--tx':'#1a2e1a','--mut':'#5a8a5a',
    '--bg':'#e8f0e4','--chip':'#d0e4cc','--card-bg':'#f0f8ec',
    '--dot-on-bg':'#2a4a2a','--dot-on-tx':'#e8f0e4',
    '--btn-hover':'#d8ecd4','--tab-active-bg':'#c0dcc0','--tab-active-bd':'#4a8a4a',
  },
  royal: {
    '--bd':'#6a4a8a','--tx':'#1e1228','--mut':'#7a5a9a',
    '--bg':'#f0e8f8','--chip':'#e0d0f0','--card-bg':'#f8f0ff',
    '--dot-on-bg':'#3a2050','--dot-on-tx':'#f0e8f8',
    '--btn-hover':'#e8d8f4','--tab-active-bg':'#d0b8e8','--tab-active-bd':'#7a4aaa',
  },
};
function applyTheme(name) {
  var theme = THEMES[name] || THEMES.light;
  var root = document.documentElement;
  Object.keys(theme).forEach(function(prop) { root.style.setProperty(prop, theme[prop]); });
  try { localStorage.setItem('dnd.theme', name); } catch {}
}

// ---- WebGL 3D Dice Renderer ----
var diceRenderer = null; // module-level ref, initialized in buildUI()
var DiceRenderer = (function () {
  // --- mat4 (column-major Float32Array[16]) ---
  function mat4Create() { var m = new Float32Array(16); m[0]=m[5]=m[10]=m[15]=1; return m; }
  function mat4Perspective(fov, aspect, near, far) {
    var f=1/Math.tan(fov/2), nf=1/(near-far), m=new Float32Array(16);
    m[0]=f/aspect; m[5]=f; m[10]=(far+near)*nf; m[11]=-1; m[14]=2*far*near*nf; return m;
  }
  function mat4Mul(a, b) {
    var o=new Float32Array(16);
    for(var i=0;i<4;i++) for(var j=0;j<4;j++)
      o[j*4+i]=a[i]*b[j*4]+a[4+i]*b[j*4+1]+a[8+i]*b[j*4+2]+a[12+i]*b[j*4+3];
    return o;
  }
  function mat4InvTranspose(m) {
    var o=new Float32Array(16);
    o[0]=m[0];o[1]=m[4];o[2]=m[8]; o[4]=m[1];o[5]=m[5];o[6]=m[9];
    o[8]=m[2];o[9]=m[6];o[10]=m[10]; o[15]=1; return o;
  }

  // --- Quaternion math ---
  function qId() { return [0,0,0,1]; }
  function qFromAxisAngle(ax,ay,az) {
    var ang=Math.sqrt(ax*ax+ay*ay+az*az);
    if(ang<0.00001) return qId();
    var ha=ang/2, s=Math.sin(ha)/ang;
    return [ax*s, ay*s, az*s, Math.cos(ha)];
  }
  function qMul(a,b) {
    return [
      a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],
      a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],
      a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],
      a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]
    ];
  }
  function qNormalize(q) {
    var l=Math.sqrt(q[0]*q[0]+q[1]*q[1]+q[2]*q[2]+q[3]*q[3]);
    return l<0.00001 ? qId() : [q[0]/l,q[1]/l,q[2]/l,q[3]/l];
  }
  function qToMat4(q) {
    var x=q[0],y=q[1],z=q[2],w=q[3], m=new Float32Array(16);
    m[0]=1-2*(y*y+z*z); m[1]=2*(x*y+w*z);   m[2]=2*(x*z-w*y);
    m[4]=2*(x*y-w*z);   m[5]=1-2*(x*x+z*z); m[6]=2*(y*z+w*x);
    m[8]=2*(x*z+w*y);   m[9]=2*(y*z-w*x);   m[10]=1-2*(x*x+y*y);
    m[15]=1; return m;
  }

  function compileShader(gl, type, src) {
    var s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn('[dice]',gl.getShaderInfoLog(s));gl.deleteShader(s);return null;}
    return s;
  }
  function linkProg(gl,vs,fs) {
    var p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);
    return gl.getProgramParameter(p,gl.LINK_STATUS)?p:null;
  }

  // --- Parameterized number texture atlas ---
  function createNumberTexture(gl, faceCount, cols, rows) {
    var cell=128, c=document.createElement('canvas');
    c.width=cols*cell; c.height=rows*cell;
    var ctx=c.getContext('2d');
    ctx.fillStyle='#1e1840'; ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle='#e8d8ff'; ctx.textAlign='center'; ctx.textBaseline='middle';
    for(var i=0;i<faceCount;i++){
      var col=i%cols, row=Math.floor(i/cols);
      var cx=(col+0.5)*cell, cy=(row+0.5)*cell, num=String(i+1);
      ctx.font='bold '+(num.length>1?40:50)+'px "Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif';
      ctx.fillText(num,cx,cy);
      if(num==='6'||num==='9'){var tw=ctx.measureText(num).width;ctx.fillRect(cx-tw/2,cy+24,tw,3);}
    }
    var tex=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    return tex;
  }

  // --- Generic mesh builder: takes verts + polygonal faces, triangulates and maps UVs ---
  function buildMesh(gl, data) {
    var verts=data.vertices, faces=data.faces, cols=data.cols, rows=data.rows;
    var positions=[], normals=[], uvs=[], faceNormals=[], edgeVerts=[];

    faces.forEach(function(face, fi) {
      // Compute face normal from first 3 verts
      var v0=verts[face[0]], v1=verts[face[1]], v2=verts[face[2]];
      var ex=[v1[0]-v0[0],v1[1]-v0[1],v1[2]-v0[2]];
      var ey=[v2[0]-v0[0],v2[1]-v0[1],v2[2]-v0[2]];
      var nx=ex[1]*ey[2]-ex[2]*ey[1];
      var ny=ex[2]*ey[0]-ex[0]*ey[2];
      var nz=ex[0]*ey[1]-ex[1]*ey[0];
      var nl=Math.sqrt(nx*nx+ny*ny+nz*nz); nx/=nl; ny/=nl; nz/=nl;
      // Centroid for outward check
      var cX=0, cY=0, cZ=0;
      for(var k=0;k<face.length;k++){var v=verts[face[k]]; cX+=v[0]; cY+=v[1]; cZ+=v[2];}
      cX/=face.length; cY/=face.length; cZ/=face.length;
      // Flip normal only — preserve face vertex order so v0 (chosen per die type as
      // a meaningful anchor, e.g. kite apex) continues to define the V axis direction.
      if(nx*cX+ny*cY+nz*cZ < 0){ nx=-nx; ny=-ny; nz=-nz; }
      faceNormals.push([nx,ny,nz]);

      // UV: project face vertices onto face plane using a basis oriented
      // so the number aligns with the face's natural axis.
      // V axis = centroid → v0 (projected to face plane).
      //   For d10 kites, v0 is the apex, so V axis = long axis of the kite.
      // U axis = V × normal: points to viewer's right when looking at face from outside.
      var col=fi%cols, row=Math.floor(fi/cols);
      var cu=(col+0.5)/cols, cv=(row+0.5)/rows, cw=1/cols, ch=1/rows, r=0.44;

      var vp=verts[face[0]];
      var Vx=vp[0]-cX, Vy=vp[1]-cY, Vz=vp[2]-cZ;
      var dN=Vx*nx+Vy*ny+Vz*nz;
      Vx-=dN*nx; Vy-=dN*ny; Vz-=dN*nz;
      var Vl=Math.sqrt(Vx*Vx+Vy*Vy+Vz*Vz);
      if(Vl<0.0001){ Vx=1; Vy=0; Vz=0; Vl=1; }
      Vx/=Vl; Vy/=Vl; Vz/=Vl;
      var Ux=Vy*nz-Vz*ny, Uy=Vz*nx-Vx*nz, Uz=Vx*ny-Vy*nx;

      // Project each vertex to (U, V) face-local coords
      var proj2d=[];
      var maxU=0, maxV=0;
      for(var k=0;k<face.length;k++){
        var v=verts[face[k]];
        var dx=v[0]-cX, dy=v[1]-cY, dz=v[2]-cZ;
        var u=dx*Ux+dy*Uy+dz*Uz;
        var vc=dx*Vx+dy*Vy+dz*Vz;
        proj2d.push([u, vc]);
        if(Math.abs(u)>maxU) maxU=Math.abs(u);
        if(Math.abs(vc)>maxV) maxV=Math.abs(vc);
      }
      // Isotropic texture sampling: atlas cells are square in PIXEL space (128×128)
      // but not in UV space when cols ≠ rows. To keep numbers un-distorted, pixel
      // distance per face-unit must match in both directions. Since 1 UV unit
      // horizontally = cols*cellSize pixels, and 1 UV unit vertically = rows*cellSize,
      // we need s_u * cols = s_v * rows.  Pick the largest scale that fits the
      // face polygon into r-fraction of the cell in both directions.
      var M=Math.max(maxU, maxV, 0.0001);
      var sU_axis = r/(cols*M);
      var sV_axis = r/(rows*M);

      var faceUVs=[];
      for(var k=0;k<face.length;k++){
        faceUVs.push([
          cu + proj2d[k][0]*sU_axis,   // face +U → atlas +U
          cv - proj2d[k][1]*sV_axis    // face +V (toward v0) → atlas -V (top of canvas)
        ]);
      }
      // Triangulate as fan from face[0]
      for(var t=1; t<face.length-1; t++) {
        var a=verts[face[0]], b=verts[face[t]], c=verts[face[t+1]];
        positions.push(a[0],a[1],a[2], b[0],b[1],b[2], c[0],c[1],c[2]);
        normals.push(nx,ny,nz, nx,ny,nz, nx,ny,nz);
        uvs.push(faceUVs[0][0],faceUVs[0][1],
                 faceUVs[t][0],faceUVs[t][1],
                 faceUVs[t+1][0],faceUVs[t+1][1]);
      }

      // Emit only real face-boundary edges (not internal triangulation diagonals)
      for(var k=0;k<face.length;k++){
        var va=verts[face[k]], vb=verts[face[(k+1)%face.length]];
        edgeVerts.push(va[0],va[1],va[2], vb[0],vb[1],vb[2]);
      }
    });

    var posBuf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    var normBuf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,normBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    var uvBuf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    var edgeBuf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,edgeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(edgeVerts), gl.STATIC_DRAW);

    var texture = createNumberTexture(gl, faces.length, cols, rows);

    return {
      posBuf: posBuf, normBuf: normBuf, uvBuf: uvBuf, edgeBuf: edgeBuf,
      vertexCount: positions.length/3,
      edgeVtxCount: edgeVerts.length/3,
      faceNormals: faceNormals,
      texture: texture
    };
  }

  // --- Die-type geometry data (normalized to unit circumradius) ---
  function dieData(type) {
    if(type==='d4') {
      var s=1/Math.sqrt(3);
      return {
        vertices:[[s,s,s],[s,-s,-s],[-s,s,-s],[-s,-s,s]],
        faces:[[0,1,2],[0,2,3],[0,3,1],[1,3,2]],
        cols:2, rows:2
      };
    }
    if(type==='d6') {
      var s=1/Math.sqrt(3);
      return {
        vertices:[[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],
                  [-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]],
        faces:[[0,1,2,3],[4,7,6,5],[0,3,7,4],[1,5,6,2],[0,4,5,1],[3,2,6,7]],
        cols:3, rows:2
      };
    }
    if(type==='d8') {
      return {
        vertices:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],
        faces:[[0,2,4],[0,4,3],[0,3,5],[0,5,2],
               [1,2,5],[1,5,3],[1,3,4],[1,4,2]],
        cols:4, rows:2
      };
    }
    if(type==='d10') {
      var verts=[[0,1,0]]; // top apex
      var ringR=0.95;
      var cosP=Math.cos(Math.PI/5);
      var ringY=(1-cosP)/(1+cosP); // ≈ 0.1056

      for(var k=0;k<5;k++){
        var a=(k/5)*Math.PI*2;
        verts.push([Math.cos(a)*ringR, ringY, Math.sin(a)*ringR]);
      }
      for(var k=0;k<5;k++){
        var a=(k/5)*Math.PI*2 + Math.PI/5;
        verts.push([Math.cos(a)*ringR, -ringY, Math.sin(a)*ringR]);
      }
      verts.push([0,-1,0]); // bottom apex

      var faces=[];
      for(var k=0;k<5;k++){
        faces.push([0, 1+k, 6+k, 1+((k+1)%5)]);
      }
      for(var k=0;k<5;k++){
        faces.push([11, 6+k, 1+((k+1)%5), 6+((k+1)%5)]);
      }
      return { vertices:verts, faces:faces, cols:5, rows:2 };
    }
    // if(type==='d10') {
    //   // Pentagonal trapezohedron: 2 apices + 2 staggered 5-rings
    //   var verts=[[0,1,0]]; // top apex (index 0)
    //   var ringR=0.95, ringY=0.35;
    //   for(var k=0;k<5;k++){
    //     var a=(k/5)*Math.PI*2;
    //     verts.push([Math.cos(a)*ringR, ringY, Math.sin(a)*ringR]); // upper 1-5
    //   }
    //   for(var k=0;k<5;k++){
    //     var a=(k/5)*Math.PI*2 + Math.PI/5;
    //     verts.push([Math.cos(a)*ringR, -ringY, Math.sin(a)*ringR]); // lower 6-10
    //   }
    //   verts.push([0,-1,0]); // bottom apex (index 11)
    //   var faces=[];
    //   // 5 upper kites meeting at top apex: top_apex, upper[k], lower[k], upper[k+1]
    //   for(var k=0;k<5;k++){
    //     faces.push([0, 1+k, 6+k, 1+((k+1)%5)]);
    //   }
    //   // 5 lower kites meeting at bottom apex: bottom_apex, lower[k], upper[k+1], lower[k+1]
    //   for(var k=0;k<5;k++){
    //     faces.push([11, 6+k, 1+((k+1)%5), 6+((k+1)%5)]);
    //   }
    //   return { vertices:verts, faces:faces, cols:5, rows:2 };
    // }
    if(type==='d12') {
      var phi=(1+Math.sqrt(5))/2, invPhi=1/phi, s=1/Math.sqrt(3);
      var verts=[
        [1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],
        [-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1],
        [0,invPhi,phi],[0,invPhi,-phi],[0,-invPhi,phi],[0,-invPhi,-phi],
        [invPhi,phi,0],[invPhi,-phi,0],[-invPhi,phi,0],[-invPhi,-phi,0],
        [phi,0,invPhi],[phi,0,-invPhi],[-phi,0,invPhi],[-phi,0,-invPhi]
      ].map(function(v){return [v[0]*s,v[1]*s,v[2]*s];});
      var faces=[
        [0,8,4,14,12],
        [0,12,1,17,16],
        [0,16,2,10,8],
        [1,12,14,5,9],
        [1,9,11,3,17],
        [2,16,17,3,13],
        [2,13,15,6,10],
        [3,11,7,15,13],
        [4,8,10,6,18],
        [4,18,19,5,14],
        [5,19,7,11,9],
        [6,15,7,19,18]
      ];
      return { vertices:verts, faces:faces, cols:4, rows:3 };
    }
    if(type==='d20') {
      var phi=(1+Math.sqrt(5))/2, len=Math.sqrt(1+phi*phi);
      var verts=[[-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],[0,-1,phi],[0,1,phi],
                 [0,-1,-phi],[0,1,-phi],[phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1]]
                 .map(function(v){return [v[0]/len,v[1]/len,v[2]/len];});
      var faces=[
        [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
        [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
        [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
        [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
      ];
      return { vertices:verts, faces:faces, cols:5, rows:4 };
    }
    return null;
  }

  // --- Top-down view matrix: camera at (0, H, 0) looking down ---
  function viewLookDown(height) {
    var m=new Float32Array(16);
    m[0]=1;
    m[4]=0; m[5]=0; m[6]=-1;
    m[8]=0; m[9]=1; m[10]=0;
    m[14]=-height;
    m[15]=1;
    return m;
  }

  function init(canvas) {
    var gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:true});
    if(!gl) return null;

    // Shaders
    var vsSrc='attribute vec3 aPos;attribute vec3 aNormal;attribute vec2 aUV;uniform mat4 uMVP;uniform mat4 uNormal;varying vec3 vNormal;varying vec2 vUV;void main(){vNormal=(uNormal*vec4(aNormal,0.0)).xyz;vUV=aUV;gl_Position=uMVP*vec4(aPos,1.0);}';
    var fsSrc='precision mediump float;varying vec3 vNormal;varying vec2 vUV;uniform vec3 uLightDir;uniform float uAlpha;uniform sampler2D uTex;void main(){float d=max(dot(normalize(vNormal),uLightDir),0.0);vec4 tc=texture2D(uTex,vUV);gl_FragColor=vec4(tc.rgb*(0.35+0.65*d),uAlpha);}';
    var vs=compileShader(gl,gl.VERTEX_SHADER,vsSrc),fs=compileShader(gl,gl.FRAGMENT_SHADER,fsSrc);
    if(!vs||!fs) return null;
    var prog=linkProg(gl,vs,fs); if(!prog) return null;
    var aPos=gl.getAttribLocation(prog,'aPos'),aNormal=gl.getAttribLocation(prog,'aNormal'),aUV=gl.getAttribLocation(prog,'aUV');
    var uMVP=gl.getUniformLocation(prog,'uMVP'),uNormal=gl.getUniformLocation(prog,'uNormal'),
        uLightDir=gl.getUniformLocation(prog,'uLightDir'),uAlpha=gl.getUniformLocation(prog,'uAlpha'),uTex=gl.getUniformLocation(prog,'uTex');

    var evs=compileShader(gl,gl.VERTEX_SHADER,'attribute vec3 aPos;uniform mat4 uMVP;void main(){gl_Position=uMVP*vec4(aPos,1.0);}');
    var efs=compileShader(gl,gl.FRAGMENT_SHADER,'precision mediump float;uniform float uAlpha;uniform vec3 uC;void main(){gl_FragColor=vec4(uC,uAlpha);}');
    var eProg=linkProg(gl,evs,efs);
    var eaPos=gl.getAttribLocation(eProg,'aPos'),euMVP=gl.getUniformLocation(eProg,'uMVP'),
        euAlpha=gl.getUniformLocation(eProg,'uAlpha'),euC=gl.getUniformLocation(eProg,'uC');

    // Build all 6 die types once
    var dieTypes = {
      d4:  buildMesh(gl, dieData('d4')),
      d6:  buildMesh(gl, dieData('d6')),
      d8:  buildMesh(gl, dieData('d8')),
      d10: buildMesh(gl, dieData('d10')),
      d12: buildMesh(gl, dieData('d12')),
      d20: buildMesh(gl, dieData('d20')),
    };

    // --- State ---
    var IDLE=0,PHYSICS=1,HOLD=2,FADEOUT=3;
    var phase=IDLE, lastT=0;
    var FLOOR_Y=0, CAM_HEIGHT=16, DIE_RADIUS=0.85;
    var holdStart, holdDur=1.5, fadeStart, fadeDur=0.5;
    var onResult=null;
    var dice=[]; // array of active dice

    function resize(){
      var dpr=window.devicePixelRatio||1;
      canvas.width=canvas.clientWidth*dpr; canvas.height=canvas.clientHeight*dpr;
      gl.viewport(0,0,canvas.width,canvas.height);
    }

    // Find face pointing most toward -Y (toward camera looking down)
    function topFace(q, faceNormals) {
      var rm=qToMat4(q);
      var best=0, bestDot=2;
      for(var i=0;i<faceNormals.length;i++){
        var n=faceNormals[i];
        var ry=rm[1]*n[0]+rm[5]*n[1]+rm[9]*n[2];
        if(ry<bestDot){bestDot=ry; best=i;}
      }
      return best;
    }

    function stepPhysics(d, dt) {
      var mesh = dieTypes[d.type];
      var linFric=Math.pow(0.965, dt*60);
      d.velX*=linFric; d.velZ*=linFric;
      d.posX+=d.velX*dt; d.posZ+=d.velZ*dt;

      var linSpeed=Math.sqrt(d.velX*d.velX+d.velZ*d.velZ);

      if(linSpeed>0.01){
        var angSpeed=linSpeed/DIE_RADIUS;
        var rax=d.velZ/linSpeed, raz=-d.velX/linSpeed;
        d.wobblePhase+=dt*linSpeed*3;
        var wobbleAmt=Math.min(linSpeed*linSpeed*0.02, 0.6);
        var wx=Math.sin(d.wobblePhase*2.3)*wobbleAmt;
        var wz=Math.cos(d.wobblePhase*1.7)*wobbleAmt;
        var dq=qFromAxisAngle((rax*angSpeed+wx)*dt, 0, (raz*angSpeed+wz)*dt);
        d.qRot=qNormalize(qMul(dq, d.qRot));
      }

      // Gravity settle: rotate bottom face toward -Y as die slows
      if(linSpeed<3.0){
        var strength=(1-linSpeed/3.0)*6*dt;
        var rm=qToMat4(d.qRot);
        var bestI=0, bestDot=2;
        for(var gi=0;gi<mesh.faceNormals.length;gi++){
          var gn=mesh.faceNormals[gi];
          var gy=rm[1]*gn[0]+rm[5]*gn[1]+rm[9]*gn[2];
          if(gy<bestDot){bestDot=gy; bestI=gi;}
        }
        var bn=mesh.faceNormals[bestI];
        var rnx=rm[0]*bn[0]+rm[4]*bn[1]+rm[8]*bn[2];
        var rny=rm[1]*bn[0]+rm[5]*bn[1]+rm[9]*bn[2];
        var rnz=rm[2]*bn[0]+rm[6]*bn[1]+rm[10]*bn[2];
        var cax=rnz, caz=-rnx;
        var cl=Math.sqrt(cax*cax+caz*caz);
        if(cl>0.001){
          cax/=cl; caz/=cl;
          var cAngle=Math.acos(Math.max(-1,Math.min(1,-rny)));
          var corr=Math.min(cAngle, strength);
          var cq=qFromAxisAngle(cax*corr, 0, caz*corr);
          d.qRot=qNormalize(qMul(cq, d.qRot));
        }
      }

      if(linSpeed<0.15){
        d.result = topFace(d.qRot, mesh.faceNormals) + 1;
        d.finalQ = qNormalize(d.qRot.slice());
        d.finalX = d.posX; d.finalZ = d.posZ;
        d.settled = true;
      }
    }

    function drawDie(d, alpha) {
      var mesh = dieTypes[d.type];
      var q = d.settled ? d.finalQ : d.qRot;
      var px = d.settled ? d.finalX : d.posX;
      var pz = d.settled ? d.finalZ : d.posZ;

      var rotMat=qToMat4(q);
      rotMat[12]=px; rotMat[13]=FLOOR_Y; rotMat[14]=pz;

      var proj=mat4Perspective(Math.PI/4, canvas.width/canvas.height, 0.1, 100);
      var view=viewLookDown(CAM_HEIGHT);
      var mvp=mat4Mul(proj, mat4Mul(view, rotMat));
      var normalMat=mat4InvTranspose(rotMat);

      gl.useProgram(prog);
      gl.uniformMatrix4fv(uMVP,false,mvp);
      gl.uniformMatrix4fv(uNormal,false,normalMat);
      gl.uniform3f(uLightDir, 0.2,0.95,0.2);
      gl.uniform1f(uAlpha, alpha);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, mesh.texture); gl.uniform1i(uTex,0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.posBuf);
      gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normBuf);
      gl.enableVertexAttribArray(aNormal); gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuf);
      gl.enableVertexAttribArray(aUV); gl.vertexAttribPointer(aUV,2,gl.FLOAT,false,0,0);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
      gl.disableVertexAttribArray(aUV);

      gl.useProgram(eProg);
      gl.uniformMatrix4fv(euMVP,false,mvp);
      gl.uniform1f(euAlpha, alpha*0.4);
      gl.uniform3f(euC, 0.55,0.45,0.8);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.edgeBuf);
      gl.enableVertexAttribArray(eaPos); gl.vertexAttribPointer(eaPos,3,gl.FLOAT,false,0,0);
      gl.drawArrays(gl.LINES, 0, mesh.edgeVtxCount);
      gl.disableVertexAttribArray(eaPos);
    }

    function render(t) {
      if(phase===IDLE) return;
      requestAnimationFrame(render);
      var dt=Math.min((t-lastT)/1000, 0.05);
      lastT=t;
      resize();
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

      if(phase===PHYSICS) {
        var allSettled = true;
        dice.forEach(function(d){
          if(!d.settled) stepPhysics(d, dt);
          if(!d.settled) allSettled = false;
        });
        // Pair-wise collision resolution (2D, horizontal plane)
        var minDist = DIE_RADIUS * 1.8; // effective collision radius per die (~0.9)
        for(var i=0; i<dice.length; i++) {
          for(var j=i+1; j<dice.length; j++) {
            var a=dice[i], b=dice[j];
            var dx=a.posX-b.posX, dz=a.posZ-b.posZ;
            var dist=Math.sqrt(dx*dx+dz*dz);
            if(dist<minDist && dist>0.0001){
              var nx=dx/dist, nz=dz/dist;
              // Separate along normal (each moves half the overlap)
              var overlap=minDist-dist;
              var push=overlap*0.5;
              if(!a.settled){ a.posX+=nx*push; a.posZ+=nz*push; }
              if(!b.settled){ b.posX-=nx*push; b.posZ-=nz*push; }
              // Exchange normal-component velocity (equal mass elastic bounce with damping)
              var vA=a.velX*nx+a.velZ*nz;
              var vB=b.velX*nx+b.velZ*nz;
              if(vA-vB<0){ // only if approaching
                var restitution=0.8;
                var delta=(vB-vA)*restitution;
                if(!a.settled){ a.velX+=delta*nx; a.velZ+=delta*nz; }
                if(!b.settled){ b.velX-=delta*nx; b.velZ-=delta*nz; }
                // Collision wakes a settled die slightly? skip for simplicity
              }
            }
          }
        }
        dice.forEach(function(d){ drawDie(d, 1); });
        if(allSettled){
          phase = HOLD; holdStart = t;
          if(onResult){
            var total=0, breakdown={};
            dice.forEach(function(d){
              if(!breakdown[d.type]) breakdown[d.type]=[];
              breakdown[d.type].push(d.result);
              total += d.result;
            });
            onResult(total, breakdown);
          }
        }
      }
      else if(phase===HOLD) {
        dice.forEach(function(d){ drawDie(d, 1); });
        if((t-holdStart)/1000 >= holdDur){ phase=FADEOUT; fadeStart=t; }
      }
      else if(phase===FADEOUT) {
        var alpha = Math.max(0, 1-(t-fadeStart)/1000/fadeDur);
        dice.forEach(function(d){ drawDie(d, alpha); });
        if(alpha<=0){ phase=IDLE; canvas.style.display='none'; }
      }
    }

    return {
      roll: function(callback, counts) {
        onResult = callback || null;
        counts = counts || { d20: 1 };

        // Flatten counts into an array of die type strings
        var items = [];
        ['d4','d6','d8','d10','d12','d20'].forEach(function(type){
          var n = (counts[type]|0);
          for(var i=0;i<n;i++) items.push(type);
        });
        if(items.length===0) return;

        var N = items.length;
        // Ring radius grows with number of dice to avoid crowding
        var ringR = 5 + Math.min(3, (N-1)*0.4);

        dice = items.map(function(type, i){
          var angle = (i/N)*Math.PI*2 + (Math.random()-0.5)*0.3;
          var dist = ringR + (Math.random()-0.5)*1.0;
          var posX = Math.cos(angle)*dist;
          var posZ = Math.sin(angle)*dist;
          var speed = 16 + Math.random()*6;
          // direction toward center ± 60°
          var baseX = -posX/dist, baseZ = -posZ/dist;
          var offsetAngle = (Math.random()-0.5)*(Math.PI*2/3);
          var cs=Math.cos(offsetAngle), sn=Math.sin(offsetAngle);
          var dirX = baseX*cs - baseZ*sn;
          var dirZ = baseX*sn + baseZ*cs;
          return {
            type: type,
            posX: posX, posZ: posZ,
            velX: dirX*speed, velZ: dirZ*speed,
            qRot: qNormalize(qFromAxisAngle(
              (Math.random()-0.5)*6, (Math.random()-0.5)*6, (Math.random()-0.5)*6)),
            wobblePhase: Math.random()*10,
            settled: false,
            result: 0
          };
        });

        phase = PHYSICS;
        canvas.style.display = 'block';
        lastT = performance.now();
        requestAnimationFrame(render);
      }
    };
  }

  return { init: init };
})();

// ---- Types ----
// Ensure we always have a full record for all skills
function completeSkills(partial) {
    var _a;
    var out = {};
    for (var _i = 0, SKILLS_1 = SKILLS; _i < SKILLS_1.length; _i++) {
        var sk = SKILLS_1[_i];
        out[sk] = ((_a = partial === null || partial === void 0 ? void 0 : partial[sk]) !== null && _a !== void 0 ? _a : 'none');
    }
    return out;
}
// (optional) ensure full abilities too, if you accept partials
function completeAbilities(partial) {
    var _a, _b, _c, _d, _e, _f;
    var base = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
    return {
        STR: (_a = partial === null || partial === void 0 ? void 0 : partial.STR) !== null && _a !== void 0 ? _a : base.STR,
        DEX: (_b = partial === null || partial === void 0 ? void 0 : partial.DEX) !== null && _b !== void 0 ? _b : base.DEX,
        CON: (_c = partial === null || partial === void 0 ? void 0 : partial.CON) !== null && _c !== void 0 ? _c : base.CON,
        INT: (_d = partial === null || partial === void 0 ? void 0 : partial.INT) !== null && _d !== void 0 ? _d : base.INT,
        WIS: (_e = partial === null || partial === void 0 ? void 0 : partial.WIS) !== null && _e !== void 0 ? _e : base.WIS,
        CHA: (_f = partial === null || partial === void 0 ? void 0 : partial.CHA) !== null && _f !== void 0 ? _f : base.CHA,
    };
}
// ---- Constants ----
var SKILL_TO_ABILITY = {
    'Acrobatics': 'DEX',
    'Animal Handling': 'WIS',
    'Arcana': 'INT',
    'Athletics': 'STR',
    'Deception': 'CHA',
    'History': 'INT',
    'Insight': 'WIS',
    'Intimidation': 'CHA',
    'Investigation': 'INT',
    'Medicine': 'WIS',
    'Nature': 'INT',
    'Perception': 'WIS',
    'Performance': 'CHA',
    'Persuasion': 'CHA',
    'Religion': 'INT',
    'Sleight of Hand': 'DEX',
    'Stealth': 'DEX',
    'Survival': 'WIS',
};
var ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
var SKILLS = Object.keys(SKILL_TO_ABILITY);
// central accessor (no redeclare)
function getApi() {
    var _a;
    try {
        var w = (_a = globalThis.webviewApi) !== null && _a !== void 0 ? _a : window.webviewApi;
        if (w && typeof w.postMessage === 'function' && typeof w.onMessage === 'function')
            return w;
    }
    catch (_b) { }
    return null;
}
// optional small wait helper
function waitForApi() {
    return __awaiter(this, arguments, void 0, function (ms) {
        var t0, api_1;
        if (ms === void 0) { ms = 1200; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t0 = Date.now();
                    _a.label = 1;
                case 1:
                    api_1 = getApi();
                    if (api_1)
                        return [2 /*return*/, api_1];
                    if (Date.now() - t0 > ms)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 50); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ---- Utilities ----
var clamp = function (n, min, max) { return Math.max(min, Math.min(max, n)); };
var int = function (v, d) {
    if (d === void 0) { d = 0; }
    var n = parseInt(String(v), 10);
    return Number.isFinite(n) ? n : d;
};
// ---- 5e data helper (panel-local, offline-first via bundled JSON) ----
function cacheGet(key, maxAgeMs) {
    try {
        var raw = localStorage.getItem(key);
        if (!raw)
            return null;
        var obj = JSON.parse(raw);
        if (obj && obj.t && (Date.now() - obj.t) <= maxAgeMs)
            return obj.v;
    }
    catch (_a) { }
    return null;
}
function cacheSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value }));
    }
    catch (_a) { }
}
function abilityIndexFor(a) {
    // 'STR'|'DEX'|'CON'|'INT'|'WIS'|'CHA' -> 'str' ..
    return String(a || '').toLowerCase();
}
function abilityCacheKey(a) { return "dnd.api.ability." + abilityIndexFor(a); }
var abilitiesDataPromise = null; // lazy-loaded JSON from src/dnd-resources
function loadLocalAbilities() {
    if (!abilitiesDataPromise) {
        abilitiesDataPromise = fetch('dnd-resources/5e-SRD-Ability-Scores.json').then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
    }
    return abilitiesDataPromise;
}
function getAbilityTooltipText(a) {
    return __awaiter(this, void 0, void 0, function () {
        var key, cached;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = abilityCacheKey(a);
                    cached = cacheGet(key, 1000 * 60 * 60 * 24 * 30);
                    if (cached)
                        return [2 /*return*/, cached];
                    return [4 /*yield*/, loadLocalAbilities()];
                case 1: return [2 /*return*/, (_a.sent()).then(function (arr) {
                        try {
                            var idx = abilityIndexFor(a);
                            var item = Array.isArray(arr) ? arr.find(function (x) { return (x === null || x === void 0 ? void 0 : x.index) === idx; }) : null;
                            if (!item)
                                return null;
                            var name = item.full_name || item.name || a;
                            var desc = Array.isArray(item.desc) ? item.desc.join('\n\n') : '';
                            var text = (name ? name + "\n\n" : '') + desc;
                            cacheSet(key, text);
                            return text;
                        }
                        catch (_a) {
                            return null;
                        }
                    })];
            }
        });
    });
}
function attachAbilityTooltip(labelEl, a) {
    return __awaiter(this, void 0, void 0, function () {
        var lblTitle, inputEl, apply;
        return __generator(this, function (_a) {
            lblTitle = labelEl.querySelector('.lblt') || labelEl;
            inputEl = labelEl.querySelector('input');
            apply = function (text) {
                if (!text)
                    return;
                // Set native title so it shows on hover
                lblTitle.setAttribute('title', text);
                // Also set on the input so hovering the textbox shows it too
                if (inputEl)
                    inputEl.setAttribute('title', text);
            };
            // Try cached immediately
            apply(cacheGet(abilityCacheKey(a), 1000 * 60 * 60 * 24 * 30));
            // Fetch in background and apply when ready
            getAbilityTooltipText(a).then(apply);
            // Also lazy-fetch on first hover if still not set
            labelEl.addEventListener('mouseenter', function () {
                if (!lblTitle.getAttribute('title'))
                    getAbilityTooltipText(a).then(apply);
            }, { once: false });
            return [2 /*return*/];
        });
    });
}
function abilityMod(score) {
    return Math.floor((score - 10) / 2);
}
function proficiencyFromLevel(level) {
    if (level >= 17)
        return 6;
    if (level >= 13)
        return 5;
    if (level >= 9)
        return 4;
    if (level >= 5)
        return 3;
    return 2;
}
function computeDerived(ch) {
    var mods = ABILITIES.reduce(function (acc, a) { return (acc[a] = abilityMod(ch.abilities[a]), acc); }, {});
    var pb = proficiencyFromLevel(ch.level || 1);
    var savingThrows = ABILITIES.reduce(function (acc, a) {
        var _a;
        var base = mods[a];
        var add = ((_a = ch.savingThrowsProficiencies) === null || _a === void 0 ? void 0 : _a[a]) ? pb : 0;
        acc[a] = base + add;
        return acc;
    }, {});
    var skills = SKILLS.reduce(function (acc, sk) {
        var _a;
        var abil = SKILL_TO_ABILITY[sk];
        var base = mods[abil];
        var prof = ((_a = ch.skillsProficiencies) === null || _a === void 0 ? void 0 : _a[sk]) || 'none';
        var add = prof === 'prof' ? pb : prof === 'expert' ? pb * 2 : 0;
        acc[sk] = base + add;
        return acc;
    }, {});
    const sc = ch.spellcasting || {};
    const spellAbil = (sc.ability && ABILITIES.includes(sc.ability)) ? sc.ability : 'INT';
    const spellMod = abilityMod(ch.abilities[spellAbil]);
    const spellSaveDC  = 8 + spellMod + pb + (sc.miscSaveDC || 0);
    const spellAtkMod  =      spellMod + pb + (sc.miscAttackMod || 0);
    var passivePerception = 10 + skills['Perception'];
    var initiative = mods.DEX;
    return { mods, proficiencyBonus: pb, skills, savingThrows, passivePerception, initiative,
            spellSaveDC, spellAtkMod, spellAbility: spellAbil };


    // return { mods: mods, proficiencyBonus: pb, skills: skills, savingThrows: savingThrows, passivePerception: passivePerception, initiative: initiative };
}
// Simple dice roller: "NdM+K" (N, K optional)
function rollExpr(expr) {
    var re = /^\s*(?:(-?\d*)\s*)?d\s*(\d+)\s*([+\-]\s*\d+)?\s*$/i; // e.g. "d20", "2d6+3", "-1d4-1"
    var plainInt = /^\s*([+\-]?\d+)\s*$/;
    expr = expr.trim();
    if (plainInt.test(expr)) {
        var total_1 = parseInt(expr, 10);
        return { total: total_1, detail: "".concat(total_1) };
    }
    var m = re.exec(expr);
    if (!m)
        return { total: NaN, detail: 'Invalid roll' };
    var nStr = m[1], mStr = m[2], kStr = m[3];
    var n = nStr ? parseInt(nStr, 10) : 1;
    var faces = parseInt(mStr, 10);
    var k = kStr ? parseInt(kStr.replace(/\s+/g, ''), 10) : 0;
    var count = Math.max(1, Math.abs(n));
    var rolls = [];
    for (var i = 0; i < count; i++)
        rolls.push(1 + Math.floor(Math.random() * faces));
    var subtotal = rolls.reduce(function (a, b) { return a + b; }, 0);
    subtotal = n < 0 ? -subtotal : subtotal;
    var total = subtotal + k;
    var sign = k >= 0 ? "+".concat(k) : "".concat(k);
    return { total: total, detail: "".concat(n, "d").concat(faces).concat(k ? sign : '', " = [").concat(rolls.join(', '), "] ").concat(n < 0 ? '=> negate ' : '').concat(subtotal).concat(k ? " ".concat(sign, " = ").concat(total) : '') };
}

// Roll composite damage like "2d6+1d4+3" or "d8+2" (any number of dice terms + integer modifiers)
// Returns: { total, detail, expr, exprForHost }
// - expr         : normalized internal form, may begin with '+'
// - exprForHost  : ONLY set when the expression is a simple NdM(+|-)K your host likely accepts
function rollCompositeDamage(expr) {
  var raw = String(expr || '0').replace(/\s+/g, '');
  if (!raw) raw = '0';

  // Keep a copy without a leading '+' for host, if we end up needing it
  var rawNoLeading = raw.replace(/^\+/, '');

  // Ensure our internal parse starts with a sign, to make tokenization easier
  var parseStr = /^[+\-]/.test(raw) ? raw : ('+' + raw);

  // Tokenize into signed terms: +<NdM> | -<NdM> | +<int> | -<int>
  var tokens = [], m;
  var re = /([+\-])(\d*d\d+|\d+)/ig;
  while ((m = re.exec(parseStr)) !== null) {
    tokens.push({ sign: m[1] === '-' ? -1 : 1, term: m[2] });
  }

  var total = 0, parts = [];
  tokens.forEach(function (tok) {
    var t = tok.term.toLowerCase();
    if (t.includes('d')) {
      var mm = /^(\d*)d(\d+)$/.exec(t);
      if (!mm) return;
      var n = mm[1] ? parseInt(mm[1], 10) : 1;
      var faces = parseInt(mm[2], 10);
      n = Math.max(1, n);
      var rolls = [];
      for (var i = 0; i < n; i++) rolls.push(1 + Math.floor(Math.random() * faces));
      var subtotal = rolls.reduce((a,b)=>a+b,0) * tok.sign;
      total += subtotal;
      parts.push(`${tok.sign<0?'-':'+'}${n}d${faces}[${rolls.join(',')}]${tok.sign<0?'(neg)':''}`);
    } else {
      var k = parseInt(t, 10);
      if (!Number.isFinite(k)) k = 0;
      k *= tok.sign;
      total += k;
      parts.push(`${tok.sign<0?'-':'+'}${Math.abs(k)}`);
    }
  });

  var detail = parts.join(' ').replace(/^\+/, '');
  var normalizedExpr = parseStr; // may start with '+'

  // Heuristic: provide exprForHost only for simple NdM(+|-)K (or just NdM)
  // Examples that pass: "2d8", "2d8+2", "d6-1", "+2d8+2" (we’ll strip leading '+')
  var simpleHostRe = /^\+?\d*d\d+(?:[+\-]\d+)?$/i;
  var exprForHost = null;
  if (simpleHostRe.test(normalizedExpr)) {
    exprForHost = normalizedExpr.replace(/^\+/, ''); // strip leading '+' for host
  }

  return { total, detail, expr: normalizedExpr, exprForHost, raw: rawNoLeading };
}


// ---- Defaults / Persistence ----
var LOCAL_KEY = 'dnd.character.editor.v1';
function defaultCharacter() {
    var baseSkills = SKILLS.reduce(function (a, s) { return (a[s] = 'none', a); }, {});
    return {
        name: '',
        class: '',
        level: 1,
        race: '',
        background: '',
        alignment: '',
        abilities: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
        armorClass: 10,
        maxHP: 1,
        currentHP: 1,
        tempHP: 0,
        speed: '30 ft',
        savingThrowsProficiencies: {},
        skillsProficiencies: baseSkills,
        attacks: [],
        spells: [],            // <— NEW
        inventory: [],         // <— NEW
        notes: '',
        journal: [],
        spellcasting: {
        ability: 'NA',        // which ability drives spells
        miscSaveDC: 0,         // extra to DC (item, feat, etc.)
        miscAttackMod: 0,      // extra to attack mod
        cantripsKnown: 0,
        preparedSpells: 0,
        slots: {               // per-level totals/used
          1:{total:0, used:0}, 2:{total:0, used:0}, 3:{total:0, used:0},
          4:{total:0, used:0}, 5:{total:0, used:0}, 6:{total:0, used:0},
          7:{total:0, used:0}, 8:{total:0, used:0}, 9:{total:0, used:0},
  },
},
    };
}
function loadLocal() {
    try {
        var raw = localStorage.getItem(LOCAL_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    catch (_a) {
        return null;
    }
}
function saveLocal(ch) {
    try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(ch));
    }
    catch (_a) { }
}

// ---- Defaults / Persistence ----
var CACHE_KEY_PREFIX = 'dnd.character.editor.v1:';
var currentNoteId = null; // set when we receive {type:'data', noteId}

function cacheKeyFor(noteId) {
  return CACHE_KEY_PREFIX + (noteId || 'unknown');
}

// Per-note cache (used only as an optimization / offline fallback)
function loadCache(noteId) {
  if (!noteId) return null;
  try {
    const raw = localStorage.getItem(cacheKeyFor(noteId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveCache(noteId, character) {
  if (!noteId) return;
  try {
    localStorage.setItem(cacheKeyFor(noteId), JSON.stringify(character));
  } catch {}
}

// ---- UI State ----
var api = null;
var ch = defaultCharacter();
var derived = computeDerived(ch);
var statusTimer = null;
var isEditing = false;
function setStatus(msg) {
    var el = document.getElementById('status');
    if (!el) return;
    // Clear any pending timer and content
    if (statusTimer) window.clearTimeout(statusTimer);
    el.innerHTML = '';
    // Build dismissible status chip
    var text = h('span', {}, [String(msg || '')]);
    var close = h('button', { class: 'btn small statusClose', title: 'Dismiss' }, ['✕']);
    close.addEventListener('click', function () { el.innerHTML = ''; });
    var wrap = h('span', { class: 'chip', style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [text, close]);
    el.appendChild(wrap);
}
function update(next) {
    ch = __assign(__assign({}, ch), next);
    derived = computeDerived(ch);
    renderDynamic();
}
function updateDeep(path, value) {
    var _a;
    // path like "abilities.STR" or "skillsProficiencies.Perception"
    var parts = path.split('.');
    var last = parts.pop();
    var obj = ch;
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var p = parts_1[_i];
        obj[p] = (_a = obj[p]) !== null && _a !== void 0 ? _a : {};
        obj = obj[p];
    }
    obj[last] = value;
    derived = computeDerived(ch);
    renderDynamic();
}
// ---- DOM creation ----
function h(tag, attrs, children) {
    if (attrs === void 0) { attrs = {}; }
    if (children === void 0) { children = []; }
    var el = document.createElement(tag);
    for (var _i = 0, _a = Object.entries(attrs); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        if (k === 'class')
            el.className = v;
        else if (k === 'style' && typeof v === 'object')
            Object.assign(el.style, v);
        else if (k.startsWith('data-'))
            el.setAttribute(k, String(v));
        else if (k === 'for')
            el.setAttribute('for', String(v));
        else if (k === 'value')
            el.value = v;
        else if (k in el)
            el[k] = v;
        else
            el.setAttribute(k, String(v));
    }
    for (var _c = 0, children_1 = children; _c < children_1.length; _c++) {
        var c = children_1[_c];
        el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return el;
}
function labeledInput(label, id, value, onInput, type) {
    if (type === void 0) { type = 'text'; }
    var input = h('input', { id: id, type: type, value: value, class: 'inp' });
    input.addEventListener('input', function () { return onInput(input.value); });
    return h('label', { class: 'lbl' }, [
        h('div', { class: 'lblt' }, [label]),
        input,
    ]);
}
function labeledNumber(label, id, value, onInput, min, max) {
    var input = h('input', { id: id, type: 'number', value: value, class: 'inp' });
    if (min !== undefined)
        input.setAttribute('min', String(min));
    if (max !== undefined)
        input.setAttribute('max', String(max));
    input.addEventListener('input', function () { return onInput(int(input.value, value)); });
    return h('label', { class: 'lbl' }, [
        h('div', { class: 'lblt' }, [label]),
        input,
    ]);
}
function selectProf(initial, onChange) {
    var sel = h('select', { class: 'sel' }, [
        h('option', { value: 'none', selected: initial === 'none' }, ['—']),
        h('option', { value: 'prof', selected: initial === 'prof' }, ['●']),
        h('option', { value: 'expert', selected: initial === 'expert' }, ['◎']),
    ]);
    sel.addEventListener('change', function () { return onChange(sel.value); });
    return sel;
}
// ---- Build UI ----
// ---- Build UI ----
function buildUI() {
  var root = document.getElementById('root');
  if (!root) return;

  // Styles
  var style = document.createElement('style');
  style.textContent = `
    :root { --bd:#d0d4db; --tx:#101216; --mut:#5a6270; --bg:#ffffff; --chip:#f5f7fa; --card-bg:#ffffff; --btn-hover:#f9fafb; --tab-active-bg:#eef3ff; --tab-active-bd:#88aaff; --dot-on-bg:#222; --dot-on-tx:#fff; }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body { margin:0; background: var(--bg); color: var(--tx); font: 14px/1.35 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; overflow-y: auto; }
    #root { min-height: 100%; }
    .wrap { min-height: 100%; }
    .wrap { padding: 12px; }
    h2 { margin: 16px 0 8px; font-size: 16px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
    /* Unified tile grid */
    .tileGrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; align-items: start; }
    .card { border: 1px solid var(--bd); border-radius: 10px; padding: 10px; background: var(--card-bg); position: relative; }
    .card.drag-over-left   { box-shadow: inset 4px 0 0 #88aaff; }
    .card.drag-over-right  { box-shadow: inset -4px 0 0 #88aaff; }
    .card.drag-over-top    { box-shadow: inset 0 4px 0 #88aaff; }
    .card.drag-over-bottom { box-shadow: inset 0 -4px 0 #88aaff; }
    .drag-grip { cursor: grab; margin-right: 6px; opacity: 0.35; user-select: none; font-size: 14px; }
    .drag-grip:hover { opacity: 0.8; }
    .tile-resize-handle {
      position: absolute; right: 2px; bottom: 2px;
      width: 18px; height: 18px; line-height: 18px; text-align: center;
      cursor: nwse-resize; opacity: 0.3; font-size: 12px; user-select: none;
      color: var(--mut);
    }
    .tile-resize-handle:hover { opacity: 0.7; }
    .lbl { display:block; }
    .lblt { font-size: 11px; color: var(--mut); margin-bottom: 4px; }
    .inp, .sel, textarea { width: 100%; padding: 8px; border: 1px solid var(--bd); border-radius: 8px; background: var(--card-bg); color: var(--tx); }
    textarea { min-height: 80px; resize: vertical; }
    .row { display:flex; gap:8px; align-items:center; }
    .mut { color: var(--mut); }
    .chip { background: var(--chip); border:1px solid var(--bd); padding:6px 8px; border-radius: 8px; }
    .skills { display: grid; grid-template-columns: 1fr auto auto; gap: 6px 8px; align-items: center; }
    .skillHead { font-size: 12px; color:var(--mut); display: contents; }
    .btn { border:1px solid var(--bd); background:var(--card-bg); color:var(--tx); padding:8px 10px; border-radius: 8px; cursor:pointer; }
    .btn:hover { background:var(--btn-hover); }
    .btn.small { padding:4px 6px; font-size:12px; }
    .right { text-align: right; }
    .status { margin-left: 8px; color: var(--mut); }
    .attacks .hdr, .attacks .row {
        display: grid;
        grid-template-columns: 1.2fr 100px 100px 1fr 1fr max-content; /* Attack | Range | Hit/DC | Damage | Notes | ✕ */
        gap: 6px;
        align-items: center;
    }
    .attacks .hdr { color: var(--mut); font-size:12px; }
    .attack-roll-btn { white-space: nowrap; }

    /* Top bar (left: roll/load/save, right: tabs) */
    .topbar {
      position: sticky; top: 0; z-index: 10;
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 8px; padding-top: 8px; background: var(--bg);
    }
    .topbar .leftActions, .topbar .rightActions {
      display: flex; align-items: center; gap: 8px;
    }
    .tab.btn {} /* inherits .btn */
    .tab.btn.active { box-shadow: 0 1px 4px rgba(0,0,0,0.12); background:var(--tab-active-bg); border-color:var(--tab-active-bd); }

    /* Dice dropdown */
    .diceWrap { position: relative; display: inline-block; }
    .dice-dropdown {
      position: absolute; top: calc(100% + 4px); left: 0;
      min-width: 160px; background: var(--card-bg); border: 1px solid var(--bd);
      border-radius: 8px; padding: 4px; z-index: 20;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .dice-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 6px 10px; cursor: pointer; border-radius: 6px; user-select: none;
      font-family: "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
    }
    .dice-row:hover { background: var(--btn-hover); }
    .dice-count { font-weight: bold; color: var(--mut); min-width: 20px; text-align: right; }
    .dice-actions {
      display: flex; gap: 6px; padding: 6px 4px 4px 4px; margin-top: 4px;
      border-top: 1px solid var(--bd);
    }
    .dice-actions .btn { flex: 1; }
    .dice-roll { background: var(--tab-active-bg); border-color: var(--tab-active-bd); }

    /* Legacy rightCol no longer used */

    /* Keep skill prof selects compact and stable */
    .skills select, .skills .sel {
      width: 88px !important; min-width: 88px !important; max-width: 88px !important;
      flex: 0 0 88px; justify-self: start;
    }
    .skills { grid-template-columns: 1fr max-content max-content; }

    /* Saving throws compactness */
    .saving-throws-grid .row { gap: 6px; }
    .saving-throws-grid .mut { white-space: nowrap; }

    /* Tighten first card header spacing */
    .card h2:first-child { margin-top: 0; }
  `;
  style.textContent += `
  /* Abilities+Saves combined grid — columns set dynamically by applyLayout */
  .grid6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
  .grid6.cols-3 { grid-template-columns: repeat(3, 1fr); }
  .grid6.cols-2 { grid-template-columns: repeat(2, 1fr); }
  .grid6.cols-1 { grid-template-columns: 1fr; }
  .abilCol .lbl { margin-bottom: 6px; }
  .abilCol .row { justify-content: space-between; }
  .abilCol .row .mut { min-width: 42px; text-align: right; }

  /* Attacks table: header + rows share the same columns */
  .attacks .header,
  .attacks .rowGrid {
    display: grid;
    grid-template-columns: 1.2fr 100px 100px 1fr 1fr max-content; /* Attack | Range | Hit/DC | Damage | Notes | ✕ */
    gap: 6px;
    align-items: center;
  }
  .attacks .header {
    color: var(--mut);
    font-size: 12px;
    margin-bottom: 6px;
  }

  /* Input+button inline for Hit/DC and Damage cells */
  .cell-inline { display: flex; align-items: center; gap: 6px; }

  /* Smaller dice buttons */
  .attack-roll-btn {
    padding: 2px 6px;
    font-size: 12px;
    line-height: 1;
    border-radius: 6px;
  }
`;
// Replace your previous Skills CSS block with this:
style.textContent += `
  /* Skills container should NOT be a grid */
  .skillsTable { display: block; }

  /* Header and each row share the same 3-column grid */
  .skillsHeader,
  .skillRow {
    display: grid;
    grid-template-columns: 1fr max-content max-content; /* Skill | Total | Prof */
    gap: 6px 8px;
    align-items: center;
  }

  .skillsHeader {
    color: var(--mut);
    font-size: 12px;
    margin-bottom: 6px;
  }

  .skillRow .right { text-align: right; }

  .skillTotalWrap {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-end;
  }

  /* Keep the small dropdowns compact */
  .skillsTable select,
  .skillsTable .sel {
    width: 88px !important; min-width: 88px !important; max-width: 88px !important;
    flex: 0 0 88px; justify-self: start;
  }
`;
style.textContent += `
  /* Spells table mirrors Attacks */
  .spells .header,
  .spells .rowGrid {
    display: grid;
    grid-template-columns: 1.2fr 100px 100px 1fr 1fr max-content; /* Spell | Range | Hit/DC | Damage | Notes | ✕ */
    gap: 6px;
    align-items: center;
  }
  .spells .header { color: var(--mut); font-size: 12px; margin-bottom: 6px; }

  /* Inventory table */
  .inventory .header {
    display: grid;
    grid-template-columns: 1.2fr 120px max-content; /* Name | Value | ✕ */
    gap: 6px;
    align-items: center;
  }
  .inventory .header { color: var(--mut); font-size: 12px; margin-bottom: 6px; }
  
  .inventory .itemRow {
    border: 1px solid var(--bd);
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 8px;
    background: var(--card-bg);
  }
  
  .inventory .itemTopRow {
    display: grid;
    grid-template-columns: 1.2fr 120px max-content; /* Name | Value | ✕ */
    gap: 6px;
    align-items: center;
    margin-bottom: 6px;
  }
  
  .inventory .itemDescription {
    width: 100%;
    margin-top: 4px;
  }
  
  .inventory .itemDescription textarea {
    min-height: 60px;
    resize: vertical;
  }

  /* Journal entries */
  .journal .journalEntry {
    border: 1px solid var(--bd);
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 8px;
    background: var(--card-bg);
  }
  .journal .journalEntryHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .journal .journalEntryBody textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

style.textContent += `
.spellcasting { display: grid; grid-template-columns: 1fr; gap: 10px; }
.spellcasting .grid { display: grid; grid-template-columns: 60px 80px 80px 1fr; gap: 6px; align-items: center; }
.spellcasting .hdr { color: var(--mut); font-size: 12px; }
.slotDots { display:flex; flex-wrap: wrap; gap: 4px; }
.dot { width: 16px; height: 16px; border-radius: 50%; border: 1px solid var(--bd); display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:10px; user-select:none; }
.dot.on  { background:var(--dot-on-bg); color:var(--dot-on-tx); }
.dot.off { background:var(--card-bg); }
.inline { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
`;

style.textContent += `
.spellcasting { display: grid; grid-template-columns: 1fr; gap: 10px; }
.spellcasting .grid { display: grid; grid-template-columns: 60px 80px 80px 1fr; gap: 6px; align-items: center; }
.spellcasting .hdr { color: var(--mut); font-size: 12px; }
.slotDots { display:flex; flex-wrap: wrap; gap: 4px; }
.dot { width: 16px; height: 16px; border-radius: 50%; border: 1px solid var(--bd); display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:10px; user-select:none; }
.dot.on  { background:var(--dot-on-bg); color:var(--dot-on-tx); }
.dot.off { background:var(--card-bg); }
.inline { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
`;


  document.head.appendChild(style);

  // Apply cached theme immediately to avoid flash of default colors
  applyTheme(localStorage.getItem('dnd.theme') || 'light');

  // Build unified tile grid
  var tileGrid = h('div', { class: 'tileGrid' });

  // Identity
  var identity = h('div', { class: 'card' }, [
    h('h2', {}, ['Identity']),
    labeledInput('Name', 'name', ch.name, function (v) { return update({ name: v }); }),
    h('div', { class: 'grid2' }, [
      labeledInput('Class', 'class', ch.class, function (v) { return update({ class: v }); }),
      labeledNumber('Level', 'level', ch.level, function (v) { return update({ level: clamp(v, 1, 20) }); }, 1, 20),
    ]),
    h('div', { class: 'grid3' }, [
      labeledInput('Race', 'race', ch.race || '', function (v) { return update({ race: v }); }),
      labeledInput('Background', 'background', ch.background || '', function (v) { return update({ background: v }); }),
      labeledInput('Alignment', 'alignment', ch.alignment || '', function (v) { return update({ alignment: v }); }),
    ]),
  ]);

  // Abilities + Saves (combined)
  var abilities = h('div', { class: 'card abilities' });
  abilities.appendChild(h('h2', {}, ['Abilities']));
  // Single row of 6 abilities, each column includes ability input and its save row beneath
  var abilGrid = h('div', { class: 'grid6' });
  // Add CSS for grid6 later in styles block
  ABILITIES.forEach(function (a) {
    var col = h('div', { class: 'abilCol' });
    var score = labeledNumber(`${a} (mod ${fmtSigned(derived.mods[a])})`, `abil.${a}`, ch.abilities[a],
      function (v) { return updateDeep(`abilities.${a}`, clamp(v, 1, 30)); }, 1, 30);
    score.setAttribute('data-ability', a);
    attachAbilityTooltip(score, a);
    // Save row under this ability
    var saveRow = h('div', { class: 'row chip' }, [
      h('input', { type: 'checkbox', checked: !!ch.savingThrowsProficiencies[a] }),
      h('div', {}, ['Save']),
      h('div', { class: 'mut' }, [h('span', { id: `save.total.${a}` }, [fmtSigned(derived.savingThrows[a])])]),
    ]);
    saveRow.firstChild.addEventListener('change', function (ev) {
      var on = ev.target.checked;
      updateDeep(`savingThrowsProficiencies.${a}`, on);
    });
    col.appendChild(score);
    col.appendChild(saveRow);
    abilGrid.appendChild(col);
  });
  abilities.appendChild(abilGrid);

  // Combat
  var combat = h('div', { class: 'card' }, [
    h('h2', {}, ['Combat']),
    h('div', { class: 'grid3' }, [
      labeledNumber('Armor Class', 'ac', ch.armorClass, function (v) { return update({ armorClass: clamp(v, 0, 40) }); }, 0, 40),
      labeledNumber('HP (max)', 'hp.max', ch.maxHP, function (v) { return update({ maxHP: Math.max(1, v) }); }, 1),
      labeledNumber('HP (current)', 'hp.cur', ch.currentHP, function (v) { return update({ currentHP: clamp(v, 0, ch.maxHP) }); }, 0),
    ]),
    h('div', { class: 'grid3', style: { marginTop: '6px' } }, [
      labeledInput('Speed', 'speed', ch.speed || '', function (v) { return update({ speed: v }); }),
      labeledNumber('Temp HP', 'hp.temp', ch.tempHP || 0, function (v) { return update({ tempHP: Math.max(0, v) }); }, 0),
      h('label', { class: 'lbl' }, [
        h('div', { class: 'lblt' }, ['Initiative']),
        h('div', { class: 'chip' }, [h('span', { id: 'derived.initiative' }, [fmtSigned(derived.initiative)]), ' (DEX mod)']),
      ]),
    ]),
    h('div', { class: 'row', style: { marginTop: '6px' } }, [
      h('div', { class: 'chip' }, ['Prof bonus: ', h('strong', { id: 'derived.pb' }, [fmtSigned(derived.proficiencyBonus)])]),
      h('div', { class: 'chip' }, ['Passive Perception: ', h('strong', { id: 'derived.pp' }, [String(derived.passivePerception)])]),
    ]),
  ]);

  // Set data-panel on top tiles
  identity.setAttribute('data-panel', 'identity');
  combat.setAttribute('data-panel', 'combat');
  abilities.setAttribute('data-panel', 'abilities');

  // Right-side cards
    //Skills tab
    var skillsCard = h('div', { class: 'card' });
    skillsCard.appendChild(h('h2', {}, ['Skills']));

    var skillsTable = h('div', { class: 'skillsTable' });

    // Header row (three actual cells)
    var skillsHeader = h('div', { class: 'skillsHeader' }, [
    h('div', {}, ['Skill']),
    h('div', { class: 'right' }, ['Total']),
    h('div', {}, ['Prof']),
    ]);
    skillsTable.appendChild(skillsHeader);

    // Rows
    SKILLS.forEach(function (sk) {
    var abil = SKILL_TO_ABILITY[sk];

    // name cell: "Stealth (DEX)"
    var nameCell = h('div', {}, [
        `${sk} `,
        h('span', { class: 'mut' }, [`(${abil})`])
    ]);

    // total cell: value + tiny roll button
    var totalEl  = h('div', { id: `skill.total.${sk}`, class: 'right' }, [fmtSigned(derived.skills[sk])]);
    var rollBtn  = h('button', { class: 'btn small', title: 'Roll skill' }, ['🎲']);
    var totalWrap = h('div', { class: 'skillTotalWrap' }, [totalEl, rollBtn]);

    rollBtn.addEventListener('click', function () {
        var expr = `1d20${signed(derived.skills[sk])}`;
        if (api) api.postMessage({ type: 'roll', expr });
        else {
        var r = rollExpr(expr);
        setStatus(`Roll ${sk}: ${r.total} (${r.detail})`, 4000);
        }
    });

    // prof select
    var sel = selectProf(ch.skillsProficiencies[sk] || 'none',
        function (p) { return updateDeep(`skillsProficiencies.${sk}`, p); });

    // assemble row (three cells)
    var row = h('div', { class: 'skillRow' }, [nameCell, totalWrap, sel]);
    skillsTable.appendChild(row);
    });

    skillsCard.appendChild(skillsTable);

//   skillsCard.appendChild(skillGrid);

 // Attacks Tab
  var attacksCard = h('div', { class: 'card attacks' });
  attacksCard.appendChild(h('h2', {}, ['Attacks']));
  var list = h('div', { id: 'attacks.list' });
  var addBtn = h('button', { class: 'btn', style: { marginTop: '8px' } }, ['+ Add attack']);
    addBtn.addEventListener('click', function () {
    ch.attacks.push({ name: 'New Attack', range: 'Melee', hitDc: '+0', damage: '1d6+2', notes: '' });
    derived = computeDerived(ch);
    renderAttacks();
    });
  attacksCard.appendChild(list);
  attacksCard.appendChild(addBtn);

  var notesCard = h('div', { class: 'card' }, [
    h('h2', {}, ['Notes']),
    (function () {
      var ta = h('textarea', { value: ch.notes || '' });
      ta.addEventListener('input', function () { return update({ notes: ta.value }); });
      return ta;
    })(),
  ]);


    // Spells Tab (modeled after Attacks)
  var spellsCard = h('div', { class: 'card spells' });
  spellsCard.appendChild(h('h2', {}, ['Spells']));

    // Spellcasting meta card (slots, DC, attack mod)
  var spellMeta = h('div', { class: 'spellcasting card', style: { padding: '10px', border: '1px dashed var(--bd)' } });

  // top row: ability + numbers + derived DC/Atk
  var topRow = h('div', { class: 'inline' }, [
    // Spellcasting Ability selector
    (function () {
      const sel = h('select', { class: 'sel' }, ABILITIES.map(a => h('option', { value: a, selected: (ch.spellcasting?.ability || 'INT') === a }, [a])));
      sel.addEventListener('change', () => updateDeep('spellcasting.ability', sel.value));
      return labeledWrap('Spell Ability', sel);
    })(),

    labeledNumber('Cantrips Known', 'sp.cantrips', ch.spellcasting?.cantripsKnown || 0, v => updateDeep('spellcasting.cantripsKnown', Math.max(0, v)), 0),
    labeledNumber('Prepared Spells', 'sp.prepared', ch.spellcasting?.preparedSpells || 0, v => updateDeep('spellcasting.preparedSpells', Math.max(0, v)), 0),

    // Derived DC (with misc)
    (function () {
      const misc = h('input', { class: 'inp', type: 'number', value: ch.spellcasting?.miscSaveDC || 0, style: { width: '90px' } });
      misc.addEventListener('input', () => updateDeep('spellcasting.miscSaveDC', int(misc.value, 0)));
      return h('div', { class: 'lbl' }, [
        h('div', { class: 'lblt' }, ['Spell Save DC']),
        h('div', { class: 'inline' }, [
          h('span', { class: 'chip' }, ['DC ', h('strong', { id: 'derived.spell.dc' }, [String(derived.spellSaveDC || (8 + abilityMod(ch.abilities.INT) + derived.proficiencyBonus))])]),
          h('span', { class: 'mut' }, ['misc']),
          misc,
        ]),
      ]);
    })(),

    // Derived Attack Mod (with misc)
    (function () {
      const misc = h('input', { class: 'inp', type: 'number', value: ch.spellcasting?.miscAttackMod || 0, style: { width: '90px' } });
      misc.addEventListener('input', () => updateDeep('spellcasting.miscAttackMod', int(misc.value, 0)));
      return h('div', { class: 'lbl' }, [
        h('div', { class: 'lblt' }, ['Spell Attack Modifier']),
        h('div', { class: 'inline' }, [
          h('span', { class: 'chip' }, [h('strong', { id: 'derived.spell.attack' }, [fmtSigned(derived.spellAtkMod || 0)])]),
          h('span', { class: 'mut' }, ['misc']),
          misc,
        ]),
      ]);
    })(),
  ]);
  spellMeta.appendChild(topRow);

  // slots grid header
  spellMeta.appendChild(h('div', { class: 'grid hdr' }, [
    h('div', {}, ['Lvl']),
    h('div', {}, ['Total']),
    h('div', {}, ['Used']),
    h('div', {}, ['Slots']),
  ]));

  // slots rows (1..9)
  for (let lvl = 1; lvl <= 9; lvl++) {
    const key = `spellcasting.slots.${lvl}`;
    const row = h('div', { class: 'grid' });

    const total = int(ch.spellcasting?.slots?.[lvl]?.total, 0);
    const used  = int(ch.spellcasting?.slots?.[lvl]?.used,  0);
    const totalInp = h('input', { class: 'inp', type: 'number', value: total, min: 0 });
    const usedInp  = h('input', { class: 'inp', type: 'number', value: used,  min: 0, max: Math.max(0,total) });

    totalInp.addEventListener('input', () => {
      const v = Math.max(0, int(totalInp.value, 0));
      updateDeep(`${key}.total`, v);
      if (used > v) updateDeep(`${key}.used`, v);
      renderSpellDots(); // refresh dots
    });
    usedInp.addEventListener('input', () => {
      const v = clamp(int(usedInp.value, 0), 0, Math.max(0, int(totalInp.value, 0)));
      updateDeep(`${key}.used`, v);
      renderSpellDots();
    });

    const dots = h('div', { class: 'slotDots', 'data-lvl': String(lvl) });
    row.appendChild(h('div', {}, [String(lvl)]));
    row.appendChild(totalInp);
    row.appendChild(usedInp);
    row.appendChild(dots);
    spellMeta.appendChild(row);
  }

  // dot render helper
  function renderSpellDots() {
    for (let lvl = 1; lvl <= 9; lvl++) {
      const dots = spellMeta.querySelector(`.slotDots[data-lvl="${lvl}"]`);
      if (!dots) continue;
      dots.innerHTML = '';
      const total = int(ch.spellcasting?.slots?.[lvl]?.total, 0);
      const used  = int(ch.spellcasting?.slots?.[lvl]?.used,  0);
      for (let i = 0; i < total; i++) {
        const on = i < used;
        const d = h('div', { class: 'dot ' + (on ? 'on' : 'off'), title: on ? 'Click to unuse' : 'Click to use' }, [on ? '●' : '○']);
        d.addEventListener('click', () => {
          const cur = int(ch.spellcasting?.slots?.[lvl]?.used, 0);
          if (on) updateDeep(`spellcasting.slots.${lvl}.used`, Math.max(0, cur - 1));
          else    updateDeep(`spellcasting.slots.${lvl}.used`, Math.min(total, cur + 1));
          renderSpellDots();
        });
        dots.appendChild(d);
      }
    }
  }
  renderSpellDots();

  spellsCard.appendChild(spellMeta);

  var spellsList = h('div', { id: 'spells.list' });
  var addSpellBtn = h('button', { class: 'btn', style: { marginTop: '8px' } }, ['+ Add spell']);
  addSpellBtn.addEventListener('click', function () {
    ch.spells.push({ name: 'New Spell', range: '30 ft', hitDc: '+0', damage: '1d6', notes: '' });
    derived = computeDerived(ch);
    renderSpells();
  });
  spellsCard.appendChild(spellsList);
  spellsCard.appendChild(addSpellBtn);

  // Inventory Tab
  var inventoryCard = h('div', { class: 'card inventory' });
  inventoryCard.appendChild(h('h2', {}, ['Inventory']));
  var inventoryList = h('div', { id: 'inventory.list' });
  var addItemBtn = h('button', { class: 'btn', style: { marginTop: '8px' } }, ['+ Add item']);
  addItemBtn.addEventListener('click', function () {
    ch.inventory.push({ name: 'New Item', value: '', desc: '' });
    renderInventory();
  });
  inventoryCard.appendChild(inventoryList);
  inventoryCard.appendChild(addItemBtn);
  // Journal Tab
  var journalCard = h('div', { class: 'card journal' });
  journalCard.appendChild(h('h2', {}, ['Journal']));
  var journalList = h('div', { id: 'journal.list' });
  var addEntryBtn = h('button', { class: 'btn', style: { marginTop: '8px' } }, ['+ Add Entry']);
  addEntryBtn.addEventListener('click', function () {
    var today = new Date().toISOString().slice(0, 10);
    ch.journal = ch.journal || [];
    ch.journal.unshift({ date: today, text: '' });
    renderJournal();
  });
  journalCard.appendChild(journalList);
  journalCard.appendChild(addEntryBtn);

  // Tag cards so we can toggle
  skillsCard.setAttribute('data-panel', 'skills');
  attacksCard.setAttribute('data-panel', 'attacks');
  notesCard.setAttribute('data-panel', 'notes');
  spellsCard.setAttribute('data-panel', 'spells');
  inventoryCard.setAttribute('data-panel', 'inventory');
  journalCard.setAttribute('data-panel', 'journal');

  // Unified tile map — all 9 tiles
  var tileMap = {
    identity:  identity,
    combat:    combat,
    abilities: abilities,
    skills:    skillsCard,
    attacks:   attacksCard,
    spells:    spellsCard,
    inventory: inventoryCard,
    notes:     notesCard,
    journal:   journalCard,
  };

  // Add drag grip + resize handle to every tile
  Object.entries(tileMap).forEach(function (entry) {
    var key = entry[0], el = entry[1];
    // Drag grip in header
    var heading = el.querySelector('h2');
    if (heading) {
      var grip = h('span', { class: 'drag-grip', title: 'Drag to reorder' }, ['\u2801\u2801']);
      heading.insertBefore(grip, heading.firstChild);
    }
    // Resize handle
    var handle = h('div', { class: 'tile-resize-handle', title: 'Drag to resize' }, ['\u25E2']);
    el.appendChild(handle);

    // --- Drag-and-drop ---
    var dragClasses = ['drag-over-left','drag-over-right','drag-over-top','drag-over-bottom'];
    function clearDragClasses() { dragClasses.forEach(function(c){ el.classList.remove(c); }); }

    // Detect which edge of the tile the cursor is closest to
    function nearestEdge(ev) {
      var rect = el.getBoundingClientRect();
      var x = ev.clientX - rect.left;
      var y = ev.clientY - rect.top;
      var dLeft = x, dRight = rect.width - x;
      var dTop = y, dBottom = rect.height - y;
      var min = Math.min(dLeft, dRight, dTop, dBottom);
      if (min === dTop) return 'top';
      if (min === dBottom) return 'bottom';
      if (min === dLeft) return 'left';
      return 'right';
    }

    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', function (ev) {
      ev.dataTransfer.setData('text/plain', key);
      ev.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragover', function (ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      clearDragClasses();
      el.classList.add('drag-over-' + nearestEdge(ev));
    });
    el.addEventListener('dragleave', function () { clearDragClasses(); });
    el.addEventListener('drop', function (ev) {
      ev.preventDefault();
      var edge = nearestEdge(ev);
      clearDragClasses();
      var from = ev.dataTransfer.getData('text/plain');
      if (!from || !tileMap[from]) return;
      var to = key;
      if (from === to) return;
      var order = layout.order.slice();
      var fi = order.indexOf(from);
      if (fi === -1) return;
      order.splice(fi, 1);
      var ti = order.indexOf(to);
      if (ti === -1) return;
      // Top/left = insert before target, bottom/right = insert after
      var insertAt = (edge === 'top' || edge === 'left') ? ti : ti + 1;
      order.splice(insertAt, 0, from);
      layout.order = order;
      saveLayout();
      applyLayout();
    });

    // --- Resize via handle ---
    // Temporarily disable draggable during resize so it doesn't intercept
    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      e.stopPropagation();
      el.setAttribute('draggable', 'false');
      var startX = e.clientX;
      var startSpan = (layout.tiles[key] && layout.tiles[key].colSpan) || 2;
      var colWidth = tileGrid.clientWidth / layout.columns;
      function onMove(ev) {
        var dx = ev.clientX - startX;
        var spanDelta = Math.round(dx / colWidth);
        var newSpan = Math.max(TILE_MIN_SPAN[key] || 1, Math.min(layout.columns, startSpan + spanDelta));
        el.style.gridColumn = 'span ' + newSpan;
      }
      function onUp(ev) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        el.setAttribute('draggable', 'true');
        var dx = ev.clientX - startX;
        var spanDelta = Math.round(dx / colWidth);
        var newSpan = Math.max(TILE_MIN_SPAN[key] || 1, Math.min(layout.columns, startSpan + spanDelta));
        layout.tiles[key].colSpan = newSpan;
        saveLayout();
        applyLayout();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  });

  function applyLayout() {
    // Ensure all tiles exist in layout
    var allTiles = ['identity','combat','abilities','skills','attacks','spells','inventory','journal','notes'];
    allTiles.forEach(function (id) {
      if (!layout.tiles[id]) layout.tiles[id] = { visible: true, colSpan: 2 };
      if (layout.order.indexOf(id) === -1) layout.order.push(id);
    });
    layout.order = Array.isArray(layout.order) ? layout.order : allTiles;

    // Rebuild grid in order
    tileGrid.innerHTML = '';
    layout.order.forEach(function (id) {
      var el = tileMap[id];
      if (!el) return;
      var tileConf = layout.tiles[id];
      el.style.display = tileConf.visible ? '' : 'none';
      el.style.gridColumn = 'span ' + (tileConf.colSpan || 2);
      tileGrid.appendChild(el);
    });

    // Responsive abilities grid: 6/3/2/1 columns based on colSpan
    var abilGrid = abilities.querySelector('.grid6');
    if (abilGrid) {
      abilGrid.classList.remove('cols-3', 'cols-2', 'cols-1');
      var abilSpan = (layout.tiles.abilities && layout.tiles.abilities.colSpan) || 4;
      if (abilSpan <= 1) abilGrid.classList.add('cols-1');
      else if (abilSpan <= 2) abilGrid.classList.add('cols-2');
      else if (abilSpan <= 3) abilGrid.classList.add('cols-3');
      // colSpan 4 = default 6 columns (no extra class needed)
    }

    // Update tab button active states
    Array.from(rightActions.querySelectorAll('.tab')).forEach(function (btn) {
      var id = btn.getAttribute('data-target');
      var on = !!(layout.tiles[id] && layout.tiles[id].visible);
      btn.classList.toggle('active', on);
    });
  }







  // Build top bar
  var leftActions = h('div', { class: 'leftActions' });

  function renderTopLeftButtons() {
    leftActions.innerHTML = '';
    if (!isEditing) {
      // Dice button + dropdown
      var diceWrap = h('div', { class: 'diceWrap' });
      var diceBtn = h('button', { class: 'btn', id: 'btn.dice' }, ['Dice']);
      var dropdown = h('div', { class: 'dice-dropdown', style: { display: 'none' } });
      var counts = { d4:0, d6:0, d8:0, d10:0, d12:0, d20:0 };
      var DIE_TYPES = ['d4','d6','d8','d10','d12','d20'];

      function renderDropdown() {
        dropdown.innerHTML = '';
        DIE_TYPES.forEach(function(type) {
          var countSpan = h('span', { class: 'dice-count' }, [String(counts[type])]);
          var row = h('div', { class: 'dice-row' }, [
            h('span', {}, [type]),
            countSpan,
          ]);
          row.addEventListener('click', function(e) {
            e.stopPropagation();
            counts[type]++;
            countSpan.textContent = String(counts[type]);
          });
          dropdown.appendChild(row);
        });
        var actions = h('div', { class: 'dice-actions' });
        var resetBtn = h('button', { class: 'btn small' }, ['Reset']);
        var rollBtn = h('button', { class: 'btn small dice-roll' }, ['Roll']);
        resetBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          DIE_TYPES.forEach(function(t){ counts[t] = 0; });
          renderDropdown();
        });
        rollBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          var total = DIE_TYPES.reduce(function(a,t){ return a+counts[t]; }, 0);
          if(total === 0) { setStatus('No dice selected', 2000); return; }
          var rollCounts = Object.assign({}, counts);
          dropdown.style.display = 'none';
          DIE_TYPES.forEach(function(t){ counts[t] = 0; });
          renderDropdown();
          if(diceRenderer) {
            diceRenderer.roll(function(sum, breakdown) {
              var parts = DIE_TYPES.filter(function(t){ return breakdown[t]; }).map(function(t){
                return t + ': ' + breakdown[t].join('+');
              });
              setStatus('Roll: ' + sum + ' (' + parts.join(', ') + ')', 6000);
            }, rollCounts);
          } else {
            setStatus('Dice renderer unavailable', 3000);
          }
        });
        actions.appendChild(resetBtn);
        actions.appendChild(rollBtn);
        dropdown.appendChild(actions);
      }
      renderDropdown();

      diceBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      });
      dropdown.addEventListener('click', function(e) { e.stopPropagation(); });
      document.addEventListener('click', function closeDropdown() {
        dropdown.style.display = 'none';
      });

      diceWrap.appendChild(diceBtn);
      diceWrap.appendChild(dropdown);

      var editBtn = h('button', { class: 'btn', id: 'btn.edit' }, ['Edit']);
      leftActions.appendChild(diceWrap);
      leftActions.appendChild(editBtn);
      leftActions.appendChild(h('div', { id: 'status', class: 'status' }, ['']));

      editBtn.addEventListener('click', function () { isEditing = true; renderTopLeftButtons(); applyEditingState(); });
    } else {
      var saveBtn = h('button', { class: 'btn', id: 'btn.save' }, ['Save']);
      var loadBtn = h('button', { class: 'btn', id: 'btn.load' }, ['Load']);
      leftActions.appendChild(saveBtn);
      leftActions.appendChild(loadBtn);
      leftActions.appendChild(h('div', { id: 'status', class: 'status' }, ['']));

      saveBtn.addEventListener('click', function () {
        if (api) api.postMessage({ type: 'save', character: ch }); else { saveLocal(ch); setStatus('Saved locally ✓'); }
        isEditing = false; renderTopLeftButtons(); applyEditingState();
      });
      loadBtn.addEventListener('click', function () {
        if (api) { api.postMessage({ type: 'load' }); setStatus('Loading…'); } else { setStatus('Nothing to load (offline)'); }
      });
    }
  }

  var rightActions = h('div', { class: 'rightActions' }, [
  h('button', { class: 'btn tab', 'data-target': 'identity'  }, ['Identity']),
  h('button', { class: 'btn tab', 'data-target': 'combat'    }, ['Combat']),
  h('button', { class: 'btn tab', 'data-target': 'abilities' }, ['Abilities']),
  h('button', { class: 'btn tab', 'data-target': 'skills'    }, ['Skills']),
  h('button', { class: 'btn tab', 'data-target': 'attacks'   }, ['Attacks']),
  h('button', { class: 'btn tab', 'data-target': 'spells'    }, ['Spells']),
  h('button', { class: 'btn tab', 'data-target': 'inventory' }, ['Inventory']),
  h('button', { class: 'btn tab', 'data-target': 'journal'   }, ['Journal']),
  h('button', { class: 'btn tab', 'data-target': 'notes'     }, ['Notes']),
]);

  var topbar = h('div', { class: 'topbar' }, [leftActions, rightActions]);

  // Mount
  root.innerHTML = '';
  var wrap = h('div', { class: 'wrap' });
  wrap.appendChild(topbar);
  wrap.appendChild(tileGrid);
  root.appendChild(wrap);

  // WebGL dice overlay
  var diceCanvas = h('canvas', { id: 'dice-canvas' });
  diceCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1000;display:none;';
  root.appendChild(diceCanvas);
  diceRenderer = DiceRenderer.init(diceCanvas);

  // Toggle visibility per tile and apply layout
  rightActions.addEventListener('click', function (e) {
    var btn = e.target.closest('.tab');
    if (!btn) return;
    var id = btn.getAttribute('data-target');
    if (!layout.tiles[id]) layout.tiles[id] = { visible: true, colSpan: 2 };
    layout.tiles[id].visible = !layout.tiles[id].visible;
    saveLayout();
    applyLayout();
  });
  applyLayout();

  // Top buttons initial render
  renderTopLeftButtons();

  // Apply editing state (disable/enable fields)
  applyEditingState();

  renderAttacks();
  renderSpells();
  renderInventory();
  renderJournal();
  renderDynamic();

}

// Enable/disable inputs based on isEditing
function applyEditingState() {
  var scope = document.querySelector('.rows');
  if (!scope) scope = document;
  // Inputs/selects/textareas
  Array.from(scope.querySelectorAll('input, select, textarea')).forEach(function (el) {
    // Do not disable topbar controls
    if (el.closest('.topbar')) return;
    // Allow roll buttons inputs to remain enabled for rolls (but they are buttons, not inputs)
    el.disabled = !isEditing;
  });
  // Buttons inside cards: disable add/remove while not editing; keep roll buttons active
  Array.from(scope.querySelectorAll('button.btn')).forEach(function (btn) {
    if (btn.closest('.topbar')) return;
    if (btn.classList.contains('attack-roll-btn')) return;
    if (btn.classList.contains('tab')) return;
    // Add/delete buttons in lists
    var isAddOrDelete = /\+ Add|✕/.test(btn.textContent || '');
    if (isAddOrDelete) btn.disabled = !isEditing; else btn.disabled = false;
  });
}
function renderSpells() {
  var list = document.getElementById('spells.list');
  if (!list) return;
  list.innerHTML = '';

  ch.spells.forEach(function (sp, i) {
    var hitDcVal = (sp.hitDc != null ? String(sp.hitDc) : '+0');
    var dmgVal   = (sp.damage != null ? String(sp.damage) : '1d6');
    var rangeVal = (sp.range  != null ? String(sp.range)  : '');

    var name  = h('input', { class: 'inp', value: sp.name || '' });
    var range = h('input', { class: 'inp', value: rangeVal });

    var hitDcInput = h('input', { class: 'inp', value: hitDcVal, title: 'Enter modifier (e.g. +5). Double-click/Enter or 🎲 to roll' });
    var hitBtn = h('button', { class: 'btn attack-roll-btn', title: 'Roll Hit/DC' }, ['🎲']);
    var hitWrap = h('div', { class: 'cell-inline' }, [hitDcInput, hitBtn]);

    var dmgInput = h('input', { class: 'inp', value: dmgVal, title: 'Composite damage like 2d6+1d4+3' });
    var dmgBtn = h('button', { class: 'btn attack-roll-btn', title: 'Roll Damage' }, ['🎲']);
    var dmgWrap = h('div', { class: 'cell-inline' }, [dmgInput, dmgBtn]);

    var notes = h('input', { class: 'inp', value: sp.notes || '' });
    var del   = h('button', { class: 'btn small', title: 'Remove' }, ['✕']);

    name.addEventListener('input',  function () { ch.spells[i].name  = name.value; });
    range.addEventListener('input', function () { ch.spells[i].range = range.value; });
    hitDcInput.addEventListener('input', function () { ch.spells[i].hitDc = hitDcInput.value; });
    dmgInput.addEventListener('input', function () { ch.spells[i].damage = dmgInput.value; });
    notes.addEventListener('input', function () { ch.spells[i].notes  = notes.value; });
    del.addEventListener('click',   function () { ch.spells.splice(i, 1); renderSpells(); });

    function rollHit() {
      var mod = parseInt(String(hitDcInput.value).replace(/\s+/g, ''), 10);
      if (!Number.isFinite(mod)) mod = 0;
      var expr = `1d20${mod >= 0 ? '+'+mod : mod}`;
      if (api) api.postMessage({ type: 'roll', expr });
      else {
        var r = rollExpr(expr);
        setStatus(`Spell Hit/DC (${sp.name || 'Spell'}): ${r.total} (${r.detail})`, 4000);
      }
    }
    function rollDamage() {
      var exprIn = String(dmgInput.value || '0');
      var r = rollCompositeDamage(exprIn);
      if (api && r.exprForHost) {
        api.postMessage({ type: 'roll', expr: r.exprForHost });
      } else {
        setStatus(`Spell Damage (${sp.name || 'Spell'}): ${r.total} (${r.detail})`, 4000);
      }
    }
    hitBtn.addEventListener('click', rollHit);
    dmgBtn.addEventListener('click', rollDamage);
    hitDcInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') rollHit(); });
    hitDcInput.addEventListener('dblclick', rollHit);
    dmgInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') rollDamage(); });
    dmgInput.addEventListener('dblclick', rollDamage);

    var row = h('div', { class: 'rowGrid' }, [
      labeledWrap('Spell',  name),
      labeledWrap('Range',  range),
      labeledWrap('Hit/DC', hitWrap),
      labeledWrap('Damage', dmgWrap),
      labeledWrap('Notes',  notes),
      del,
    ]);

    list.appendChild(row);
  });
}

function renderInventory() {
  var list = document.getElementById('inventory.list');
  if (!list) return;
  list.innerHTML = '';

  ch.inventory.forEach(function (it, i) {
    var name  = h('input', { class: 'inp', value: it.name || '' });
    var value = h('input', { class: 'inp', value: it.value || '', placeholder: 'e.g., 25 gp' });
    var desc  = h('textarea', { class: 'inp', value: it.desc || '', placeholder: 'Item description...', rows: 2 });
    var del   = h('button', { class: 'btn small', title: 'Remove' }, ['✕']);

    name.addEventListener('input',  function () { ch.inventory[i].name  = name.value; });
    value.addEventListener('input', function () { ch.inventory[i].value = value.value; });
    desc.addEventListener('input',  function () { ch.inventory[i].desc  = desc.value; });
    del.addEventListener('click',   function () { ch.inventory.splice(i, 1); renderInventory(); });

    // Create the item row container
    var itemRow = h('div', { class: 'itemRow' }, [
      // Top row with name, value, and delete button
      h('div', { class: 'itemTopRow' }, [
        labeledWrap('Item', name),
        labeledWrap('Value', value),
        del,
      ]),
      // Description textarea below
      h('div', { class: 'itemDescription' }, [
        labeledWrap('Description', desc),
      ]),
    ]);

    list.appendChild(itemRow);
  });
}


function renderJournal() {
  var list = document.getElementById('journal.list');
  if (!list) return;
  list.innerHTML = '';

  (ch.journal || []).forEach(function (entry, i) {
    var dateInput = h('input', { class: 'inp', type: 'date', value: entry.date || '', style: { width: '180px' } });
    var textArea = h('textarea', { class: 'inp', value: entry.text || '', placeholder: 'Session notes...' });
    var del = h('button', { class: 'btn small', title: 'Remove entry' }, ['\u2715']);

    dateInput.addEventListener('input', function () { ch.journal[i].date = dateInput.value; });
    textArea.addEventListener('input', function () { ch.journal[i].text = textArea.value; });
    del.addEventListener('click', function () { ch.journal.splice(i, 1); renderJournal(); });

    var entryDiv = h('div', { class: 'journalEntry' }, [
      h('div', { class: 'journalEntryHeader' }, [dateInput, del]),
      h('div', { class: 'journalEntryBody' }, [textArea]),
    ]);
    list.appendChild(entryDiv);
  });
}

// tiny helper to mirror your Combat labels
function labeledWrap(label, child) {
  return h('label', { class: 'lbl' }, [
    h('div', { class: 'lblt' }, [label]),
    child,
  ]);
}

function renderAttacks() {
  var list = document.getElementById('attacks.list');
  if (!list) return;
  list.innerHTML = '';

  ch.attacks.forEach(function (atk, i) {
    // Back-compat: use toHit if hitDc not present
    var hitDcVal = (atk.hitDc != null ? String(atk.hitDc) : (atk.toHit != null ? String(atk.toHit) : '+0'));
    var dmgVal   = (atk.damage != null ? String(atk.damage) : '1d4');
    var rangeVal = (atk.range  != null ? String(atk.range)  : '');

    // Inputs
    var name  = h('input', { class: 'inp', value: atk.name || '' });
    var range = h('input', { class: 'inp', value: rangeVal });

    var hitDcInput = h('input', { class: 'inp', value: hitDcVal, title: 'Enter modifier (e.g. +5). Double-click/Enter or 🎲 to roll' });
    var hitBtn = h('button', { class: 'btn attack-roll-btn', title: 'Roll Hit/DC' }, ['🎲']);
    var hitWrap = h('div', { class: 'cell-inline' }, [hitDcInput, hitBtn]);

    var dmgInput = h('input', { class: 'inp', value: dmgVal, title: 'Composite damage like 2d6+1d4+3' });
    var dmgBtn = h('button', { class: 'btn attack-roll-btn', title: 'Roll Damage' }, ['🎲']);
    var dmgWrap = h('div', { class: 'cell-inline' }, [dmgInput, dmgBtn]);

    var notes = h('input', { class: 'inp', value: atk.notes || '' });
    var del   = h('button', { class: 'btn small', title: 'Remove' }, ['✕']);

    // Persist on input
    name.addEventListener('input',  function () { ch.attacks[i].name  = name.value; });
    range.addEventListener('input', function () { ch.attacks[i].range = range.value; });
    hitDcInput.addEventListener('input', function () {
      ch.attacks[i].hitDc = hitDcInput.value;
      ch.attacks[i].toHit = hitDcInput.value; // keep legacy field updated
    });
    dmgInput.addEventListener('input', function () { ch.attacks[i].damage = dmgInput.value; });
    notes.addEventListener('input', function () { ch.attacks[i].notes  = notes.value; });
    del.addEventListener('click',   function () { ch.attacks.splice(i, 1); renderAttacks(); });

    // Roll handlers
    function rollHit() {
      var mod = parseInt(String(hitDcInput.value).replace(/\s+/g, ''), 10);
      if (!Number.isFinite(mod)) mod = 0;
      var expr = `1d20${mod >= 0 ? '+'+mod : mod}`;
      if (api) api.postMessage({ type: 'roll', expr });
      else {
        var r = rollExpr(expr);
        setStatus(`Hit/DC (${atk.name || 'Attack'}): ${r.total} (${r.detail})`, 4000);
      }
    }
    function rollDamage() {
    var exprIn = String(dmgInput.value || '0');
    var r = rollCompositeDamage(exprIn);

    // If the host can understand this (simple NdM±K), let it roll; otherwise show our local result.
    if (api && r.exprForHost) {
        api.postMessage({ type: 'roll', expr: r.exprForHost });
    } else {
        setStatus(`Damage (${atk.name || 'Attack'}): ${r.total} (${r.detail})`, 4000);
    }
    }
    hitBtn.addEventListener('click', rollHit);
    dmgBtn.addEventListener('click', rollDamage);
    hitDcInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') rollHit(); });
    hitDcInput.addEventListener('dblclick', rollHit);
    dmgInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') rollDamage(); });
    dmgInput.addEventListener('dblclick', rollDamage);

    // Row grid with labeled cells (like Combat)
    var row = h('div', { class: 'rowGrid' }, [
      labeledWrap('Attack', name),
      labeledWrap('Range',  range),
      labeledWrap('Hit/DC', hitWrap),
      labeledWrap('Damage', dmgWrap),
      labeledWrap('Notes',  notes),
      del,
    ]);

    list.appendChild(row);
  });
}


function renderDynamic() {
    // Update ability labels (mods)
    ABILITIES.forEach(function (a) {
        var lab = document.querySelector("[data-ability=\"".concat(a, "\"] .lblt"));
        if (lab)
            lab.textContent = "".concat(a, " (mod ").concat(fmtSigned(derived.mods[a]), ")");
    });
    // Derived chips
    var pb = document.getElementById('derived.pb');
    if (pb)
        pb.textContent = fmtSigned(derived.proficiencyBonus);
    var pp = document.getElementById('derived.pp');
    if (pp)
        pp.textContent = String(derived.passivePerception);
    var ini = document.getElementById('derived.initiative');
    if (ini)
        ini.textContent = fmtSigned(derived.initiative);
    // Saves
    ABILITIES.forEach(function (a) {
        var el = document.getElementById("save.total.".concat(a));
        if (el)
            el.textContent = fmtSigned(derived.savingThrows[a]);
    });
    // Skills
    SKILLS.forEach(function (sk) {
        var el = document.getElementById("skill.total.".concat(sk));
        if (el)
            el.textContent = fmtSigned(derived.skills[sk]);
    });
    // Spellcasting
    const sdc = document.getElementById('derived.spell.dc');
    if (sdc) sdc.textContent = String(derived.spellSaveDC);
    const sam = document.getElementById('derived.spell.attack');
    if (sam) sam.textContent = fmtSigned(derived.spellAtkMod);

}
function fmtSigned(n) {
    return (n >= 0 ? "+".concat(n) : "".concat(n));
}
function signed(n) {
    return n >= 0 ? "+".concat(n) : "".concat(n);
}
// ---- Bootstrap ----
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var r, local;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Provide a very small HTML scaffold in case host forgot:
                    if (!document.getElementById('root')) {
                        r = document.createElement('div');
                        r.id = 'root';
                        document.body.appendChild(r);
                    }
                    buildUI();
                    return [4 /*yield*/, waitForApi(1500)];
                case 1:
                    api = _a.sent();
                    if (api) {
                         api.onMessage(function (raw) {
                           // Some Joplin builds deliver { message: <payload> } or an event-like { data: <payload> }.
                           const msg = (raw && typeof raw === 'object')
                             ? (('message' in raw && typeof raw.message === 'object') ? raw.message
                                : ('data' in raw && typeof raw.data === 'object') ? raw.data
                                : raw)
                             : raw;
                           console.log('[webview] message (unwrapped):', msg, ' raw:', raw);
                           if (!msg || typeof msg !== 'object') return;
                        
                           if (msg.type === 'data') {
                            // Host is source of truth. Accept it and update UI.
                            currentNoteId = msg.noteId || currentNoteId;
                            ch = mergeCharacter(defaultCharacter(), msg.character || {});
                            derived = computeDerived(ch);

                            // Cache only for fast reopen/offline — but do NOT read it unless offline.
                            if (currentNoteId) saveCache(currentNoteId, ch);

                            buildUI(); // rebuild inputs to reflect host data
                            setStatus('Loaded ✓');
                        } else if (msg.type === 'saved') {
                            setStatus('Saved ✓');
                            // Do NOT write cache here; it was already saved when we applied 'data'
                        } else if (msg.type === 'error') {
                            setStatus(`Error: ${msg.message}`, 4000);
                        } else if (msg.type === 'rollResult') {
                            setStatus(`Roll: ${msg.result}`, 4000);
                        } else if (msg.type === 'theme') {
                            applyTheme(msg.theme || 'light');
                        }
                        });
                        // Ask host for data
                        api.postMessage({ type: 'load' });
                    
                        } else {
                        // OFFLINE MODE: only now is it OK to use cache
                        // We don't know noteId offline; skip cache unless you have one from before
                        const cached = currentNoteId ? loadCache(currentNoteId) : null;
                        if (cached) {
                            ch = mergeCharacter(defaultCharacter(), cached);
                            derived = computeDerived(ch);
                            buildUI();
                            setStatus('Loaded (local cache)');
                        } else {
                            setStatus('Offline mode — using defaults');
                        }
                        }

                    return [2 /*return*/];
            }
        });
    });
}
// function mergeCharacter(base, incoming) {
//     var _a, _b, _c;
//     var mergedAbilities = completeAbilities(__assign(__assign({}, base.abilities), ((_a = incoming.abilities) !== null && _a !== void 0 ? _a : {})));
//     var mergedSkills = completeSkills(__assign(__assign({}, ((_b = base.skillsProficiencies) !== null && _b !== void 0 ? _b : {})), ((_c = incoming.skillsProficiencies) !== null && _c !== void 0 ? _c : {})));
//     return __assign(__assign(__assign({}, base), incoming), { abilities: mergedAbilities, savingThrowsProficiencies: __assign(__assign({}, (base.savingThrowsProficiencies || {})), (incoming.savingThrowsProficiencies || {})), skillsProficiencies: mergedSkills, attacks: (incoming.attacks || base.attacks || []).map(function (a) { return (__assign({ name: '', toHit: '', damage: '', notes: '' }, a)); }) });
// }
function mergeCharacter(base, incoming) {
  const mergedAbilities = completeAbilities({ ...base.abilities, ...(incoming.abilities ?? {}) });
  const mergedSkills = completeSkills({ ...(base.skillsProficiencies ?? {}), ...(incoming.skillsProficiencies ?? {}) });

  return {
    ...base,
    ...incoming,
    abilities: mergedAbilities,
    savingThrowsProficiencies: { ...(base.savingThrowsProficiencies || {}), ...(incoming.savingThrowsProficiencies || {}) },
    skillsProficiencies: mergedSkills,
    attacks: (incoming.attacks || base.attacks || []).map(a => ({ name: '', toHit: '', damage: '', notes: '', ...a })),
    spells: (incoming.spells || base.spells || []).map(s => ({ name: 'New Spell', range: '', hitDc: '+0', damage: '1d6', notes: '', ...s })), // <— NEW
    inventory: (incoming.inventory || base.inventory || []).map(it => ({ name: 'New Item', value: '', desc: '', ...it })),
    journal: (incoming.journal || base.journal || []).map(e => ({ date: '', text: '', ...e })),
    spellcasting: {
    ...base.spellcasting,
    ...(incoming.spellcasting || {}),
    slots: {
      ...base.spellcasting.slots,
      ...((incoming.spellcasting && incoming.spellcasting.slots) || {})
  }
},

  };
}
(function bootstrap() {
  function start() {
    try {
      main();
      const a = getApi();
      if (a) {
        api = a
        // Tell the host we’re ready so queued messages flush
        api.postMessage({ type: 'ready' });
      }
    } catch (err) {
      console.error('[renderer] bootstrap error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    // DOM is already ready — run immediately
    start();
  }
})();
