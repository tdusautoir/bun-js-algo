function J(b){function E(q){q.stopPropagation();const{offsetX:N,offsetY:X}=q,F=Math.min(Math.floor(N/b.ui.cellSize),8),Y=Math.min(Math.floor(X/b.ui.cellSize),8),h=b.getSelectedCell();if(h===null||h[0]!==F||h[1]!==Y)b.setSelectedCell([F,Y]),b.refreshGrid()}function A(q){if(q.stopPropagation(),b.getSelectedCell()!==null)b.setSelectedCell(null),b.refreshGrid()}function L(q){if(q.stopPropagation(),q.key>="1"&&q.key<="9"&&b.getSelectedCell()!==null)b.toggle(parseInt(q.key))}b.canvas.addEventListener("mousemove",E),b.canvas.addEventListener("mouseout",A),document.onkeyup=L}class Q{b;E;static _uis=new WeakMap;static bgColor="#DDD";static thinLineColor="#AAA";static boldLineColor="#000";static impactedColor="#eec";static selectedColor="#ff6";static get(b){if(Q._uis.has(b))return Q._uis.get(b);const E=b.getContext("2d");if(E===null)return!1;const A=new Q(b,E);return Q._uis.set(b,A),A}_cellSize;constructor(b,E){this._canvas=b;this._ctx=E;this._cellSize=Math.round(Math.min(b.width,b.height)/9)}get width(){return this._canvas.width}get height(){return this._canvas.height}get cellSize(){return this._cellSize}clearCanvas(){return this._ctx.fillStyle=Q.bgColor,this._ctx.fillRect(0,0,this.width,this.height),this}drawCell(b,E,A=this._cellSize,L=Q.thinLineColor,q){const N=b*A,X=E*A;if(q)this._ctx.fillStyle=q,this._ctx.fillRect(N+1,X+1,A-2,A-2);return this._ctx.strokeStyle=L,this._ctx.strokeRect(N,X,A,A),this}drawRow(b,E){for(let A=0;A<9;A++)this.drawCell(A,b,this._cellSize,Q.thinLineColor,E);return this}drawColumn(b,E){for(let A=0;A<9;A++)this.drawCell(b,A,this._cellSize,Q.thinLineColor,E);return this}drawGroup(b,E,A){this.drawCell(b,E,this._cellSize*3,Q.boldLineColor,A);for(let L=0;L<3;L++)for(let q=0;q<3;q++)this.drawCell(b*3+q,E*3+L,this._cellSize,Q.thinLineColor);return this}drawCellValue(b,E,A){this._ctx.fillStyle="#000",this._ctx.font="bold 60px Arial",this._ctx.textBaseline="middle",this._ctx.textAlign="center";const L=b*this._cellSize+Math.floor(this._cellSize*0.5),q=E*this._cellSize+Math.floor(this._cellSize*0.575);return this._ctx.fillText(A.toString(),L,q),this}drawCellDomain(b,E,A){this._ctx.fillStyle="#000",this._ctx.font="16px Arial",this._ctx.textBaseline="top",this._ctx.textAlign="start";const L=Math.max(this._cellSize-2,Math.floor(this._cellSize*0.8)),q=Math.floor(L/3),N=Math.max(1,Math.floor(this._cellSize*0.1)),X=b*this._cellSize+N,F=E*this._cellSize+N;for(let Y=1;Y<=9;Y++){const h=A.includes(Y)?Y:null,T=(Y-1)%3,H=Math.floor((Y-1)/3),O=X+q*T,B=F+q*H;this._ctx.fillText(h!==null?h.toString():"",O,B)}return this}drawEmptyGrid(){this.clearCanvas();for(let b=0;b<3;b++)for(let E=0;E<3;E++)this.drawGroup(E,b);return this}colorizeSelectedStuff(b){if(b===null)return this;const E=[Math.floor(b[0]/3),Math.floor(b[1]/3)];return this.drawRow(b[1],Q.impactedColor).drawColumn(b[0],Q.impactedColor).drawGroup(E[0],E[1],Q.impactedColor).drawCell(b[0],b[1],this._cellSize,Q.thinLineColor,Q.selectedColor),this}}function w(){const b=new WebSocket(`ws://${location.host}`);b.onopen=()=>setInterval(()=>b.send("ping"),5000),b.onmessage=(E)=>{if(E.data!=="Well received")console.log(E.data);if(E.data==="reload")location.reload()}}var x=function(b){const E=document.getElementById(b);if(E===null)return console.error("Cannot get the given Canvas 2D rendering context"),!1;const A=Q.get(E);if(!A)return!1;const L=[],q=[];for(let N=0;N<9;N++){L.push([]),q.push([]);for(let X=0;X<9;X++)L[N].push([1,2,3,4,5,6,7,8,9]),q[N].push(null)}return{canvas:E,ui:A,cellDomains:L,cellValues:q}},g=function(b){const{canvas:E,ui:A,cellDomains:L,cellValues:q}=b;let N=null;function X(B,K){if(q[K][B]!==null)A.drawCellValue(B,K,q[K][B]);else A.drawCellDomain(B,K,L[K][B])}function F(){for(let B=0;B<9;B++)for(let K=0;K<9;K++)X(K,B)}function Y(B,K,R){const W=L[K][B],Z=W.indexOf(R);if(Z!==-1)W.splice(Z,1)}function h(B,K,R){const W=L[K][B];if(!W.includes(R))W.push(R)}function T(B,K,R,W){const Z=W?Y:h;for(let $=0;$<9;$++){if($!==B)Z($,K,R);if($!==K)Z(B,$,R)}const G=Math.floor(B/3),f=Math.floor(K/3);for(let $=0;$<3;$++)for(let P=0;P<3;P++){const M=G*3+P,_=f*3+$;if(M!==B&&_!==K)Z(M,_,R)}}function H(B){const K=N[0],R=N[1];if(q[R][K]===null){if(L[R][K].includes(B))q[R][K]=B,T(K,R,B,!0),O()}else if(q[R][K]===B){q[R][K]=null,T(K,R,B,!1);for(let W=0;W<9;W++)for(let Z=0;Z<9;Z++)if(q[W][Z]===B)T(Z,W,B,!0);O()}}function O(){A.drawEmptyGrid().colorizeSelectedStuff(N),F()}J({canvas:E,ui:A,refreshGrid:O,toggle:H,getSelectedCell:()=>N,setSelectedCell:(B)=>N=B}),w(),O()},y=x("sudokuCanvas");if(y)g(y);
