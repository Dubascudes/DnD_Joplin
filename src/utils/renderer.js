
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
// ---- Active tab (persisted) ----
var ACTIVE_TAB_KEY = 'dnd.character.editor.activeTab.v1';
var activeTab = (function () {
  try { return localStorage.getItem(ACTIVE_TAB_KEY) || 'actions'; } catch { return 'actions'; }
})();
function setActiveTab(id) {
  activeTab = id;
  try { localStorage.setItem(ACTIVE_TAB_KEY, id); } catch {}
}

// ---- Color Themes ----
// Each theme supplies the full variable set consumed by the sheet CSS,
// including an accent color used for proficiency pips, rolls and tabs.
var THEMES = {
  light: {
    '--bg':'#f4f0e6','--card-bg':'#ffffff','--bd':'#d9d4c8','--tx':'#1d1b16','--mut':'#7b7466',
    '--chip':'#f5f1e8','--btn-hover':'#ece7da',
    '--accent':'#bf2c2c','--accent-tx':'#ffffff',
    '--header-bg':'#3a2626','--header-tx':'#f7f2e9',
  },
  dark: {
    '--bg':'#17191f','--card-bg':'#21242c','--bd':'#3a3f4b','--tx':'#e2e4e9','--mut':'#8b91a0',
    '--chip':'#282c35','--btn-hover':'#303540',
    '--accent':'#d64545','--accent-tx':'#ffffff',
    '--header-bg':'#101216','--header-tx':'#eceef2',
  },
  parchment: {
    '--bg':'#eadfbf','--card-bg':'#f8efd9','--bd':'#c9ae76','--tx':'#3b2e1a','--mut':'#85714a',
    '--chip':'#f0e5c6','--btn-hover':'#ecdfba',
    '--accent':'#94391d','--accent-tx':'#f8efd9',
    '--header-bg':'#4f3520','--header-tx':'#f2e6c8',
  },
  darkDungeon: {
    '--bg':'#16110d','--card-bg':'#201812','--bd':'#4a3828','--tx':'#d8c8a2','--mut':'#91805f',
    '--chip':'#291f16','--btn-hover':'#31261a',
    '--accent':'#c98a2c','--accent-tx':'#1a1410',
    '--header-bg':'#0d0a07','--header-tx':'#e6d5ac',
  },
  forest: {
    '--bg':'#e7efe2','--card-bg':'#f7fbf4','--bd':'#b4ccae','--tx':'#1d2d1d','--mut':'#61795f',
    '--chip':'#ecf3e7','--btn-hover':'#dfeada',
    '--accent':'#2f7d45','--accent-tx':'#ffffff',
    '--header-bg':'#23402b','--header-tx':'#eef7ea',
  },
  royal: {
    '--bg':'#ede7f5','--card-bg':'#faf7ff','--bd':'#c6b3dd','--tx':'#241634','--mut':'#7a659a',
    '--chip':'#f2ecfa','--btn-hover':'#e8dff4',
    '--accent':'#6f3fb4','--accent-tx':'#ffffff',
    '--header-bg':'#2f1e4a','--header-tx':'#f2ebfc',
  },
};
function applyTheme(name) {
  var theme = THEMES[name] || THEMES.light;
  var root = document.documentElement;
  Object.keys(theme).forEach(function (prop) { root.style.setProperty(prop, theme[prop]); });
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
    var boundX=6, boundZ=6; // visible half-extents of the floor plane (world units)

    // Keep dice inside the camera frustum: at floor level the visible half-height
    // is tan(fov/2)*CAM_HEIGHT and half-width scales with the canvas aspect.
    function updateBounds(){
      var aspect = canvas.width / Math.max(1, canvas.height);
      var half = Math.tan(Math.PI/8) * CAM_HEIGHT; // fov = π/4
      boundZ = Math.max(1.5, half - 1.2);
      boundX = Math.max(1.5, half * aspect - 1.2);
    }

    function resize(){
      var dpr=window.devicePixelRatio||1;
      canvas.width=canvas.clientWidth*dpr; canvas.height=canvas.clientHeight*dpr;
      gl.viewport(0,0,canvas.width,canvas.height);
      updateBounds();
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

      // Invisible walls at the edge of the visible area
      if(d.posX < -boundX){ d.posX = -boundX; d.velX = Math.abs(d.velX)*0.7; }
      if(d.posX >  boundX){ d.posX =  boundX; d.velX = -Math.abs(d.velX)*0.7; }
      if(d.posZ < -boundZ){ d.posZ = -boundZ; d.velZ = Math.abs(d.velZ)*0.7; }
      if(d.posZ >  boundZ){ d.posZ =  boundZ; d.velZ = -Math.abs(d.velZ)*0.7; }

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

        // Show + measure the canvas first so spawn positions respect the
        // actual visible bounds (a narrow panel has a much smaller floor).
        canvas.style.display = 'block';
        resize();

        var N = items.length;
        // Ring radius grows with number of dice to avoid crowding, but never
        // beyond the visible area.
        var ringR = Math.min(5 + Math.min(3, (N-1)*0.4), Math.min(boundX, boundZ) - 0.5);

        dice = items.map(function(type, i){
          var angle = (i/N)*Math.PI*2 + (Math.random()-0.5)*0.3;
          var dist = ringR + (Math.random()-0.5)*1.0;
          var posX = Math.max(-boundX, Math.min(boundX, Math.cos(angle)*dist));
          var posZ = Math.max(-boundZ, Math.min(boundZ, Math.sin(angle)*dist));
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
                case 1: return [2 /*return*/, (function (arr) {
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
                    })(_a.sent())];
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
        spells: [],
        inventory: [],
        features: [],
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
// ---- Toast notifications (bottom-left stack, survives UI rebuilds) ----
function getToastContainer() {
  var c = document.getElementById('dnd-toasts');
  if (!c) {
    c = document.createElement('div');
    c.id = 'dnd-toasts';
    document.body.appendChild(c); // on body, not #root — rebuilds must not wipe toasts
  }
  return c;
}
function clearToasts() {
  var c = document.getElementById('dnd-toasts');
  if (c) c.innerHTML = '';
}
function syncToastClearAll() {
  var c = getToastContainer();
  var count = c.querySelectorAll('.toast').length;
  var btn = c.querySelector('.toastClearAll');
  if (count >= 2 && !btn) {
    btn = h('button', { class: 'toastClearAll' }, ['Clear all']);
    btn.addEventListener('click', clearToasts);
    c.insertBefore(btn, c.firstChild);
  } else if (count < 2 && btn) {
    btn.remove();
  }
}
// ttl in ms; 0 = sticky (stays until dismissed). Default 5s for transient statuses.
function setStatus(msg, ttl) {
  var c = getToastContainer();
  var toast = h('div', { class: 'toast' });
  var close = h('button', { class: 'toastClose', title: 'Dismiss' }, ['✕']);
  close.addEventListener('click', function () { toast.remove(); syncToastClearAll(); });
  toast.appendChild(h('span', {}, [String(msg || '')]));
  toast.appendChild(close);
  c.appendChild(toast);
  var toasts = c.querySelectorAll('.toast');
  if (toasts.length > 8) toasts[0].remove(); // cap the stack
  if (ttl == null) ttl = 5000;
  if (ttl > 0) setTimeout(function () { toast.remove(); syncToastClearAll(); }, ttl);
  syncToastClearAll();
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
var TAB_DEFS = [
  { id: 'actions',   label: 'Actions'   },
  { id: 'spells',    label: 'Spells'    },
  { id: 'inventory', label: 'Inventory' },
  { id: 'features',  label: 'Features'  },
  { id: 'notes',     label: 'Notes'     },
  { id: 'journal',   label: 'Journal'   },
];

var SHEET_CSS = `
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin:0; background:var(--bg); color:var(--tx); font:14px/1.4 "Segoe UI", system-ui, -apple-system, Roboto, sans-serif; overflow-y:auto; }
  #root { min-height:100%; }
  .sheet { max-width:1100px; margin:0 auto; padding:10px; display:flex; flex-direction:column; gap:10px; }

  /* --- Header banner --- */
  .sheetHeader {
    position:sticky; top:0; z-index:50;
    background:var(--header-bg); color:var(--header-tx);
    border-radius:10px; padding:12px 16px;
    display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;
    box-shadow:0 2px 10px rgba(0,0,0,0.25);
  }
  .charName { font-family:Georgia,'Palatino Linotype','Times New Roman',serif; font-size:22px; font-weight:700; letter-spacing:0.3px; }
  .charMeta { font-size:12.5px; opacity:0.78; margin-top:2px; }
  .headerActions { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
  .headerActions .btn {
    background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.28);
    color:var(--header-tx);
  }
  .headerActions .btn:hover { background:rgba(255,255,255,0.18); }
  .headerActions .btn.primary { background:var(--accent); border-color:var(--accent); color:var(--accent-tx); }
  .headerActions .btn.primary:hover { filter:brightness(1.1); background:var(--accent); }
  /* --- Toasts (bottom-left roll results & statuses) --- */
  #dnd-toasts {
    position:fixed; left:10px; bottom:10px; z-index:1100;
    display:flex; flex-direction:column; gap:6px;
    max-width:min(340px, 80vw);
  }
  .toast {
    display:flex; align-items:flex-start; gap:8px;
    background:var(--card-bg); color:var(--tx);
    border:1px solid var(--bd); border-left:3px solid var(--accent);
    border-radius:8px; padding:8px 10px; font-size:12.5px;
    box-shadow:0 4px 14px rgba(0,0,0,0.25);
    animation:toastIn 0.15s ease-out;
  }
  .toast span { flex:1; white-space:pre-wrap; word-break:break-word; }
  .toastClose { background:none; border:none; color:var(--mut); cursor:pointer; padding:0 2px; font-size:12px; flex:none; }
  .toastClose:hover { color:var(--tx); }
  .toastClearAll {
    align-self:flex-start; background:var(--chip); border:1px solid var(--bd);
    color:var(--mut); border-radius:999px; padding:2px 10px; font-size:11px; cursor:pointer;
  }
  .toastClearAll:hover { color:var(--tx); }
  @keyframes toastIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }

  /* --- HP heal/damage (play mode) --- */
  .hpPlayRow { display:flex; align-items:center; justify-content:center; gap:4px; margin-top:6px; }
  .hpPlayRow .inp { width:52px; text-align:center; padding:3px 4px; }

  /* --- Journal entry header --- */
  .journalEntryHeader .jTitle { flex:1; }
  .journalEntryHeader .jDate { width:150px; flex:none; }
  .journalRow { display:flex; align-items:center; gap:8px; padding:6px 2px; border-top:1px solid var(--chip); }
  .journalRow .rowName { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .logLine { display:flex; gap:6px; align-items:baseline; font-size:12.5px; padding:3px 0; border-top:1px solid var(--chip); }
  .logLine span { flex:1; }
  .logLine .btn.small { flex:none; }

  /* --- Generic bits --- */
  .card { background:var(--card-bg); border:1px solid var(--bd); border-radius:10px; padding:12px; min-width:0; }
  .cardTitle { font-size:11px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:var(--mut); text-align:center; margin:0 0 10px; }
  .btn { border:1px solid var(--bd); background:var(--card-bg); color:var(--tx); padding:7px 10px; border-radius:8px; cursor:pointer; font:inherit; }
  .btn:hover { background:var(--btn-hover); }
  .btn.small { padding:3px 6px; font-size:12px; }
  .inp, .sel, textarea {
    width:100%; padding:7px 8px; border:1px solid var(--bd); border-radius:8px;
    background:var(--card-bg); color:var(--tx); font:inherit;
  }
  textarea { min-height:90px; resize:vertical; }
  .lbl { display:block; min-width:0; }
  .lblt { font-size:10.5px; font-weight:600; letter-spacing:0.6px; text-transform:uppercase; color:var(--mut); margin-bottom:3px; }
  .mut { color:var(--mut); }
  .chip { background:var(--chip); border:1px solid var(--bd); padding:5px 8px; border-radius:8px; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
  .emptyHint { color:var(--mut); font-size:13px; padding:6px 0; }

  /* View mode: inputs render as flat text; edit-only chrome disappears */
  .viewing .inp:disabled, .viewing .sel:disabled, .viewing textarea:disabled {
    border-color:transparent; background:transparent; opacity:1; color:var(--tx); cursor:default;
  }
  .viewing .editOnly { display:none !important; }
  .editing .viewOnly { display:none !important; }

  /* --- Ability strip --- */
  .abilityRow { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:8px; }
  @media (max-width:640px) { .abilityRow { grid-template-columns:repeat(3,minmax(0,1fr)); } }
  .abilityBox { background:var(--card-bg); border:1px solid var(--bd); border-radius:10px; padding:8px 4px 10px; text-align:center; }
  .abilityBox .abName { font-size:10px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:var(--mut); margin-bottom:0; }
  .abMod { font-size:24px; font-weight:700; line-height:1.2; margin:2px 0 4px; cursor:pointer; }
  .abMod:hover { color:var(--accent); }
  .abScore { display:inline-block; min-width:34px; padding:1px 9px; border:1px solid var(--bd); border-radius:999px; font-size:12px; color:var(--mut); background:var(--chip); }
  .abScoreInp { width:56px; margin:0 auto; text-align:center; padding:3px 4px; }

  /* --- Vitals --- */
  .vitalsRow { display:grid; grid-template-columns:repeat(4,minmax(80px,1fr)) minmax(210px,1.8fr); gap:8px; align-items:stretch; }
  @media (max-width:760px) { .vitalsRow { grid-template-columns:repeat(2,minmax(0,1fr)); } .vitalHp { grid-column:1 / -1; } }
  .vital { background:var(--card-bg); border:1px solid var(--bd); border-radius:10px; padding:8px 6px; text-align:center; display:flex; flex-direction:column; justify-content:center; gap:2px; min-width:0; }
  .vitalLabel { font-size:10px; font-weight:700; letter-spacing:1.1px; text-transform:uppercase; color:var(--mut); }
  .vitalValue { font-size:21px; font-weight:700; line-height:1.25; }
  .vital .roll { cursor:pointer; }
  .vital .roll:hover { color:var(--accent); }
  .vitalNum { width:64px; margin:0 auto; text-align:center; font-size:18px; font-weight:700; padding:3px 4px; }
  .vitalAc .vitalNum { color:var(--accent); }
  .hpRow { display:flex; align-items:center; justify-content:center; gap:4px; }
  .hpRow .vitalNum { width:56px; margin:0; }
  .hpSlash { font-size:18px; color:var(--mut); }
  .hpTemp { display:flex; align-items:center; justify-content:center; gap:6px; font-size:11px; color:var(--mut); margin-top:2px; }
  .hpTemp .inp { width:52px; text-align:center; padding:2px 4px; }

  /* --- Main grid --- */
  .mainGrid { display:grid; grid-template-columns:minmax(230px,290px) minmax(0,1fr); gap:10px; align-items:start; }
  @media (max-width:840px) { .mainGrid { grid-template-columns:1fr; } }
  .colStack { display:flex; flex-direction:column; gap:10px; min-width:0; }

  /* --- Saving throws --- */
  .savesGrid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
  .saveItem { display:flex; align-items:center; gap:7px; border:1px solid var(--bd); border-radius:8px; padding:5px 8px; background:var(--chip); cursor:pointer; user-select:none; }
  .saveItem:hover { border-color:var(--accent); }
  .saveName { flex:1; font-size:12.5px; font-weight:600; }
  .saveVal { font-weight:700; }
  .pip { width:11px; height:11px; border-radius:50%; border:2px solid var(--mut); flex:none; background:transparent; display:inline-block; }
  .pip.on { background:var(--accent); border-color:var(--accent); }
  .pip.expert { background:var(--accent); border-color:var(--accent); box-shadow:0 0 0 1.5px var(--card-bg), 0 0 0 3px var(--accent); }

  /* --- Senses --- */
  .senseRow { display:flex; justify-content:space-between; align-items:center; gap:8px; padding:4px 2px; font-size:13px; }
  .senseRow + .senseRow { border-top:1px solid var(--chip); }
  .senseVal { font-weight:700; }

  /* --- Skills --- */
  .skillRow { display:grid; grid-template-columns:auto minmax(0,1fr) auto; gap:8px; align-items:center; padding:4px 2px; }
  .skillRow + .skillRow { border-top:1px solid var(--chip); }
  .skillName { font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .skillGroupHead {
    display:flex; justify-content:space-between; align-items:baseline;
    margin:10px 2px 2px; padding-bottom:3px; border-bottom:1px solid var(--bd);
    font-size:10px; font-weight:700; letter-spacing:1.1px; text-transform:uppercase; color:var(--mut);
  }
  .skillGroupHead:first-child { margin-top:0; }
  .skillGroupMod { font-size:11px; font-weight:700; }
  .skillVal { font-weight:700; min-width:34px; text-align:right; cursor:pointer; }
  .skillVal:hover { color:var(--accent); }
  .skillRow .sel { width:74px; padding:2px 4px; }

  /* --- Tabs --- */
  .tabBar { display:flex; gap:2px; border-bottom:2px solid var(--bd); overflow-x:auto; scrollbar-width:none; }
  .tabBar::-webkit-scrollbar { display:none; }
  .tabBtn { background:none; border:none; padding:8px 12px; font:inherit; font-size:12px; font-weight:700; letter-spacing:0.9px; text-transform:uppercase; color:var(--mut); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-2px; white-space:nowrap; }
  .tabBtn:hover { color:var(--tx); }
  .tabBtn.active { color:var(--accent); border-bottom-color:var(--accent); }
  .tabSection { min-width:0; }

  /* --- Actions / Spells tables --- */
  .tableScroll { overflow-x:auto; }
  .tableInner { min-width:480px; }
  .rowsHead, .rowGrid { display:grid; grid-template-columns:1.3fr 0.7fr 0.9fr 1fr 1fr auto; gap:6px; align-items:center; }
  .rowsHead { color:var(--mut); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; padding:0 0 4px; }
  .rowGrid { padding:5px 0; border-top:1px solid var(--chip); }
  .rowGrid .inp { padding:5px 6px; }
  .rowName { font-weight:600; }
  .cell-inline { display:flex; align-items:center; gap:4px; min-width:0; }
  .attack-roll-btn { padding:2px 6px; font-size:12px; line-height:1.2; border-radius:6px; flex:none; }
  .addBtn { margin-top:8px; }

  /* --- Spellcasting --- */
  .spellStatRow { display:grid; grid-template-columns:repeat(auto-fit,minmax(96px,1fr)); gap:8px; margin-bottom:10px; }
  .miscRow { display:flex; align-items:center; justify-content:center; gap:4px; font-size:10.5px; color:var(--mut); }
  .miscRow .inp { width:48px; text-align:center; padding:1px 4px; }
  .slotRow { display:flex; align-items:center; gap:8px; padding:4px 0; }
  .slotRow + .slotRow { border-top:1px solid var(--chip); }
  .slotLvl { width:56px; flex:none; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:var(--mut); }
  .slotTotalInp { width:50px; flex:none; padding:2px 4px; text-align:center; }
  .slotDots { display:flex; flex-wrap:wrap; gap:4px; }
  .dot { width:15px; height:15px; border-radius:50%; border:1.5px solid var(--accent); cursor:pointer; background:transparent; }
  .dot.on { background:var(--accent); }
  .spellsBlock { margin-top:12px; }

  /* --- Collapsible list rows (spells + inventory) --- */
  .srowHead, .srow { display:grid; grid-template-columns:18px minmax(90px,1.3fr) 0.7fr 0.9fr 1fr auto auto; gap:6px; align-items:center; }
  .irowHead, .irow { display:grid; grid-template-columns:18px minmax(0,1.5fr) minmax(70px,0.7fr) auto auto; gap:6px; align-items:center; }
  .frow { display:grid; grid-template-columns:18px minmax(0,1fr) auto auto; gap:6px; align-items:center; }
  /* Actions-tab variants: spells without the toggle column, features name-only */
  .asrowHead, .asrow { display:grid; grid-template-columns:18px minmax(90px,1.3fr) 0.7fr 0.9fr 1fr auto; gap:6px; align-items:center; }
  .afrow { display:grid; grid-template-columns:18px minmax(0,1fr) auto; gap:6px; align-items:center; }
  .ftrow { display:grid; grid-template-columns:minmax(0,1fr) auto auto; gap:6px; align-items:center; }
  .ftStatement { padding:2px 0 2px; }
  .ftStatement textarea { min-height:0; resize:none; color:var(--mut); font-size:12.5px; line-height:1.4; padding:2px 8px; }
  .srowHead, .irowHead, .asrowHead { color:var(--mut); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; padding:0 0 4px; }
  .featText { white-space:pre-wrap; font-size:12.5px; color:var(--tx); }

  /* --- Rich note text (view mode): paragraphs + real tables --- */
  .richText { font-size:12.5px; color:var(--tx); }
  .richText .rtP { margin:0 0 8px; white-space:pre-wrap; }
  .richText .rtP:last-child { margin-bottom:0; }
  .rtTableWrap { overflow-x:auto; margin:4px 0 8px; }
  .rtTable { border-collapse:collapse; font-size:12px; }
  .rtTable th, .rtTable td { border:1px solid var(--bd); padding:3px 9px; text-align:left; white-space:nowrap; }
  .rtTable th { background:var(--chip); font-weight:700; }
  .featSectionHead {
    margin:12px 0 2px; padding:4px 8px;
    background:var(--chip); border:1px solid var(--bd); border-radius:6px;
    font-size:10.5px; font-weight:700; letter-spacing:1.1px; text-transform:uppercase; color:var(--mut);
  }
  .featSectionHead:first-child { margin-top:0; }
  .rowWrap { border-top:1px solid var(--chip); padding:5px 0; }
  .rowWrap .inp { padding:5px 6px; }
  .subRow { padding:8px 0 4px 24px; display:grid; gap:8px; }
  .subRow textarea { min-height:48px; }
  .subGrid3 { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; }
  .caret { background:none; border:none; cursor:pointer; color:var(--mut); padding:0; width:18px; font-size:11px; line-height:1; }
  .caret:hover { color:var(--tx); }
  .actToggle { padding:3px 7px; font-size:12px; line-height:1.2; border-radius:6px; }
  .actToggle.on { color:var(--accent); border-color:var(--accent); }
  .actBadge { color:var(--accent); font-size:12px; }
  .actionsGroup { margin-top:12px; }

  /* --- Journal --- */
  .journalEntry { border:1px solid var(--bd); border-radius:8px; padding:8px; margin-bottom:8px; background:var(--chip); }
  .journalEntryHeader { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px; }
  .journalEntryHeader .inp { width:170px; }

  /* --- Search --- */
  .searchWrap { position:relative; }
  .searchPanel {
    position:absolute; top:calc(100% + 4px); right:0; width:min(380px, 92vw);
    background:var(--card-bg); color:var(--tx); border:1px solid var(--bd);
    border-radius:8px; padding:8px; z-index:70; box-shadow:0 4px 14px rgba(0,0,0,0.25);
  }
  .searchResults { max-height:340px; overflow-y:auto; margin-top:6px; }
  .searchResult { padding:6px 8px; border-radius:6px; cursor:pointer; }
  .searchResult:hover, .searchResult.sel { background:var(--btn-hover); }
  .srCrumb { font-size:10px; text-transform:uppercase; letter-spacing:0.7px; color:var(--mut); }
  .srLabel { font-size:13px; font-weight:600; }
  .srSnippet { font-size:11.5px; color:var(--mut); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .searchHit { animation:searchFlash 1.6s ease-out; }
  @keyframes searchFlash { 0% { box-shadow:0 0 0 3px var(--accent); } 100% { box-shadow:0 0 0 3px transparent; } }

  /* --- Dice dropdown --- */
  .diceWrap { position:relative; display:inline-block; }
  .dice-dropdown {
    position:absolute; top:calc(100% + 4px); left:0; min-width:170px;
    background:var(--card-bg); color:var(--tx); border:1px solid var(--bd);
    border-radius:8px; padding:4px; z-index:60; box-shadow:0 4px 14px rgba(0,0,0,0.2);
  }
  .dice-row { display:flex; justify-content:space-between; align-items:center; padding:6px 10px; cursor:pointer; border-radius:6px; user-select:none; font-family:Georgia,'Palatino Linotype',serif; }
  .dice-row:hover { background:var(--btn-hover); }
  .dice-count { font-weight:bold; color:var(--mut); min-width:20px; text-align:right; }
  .dice-actions { display:flex; gap:6px; padding:6px 4px 4px; margin-top:4px; border-top:1px solid var(--bd); }
  .dice-actions .btn { flex:1; background:var(--card-bg); border-color:var(--bd); color:var(--tx); }
  .dice-actions .btn:hover { background:var(--btn-hover); }
  .dice-actions .btn.dice-roll { background:var(--accent); border-color:var(--accent); color:var(--accent-tx); }
`;

function charMetaText() {
  var bits = [];
  if (ch.level) bits.push('Level ' + ch.level);
  if (ch.race) bits.push(ch.race);
  if (ch.class) bits.push(ch.class);
  if (ch.background) bits.push(ch.background);
  if (ch.alignment) bits.push(ch.alignment);
  return bits.length ? bits.join(' • ') : 'Click Edit to fill in this character';
}

// Parse "2d6+1d4+3"-style expressions into 3D-roller dice counts + flat modifier.
// Returns null when the expression can't be animated (no dice, unsupported die
// types, negative dice terms, or an absurd number of dice) — callers fall back
// to the text roller.
function parseDiceExpr(expr) {
  var s = String(expr == null ? '' : expr).replace(/\s+/g, '');
  if (!s) return null;
  if (!/^[+-]?(?:\d*d\d+|\d+)(?:[+-](?:\d*d\d+|\d+))*$/i.test(s)) return null;
  if (!/^[+-]/.test(s)) s = '+' + s;
  var counts = { d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0 };
  var mod = 0, diceCount = 0;
  var re = /([+-])(\d*d\d+|\d+)/gi, m;
  while ((m = re.exec(s)) !== null) {
    var sign = m[1] === '-' ? -1 : 1;
    var term = m[2].toLowerCase();
    if (term.indexOf('d') !== -1) {
      if (sign < 0) return null;
      var dm = /^(\d*)d(\d+)$/.exec(term);
      var n = dm[1] ? parseInt(dm[1], 10) : 1;
      var key = 'd' + dm[2];
      if (!(key in counts) || n < 1) return null;
      counts[key] += n;
      diceCount += n;
    } else {
      mod += sign * parseInt(term, 10);
    }
  }
  if (!diceCount || diceCount > 10) return null;
  return { counts: counts, mod: mod };
}

// Does the text contain at least one rollable dice term (any die size)?
function containsDice(v) {
  return /(?:^|[+\-])\d*d\d+/i.test(String(v == null ? '' : v).replace(/\s+/g, ''));
}

// Is the text a plain integer modifier like "+5", "-1", "3"?
function isRollableMod(v) {
  return /^[+-]?\d+$/.test(String(v == null ? '' : v).trim());
}

// ---- Play session (rolls are logged to a journal entry while active) ----
var session = null; // { title, date, lines: [] }
var healAmount = 1;
var playSaveTimer = null;

function sessionStorageKey() { return 'dnd.session.' + (currentNoteId || 'unknown'); }
function loadSessionState() {
  try { session = JSON.parse(localStorage.getItem(sessionStorageKey()) || 'null'); }
  catch { session = null; }
  if (session && !Array.isArray(session.lines)) session.lines = [];
}
function saveSessionState() {
  try {
    if (session) localStorage.setItem(sessionStorageKey(), JSON.stringify(session));
    else localStorage.removeItem(sessionStorageKey());
  } catch {}
}

// Journal entries live as notes in a "Character Journal" notebook inside the
// character's folder; the sheet's Journal tab lists them via the host.
var journalNotes = [];   // [{id, title, date}]
var journalEntry = null; // entry of the journal NOTE currently shown (journal view)
var journalNoteId = null;

function logSession(text) {
  if (!session) return;
  var t = new Date();
  var hh = ('0' + t.getHours()).slice(-2), mm = ('0' + t.getMinutes()).slice(-2);
  session.lines.push('[' + hh + ':' + mm + '] ' + text);
  saveSessionState();
  renderJournal();
}

function postSave() {
  if (api) api.postMessage({ type: 'save', character: ch });
  else saveLocal(ch);
}

// Debounced save for play-mode interactions (heal/damage clicks)
function schedulePlaySave() {
  if (playSaveTimer) clearTimeout(playSaveTimer);
  playSaveTimer = setTimeout(function () { playSaveTimer = null; postSave(); }, 900);
}

function startSession() {
  var titles = journalNotes.map(function (n) { return n.title; })
    .concat((ch.journal || []).map(function (e) { return (e && e.title) || ''; }));
  var maxN = 0;
  titles.forEach(function (t) {
    var m = /^Session (\d+)/.exec(String(t || ''));
    if (m) maxN = Math.max(maxN, parseInt(m[1], 10));
  });
  var date = new Date().toISOString().slice(0, 10);
  session = { title: 'Session ' + (maxN + 1) + ' - ' + date, date: date, lines: [] };
  saveSessionState();
  buildUI();
  setStatus(session.title + ' started — dice rolls will be logged to the journal');
}

function endSession() {
  if (!session) return;
  var entry = {
    title: session.title,
    date: session.date,
    character: ch.name || '',
    log: session.lines.slice(),
    text: '',
  };
  session = null;
  saveSessionState();
  if (api) {
    api.postMessage({ type: 'journalCreate', entry: entry });
  } else {
    // Offline fallback: keep the entry embedded in the sheet
    ch.journal = ch.journal || [];
    ch.journal.unshift({ title: entry.title, date: entry.date, text: entry.log.join('\n') });
    saveLocal(ch);
  }
  buildUI();
  setStatus(entry.title + ' ended — saving log to the Character Journal…');
}

function rollTo(expr, label) {
  var parsed = parseDiceExpr(expr);
  if (parsed && diceRenderer) {
    diceRenderer.roll(function (sum, breakdown) {
      var total = sum + parsed.mod;
      var parts = Object.keys(breakdown).map(function (t) {
        return t + ' [' + breakdown[t].join(', ') + ']';
      });
      if (parsed.mod) parts.push(parsed.mod > 0 ? '+' + parsed.mod : String(parsed.mod));
      var text = (label ? label + ': ' : 'Roll: ') + total + ' (' + parts.join(' ') + ')';
      setStatus(text, 0);
      logSession(text);
    }, parsed.counts);
    return;
  }
  // Text fallback: handles odd dice (d3, d100), negative dice terms, huge pools
  var r = rollCompositeDamage(String(expr || '0'));
  var text = (label ? label + ': ' : 'Roll: ') + r.total + ' (' + r.detail + ')';
  setStatus(text, 0);
  logSession(text);
}

// Track the document-level dice-dropdown close handler across rebuilds
var docCloseDiceDropdown = null;
var docCloseSearch = null;

// ---- Search & Query ----
var ABILITY_FULLNAMES = {
  STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
  INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma',
};

// Build a flat, searchable index of the whole sheet. nav describes how to get
// to the entry: tab to open, rowkey/expand for collapsible rows, elId for
// always-visible sheet elements.
function buildSearchIndex() {
  var idx = [];
  function add(tab, tabLabel, table, label, textParts, nav) {
    label = String(label || '').trim();
    if (!label) return;
    idx.push({
      tab: tab, tabLabel: tabLabel, table: table, label: label,
      text: textParts.filter(Boolean).map(String).join(' \n '),
      nav: nav || {},
    });
  }

  (ch.attacks || []).forEach(function (a, i) {
    add('actions', 'Actions', 'Attacks', a.name, [a.name, a.range, a.hitDc, a.damage, a.notes], { rowkey: 'atk:' + i });
  });
  (ch.spells || []).forEach(function (sp, i) {
    add('spells', 'Spells', 'Spells', sp.name, [sp.name, sp.range, sp.hitDc, sp.damage, sp.notes], { rowkey: 'spell:' + i, expand: 'spell:' + i });
  });
  (ch.inventory || []).forEach(function (it, i) {
    add('inventory', 'Inventory', 'Items', it.name, [it.name, it.value, it.desc, it.notes], { rowkey: 'inv:' + i, expand: 'inv:' + i });
  });
  (ch.features || []).forEach(function (ft, i) {
    add('features', 'Features', featureSection(ft && ft.source), ft.name, [ft.name, ft.source, ft.notes], { rowkey: 'feat:' + i, expand: 'feat:' + i });
  });
  if (ch.notes) {
    add('notes', 'Notes', 'Notes', String(ch.notes).split('\n')[0].slice(0, 60), [ch.notes], {});
  }
  (journalNotes || []).forEach(function (n, i) {
    add('journal', 'Journal', 'Character Journal', n.title, [n.title, n.date], { rowkey: 'jnote:' + i });
  });
  (ch.journal || []).forEach(function (e, i) {
    add('journal', 'Journal', 'Legacy Entries', (e && (e.title || e.date)) || 'Entry', [e && e.title, e && e.date, e && e.text], {});
  });

  // Always-visible sheet stats
  SKILLS.forEach(function (sk) {
    add(null, 'Sheet', 'Skills', sk, [sk, SKILL_TO_ABILITY[sk], ABILITY_FULLNAMES[SKILL_TO_ABILITY[sk]]], { elId: 'skill.total.' + sk });
  });
  ABILITIES.forEach(function (a) {
    add(null, 'Sheet', 'Abilities', a, [a, ABILITY_FULLNAMES[a]], { elId: 'abil.mod.' + a });
    add(null, 'Sheet', 'Saving Throws', a + ' save', [a + ' save', ABILITY_FULLNAMES[a] + ' saving throw'], { elId: 'save.total.' + a });
  });
  return idx;
}

function searchSnippet(text, q) {
  var i = text.toLowerCase().indexOf(q);
  if (i === -1) return '';
  var start = Math.max(0, i - 28);
  return (start > 0 ? '…' : '') + text.slice(start, i + q.length + 60).replace(/\s+/g, ' ').trim() + '…';
}

function searchSheet(query) {
  var q = String(query || '').trim().toLowerCase();
  if (q.length < 2) return [];
  var hits = [];
  buildSearchIndex().forEach(function (e) {
    var inLabel = e.label.toLowerCase().indexOf(q) !== -1;
    var inText = e.text.toLowerCase().indexOf(q) !== -1;
    if (!inLabel && !inText) return;
    hits.push({ e: e, rank: inLabel ? 0 : 1, snippet: inLabel ? '' : searchSnippet(e.text, q) });
  });
  hits.sort(function (a, b) { return a.rank - b.rank; });
  return hits.slice(0, 30);
}

// Navigate to a search result: switch tab, expand the row, scroll + flash.
function gotoSearchResult(hit) {
  var e = hit.e;
  if (e.nav.expand) expandedRows[e.nav.expand] = true;
  if (e.tab) {
    var tb = document.querySelector('.tabBar .tabBtn[data-tab="' + e.tab + '"]');
    if (tb) tb.click(); // switches tab + re-renders all lists
  }
  var el = null;
  if (e.nav.elId) el = document.getElementById(e.nav.elId);
  else if (e.nav.rowkey) el = document.querySelector('[data-rowkey="' + e.nav.rowkey + '"]');
  else if (e.tab) el = document.querySelector('.tabSection[data-tabid="' + e.tab + '"]');
  if (!el) return;
  var target = el.closest && (el.closest('.skillRow, .saveItem, .abilityBox, .rowWrap, .rowGrid, .journalRow') || el) || el;
  if (typeof target.scrollIntoView === 'function') {
    try { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch { try { target.scrollIntoView(); } catch {} }
  }
  target.classList.remove('searchHit');
  void target.offsetWidth; // restart the animation
  target.classList.add('searchHit');
  setTimeout(function () { target.classList.remove('searchHit'); }, 1800);
}

function makeSearchWidget() {
  var wrapEl = h('div', { class: 'searchWrap' });
  var btn = h('button', { class: 'btn', title: 'Search character sheet' }, ['🔍']);
  var panel = h('div', { class: 'searchPanel', style: { display: 'none' } });
  var input = h('input', { class: 'inp playInput', placeholder: 'Search your sheet…' });
  var results = h('div', { class: 'searchResults' });
  panel.appendChild(input);
  panel.appendChild(results);
  var selIndex = -1;
  var currentHits = [];

  function close() { panel.style.display = 'none'; }
  function renderResults() {
    currentHits = searchSheet(input.value);
    selIndex = -1;
    results.innerHTML = '';
    if (!currentHits.length) {
      if (String(input.value).trim().length >= 2) {
        results.appendChild(h('div', { class: 'emptyHint' }, ['No matches.']));
      }
      return;
    }
    currentHits.forEach(function (hit, i) {
      var row = h('div', { class: 'searchResult' }, [
        h('div', { class: 'srCrumb' }, [hit.e.tabLabel + ' › ' + hit.e.table]),
        h('div', { class: 'srLabel' }, [hit.e.label]),
      ]);
      if (hit.snippet) row.appendChild(h('div', { class: 'srSnippet' }, [hit.snippet]));
      row.addEventListener('click', function () { close(); gotoSearchResult(hit); });
      results.appendChild(row);
    });
  }
  function updateSel() {
    Array.from(results.querySelectorAll('.searchResult')).forEach(function (r, i) {
      r.classList.toggle('sel', i === selIndex);
      if (i === selIndex && typeof r.scrollIntoView === 'function') r.scrollIntoView({ block: 'nearest' });
    });
  }

  btn.addEventListener('click', function (ev) {
    ev.stopPropagation();
    var opening = panel.style.display === 'none';
    panel.style.display = opening ? 'block' : 'none';
    if (opening) { input.focus(); renderResults(); }
  });
  panel.addEventListener('click', function (ev) { ev.stopPropagation(); });
  input.addEventListener('input', renderResults);
  input.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { close(); return; }
    if (ev.key === 'ArrowDown') { ev.preventDefault(); selIndex = Math.min(currentHits.length - 1, selIndex + 1); updateSel(); return; }
    if (ev.key === 'ArrowUp') { ev.preventDefault(); selIndex = Math.max(0, selIndex - 1); updateSel(); return; }
    if (ev.key === 'Enter' && currentHits.length) {
      var hit = currentHits[selIndex >= 0 ? selIndex : 0];
      close();
      gotoSearchResult(hit);
    }
  });
  if (docCloseSearch) document.removeEventListener('click', docCloseSearch);
  docCloseSearch = close;
  document.addEventListener('click', docCloseSearch);

  wrapEl.appendChild(btn);
  wrapEl.appendChild(panel);
  return wrapEl;
}

function buildUI() {
  var root = document.getElementById('root');
  if (!root) return;

  // (Re)install stylesheet without stacking duplicates on rebuilds
  var style = document.getElementById('dnd-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'dnd-style';
    document.head.appendChild(style);
  }
  style.textContent = SHEET_CSS;

  // Apply cached theme immediately to avoid flash of default colors
  applyTheme(localStorage.getItem('dnd.theme') || 'light');

  var sheet = h('div', { class: 'sheet ' + (isEditing ? 'editing' : 'viewing') });

  // ===== Header banner =====
  function makeDiceWidget() {
    var diceWrap = h('div', { class: 'diceWrap' });
    var diceBtn = h('button', { class: 'btn' }, ['🎲 Dice']);
    var dropdown = h('div', { class: 'dice-dropdown', style: { display: 'none' } });
    var counts = { d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0 };
    var DIE_TYPES = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

    function renderDropdown() {
      dropdown.innerHTML = '';
      DIE_TYPES.forEach(function (type) {
        var countSpan = h('span', { class: 'dice-count' }, [String(counts[type])]);
        var row = h('div', { class: 'dice-row' }, [h('span', {}, [type]), countSpan]);
        row.addEventListener('click', function (e) {
          e.stopPropagation();
          counts[type]++;
          countSpan.textContent = String(counts[type]);
        });
        dropdown.appendChild(row);
      });
      var actions = h('div', { class: 'dice-actions' });
      var resetBtn = h('button', { class: 'btn small' }, ['Reset']);
      var rollBtn = h('button', { class: 'btn small dice-roll' }, ['Roll']);
      resetBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        DIE_TYPES.forEach(function (t) { counts[t] = 0; });
        renderDropdown();
      });
      rollBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var total = DIE_TYPES.reduce(function (a, t) { return a + counts[t]; }, 0);
        if (total === 0) { setStatus('No dice selected'); return; }
        var rollCounts = Object.assign({}, counts);
        dropdown.style.display = 'none';
        DIE_TYPES.forEach(function (t) { counts[t] = 0; });
        renderDropdown();
        if (diceRenderer) {
          diceRenderer.roll(function (sum, breakdown) {
            var parts = DIE_TYPES.filter(function (t) { return breakdown[t]; }).map(function (t) {
              return t + ': ' + breakdown[t].join('+');
            });
            var text = 'Roll: ' + sum + ' (' + parts.join(', ') + ')';
            setStatus(text, 0);
            logSession(text);
          }, rollCounts);
        } else {
          setStatus('Dice renderer unavailable');
        }
      });
      actions.appendChild(resetBtn);
      actions.appendChild(rollBtn);
      dropdown.appendChild(actions);
    }
    renderDropdown();

    diceBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    dropdown.addEventListener('click', function (e) { e.stopPropagation(); });
    if (docCloseDiceDropdown) document.removeEventListener('click', docCloseDiceDropdown);
    docCloseDiceDropdown = function () { dropdown.style.display = 'none'; };
    document.addEventListener('click', docCloseDiceDropdown);

    diceWrap.appendChild(diceBtn);
    diceWrap.appendChild(dropdown);
    return diceWrap;
  }

  var headerActions = h('div', { class: 'headerActions' });
  headerActions.appendChild(makeSearchWidget());
  headerActions.appendChild(makeDiceWidget());
  if (!isEditing) {
    var sessBtn;
    if (!session) {
      sessBtn = h('button', { class: 'btn', title: 'Start a play session — dice rolls get logged to a journal entry' }, ['▶ Session']);
      sessBtn.addEventListener('click', startSession);
    } else {
      sessBtn = h('button', { class: 'btn', title: 'End "' + session.title + '" and save the roll log to the journal' }, ['■ End Session']);
      sessBtn.addEventListener('click', endSession);
    }
    headerActions.appendChild(sessBtn);
    if (ch.ddbId != null) {
      var syncBtn = h('button', { class: 'btn', title: 'Re-sync this character from D&D Beyond (keeps journal, notes and expended slots)' }, ['↻ Sync']);
      syncBtn.addEventListener('click', function () {
        if (api) { api.postMessage({ type: 'ddbSync' }); setStatus('Syncing from D&D Beyond…'); }
        else setStatus('Sync requires the Joplin host');
      });
      headerActions.appendChild(syncBtn);
    }
    var editBtn = h('button', { class: 'btn primary' }, ['Edit']);
    editBtn.addEventListener('click', function () { isEditing = true; buildUI(); });
    headerActions.appendChild(editBtn);
  } else {
    var saveBtn = h('button', { class: 'btn primary' }, ['Save']);
    saveBtn.addEventListener('click', function () {
      isEditing = false;
      if (api) api.postMessage({ type: 'save', character: ch });
      else saveLocal(ch);
      buildUI();
      setStatus(api ? 'Saving…' : 'Saved locally ✓');
    });
    var cancelBtn = h('button', { class: 'btn' }, ['Cancel']);
    cancelBtn.addEventListener('click', function () {
      isEditing = false;
      buildUI();
      if (api) { api.postMessage({ type: 'load' }); setStatus('Reverting…'); }
    });
    headerActions.appendChild(saveBtn);
    headerActions.appendChild(cancelBtn);
  }

  sheet.appendChild(h('div', { class: 'sheetHeader' }, [
    h('div', { class: 'charTitle' }, [
      h('div', { class: 'charName', id: 'hdr.name' }, [ch.name || 'Unnamed Character']),
      h('div', { class: 'charMeta', id: 'hdr.meta' }, [charMetaText()]),
    ]),
    headerActions,
  ]));

  // ===== Identity (edit mode only — shown as header text otherwise) =====
  sheet.appendChild(h('div', { class: 'card editOnly' }, [
    h('h3', { class: 'cardTitle' }, ['Identity']),
    h('div', { class: 'grid2' }, [
      labeledInput('Name', 'id.name', ch.name, function (v) { return update({ name: v }); }),
      labeledNumber('Level', 'id.level', ch.level, function (v) { return update({ level: clamp(v, 1, 20) }); }, 1, 20),
    ]),
    h('div', { class: 'grid2', style: { marginTop: '8px' } }, [
      labeledInput('Class', 'id.class', ch.class, function (v) { return update({ class: v }); }),
      labeledInput('Species / Race', 'id.race', ch.race || '', function (v) { return update({ race: v }); }),
    ]),
    h('div', { class: 'grid2', style: { marginTop: '8px' } }, [
      labeledInput('Background', 'id.background', ch.background || '', function (v) { return update({ background: v }); }),
      labeledInput('Alignment', 'id.alignment', ch.alignment || '', function (v) { return update({ alignment: v }); }),
    ]),
  ]));

  // ===== Ability score strip =====
  var abilityRow = h('div', { class: 'abilityRow' });
  ABILITIES.forEach(function (a) {
    var modEl = h('div', { class: 'abMod', id: 'abil.mod.' + a, title: 'Roll ' + a + ' check' }, [fmtSigned(derived.mods[a])]);
    modEl.addEventListener('click', function () { rollTo('1d20' + signed(derived.mods[a]), a + ' check'); });
    var scoreView = h('span', { class: 'abScore viewOnly', id: 'abil.score.' + a }, [String(ch.abilities[a])]);
    var scoreInp = h('input', { class: 'inp abScoreInp editOnly', type: 'number', value: ch.abilities[a], min: 1, max: 30 });
    scoreInp.addEventListener('input', function () { updateDeep('abilities.' + a, clamp(int(scoreInp.value, ch.abilities[a]), 1, 30)); });
    var box = h('div', { class: 'abilityBox', 'data-ability': a }, [
      h('div', { class: 'abName lblt' }, [a]),
      modEl,
      scoreView,
      scoreInp,
    ]);
    attachAbilityTooltip(box, a);
    abilityRow.appendChild(box);
  });
  sheet.appendChild(abilityRow);

  // ===== Vitals band =====
  function vitalTile(label, node, extraClass) {
    return h('div', { class: 'vital' + (extraClass ? ' ' + extraClass : '') }, [
      h('div', { class: 'vitalLabel' }, [label]),
      node,
    ]);
  }

  var pbTile = vitalTile('Proficiency', h('div', { class: 'vitalValue' }, [
    h('span', { id: 'derived.pb' }, [fmtSigned(derived.proficiencyBonus)]),
  ]));

  var speedInp = h('input', { class: 'inp vitalNum', value: ch.speed || '' });
  speedInp.style.fontSize = '16px';
  speedInp.style.width = '84px';
  speedInp.addEventListener('input', function () { update({ speed: speedInp.value }); });
  var speedTile = vitalTile('Speed', speedInp);

  var initVal = h('div', { class: 'vitalValue roll', title: 'Roll initiative' }, [
    h('span', { id: 'derived.initiative' }, [fmtSigned(derived.initiative)]),
  ]);
  initVal.addEventListener('click', function () { rollTo('1d20' + signed(derived.initiative), 'Initiative'); });
  var initTile = vitalTile('Initiative', initVal);

  var acInp = h('input', { class: 'inp vitalNum', type: 'number', value: ch.armorClass, min: 0, max: 40 });
  acInp.addEventListener('input', function () { update({ armorClass: clamp(int(acInp.value, ch.armorClass), 0, 40) }); });
  var acTile = vitalTile('Armor Class', acInp, 'vitalAc');

  var hpCur = h('input', { class: 'inp vitalNum', type: 'number', value: ch.currentHP, min: 0 });
  var hpMax = h('input', { class: 'inp vitalNum', type: 'number', value: ch.maxHP, min: 1 });
  var hpTmp = h('input', { class: 'inp', type: 'number', value: ch.tempHP || 0, min: 0 });
  hpCur.addEventListener('input', function () { update({ currentHP: clamp(int(hpCur.value, ch.currentHP), 0, ch.maxHP) }); });
  hpMax.addEventListener('input', function () { update({ maxHP: Math.max(1, int(hpMax.value, ch.maxHP)) }); });
  hpTmp.addEventListener('input', function () { update({ tempHP: Math.max(0, int(hpTmp.value, 0)) }); });
  // Heal/damage controls: usable while viewing (play mode); direct HP inputs
  // cover the edit-mode case. Damage is absorbed by temp HP first (5e rules).
  var amtInp = h('input', { class: 'inp playInput', type: 'number', value: healAmount, min: 1, title: 'Amount' });
  amtInp.addEventListener('input', function () { healAmount = Math.max(1, int(amtInp.value, 1)); });
  function applyHp(delta) {
    var amt = Math.max(1, int(amtInp.value, healAmount));
    var cur = Number(ch.currentHP || 0), tmp = Number(ch.tempHP || 0);
    var text;
    if (delta < 0) {
      var absorbed = Math.min(tmp, amt);
      tmp -= absorbed;
      cur = Math.max(0, cur - (amt - absorbed));
      text = 'Took ' + amt + ' damage — HP ' + cur + '/' + ch.maxHP + (tmp ? ' (+' + tmp + ' temp)' : '');
    } else {
      cur = Math.min(Number(ch.maxHP || 1), cur + amt);
      text = 'Healed ' + amt + ' — HP ' + cur + '/' + ch.maxHP;
    }
    ch.currentHP = cur; ch.tempHP = tmp;
    hpCur.value = cur; hpTmp.value = tmp;
    derived = computeDerived(ch);
    renderDynamic();
    setStatus(text);
    logSession(text);
    schedulePlaySave();
  }
  var hpDmgBtn = h('button', { class: 'btn small playInput', title: 'Take damage (temp HP absorbs first)' }, ['− Dmg']);
  hpDmgBtn.addEventListener('click', function () { applyHp(-1); });
  var hpHealBtn = h('button', { class: 'btn small playInput', title: 'Heal' }, ['+ Heal']);
  hpHealBtn.addEventListener('click', function () { applyHp(1); });

  var hpTile = vitalTile('Hit Points', h('div', {}, [
    h('div', { class: 'hpRow' }, [hpCur, h('span', { class: 'hpSlash' }, ['/']), hpMax]),
    h('div', { class: 'hpTemp' }, [h('span', {}, ['TEMP']), hpTmp]),
    h('div', { class: 'hpPlayRow viewOnly' }, [hpDmgBtn, amtInp, hpHealBtn]),
  ]), 'vitalHp');

  sheet.appendChild(h('div', { class: 'vitalsRow' }, [pbTile, speedTile, initTile, acTile, hpTile]));

  // ===== Main two-column body =====
  var leftCol = h('div', { class: 'colStack' });
  var rightCol = h('div', { class: 'colStack' });
  sheet.appendChild(h('div', { class: 'mainGrid' }, [leftCol, rightCol]));

  // --- Saving throws ---
  var savesGrid = h('div', { class: 'savesGrid' });
  ABILITIES.forEach(function (a) {
    var on = !!ch.savingThrowsProficiencies[a];
    var pip = h('span', { class: 'pip' + (on ? ' on' : ''), id: 'save.pip.' + a });
    var item = h('div', {
      class: 'saveItem',
      title: isEditing ? 'Toggle proficiency' : 'Roll ' + a + ' save',
    }, [
      pip,
      h('span', { class: 'saveName' }, [a]),
      h('span', { class: 'saveVal', id: 'save.total.' + a }, [fmtSigned(derived.savingThrows[a])]),
    ]);
    item.addEventListener('click', function () {
      if (isEditing) updateDeep('savingThrowsProficiencies.' + a, !ch.savingThrowsProficiencies[a]);
      else rollTo('1d20' + signed(derived.savingThrows[a]), a + ' save');
    });
    savesGrid.appendChild(item);
  });
  leftCol.appendChild(h('div', { class: 'card' }, [
    h('h3', { class: 'cardTitle' }, ['Saving Throws']),
    savesGrid,
  ]));

  // --- Senses ---
  function senseRow(label, id, value) {
    return h('div', { class: 'senseRow' }, [
      h('span', {}, [label]),
      h('span', { class: 'senseVal', id: id }, [String(value)]),
    ]);
  }
  leftCol.appendChild(h('div', { class: 'card' }, [
    h('h3', { class: 'cardTitle' }, ['Senses']),
    senseRow('Passive Perception', 'derived.pp', derived.passivePerception),
    senseRow('Passive Insight', 'derived.pins', 10 + (derived.skills['Insight'] || 0)),
    senseRow('Passive Investigation', 'derived.pinv', 10 + (derived.skills['Investigation'] || 0)),
  ]));

  // --- Skills (grouped under their parent ability) ---
  var skillsWrap = h('div', {});
  ABILITIES.forEach(function (a) {
    var group = SKILLS.filter(function (sk) { return SKILL_TO_ABILITY[sk] === a; });
    if (!group.length) return; // CON has no skills
    skillsWrap.appendChild(h('div', { class: 'skillGroupHead' }, [
      h('span', {}, [ABILITY_FULLNAMES[a] || a]),
      h('span', { class: 'skillGroupMod', id: 'skillhdr.mod.' + a }, [fmtSigned(derived.mods[a])]),
    ]));
    group.forEach(function (sk) {
      var lvl = ch.skillsProficiencies[sk] || 'none';
      var pip = h('span', { class: 'pip viewOnly' + (lvl === 'expert' ? ' expert' : lvl === 'prof' ? ' on' : ''), id: 'skill.pip.' + sk });
      var sel = selectProf(lvl, function (p) { return updateDeep('skillsProficiencies.' + sk, p); });
      sel.classList.add('editOnly');
      var profCell = h('span', { style: { display: 'inline-flex', alignItems: 'center' } }, [pip, sel]);
      var name = h('span', { class: 'skillName' }, [sk]);
      var val = h('span', { class: 'skillVal', id: 'skill.total.' + sk, title: 'Roll ' + sk }, [fmtSigned(derived.skills[sk])]);
      val.addEventListener('click', function () { rollTo('1d20' + signed(derived.skills[sk]), sk); });
      skillsWrap.appendChild(h('div', { class: 'skillRow' }, [profCell, name, val]));
    });
  });
  leftCol.appendChild(h('div', { class: 'card' }, [
    h('h3', { class: 'cardTitle' }, ['Skills']),
    skillsWrap,
  ]));

  // --- Tab bar + sections ---
  var tabBar = h('div', { class: 'tabBar' });
  var sections = {};
  TAB_DEFS.forEach(function (t) {
    var b = h('button', { class: 'tabBtn', 'data-tab': t.id }, [t.label]);
    b.addEventListener('click', function () {
      setActiveTab(t.id);
      // Spells/items are shared with the Actions tab (and the journal gets
      // session log lines) — re-render so tabs stay in sync.
      renderActions(); renderSpells(); renderInventory(); renderFeatures(); renderJournal();
      showActiveTab();
    });
    tabBar.appendChild(b);
  });
  rightCol.appendChild(tabBar);

  function showActiveTab() {
    if (!sections[activeTab]) activeTab = TAB_DEFS[0].id;
    Array.from(tabBar.querySelectorAll('.tabBtn')).forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-tab') === activeTab);
    });
    Object.keys(sections).forEach(function (id) {
      sections[id].style.display = id === activeTab ? '' : 'none';
    });
  }

  // --- Actions section ---
  var actionsCard = h('div', { class: 'card tabSection' }, [
    h('h3', { class: 'cardTitle' }, ['Actions & Attacks']),
    h('div', { class: 'tableScroll' }, [h('div', { class: 'tableInner' }, [
      h('div', { class: 'rowsHead' }, [
        h('div', {}, ['Attack']), h('div', {}, ['Range']), h('div', {}, ['Hit / DC']),
        h('div', {}, ['Damage']), h('div', {}, ['Notes']), h('div', {}, ['']),
      ]),
      h('div', { id: 'attacks.list' }),
    ])]),
  ]);
  var addAtk = h('button', { class: 'btn addBtn editOnly' }, ['+ Add attack']);
  addAtk.addEventListener('click', function () {
    ch.attacks.push({ name: 'New Attack', range: 'Melee', hitDc: '+0', damage: '1d6+2', notes: '' });
    renderActions();
  });
  actionsCard.appendChild(addAtk);

  // Spells: same layout as the Spells tab (no Notes column; notes drop down)
  actionsCard.appendChild(h('div', { class: 'actionsGroup', id: 'actions.spells.group' }, [
    h('div', { class: 'lblt' }, ['Spells']),
    h('div', { class: 'tableScroll' }, [h('div', { class: 'tableInner' }, [
      h('div', { class: 'asrowHead' }, [
        h('div', {}, ['']), h('div', {}, ['Spell']), h('div', {}, ['Range']),
        h('div', {}, ['Hit / DC']), h('div', {}, ['Damage']), h('div', {}, ['']),
      ]),
      h('div', { id: 'actions.spells.list' }),
    ])]),
  ]));
  // Features: name-only rows that expand into their details
  actionsCard.appendChild(h('div', { class: 'actionsGroup', id: 'actions.features.group' }, [
    h('div', { class: 'lblt' }, ['Features & Abilities']),
    h('div', { id: 'actions.features.list' }),
  ]));
  // Equipment: keeps the full combat row (stats live on the item itself)
  actionsCard.appendChild(h('div', { class: 'actionsGroup', id: 'actions.items.group' }, [
    h('div', { class: 'lblt' }, ['Equipment']),
    h('div', { class: 'tableScroll' }, [h('div', { class: 'tableInner' }, [
      h('div', { class: 'rowsHead' }, [
        h('div', {}, ['Item']), h('div', {}, ['Range']), h('div', {}, ['Hit / DC']),
        h('div', {}, ['Damage']), h('div', {}, ['Notes']), h('div', {}, ['']),
      ]),
      h('div', { id: 'actions.items.list' }),
    ])]),
  ]));
  actionsCard.appendChild(h('div', { class: 'emptyHint editOnly' }, ['Tip: flag spells, features and inventory items with ⚔ to include them here.']));
  sections.actions = actionsCard;
  rightCol.appendChild(actionsCard);

  // --- Spells section ---
  var spellsCard = h('div', { class: 'card tabSection' }, [h('h3', { class: 'cardTitle' }, ['Spellcasting'])]);

  var abilView = h('div', { class: 'vitalValue viewOnly' }, [
    h('span', { id: 'spell.ability.view' }, [(ch.spellcasting?.ability && ch.spellcasting.ability !== 'NA') ? ch.spellcasting.ability : '—']),
  ]);
  var abilSel = h('select', { class: 'sel editOnly' }, ['NA'].concat(ABILITIES).map(function (a) {
    return h('option', { value: a, selected: (ch.spellcasting?.ability || 'NA') === a }, [a === 'NA' ? '—' : a]);
  }));
  abilSel.addEventListener('change', function () { updateDeep('spellcasting.ability', abilSel.value); });
  var abilTile = vitalTile('Ability', h('div', {}, [abilView, abilSel]));

  var dcMisc = h('input', { class: 'inp', type: 'number', value: ch.spellcasting?.miscSaveDC || 0 });
  dcMisc.addEventListener('input', function () { updateDeep('spellcasting.miscSaveDC', int(dcMisc.value, 0)); });
  var dcTile = vitalTile('Save DC', h('div', {}, [
    h('div', { class: 'vitalValue' }, [h('span', { id: 'derived.spell.dc' }, [String(derived.spellSaveDC)])]),
    h('div', { class: 'miscRow editOnly' }, [h('span', {}, ['misc']), dcMisc]),
  ]));

  var atkMisc = h('input', { class: 'inp', type: 'number', value: ch.spellcasting?.miscAttackMod || 0 });
  atkMisc.addEventListener('input', function () { updateDeep('spellcasting.miscAttackMod', int(atkMisc.value, 0)); });
  var atkVal = h('div', { class: 'vitalValue roll', title: 'Roll spell attack' }, [
    h('span', { id: 'derived.spell.attack' }, [fmtSigned(derived.spellAtkMod)]),
  ]);
  atkVal.addEventListener('click', function () { rollTo('1d20' + signed(derived.spellAtkMod), 'Spell attack'); });
  var atkTile = vitalTile('Spell Attack', h('div', {}, [
    atkVal,
    h('div', { class: 'miscRow editOnly' }, [h('span', {}, ['misc']), atkMisc]),
  ]));

  var cantripsInp = h('input', { class: 'inp vitalNum', type: 'number', value: ch.spellcasting?.cantripsKnown || 0, min: 0 });
  cantripsInp.style.fontSize = '16px';
  cantripsInp.addEventListener('input', function () { updateDeep('spellcasting.cantripsKnown', Math.max(0, int(cantripsInp.value, 0))); });
  var preparedInp = h('input', { class: 'inp vitalNum', type: 'number', value: ch.spellcasting?.preparedSpells || 0, min: 0 });
  preparedInp.style.fontSize = '16px';
  preparedInp.addEventListener('input', function () { updateDeep('spellcasting.preparedSpells', Math.max(0, int(preparedInp.value, 0))); });

  spellsCard.appendChild(h('div', { class: 'spellStatRow' }, [
    abilTile, dcTile, atkTile,
    vitalTile('Cantrips', cantripsInp),
    vitalTile('Prepared', preparedInp),
  ]));

  // Spell slots — dots to expend/restore; totals editable in edit mode
  var slotsWrap = h('div', {});

  function renderSlotDots(lvl) {
    var dots = slotsWrap.querySelector('.slotDots[data-lvl="' + lvl + '"]');
    if (!dots) return;
    dots.innerHTML = '';
    var total = int(ch.spellcasting?.slots?.[lvl]?.total, 0);
    var used = int(ch.spellcasting?.slots?.[lvl]?.used, 0);
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var on = idx < used;
        var d = h('div', { class: 'dot' + (on ? ' on' : ''), title: on ? 'Click to restore' : 'Click to expend' });
        d.addEventListener('click', function () {
          var cur = int(ch.spellcasting?.slots?.[lvl]?.used, 0);
          updateDeep('spellcasting.slots.' + lvl + '.used', on ? Math.max(0, cur - 1) : Math.min(total, cur + 1));
          renderSlotDots(lvl);
        });
        dots.appendChild(d);
      })(i);
    }
  }

  function makeSlotRow(lvl) {
    var total = int(ch.spellcasting?.slots?.[lvl]?.total, 0);
    var row = h('div', { class: 'slotRow' });
    if (!isEditing && total === 0) row.style.display = 'none';
    row.appendChild(h('span', { class: 'slotLvl' }, ['Level ' + lvl]));
    var totalInp = h('input', { class: 'inp slotTotalInp editOnly', type: 'number', value: total, min: 0, title: 'Total slots' });
    totalInp.addEventListener('input', function () {
      var v = Math.max(0, int(totalInp.value, 0));
      updateDeep('spellcasting.slots.' + lvl + '.total', v);
      if (int(ch.spellcasting?.slots?.[lvl]?.used, 0) > v) updateDeep('spellcasting.slots.' + lvl + '.used', v);
      renderSlotDots(lvl);
    });
    row.appendChild(totalInp);
    row.appendChild(h('div', { class: 'slotDots', 'data-lvl': String(lvl) }));
    slotsWrap.appendChild(row);
    renderSlotDots(lvl);
  }

  var anySlots = false;
  for (var lv = 1; lv <= 9; lv++) {
    if (int(ch.spellcasting?.slots?.[lv]?.total, 0) > 0) { anySlots = true; break; }
  }
  for (var lv2 = 1; lv2 <= 9; lv2++) makeSlotRow(lv2);

  spellsCard.appendChild(h('div', { class: 'spellsBlock' }, [
    h('div', { class: 'lblt' }, ['Spell Slots']),
    (anySlots || isEditing) ? slotsWrap : h('div', { class: 'emptyHint' }, ['No spell slots']),
  ]));

  spellsCard.appendChild(h('div', { class: 'spellsBlock' }, [
    h('div', { class: 'lblt' }, ['Spells']),
    h('div', { class: 'tableScroll' }, [h('div', { class: 'tableInner' }, [
      h('div', { class: 'srowHead' }, [
        h('div', {}, ['']), h('div', {}, ['Spell']), h('div', {}, ['Range']),
        h('div', {}, ['Hit / DC']), h('div', {}, ['Damage']), h('div', {}, ['']), h('div', {}, ['']),
      ]),
      h('div', { id: 'spells.list' }),
    ])]),
  ]));
  var addSpell = h('button', { class: 'btn addBtn editOnly' }, ['+ Add spell']);
  addSpell.addEventListener('click', function () {
    ch.spells.push({ name: 'New Spell', range: '30 ft', hitDc: '+0', damage: '1d6', notes: '' });
    renderSpells();
  });
  spellsCard.appendChild(addSpell);
  sections.spells = spellsCard;
  rightCol.appendChild(spellsCard);

  // --- Inventory section ---
  var invCard = h('div', { class: 'card tabSection' }, [
    h('h3', { class: 'cardTitle' }, ['Inventory']),
    h('div', { class: 'irowHead' }, [
      h('div', {}, ['']), h('div', {}, ['Item']), h('div', {}, ['Value']),
      h('div', {}, ['']), h('div', {}, ['']),
    ]),
    h('div', { id: 'inventory.list' }),
  ]);
  var addItem = h('button', { class: 'btn addBtn editOnly' }, ['+ Add item']);
  addItem.addEventListener('click', function () {
    ch.inventory.push({ name: 'New Item', value: '', desc: '' });
    renderInventory();
  });
  invCard.appendChild(addItem);
  sections.inventory = invCard;
  rightCol.appendChild(invCard);

  // --- Features section ---
  var featCard = h('div', { class: 'card tabSection' }, [
    h('h3', { class: 'cardTitle' }, ['Features & Traits']),
    h('div', { id: 'features.list' }),
  ]);
  var addFeat = h('button', { class: 'btn addBtn editOnly' }, ['+ Add feature']);
  addFeat.addEventListener('click', function () {
    ch.features.push({ name: 'New Feature', source: '', notes: '' });
    renderFeatures();
  });
  featCard.appendChild(addFeat);
  sections.features = featCard;
  rightCol.appendChild(featCard);

  // --- Notes section ---
  var notesTa = h('textarea', { value: ch.notes || '' });
  notesTa.style.minHeight = '180px';
  notesTa.addEventListener('input', function () { return update({ notes: notesTa.value }); });
  var notesCard = h('div', { class: 'card tabSection' }, [
    h('h3', { class: 'cardTitle' }, ['Notes']),
    notesTa,
  ]);
  sections.notes = notesCard;
  rightCol.appendChild(notesCard);

  // --- Journal section ---
  var journalCard = h('div', { class: 'card tabSection' }, [
    h('h3', { class: 'cardTitle' }, ['Journal']),
    h('div', { id: 'journal.list' }),
  ]);
  var addEntry = h('button', { class: 'btn addBtn' }, ['+ New entry']);
  addEntry.addEventListener('click', function () {
    var today = new Date().toISOString().slice(0, 10);
    if (api) {
      api.postMessage({ type: 'journalCreate', entry: { date: today, character: ch.name || '' }, open: true });
      setStatus('Creating journal entry…');
    } else {
      ch.journal = ch.journal || [];
      ch.journal.unshift({ title: '', date: today, text: '' });
      renderJournal();
    }
  });
  journalCard.appendChild(addEntry);
  sections.journal = journalCard;
  rightCol.appendChild(journalCard);

  // ===== Mount =====
  root.innerHTML = '';
  root.appendChild(sheet);

  // WebGL dice overlay
  var diceCanvas = h('canvas', { id: 'dice-canvas' });
  diceCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1000;display:none;';
  root.appendChild(diceCanvas);
  diceRenderer = DiceRenderer.init(diceCanvas);

  // Let search results fall back to the whole section when a row has no anchor
  Object.keys(sections).forEach(function (id) { sections[id].setAttribute('data-tabid', id); });

  renderActions();
  renderSpells();
  renderInventory();
  renderFeatures();
  renderJournal();
  renderDynamic();
  showActiveTab();
  applyEditingState();
}

// ---- Journal note view (rendered when the active note is a journal entry) ----
function buildJournalUI() {
  var root = document.getElementById('root');
  if (!root || !journalEntry) return;

  var style = document.getElementById('dnd-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'dnd-style';
    document.head.appendChild(style);
  }
  style.textContent = SHEET_CSS;
  applyTheme(localStorage.getItem('dnd.theme') || 'light');

  var e = journalEntry;
  var sheet = h('div', { class: 'sheet editing' }); // journal entries are always editable

  // Header
  var saveBtn = h('button', { class: 'btn primary' }, ['Save']);
  var header = h('div', { class: 'sheetHeader' }, [
    h('div', { class: 'charTitle' }, [
      h('div', { class: 'charName', id: 'jhdr.title' }, [e.title || 'Journal Entry']),
      h('div', { class: 'charMeta' }, [[e.character, 'Character Journal'].filter(Boolean).join(' • ')]),
    ]),
    h('div', { class: 'headerActions' }, [saveBtn]),
  ]);
  sheet.appendChild(header);

  var card = h('div', { class: 'card' });

  var titleInput = h('input', { class: 'inp rowName', value: e.title || '', placeholder: 'Entry title' });
  titleInput.addEventListener('input', function () {
    e.title = titleInput.value;
    var hd = document.getElementById('jhdr.title');
    if (hd) hd.textContent = e.title || 'Journal Entry';
  });
  var dateInput = h('input', { class: 'inp', type: 'date', value: e.date || '' });
  dateInput.addEventListener('input', function () { e.date = dateInput.value; });
  card.appendChild(h('div', { class: 'grid2' }, [
    labeledWrap('Title', titleInput),
    labeledWrap('Date', dateInput),
  ]));

  // Roll log
  var logWrap = h('div', { class: 'spellsBlock' });
  logWrap.appendChild(h('div', { class: 'lblt' }, ['Roll Log' + (e.log.length ? ' (' + e.log.length + ')' : '')]));
  if (e.log.length) {
    e.log.forEach(function (line, i) {
      var del = h('button', { class: 'btn small', title: 'Remove line' }, ['✕']);
      del.addEventListener('click', function () { e.log.splice(i, 1); buildJournalUI(); });
      logWrap.appendChild(h('div', { class: 'logLine' }, [h('span', {}, [line]), del]));
    });
  } else {
    logWrap.appendChild(h('div', { class: 'emptyHint' }, ['No rolls were logged for this entry.']));
  }
  card.appendChild(logWrap);

  // Free-form notes
  var ta = h('textarea', { class: 'inp', value: e.text || '', placeholder: 'What happened this session…', rows: estimateRows(e.text, 20) });
  ta.addEventListener('input', function () { e.text = ta.value; });
  card.appendChild(h('div', { class: 'spellsBlock' }, [labeledWrap('Notes', ta)]));

  sheet.appendChild(card);

  saveBtn.addEventListener('click', function () {
    if (api) {
      api.postMessage({ type: 'journalSave', noteId: journalNoteId, entry: e });
      setStatus('Saving journal entry…');
    }
  });

  root.innerHTML = '';
  root.appendChild(sheet);
}

// Enable/disable inputs based on isEditing; edit-only chrome is hidden via CSS
function applyEditingState() {
  var sheet = document.querySelector('.sheet');
  if (!sheet) return;
  sheet.classList.toggle('editing', isEditing);
  sheet.classList.toggle('viewing', !isEditing);
  Array.from(sheet.querySelectorAll('input, select, textarea')).forEach(function (el) {
    // .playInput controls (heal/damage) stay usable while viewing
    el.disabled = !isEditing && !el.classList.contains('playInput');
  });
}

// tiny helper for labeled cells in card-style rows
function labeledWrap(label, child) {
  return h('label', { class: 'lbl' }, [
    h('div', { class: 'lblt' }, [label]),
    child,
  ]);
}

// Expand/collapse state for description rows (session-only, keyed 'spell:N' / 'inv:N')
var expandedRows = {};

// Render note text as formatted content: consecutive "a | b | c" lines become
// a real table (first row = header), everything else becomes paragraphs.
function renderRichText(text) {
  var container = h('div', { class: 'richText' });
  var lines = String(text || '').split('\n');
  var i = 0;
  var buf = [];
  function flushPara() {
    if (buf.length) {
      container.appendChild(h('p', { class: 'rtP' }, [buf.join('\n')]));
      buf = [];
    }
  }
  while (i < lines.length) {
    var line = lines[i];
    var isTableLine = line.indexOf(' | ') !== -1;
    if (isTableLine && i + 1 < lines.length && lines[i + 1].indexOf(' | ') !== -1) {
      flushPara();
      var table = h('table', { class: 'rtTable' });
      var ri = 0;
      while (i < lines.length && lines[i].indexOf(' | ') !== -1) {
        var tr = h('tr', {});
        lines[i].split(' | ').forEach(function (c) {
          tr.appendChild(h(ri === 0 ? 'th' : 'td', {}, [c.trim()]));
        });
        table.appendChild(tr);
        ri++; i++;
      }
      container.appendChild(h('div', { class: 'rtTableWrap' }, [table]));
      continue;
    }
    if (line.trim() === '') { flushPara(); i++; continue; }
    buf.push(line);
    i++;
  }
  flushPara();
  return container;
}

// Size a textarea to roughly fit its content (accounts for soft-wrapped lines)
function estimateRows(text, cap) {
  var est = String(text || '').split('\n').reduce(function (n, line) {
    return n + 1 + Math.floor(line.length / 60);
  }, 0);
  return Math.max(3, Math.min(cap || 12, est));
}

function caretButton(key, title, rerender) {
  var open = !!expandedRows[key];
  var btn = h('button', { class: 'caret', title: (open ? 'Hide ' : 'Show ') + title }, [open ? '▾' : '▸']);
  btn.addEventListener('click', function () {
    expandedRows[key] = !expandedRows[key];
    rerender();
  });
  return btn;
}

// ⚔ toggle: marks a spell/item as shown in the Actions tab.
// Edit mode shows the toggle button; view mode shows a small badge when flagged.
function actionToggle(obj, onToggle) {
  var btn = h('button', {
    class: 'btn small actToggle editOnly' + (obj.action ? ' on' : ''),
    title: obj.action ? 'Remove from Actions tab' : 'Show in Actions tab',
  }, ['⚔']);
  btn.addEventListener('click', function () {
    if (obj.action) delete obj.action; else obj.action = true;
    onToggle();
    renderActions();
  });
  var badge = h('span', { class: 'actBadge viewOnly', title: 'Shown in Actions tab' }, [obj.action ? '⚔' : '']);
  return h('span', { style: { display: 'inline-flex', alignItems: 'center' } }, [btn, badge]);
}

// Shared editable cells (name/range/hit/damage/notes) wired to items[i], with roll handlers.
function makeCombatCells(items, i, kindLabel, syncLegacyToHit) {
  var it = items[i];
  var hitDcVal = (it.hitDc != null ? String(it.hitDc) : (it.toHit != null ? String(it.toHit) : ''));
  var dmgVal = (it.damage != null ? String(it.damage) : '');

  var name = h('input', { class: 'inp rowName', value: it.name || '', placeholder: kindLabel });
  var range = h('input', { class: 'inp', value: (it.range != null ? String(it.range) : '') });

  var hitDcInput = h('input', { class: 'inp', value: hitDcVal, title: 'Attack modifier (e.g. +5) or save DC (e.g. DC 13)' });
  var hitBtn = h('button', { class: 'btn attack-roll-btn', title: 'Roll d20 + modifier' }, ['🎲']);
  var hitWrap = h('div', { class: 'cell-inline' }, [hitDcInput, hitBtn]);

  var dmgInput = h('input', { class: 'inp', value: dmgVal, title: 'Damage dice like 1d8+4 or 2d6+1d4+3' });
  var dmgBtn = h('button', { class: 'btn attack-roll-btn', title: 'Roll damage' }, ['🎲']);
  var dmgWrap = h('div', { class: 'cell-inline' }, [dmgInput, dmgBtn]);

  var notes = h('input', { class: 'inp', value: it.notes || '' });

  // Only offer a roll where there is something to roll: a numeric to-hit
  // modifier (not a DC / empty field), and damage that contains dice.
  function syncRollButtons() {
    hitBtn.style.display = isRollableMod(hitDcInput.value) ? '' : 'none';
    dmgBtn.style.display = containsDice(dmgInput.value) ? '' : 'none';
  }
  syncRollButtons();

  name.addEventListener('input', function () { items[i].name = name.value; });
  range.addEventListener('input', function () { items[i].range = range.value; });
  hitDcInput.addEventListener('input', function () {
    items[i].hitDc = hitDcInput.value;
    if (syncLegacyToHit) items[i].toHit = hitDcInput.value;
    syncRollButtons();
  });
  dmgInput.addEventListener('input', function () {
    items[i].damage = dmgInput.value;
    syncRollButtons();
  });
  notes.addEventListener('input', function () { items[i].notes = notes.value; });

  function rollHit() {
    if (!isRollableMod(hitDcInput.value)) return;
    var mod = parseInt(String(hitDcInput.value).trim(), 10);
    rollTo('1d20' + (mod >= 0 ? '+' + mod : mod), (it.name || kindLabel) + ' hit');
  }
  function rollDamage() {
    var expr = String(dmgInput.value || '').trim();
    if (!containsDice(expr)) return;
    rollTo(expr, (it.name || kindLabel) + ' damage');
  }
  hitBtn.addEventListener('click', rollHit);
  dmgBtn.addEventListener('click', rollDamage);
  hitDcInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') rollHit(); });
  hitDcInput.addEventListener('dblclick', rollHit);
  dmgInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') rollDamage(); });
  dmgInput.addEventListener('dblclick', rollDamage);

  return { name: name, range: range, hitWrap: hitWrap, dmgWrap: dmgWrap, notes: notes };
}

// Full 6-column row for the Actions tab. opts: { onRender, syncLegacyToHit, onRemove, removeTitle, rowKey }
function makeCombatRow(items, i, kindLabel, opts) {
  opts = opts || {};
  var cells = makeCombatCells(items, i, kindLabel, !!opts.syncLegacyToHit);
  var del = h('button', { class: 'btn small editOnly', title: opts.removeTitle || 'Remove' }, ['✕']);
  del.addEventListener('click', function () {
    if (opts.onRemove) opts.onRemove();
    else { items.splice(i, 1); if (opts.onRender) opts.onRender(); }
  });
  var row = h('div', { class: 'rowGrid' }, [cells.name, cells.range, cells.hitWrap, cells.dmgWrap, cells.notes, del]);
  if (opts.rowKey) row.setAttribute('data-rowkey', opts.rowKey);
  return row;
}

// Actions tab: native attacks + spells/items flagged with ⚔ (live-linked, not copies)
function renderActions() {
  var list = document.getElementById('attacks.list');
  if (!list) return;
  list.innerHTML = '';
  if (!ch.attacks.length) {
    list.appendChild(h('div', { class: 'emptyHint' }, ['No attacks yet.']));
  }
  ch.attacks.forEach(function (_, i) {
    list.appendChild(makeCombatRow(ch.attacks, i, 'Attack', { onRender: renderActions, syncLegacyToHit: true, rowKey: 'atk:' + i }));
  });

  function renderFlagged(idBase, items, rowBuilder) {
    var group = document.getElementById(idBase + '.group');
    var sub = document.getElementById(idBase + '.list');
    if (!group || !sub) return;
    sub.innerHTML = '';
    var any = false;
    (items || []).forEach(function (it, i) {
      if (!it || !it.action) return;
      any = true;
      sub.appendChild(rowBuilder(i));
    });
    group.style.display = any ? '' : 'none';
  }
  renderFlagged('actions.spells', ch.spells, function (i) { return buildSpellRow(i, true); });
  renderFlagged('actions.features', ch.features, buildActionFeatureRow);
  renderFlagged('actions.items', ch.inventory, function (i) {
    return makeCombatRow(ch.inventory, i, 'Item', {
      onRender: renderActions,
      removeTitle: 'Remove from Actions',
      onRemove: function () { delete ch.inventory[i].action; renderActions(); renderInventory(); },
    });
  });

  applyEditingState();
}

function renderSpells() {
  var list = document.getElementById('spells.list');
  if (!list) return;
  list.innerHTML = '';
  if (!ch.spells.length) {
    list.appendChild(h('div', { class: 'emptyHint' }, ['No spells yet.']));
  }

  ch.spells.forEach(function (sp, i) {
    list.appendChild(buildSpellRow(i, false));
  });
  applyEditingState();
}

// Shared spell row: Spells tab (inActions=false, with ⚔/delete) and the
// Actions tab (inActions=true, with an unflag button) — same collapsible notes.
function buildSpellRow(i, inActions) {
  var sp = ch.spells[i];
  var key = (inActions ? 'aspell:' : 'spell:') + i;
  var rerender = inActions ? renderActions : renderSpells;
  var wrap = h('div', { class: 'rowWrap', 'data-rowkey': key });
  var cells = makeCombatCells(ch.spells, i, 'Spell', false);
  var rowChildren = [caretButton(key, 'notes', rerender), cells.name, cells.range, cells.hitWrap, cells.dmgWrap];

  if (inActions) {
    var unflag = h('button', { class: 'btn small editOnly', title: 'Remove from Actions' }, ['✕']);
    unflag.addEventListener('click', function () {
      delete ch.spells[i].action;
      renderActions();
      renderSpells();
    });
    wrap.appendChild(h('div', { class: 'asrow' }, rowChildren.concat([unflag])));
  } else {
    var del = h('button', { class: 'btn small editOnly', title: 'Remove' }, ['✕']);
    del.addEventListener('click', function () {
      ch.spells.splice(i, 1);
      delete expandedRows[key];
      renderSpells();
      renderActions();
    });
    wrap.appendChild(h('div', { class: 'srow' }, rowChildren.concat([actionToggle(sp, renderSpells), del])));
  }

  if (expandedRows[key]) {
    var ta = h('textarea', { class: 'inp', value: sp.notes || '', placeholder: 'Notes / description...', rows: estimateRows(sp.notes, 18) });
    ta.addEventListener('input', function () { ch.spells[i].notes = ta.value; });
    wrap.appendChild(h('div', { class: 'subRow' }, [
      h('div', { class: 'viewOnly' }, [renderRichText(sp.notes)]),
      h('div', { class: 'editOnly' }, [labeledWrap('Notes', ta)]),
    ]));
  }
  return wrap;
}

// Derive a section heading from a feature's source ("Sorcerer 3" → "Sorcerer",
// "Racial" → "Species", "Feat option" → "Options", …)
function featureSection(src) {
  var s = String(src || '').trim();
  if (!s) return 'Other';
  if (/^background/i.test(s)) return 'Background';
  if (/option$/i.test(s)) return 'Options';
  if (/^feat$/i.test(s)) return 'Feats';
  if (/^racial$/i.test(s)) return 'Species';
  return s.replace(/\s+\d+$/, ''); // strip trailing class level
}

function renderFeatures() {
  var list = document.getElementById('features.list');
  if (!list) return;
  list.innerHTML = '';
  ch.features = ch.features || [];
  if (!ch.features.length) {
    list.appendChild(h('div', { class: 'emptyHint' }, ['No features yet — import from D&D Beyond or add one in Edit mode.']));
  }

  // Group into labeled sections by source, preserving first-appearance order
  var sections = [];
  var bySection = {};
  ch.features.forEach(function (ft, i) {
    var sec = featureSection(ft && ft.source);
    if (!bySection[sec]) { bySection[sec] = []; sections.push(sec); }
    bySection[sec].push(i);
  });

  sections.forEach(function (sec) {
    if (sections.length > 1 || sec !== 'Other') {
      list.appendChild(h('div', { class: 'featSectionHead' }, [sec]));
    }
    // Single-statement entries render as a compact table (no dropdown);
    // everything else keeps the expandable row.
    var shorts = [], longs = [];
    bySection[sec].forEach(function (i) {
      if (featureStatement(ch.features[i]) != null) shorts.push(i);
      else longs.push(i);
    });
    shorts.forEach(function (i) { list.appendChild(buildShortFeatureRow(i)); });
    longs.forEach(function (i) { list.appendChild(buildFeatureRow(i)); });
  });
  applyEditingState();
}

// Body of a feature's notes with our generated "Source — activation" header
// line removed. Returns the remaining non-empty lines.
function featureBodyLines(ft) {
  var lines = String((ft && ft.notes) || '').split('\n')
    .map(function (l) { return l.trim(); })
    .filter(Boolean);
  if (lines.length > 1) {
    var first = lines[0];
    // Header lines are short and don't read as sentences
    if (first.length < 70 && !/[.!?]$/.test(first)) lines = lines.slice(1);
  }
  return lines;
}

// If a feature is just one short statement, return it (else null)
function featureStatement(ft) {
  var lines = featureBodyLines(ft);
  if (lines.length === 1 && lines[0].length <= 160) return lines[0];
  return null;
}

// Compact row for single-statement features: name | statement | ⚔ | ✕
function buildShortFeatureRow(i) {
  var ft = ch.features[i];
  var statement = featureStatement(ft) || '';
  // Preserve the header line (if any) when the statement text is edited
  var allLines = String(ft.notes || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
  var header = allLines.length > 1 ? allLines[0] : '';

  var wrap = h('div', { class: 'rowWrap', 'data-rowkey': 'feat:' + i });

  var name = h('input', { class: 'inp rowName', value: ft.name || '', placeholder: 'Feature' });
  name.addEventListener('input', function () { ch.features[i].name = name.value; });
  // Statement sits below the title so long text wraps instead of clipping
  var stmt = h('textarea', {
    class: 'inp', value: statement,
    rows: Math.max(1, Math.min(4, Math.ceil(statement.length / 60))),
  });
  stmt.addEventListener('input', function () {
    ch.features[i].notes = header ? header + '\n\n' + stmt.value : stmt.value;
  });

  var del = h('button', { class: 'btn small editOnly', title: 'Remove' }, ['✕']);
  del.addEventListener('click', function () {
    ch.features.splice(i, 1);
    renderFeatures();
    renderActions();
  });

  wrap.appendChild(h('div', { class: 'ftrow' }, [
    name,
    actionToggle(ft, renderFeatures),
    del,
  ]));
  wrap.appendChild(h('div', { class: 'ftStatement' }, [stmt]));
  return wrap;
}

function buildFeatureRow(i) {
  var ft = ch.features[i];
  var key = 'feat:' + i;
  var wrap = h('div', { class: 'rowWrap', 'data-rowkey': key });

  var name = h('input', { class: 'inp rowName', value: ft.name || '', placeholder: 'Feature' });
  name.addEventListener('input', function () { ch.features[i].name = name.value; });

  var del = h('button', { class: 'btn small editOnly', title: 'Remove' }, ['✕']);
  del.addEventListener('click', function () {
    ch.features.splice(i, 1);
    delete expandedRows[key];
    renderFeatures();
    renderActions();
  });

  wrap.appendChild(h('div', { class: 'frow' }, [
    caretButton(key, 'details', renderFeatures),
    name,
    actionToggle(ft, renderFeatures),
    del,
  ]));

  if (expandedRows[key]) {
    var sub = h('div', { class: 'subRow' });
    // Source is edited here; the section grouping above derives from it
    var source = h('input', { class: 'inp', value: ft.source || '', placeholder: 'e.g. Sorcerer 3, Feat, Racial' });
    source.addEventListener('input', function () { ch.features[i].source = source.value; });
    sub.appendChild(h('div', { class: 'editOnly' }, [labeledWrap('Source', source)]));
    sub.appendChild(h('div', { class: 'viewOnly' }, [renderRichText(ft.notes)]));
    var notesTa = h('textarea', { class: 'inp', value: ft.notes || '', placeholder: 'Feature description...', rows: estimateRows(ft.notes, 16) });
    notesTa.addEventListener('input', function () { ch.features[i].notes = notesTa.value; });
    sub.appendChild(h('div', { class: 'editOnly' }, [labeledWrap('Details', notesTa)]));
    wrap.appendChild(sub);
  }
  return wrap;
}

// Actions-tab row for a flagged feature: just the name, expanding to details
function buildActionFeatureRow(i) {
  var ft = ch.features[i];
  var key = 'afeat:' + i;
  var wrap = h('div', { class: 'rowWrap' });

  var unflag = h('button', { class: 'btn small editOnly', title: 'Remove from Actions' }, ['✕']);
  unflag.addEventListener('click', function () {
    delete ch.features[i].action;
    renderActions();
    renderFeatures();
  });

  wrap.appendChild(h('div', { class: 'afrow' }, [
    caretButton(key, 'details', renderActions),
    h('span', { class: 'rowName', style: { fontSize: '13px' } }, [ft.name || 'Feature']),
    unflag,
  ]));

  if (expandedRows[key]) {
    wrap.appendChild(h('div', { class: 'subRow' }, [renderRichText(ft.notes)]));
  }
  return wrap;
}

function renderInventory() {
  var list = document.getElementById('inventory.list');
  if (!list) return;
  list.innerHTML = '';
  if (!ch.inventory.length) {
    list.appendChild(h('div', { class: 'emptyHint' }, ['No items yet.']));
  }

  ch.inventory.forEach(function (it, i) {
    var key = 'inv:' + i;
    var wrap = h('div', { class: 'rowWrap', 'data-rowkey': key });

    var name = h('input', { class: 'inp rowName', value: it.name || '', placeholder: 'Item' });
    var value = h('input', { class: 'inp', value: it.value || '', placeholder: 'e.g., 25 gp' });
    name.addEventListener('input', function () { ch.inventory[i].name = name.value; });
    value.addEventListener('input', function () { ch.inventory[i].value = value.value; });

    var del = h('button', { class: 'btn small editOnly', title: 'Remove' }, ['✕']);
    del.addEventListener('click', function () {
      ch.inventory.splice(i, 1);
      delete expandedRows[key];
      renderInventory();
      renderActions();
    });

    wrap.appendChild(h('div', { class: 'irow' }, [
      caretButton(key, 'description', renderInventory),
      name, value,
      // Reveal the weapon stats when an item is flagged for the Actions tab
      actionToggle(it, function () { if (it.action) expandedRows[key] = true; renderInventory(); }),
      del,
    ]));

    if (expandedRows[key]) {
      var sub = h('div', { class: 'subRow' });
      sub.appendChild(h('div', { class: 'viewOnly' }, [renderRichText(it.desc)]));
      var desc = h('textarea', { class: 'inp', value: it.desc || '', placeholder: 'Item description...', rows: estimateRows(it.desc, 10) });
      desc.addEventListener('input', function () { ch.inventory[i].desc = desc.value; });
      sub.appendChild(h('div', { class: 'editOnly' }, [labeledWrap('Description', desc)]));

      if (it.action) {
        var rng = h('input', { class: 'inp', value: it.range || '', placeholder: 'Melee' });
        rng.addEventListener('input', function () { ch.inventory[i].range = rng.value; });
        var hit = h('input', { class: 'inp', value: it.hitDc || '', placeholder: '+0' });
        hit.addEventListener('input', function () { ch.inventory[i].hitDc = hit.value; });
        var dmg = h('input', { class: 'inp', value: it.damage || '', placeholder: '1d6' });
        dmg.addEventListener('input', function () { ch.inventory[i].damage = dmg.value; });
        sub.appendChild(h('div', { class: 'subGrid3' }, [
          labeledWrap('Range', rng), labeledWrap('Hit / DC', hit), labeledWrap('Damage', dmg),
        ]));
      }
      wrap.appendChild(sub);
    }
    list.appendChild(wrap);
  });
  applyEditingState();
}

function renderJournal() {
  var list = document.getElementById('journal.list');
  if (!list) return;
  list.innerHTML = '';

  // Live view of the active session's roll log
  if (session) {
    var live = h('div', { class: 'journalEntry' }, [
      h('div', { class: 'journalEntryHeader' }, [
        h('span', { class: 'rowName' }, [session.title]),
        h('span', { class: 'mut', style: { fontSize: '11px' } }, ['in progress']),
      ]),
    ]);
    if (session.lines.length) {
      var logBox = h('div', {});
      session.lines.forEach(function (l) { logBox.appendChild(h('div', { class: 'logLine' }, [h('span', {}, [l])])); });
      live.appendChild(logBox);
    } else {
      live.appendChild(h('div', { class: 'emptyHint' }, ['No rolls yet — they will appear here.']));
    }
    list.appendChild(live);
  }

  // Entries stored as notes in the Character Journal notebook
  if (journalNotes.length) {
    journalNotes.forEach(function (n, ji) {
      var open = h('button', { class: 'btn small' }, ['Open']);
      open.addEventListener('click', function () {
        if (api) api.postMessage({ type: 'journalOpen', id: n.id });
      });
      list.appendChild(h('div', { class: 'journalRow', 'data-rowkey': 'jnote:' + ji }, [
        h('span', { class: 'rowName' }, [n.title || '(untitled)']),
        h('span', { class: 'mut', style: { fontSize: '11.5px' } }, [n.date || '']),
        open,
      ]));
    });
  } else if (!session) {
    list.appendChild(h('div', { class: 'emptyHint' }, [
      api ? 'No journal entries yet — start a session or add an entry.'
          : 'Journal entries are stored as notes and need the Joplin host.',
    ]));
  }

  // Legacy entries still embedded in the sheet YAML → offer migration
  if ((ch.journal || []).length) {
    var legacyWrap = h('div', { class: 'spellsBlock' });
    legacyWrap.appendChild(h('div', { class: 'lblt' }, ['Stored in sheet (legacy)']));
    if (api) {
      var migrate = h('button', { class: 'btn small' }, ['Move ' + ch.journal.length + ' entr' + (ch.journal.length === 1 ? 'y' : 'ies') + ' to the Character Journal notebook']);
      migrate.addEventListener('click', function () {
        var entries = ch.journal.map(function (e) {
          return { title: (e && e.title) || '', date: (e && e.date) || '', character: ch.name || '', log: [], text: (e && e.text) || '' };
        });
        api.postMessage({ type: 'journalMigrate', entries: entries });
        setStatus('Moving journal entries to the Character Journal notebook…');
      });
      legacyWrap.appendChild(migrate);
    }
    ch.journal.forEach(function (entry, i) {
      var titleInput = h('input', { class: 'inp rowName jTitle', value: entry.title || '', placeholder: 'Entry title' });
      var dateInput = h('input', { class: 'inp jDate', type: 'date', value: entry.date || '' });
      var textArea = h('textarea', { class: 'inp', value: entry.text || '', placeholder: 'Session notes...', rows: estimateRows(entry.text, 14) });
      var del = h('button', { class: 'btn small editOnly', title: 'Remove entry' }, ['✕']);

      titleInput.addEventListener('input', function () { ch.journal[i].title = titleInput.value; });
      dateInput.addEventListener('input', function () { ch.journal[i].date = dateInput.value; });
      textArea.addEventListener('input', function () { ch.journal[i].text = textArea.value; });
      del.addEventListener('click', function () { ch.journal.splice(i, 1); renderJournal(); });

      legacyWrap.appendChild(h('div', { class: 'journalEntry' }, [
        h('div', { class: 'journalEntryHeader' }, [titleInput, dateInput, del]),
        h('div', {}, [textArea]),
      ]));
    });
    list.appendChild(legacyWrap);
  }
  applyEditingState();
}

function renderDynamic() {
  // Header
  var hn = document.getElementById('hdr.name');
  if (hn) hn.textContent = ch.name || 'Unnamed Character';
  var hm = document.getElementById('hdr.meta');
  if (hm) hm.textContent = charMetaText();

  // Abilities + saves
  ABILITIES.forEach(function (a) {
    var m = document.getElementById('abil.mod.' + a);
    if (m) m.textContent = fmtSigned(derived.mods[a]);
    var s = document.getElementById('abil.score.' + a);
    if (s) s.textContent = String(ch.abilities[a]);
    var el = document.getElementById('save.total.' + a);
    if (el) el.textContent = fmtSigned(derived.savingThrows[a]);
    var pip = document.getElementById('save.pip.' + a);
    if (pip) pip.className = 'pip' + (ch.savingThrowsProficiencies[a] ? ' on' : '');
    var gm = document.getElementById('skillhdr.mod.' + a);
    if (gm) gm.textContent = fmtSigned(derived.mods[a]);
  });

  // Derived chips
  var pb = document.getElementById('derived.pb');
  if (pb) pb.textContent = fmtSigned(derived.proficiencyBonus);
  var ini = document.getElementById('derived.initiative');
  if (ini) ini.textContent = fmtSigned(derived.initiative);
  var pp = document.getElementById('derived.pp');
  if (pp) pp.textContent = String(derived.passivePerception);
  var pins = document.getElementById('derived.pins');
  if (pins) pins.textContent = String(10 + (derived.skills['Insight'] || 0));
  var pinv = document.getElementById('derived.pinv');
  if (pinv) pinv.textContent = String(10 + (derived.skills['Investigation'] || 0));

  // Skills
  SKILLS.forEach(function (sk) {
    var el = document.getElementById('skill.total.' + sk);
    if (el) el.textContent = fmtSigned(derived.skills[sk]);
    var pip = document.getElementById('skill.pip.' + sk);
    if (pip) {
      var lvl = ch.skillsProficiencies[sk] || 'none';
      pip.className = 'pip viewOnly' + (lvl === 'expert' ? ' expert' : lvl === 'prof' ? ' on' : '');
    }
  });

  // Spellcasting
  var sdc = document.getElementById('derived.spell.dc');
  if (sdc) sdc.textContent = String(derived.spellSaveDC);
  var sam = document.getElementById('derived.spell.attack');
  if (sam) sam.textContent = fmtSigned(derived.spellAtkMod);
  var sav = document.getElementById('spell.ability.view');
  if (sav) sav.textContent = (ch.spellcasting?.ability && ch.spellcasting.ability !== 'NA') ? ch.spellcasting.ability : '—';
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

                            // Resume any active play session for this note
                            // (host pushes rebuild `ch`).
                            loadSessionState();
                            journalEntry = null; // leaving journal view, if we were in it

                            buildUI(); // rebuild inputs to reflect host data

                            // Refresh the Character Journal listing for the Journal tab
                            if (api) api.postMessage({ type: 'journalList' });
                        } else if (msg.type === 'journalData') {
                            journalEntry = msg.entry || { title: '', date: '', character: '', log: [], text: '' };
                            journalNoteId = msg.noteId || null;
                            buildJournalUI();
                        } else if (msg.type === 'journalListData') {
                            journalNotes = Array.isArray(msg.entries) ? msg.entries : [];
                            renderJournal();
                        } else if (msg.type === 'journalCreated') {
                            setStatus('Journal entry "' + (msg.title || '') + '" created ✓');
                        } else if (msg.type === 'journalSaved') {
                            setStatus('Journal entry saved ✓');
                        } else if (msg.type === 'journalMigrated') {
                            ch.journal = [];
                            postSave();
                            renderJournal();
                            setStatus('Moved ' + (msg.count || 0) + ' journal entr' + (msg.count === 1 ? 'y' : 'ies') + ' to the Character Journal notebook ✓');
                        } else if (msg.type === 'saved') {
                            setStatus('Saved ✓');
                            // Do NOT write cache here; it was already saved when we applied 'data'
                        } else if (msg.type === 'synced') {
                            setStatus('Synced from D&D Beyond ✓');
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
    features: (incoming.features || base.features || []).map(f => ({ name: '', source: '', notes: '', ...f })),
    journal: (incoming.journal || base.journal || []).map(e => ({ title: '', date: '', text: '', ...e })),
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
