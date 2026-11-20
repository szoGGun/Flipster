import { esc, displayName } from './util.js';
import * as store from './store.js';
import { TIPS } from './tips.js';

const CSS = `
#stt-fab{position:fixed;left:70px;bottom:20px;z-index:99990;display:flex;gap:6px;align-items:center;background:#171d25;border:1px solid #2a475e;border-radius:6px;padding:4px 4px 4px 10px;box-shadow:0 4px 14px #000a;font:13px "Motiva Sans",Arial,sans-serif;color:#c6d4df}
#stt-fab button{background:#5c7e10;color:#fff;border:0;border-radius:4px;padding:8px 14px;font:600 13px inherit;cursor:pointer}
#stt-fab button:hover{background:#7ea64b}
#stt-fab .dot{width:8px;height:8px;border-radius:50%;background:#555}
#stt-fab .dot.on{background:#a4d007;box-shadow:0 0 6px #a4d007}
#stt-ov{position:fixed;inset:0;background:#000b;z-index:99995;display:flex;justify-content:center;align-items:flex-start;padding:28px 14px;overflow:auto}
#stt-ov[hidden],#stt [hidden]{display:none!important}
#stt{--bg:#1b2838;--bg2:#16202d;--bg3:#0e1621;--ln:#2a475e;--tx:#c6d4df;--mut:#8f98a0;--ok:#a4d007;--err:#ff6b6b;--warn:#e5b84c;--acc:#66c0f4;
  background:var(--bg);color:var(--tx);width:min(1280px,100%);border-radius:8px;box-shadow:0 10px 50px #000;font:13px "Motiva Sans",Arial,sans-serif;display:flex;flex-direction:column;height:calc(100vh - 56px)}
#stt *{box-sizing:border-box}
#stt header{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--ln);flex-wrap:wrap}
#stt header h2{margin:0;font-size:16px;color:#fff;font-weight:500;margin-right:8px}
#stt nav{display:flex;gap:2px;flex-wrap:wrap;flex:1}
#stt nav button{background:none;border:0;color:var(--mut);padding:7px 11px;border-radius:4px;cursor:pointer;font:inherit}
#stt nav button.on{background:var(--ln);color:#fff}
#stt nav button:hover{color:#fff}
#stt header .b.ico{font-size:17px;line-height:1;margin-right:6px}
#stt header .b.ico.on{background:var(--ln);color:#fff}
#stt .body{overflow:auto;flex:1;min-height:200px}
#stt .tab{display:none}#stt .tab.on{display:block}
#stt .bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 14px;border-bottom:1px solid #22303f;position:sticky;top:0;background:var(--bg);z-index:2}
#stt .bar .sp{flex:1}
#stt .sec-h{display:flex;align-items:baseline;gap:8px;padding:14px 14px 6px;font-size:15px;color:#fff;border-top:1px solid var(--ln)}
#stt .sec-h:first-child{border-top:0}
#stt .sec-h .cnt{font-size:12px;color:var(--mut)}
#stt button.b{background:var(--ln);color:var(--tx);border:0;border-radius:3px;padding:6px 11px;cursor:pointer;font:inherit;white-space:nowrap}
#stt button.b:hover:not(:disabled){background:#3d6c8d;color:#fff}
#stt button.b.on{background:var(--acc);color:#000}
#stt button.go{background:#5c7e10;color:#fff}#stt button.go:hover:not(:disabled){background:#7ea64b}
#stt button.red{background:#7a2b2b;color:#fff}#stt button.red:hover:not(:disabled){background:#a33}
#stt button.s{padding:3px 7px;font-size:12px}
#stt button:disabled{opacity:.4;cursor:default}
#stt input:not([type]),#stt input[type=text],#stt input[type=number],#stt input[type=search],#stt select{background:var(--bg3);border:1px solid var(--ln);color:#fff;border-radius:3px;padding:5px 7px;font:inherit}
#stt input.p{width:76px}
#stt label{display:inline-flex;gap:5px;align-items:center;cursor:pointer}
#stt table{width:100%;border-collapse:collapse}
#stt th{position:sticky;top:0;background:var(--bg2);text-align:left;font-weight:500;color:var(--mut);padding:7px 8px;font-size:11px;text-transform:uppercase;white-space:nowrap;z-index:1}
#stt th[data-sort]{cursor:pointer}#stt th[data-sort]:hover{color:#fff}
#stt td{padding:5px 8px;border-top:1px solid #22303f;vertical-align:middle}
#stt tr:hover td{background:#1f2f42}
#stt .it{display:flex;align-items:center;gap:8px;min-width:220px}
#stt .it img{width:46px;height:34px;object-fit:contain;background:var(--bg3);border-radius:3px;flex:none}
#stt .it a{color:inherit;text-decoration:none}#stt .it a:hover{text-decoration:underline}
#stt .sub{font-size:11px;color:var(--mut)}
#stt .ok{color:var(--ok)}#stt .err{color:var(--err)}#stt .warn{color:var(--warn)}#stt .acc{color:var(--acc)}#stt .mut{color:var(--mut)}
#stt .pos{color:var(--ok)}#stt .neg{color:var(--err)}
#stt .tag{display:inline-block;padding:1px 6px;border-radius:9px;font-size:11px;background:var(--bg3);border:1px solid var(--ln)}
#stt .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;padding:12px 14px}
#stt .card{background:var(--bg2);border:1px solid #22303f;border-radius:6px;padding:10px 12px}
#stt .card .k{font-size:11px;color:var(--mut);text-transform:uppercase;display:flex;align-items:flex-start;gap:2px}
#stt .card .k .stt-i{flex:none;margin-top:-1px}
#stt .card .v{font-size:19px;color:#fff;margin-top:3px}
#stt .note{padding:8px 14px;font-size:12px;color:var(--mut);line-height:1.5}
#stt .empty{padding:30px;text-align:center;color:var(--mut)}
#stt .htabs{display:flex;gap:2px;padding:0 14px;border-bottom:1px solid rgba(255,255,255,.08);margin-top:6px}
#stt .htabs button{background:none;border:0;border-bottom:2px solid transparent;color:var(--mut,#8f98a0);padding:9px 14px;font:inherit;font-size:14px;cursor:pointer}
#stt .htabs button:hover{color:#fff}
#stt .htabs button.on{color:#fff;border-bottom-color:var(--acc,#66c0f4)}
#stt .htabs .cnt{font-size:12px;opacity:.7}
#stt .chipst{display:inline-block;font-size:11px;font-weight:600;padding:1px 8px;border-radius:9px;border:1px solid;line-height:1.6;white-space:nowrap}
#stt .chipst.ok{color:#a4d007;border-color:#4c6b22;background:rgba(164,208,7,.1)}
#stt .chipst.bad{color:#ff7b7b;border-color:#7a2b2b;background:rgba(255,107,107,.1)}
#stt .chipst.mid{color:#e5b84c;border-color:#7a6224;background:rgba(229,184,76,.1)}
#stt .chipst.mut{color:#8f98a0;border-color:#3a4654}
#stt .acts{display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap}
#stt tr.cfg>td{background:rgba(0,0,0,.18)}
#stt .chips{display:inline-flex;gap:4px;flex-wrap:wrap;background:var(--bg3,#101822);border:1px solid #22303f;border-radius:6px;padding:3px}
#stt label.tgl{display:inline-flex;align-items:center;gap:7px;padding:3px 4px;cursor:pointer;user-select:none;font-size:12px;color:var(--mut);white-space:nowrap}
#stt label.tgl:hover{color:#c6d4df}
#stt label.tgl input{display:none}
#stt label.tgl .tr{position:relative;flex:none;width:28px;height:16px;border-radius:9px;background:#2a3542;border:1px solid #3a4a5c;transition:background .15s,border-color .15s}
#stt label.tgl .tr::after{content:'';position:absolute;top:2px;left:2px;width:10px;height:10px;border-radius:50%;background:#8f98a0;transition:transform .15s,background .15s}
#stt label.tgl:has(input:checked){color:#fff}
#stt label.tgl:has(input:checked) .tr{background:#2a6f9c;border-color:#66c0f4}
#stt label.tgl:has(input:checked) .tr::after{transform:translateX(12px);background:#fff}
#stt .seg{display:inline-flex;background:var(--bg3,#101822);border:1px solid #22303f;border-radius:6px;padding:2px}
#stt .seg label{padding:4px 10px;border-radius:4px;cursor:pointer;user-select:none;font-size:12px;color:var(--mut);white-space:nowrap;transition:background .12s,color .12s}
#stt .seg label:hover{color:#fff}
#stt .seg input{display:none}
#stt .seg label:has(input:checked){background:#2a475e;color:#fff}
#stt label.chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:4px;cursor:pointer;user-select:none;color:var(--mut);font-size:12px;transition:background .12s,color .12s}
#stt label.chip:hover{color:#fff;background:rgba(255,255,255,.05)}
#stt label.chip input{display:none}
#stt label.chip:has(input:checked){background:#2a475e;color:#fff}
#stt label.chip:has(input:checked)::before{content:'✓';font-size:11px;color:var(--acc,#66c0f4)}
#stt .bar .line{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;width:100%}
#stt .bar .line + .line{padding-top:8px;border-top:1px solid rgba(255,255,255,.05)}
#stt .grp{display:inline-flex;align-items:center;gap:6px}
#stt .grp > .lb{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--mut)}
#stt label.spot{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:16px;border:1px solid #4c6b22;background:rgba(164,208,7,.08);color:#a4d007;font-size:12px;font-weight:600;cursor:pointer;user-select:none;transition:background .12s,color .12s,border-color .12s}
#stt label.spot:hover{background:rgba(164,208,7,.16)}
#stt label.spot input{display:none}
#stt label.spot:has(input:checked){background:#5c7e10;border-color:#a4d007;color:#fff}
#stt label.spot b{min-width:18px;padding:1px 6px;border-radius:9px;background:rgba(0,0,0,.28);font-size:11px;text-align:center}
#stt label.spot b:empty{display:none}
#stt .grid>.empty{grid-column:1/-1}
#stt .sugg{position:absolute;top:100%;left:0;right:0;z-index:20;background:var(--bg2,#1b2838);border:1px solid #2a475e;border-radius:4px;max-height:320px;overflow:auto;box-shadow:0 6px 18px #0009}#stt .sugg div{display:flex;gap:8px;align-items:center;padding:5px 8px;cursor:pointer;font-size:12px;color:#c6d4df}#stt .sugg div:hover{background:#2a475e}#stt .sugg img{width:40px;height:30px;object-fit:contain}#stt .sugg .p2{margin-left:auto;color:var(--mut)}
#stt .spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.15);border-top-color:var(--acc,#66c0f4);border-radius:50%;animation:stt-spin .8s linear infinite;vertical-align:-2px;margin-right:8px}
@keyframes stt-spin{to{transform:rotate(360deg)}}
#stt .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(172px,1fr));gap:10px;padding:12px 14px 48px}
#stt .gi{background:var(--bg2);border:2px solid #22303f;border-radius:6px;padding:6px;cursor:pointer;position:relative;user-select:none;display:flex;flex-direction:column}
#stt .gi .meta{height:36px;overflow:hidden;display:flex;flex-direction:column;gap:2px;margin-top:2px}
#stt .gi .meta>.sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#stt .gi .foot{display:flex;flex-direction:column;gap:3px}
#stt .gi .tail{margin-top:auto;display:flex;flex-direction:column;gap:3px;padding-top:6px}
#stt .gi .src{font-size:11px;color:var(--mut);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em}
#stt .gi.listed{border-style:dashed;border-color:#6b5a2a;background:#1d1f22}
#stt .gi.listed img.m{opacity:.75}
#stt .gi.locked{border-style:dashed;border-color:#3d5a7a;background:#18212c}
#stt .gi.locked img.m{opacity:.6;filter:grayscale(.35)}
#stt .gi.locked .n{opacity:.85}
#stt .gi.mark{border-color:#e5b84c;box-shadow:0 0 0 1px rgba(229,184,76,.25),0 0 12px rgba(229,184,76,.18)}
#stt .gi.sel{border-color:var(--acc);background:#1d3346}
#stt .gi.hl{border-color:#66c0f4;box-shadow:0 0 0 3px rgba(102,192,244,.35)}
#stt .gi.hl.main{border-color:#fff;box-shadow:0 0 0 3px #66c0f4,0 0 18px rgba(102,192,244,.7);animation:stt-hl 1s ease-in-out 3}
@keyframes stt-hl{50%{box-shadow:0 0 0 6px rgba(102,192,244,.25),0 0 26px rgba(102,192,244,.9)}}
#stt .gi img.m{width:100%;height:84px;object-fit:contain;margin-top:26px}
#stt .gi .pv .lb{white-space:nowrap}
#stt .gi .n{font-size:11px;line-height:1.25;height:28px;overflow:hidden}
#stt .gi .pv{display:grid;grid-template-columns:auto auto;justify-content:space-between;gap:6px;margin-top:6px;padding-top:6px;border-top:1px solid #22303f}
#stt .gi .pv>div{display:flex;flex-direction:column;min-width:0}
#stt .gi .pv>div+div{text-align:right;align-items:flex-end}
#stt .gi .pv .pl{grid-column:1/-1;display:flex;justify-content:space-between;align-items:baseline;gap:6px;border-top:1px dashed #22303f;padding-top:3px;flex-direction:row!important;text-align:left!important}
#stt .gi .pv .pl b{font-size:12px}
#stt .gi .pv .lb{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--mut)}
#stt .gi .pv b{font-size:13px;white-space:nowrap}
#stt .gi .pv .sub{white-space:nowrap;font-size:10.5px}
#stt .gi .pr{display:flex;justify-content:space-between;font-size:12px;margin-top:3px}
#stt .gi .fl{flex:none;height:3px;background:linear-gradient(90deg,#3c9 0 7%,#9c3 7% 15%,#cc3 15% 38%,#e93 38% 45%,#e44 45%);border-radius:2px;position:relative;margin-top:4px}
#stt .gi .fl i{position:absolute;top:-3px;width:2px;height:9px;background:#fff}
#stt .gi .st{display:flex;gap:1px;position:absolute;top:4px;right:4px}
#stt .gi .st img{width:22px;height:16px}
#stt .gi .qty{position:absolute;top:4px;right:4px;z-index:1;min-width:22px;padding:2px 7px;border-radius:10px;background:#2a6f9c;border:1px solid #66c0f4;color:#fff;font-size:11px;font-weight:700;line-height:1.2;text-align:center;box-shadow:0 1px 4px #0008}
#stt .gi .mk{position:absolute;top:4px;left:4px;z-index:1;display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;background:rgba(23,29,37,.88);border:1px solid rgba(102,192,244,.28);color:#66c0f4;opacity:.85;transition:background .12s,color .12s,border-color .12s,opacity .12s,transform .12s}
#stt .gi .mk svg{width:15px;height:15px;display:block}
#stt .gi .wt{position:absolute;top:4px;left:32px;z-index:1;width:24px;height:24px;padding:0;border-radius:6px;background:rgba(23,29,37,.88);border:1px solid rgba(229,184,76,.25);font-size:12px;line-height:1;cursor:pointer;opacity:.45;filter:grayscale(1);transition:opacity .12s,filter .12s,background .12s}
#stt .gi:hover .wt{opacity:.85}
#stt .gi .wt:hover{opacity:1;filter:none}
#stt .gi .wt.on{opacity:1;filter:none;background:rgba(229,184,76,.18);border-color:#e5b84c}
#stt .gi .adv{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;column-gap:6px;row-gap:1px;margin-top:6px;padding:5px 8px;border-radius:5px;background:rgba(164,208,7,.07);border:1px solid rgba(164,208,7,.24);line-height:1.3}
#stt .gi .adv .lb{font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#a4d007;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#stt .gi .adv b{font-size:13px;color:#fff;text-align:right;white-space:nowrap}
#stt .gi .adv .w{grid-column:1 / -1;font-size:10.5px;color:var(--mut)}
#stt .gi .adv.now{background:rgba(229,184,76,.07);border-color:rgba(229,184,76,.28)}
#stt .gi .adv.now .lb{color:#e5b84c}
#stt .gi:hover .mk{opacity:1}
#stt .gi .mk:hover{background:#2a475e;border-color:#66c0f4;color:#fff;transform:scale(1.08)}
#stt .gi .sigs{display:flex;flex-wrap:wrap;gap:3px;min-height:18px}
#stt .gi .sig{font-size:10px;font-weight:600;padding:1px 6px;border-radius:9px;line-height:1.5;border:1px solid}
#stt .gi .sig.profit{color:#a4d007;border-color:#4c6b22;background:rgba(164,208,7,.12)}
#stt .gi .sig.high{color:#e5b84c;border-color:#7a6224;background:rgba(229,184,76,.12)}
#stt .gi .sig.fall{color:#ff7b7b;border-color:#7a2b2b;background:rgba(255,107,107,.12)}
#stt .gi .sig.hold{color:#8fb8d8;border-color:#2a475e;background:rgba(102,192,244,.06);font-weight:500}
#stt .gi .sig.plan{color:#66c0f4;border-color:#2a6f9c;background:rgba(102,192,244,.12);cursor:pointer}
#stt .gi .sig.skip{color:#8f98a0;border-color:#3a4654;background:rgba(143,152,160,.08)}
#stt .gi:hover{z-index:4}
#stt .gi .qs{position:absolute;left:-2px;right:-2px;top:100%;margin-top:-6px;z-index:5;display:flex;gap:6px;padding:10px 6px 6px;border:2px solid;border-color:inherit;border-top:0;border-radius:0 0 6px 6px;background:var(--bg2);box-shadow:0 8px 16px rgba(0,0,0,.55);opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .12s,transform .12s}
#stt .gi.sel .qs{background:#1d3346}#stt .gi.listed .qs{background:#1d1f22}#stt .gi.locked .qs{background:#18212c}
#stt .gi:hover .qs{opacity:1;transform:none;pointer-events:auto}
#stt .gi .qs button{flex:1;border:1px solid rgba(255,255,255,.12);border-radius:4px;padding:6px 0;font-family:inherit;font-size:12px;font-weight:600;line-height:1;cursor:pointer;color:#fff;background:#2a475e;transition:background .12s}
#stt .gi .qs button:hover{background:#3a6a8c}
#stt .gi .qs button.g{background:#5c7e10}#stt .gi .qs button.g:hover{background:#6f9a14}
#stt .gi .qs button.red{background:#8c2828}#stt .gi .qs button.red:hover{background:#a83232}
#stt .log{height:110px;min-height:40px;flex:none;overflow:auto;padding:8px 14px;font:12px/1.5 Consolas,monospace;background:var(--bg3);white-space:pre-wrap;border-radius:0 0 8px 8px}
#stt .logbar{flex:none;height:9px;cursor:ns-resize;border-top:1px solid var(--ln);background:var(--bg3);display:flex;align-items:center;justify-content:center;user-select:none}
#stt .logbar::before{content:'';width:42px;height:3px;border-radius:2px;background:#3a4a5c;transition:background .12s}
#stt .logbar:hover::before,#stt .logbar.drag::before{background:var(--acc)}
#stt .status{display:flex;gap:14px;padding:6px 14px;font-size:12px;color:var(--mut);border-top:1px solid var(--ln);flex-wrap:wrap}
#stt .prog{height:3px;background:var(--bg3)}#stt .prog i{display:block;height:100%;background:var(--acc);transition:width .3s}
#stt details{padding:4px 14px}#stt summary{cursor:pointer;color:var(--acc)}
#stt .row2{display:flex;gap:10px;flex-wrap:wrap;padding:12px 14px;align-items:flex-end}
#stt .row2 > label{flex-direction:column;align-items:flex-start;gap:3px;font-size:12px;color:var(--mut)}
#stt .row2 > label > .lt{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
#stt svg.chart{width:100%;height:220px;display:block}
#stt .modal{position:fixed;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;z-index:99999}
#stt .modal > div{background:var(--bg);border:1px solid var(--ln);border-radius:8px;padding:18px;max-width:520px;width:calc(100% - 32px);box-shadow:0 10px 40px #000}
#stt .modal h3{margin:0 0 10px;color:#fff;font-weight:500}
#stt .modal .acts{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
.stt-i{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;margin-left:6px;border-radius:50%;border:1px solid #66c0f4;color:#66c0f4;font:700 10px/1 Georgia,serif;font-style:italic;text-transform:none;cursor:help;vertical-align:1px;user-select:none}
.stt-i:hover,.stt-i.on{background:#66c0f4;color:#0e1621}
#stt-tip{position:fixed;z-index:100002;max-width:300px;background:#0e1621;border:1px solid #66c0f4;color:#c6d4df;padding:9px 11px;border-radius:6px;font:12.5px/1.5 "Motiva Sans",Arial,sans-serif;box-shadow:0 6px 24px #000c;pointer-events:none}
.stt-badge{position:absolute;left:2px;top:2px;right:2px;font:600 10px Arial,sans-serif;color:#fff;background:#000b;padding:1px 3px;border-radius:2px;pointer-events:none;display:flex;justify-content:space-between;z-index:3}
.stt-badge .f{color:#9bd}
.stt-badge.two{flex-wrap:wrap;row-gap:0}
.stt-badge .l{flex-basis:100%;color:#e5b84c}
.stt-badge .l.bad{color:#ff6b6b}
`;

let root, ov, nav, body, logEl, statusEl, progEl, fabDot;
const tabs = [];
let current = null;

export function init() {
  const st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);

  const fab = document.createElement('div');
  fab.id = 'stt-fab';
  fab.innerHTML = `<span class="dot" title="Automaty"></span><span class="mut" id="stt-fab-t"></span><button>⚡ Flipster</button>`;
  fab.querySelector('button').onclick = () => open();
  fabDot = fab.querySelector('.dot');
  document.body.appendChild(fab);

  ov = document.createElement('div');
  ov.id = 'stt-ov';
  ov.hidden = true;
  ov.innerHTML = `<div id="stt">
    <header><h2>⚡ Flipster <span class="sub" style="font-size:11px">Steam Market · build ${typeof __BUILD__ !== 'undefined' ? __BUILD__ : '?'}</span></h2><nav></nav><button class="b" data-x>✕</button></header>
    <div class="prog"><i style="width:0"></i></div>
    <div class="body"></div>
    <div class="status"></div>
    <div class="logbar" title="Przeciągnij w górę, żeby powiększyć log (kosztem okna powyżej) · dwuklik: duży / mały"></div>
    <div class="log"></div>
  </div>`;
  document.body.appendChild(ov);
  root = ov.querySelector('#stt');
  nav = root.querySelector('nav');
  body = root.querySelector('.body');
  logEl = root.querySelector('.log');
  statusEl = root.querySelector('.status');
  progEl = root.querySelector('.prog i');
  initLogResize();
  ov.addEventListener('mousedown', (e) => { if (e.target === ov) close(); });
  root.querySelector('[data-x]').onclick = close;
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !ov.hidden && !root.querySelector('.modal')) close(); });
  initTips();
}

// ---------------------------------------------------------------- ⓘ info icons on cards
function initTips() {
  const tip = document.createElement('div');
  tip.id = 'stt-tip';
  tip.hidden = true;
  document.body.appendChild(tip);
  let pinned = null;

  const icon = (text) => {
    const i = document.createElement('span');
    i.className = 'stt-i';
    i.textContent = 'i';
    i.tabIndex = 0;
    i.dataset.tip = text;
    return i;
  };
  const decorate = () => {
    // card titles
    for (const k of root.querySelectorAll('.card .k')) {
      if (k.querySelector('.stt-i')) continue;
      const text = TIPS[k.textContent.trim()];
      if (text) k.appendChild(icon(text));
    }
    // table headers (ignore sort arrows)
    for (const th of root.querySelectorAll('th')) {
      if (th.querySelector('.stt-i')) continue;
      const text = TIPS[th.textContent.replace(/[▲▼]/g, '').trim()];
      if (text) th.appendChild(icon(text));
    }
    // form labels in .row2: "<label>Title<input></label>" → icon right after the title text
    for (const lb of root.querySelectorAll('.row2 > label')) {
      if (lb.querySelector('.stt-i')) continue;
      const t = [...lb.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      const text = t && TIPS[t.textContent.trim()];
      if (text) { const w = document.createElement('span'); w.className = 'lt'; t.replaceWith(w); w.append(t, icon(text)); }
    }
  };
  const showFor = (icon) => {
    tip.textContent = icon.dataset.tip;
    tip.hidden = false;
    const r = icon.getBoundingClientRect();
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
    let top = r.bottom + 8;
    if (top + h > window.innerHeight - 8) top = r.top - h - 8; // flip above when no room below
    tip.style.left = `${left}px`;
    tip.style.top = `${Math.max(8, top)}px`;
  };
  const hide = () => { tip.hidden = true; pinned?.classList.remove('on'); pinned = null; };

  new MutationObserver(decorate).observe(root, { childList: true, subtree: true });
  root.addEventListener('mouseover', (e) => { const i = e.target.closest('.stt-i'); if (i && !pinned) showFor(i); });
  root.addEventListener('mouseout', (e) => { if (e.target.closest('.stt-i') && !pinned) tip.hidden = true; });
  root.addEventListener('focusin', (e) => { const i = e.target.closest('.stt-i'); if (i) showFor(i); });
  root.addEventListener('focusout', (e) => { if (e.target.closest('.stt-i') && !pinned) tip.hidden = true; });
  // click pins the tooltip (useful on touch screens); click elsewhere or scroll closes it
  document.addEventListener('click', (e) => {
    const i = e.target.closest?.('#stt .stt-i');
    if (i) {
      e.stopPropagation();
      if (pinned === i) return hide();
      hide();
      pinned = i;
      i.classList.add('on');
      showFor(i);
    } else if (pinned) hide();
  }, true);
  root.querySelector('.body').addEventListener('scroll', hide, { passive: true });
}

export function tab(def) {
  if (def.when && !def.when()) return;
  const b = document.createElement('button');
  b.onclick = () => show(def.id);
  if (def.icon) {
    // icon tab (e.g. settings ⚙) sits in the header next to ✕
    b.className = 'b ico';
    b.textContent = def.icon;
    b.title = def.title;
    root.querySelector('[data-x]').before(b);
  } else {
    b.textContent = def.title;
    nav.appendChild(b);
  }
  const el = document.createElement('div');
  el.className = 'tab';
  body.appendChild(el);
  tabs.push({ ...def, btn: b, el, mounted: false });
}

export function show(id) {
  const t = tabs.find((x) => x.id === id) || tabs[0];
  if (!t) return;
  tabs.forEach((x) => { x.btn.classList.toggle('on', x === t); x.el.classList.toggle('on', x === t); });
  if (!t.mounted) { t.mounted = true; t.mount(t.el); }
  current = t;
  store.set('lastTab', t.id);
  t.show?.();
}

export function open(id) {
  ov.hidden = false;
  show(id || current?.id || store.get('lastTab', null) || tabs[0]?.id);
}
export const close = () => {
  ov.hidden = true;
  const t = document.getElementById('stt-tip');
  if (t) t.hidden = true;
};
export const isOpen = () => !ov.hidden;

// ---------------------------------------------------------------- feedback
/**
 * The log's height: drag the bar above it (the window content above gives the room, down to its 200 px minimum),
 * double-click for big / small. Remembered for the next visit.
 */
const LOG_MIN = 40, LOG_DEFAULT = 110;
function initLogResize() {
  const bar = root.querySelector('.logbar');
  const maxH = () => Math.max(LOG_MIN, root.clientHeight - root.querySelector('header').offsetHeight - 200 - 40);
  const set = (h, save = true) => {
    const v = Math.round(Math.max(LOG_MIN, Math.min(root.clientHeight ? maxH() : Infinity, h))); // hidden panel: no size to fit yet
    const atEnd = logEl.scrollHeight - logEl.scrollTop - logEl.clientHeight < 30;
    logEl.style.height = v + 'px';
    if (atEnd) logEl.scrollTop = logEl.scrollHeight;
    if (save) store.set('logHeight', v);
  };
  set(store.get('logHeight', LOG_DEFAULT), false);
  bar.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const y0 = e.clientY, h0 = logEl.offsetHeight;
    bar.classList.add('drag');
    const move = (ev) => set(h0 + (y0 - ev.clientY), false);
    const up = () => { bar.classList.remove('drag'); document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); set(logEl.offsetHeight); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });
  bar.addEventListener('dblclick', () => set(logEl.offsetHeight > LOG_DEFAULT + 40 ? LOG_DEFAULT : maxH()));
}

export function log(msg, cls = '') {
  const line = document.createElement('div');
  if (cls) line.className = cls;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  // follow new lines only while you're at the bottom, scrolling up to read isn't yanked away by the next message
  const atEnd = logEl.scrollHeight - logEl.scrollTop - logEl.clientHeight < 30;
  logEl.appendChild(line);
  while (logEl.childElementCount > 400) logEl.firstChild.remove();
  if (atEnd) logEl.scrollTop = logEl.scrollHeight;
  if (cls === 'err') console.warn('[Flipster]', msg);
}

export function progress(done, total) {
  progEl.style.width = total ? `${Math.min(100, (done / total) * 100)}%` : '0';
}

const statusItems = new Map();
export function status(key, html) {
  if (html == null) statusItems.delete(key); else statusItems.set(key, html);
  statusEl.innerHTML = [...statusItems.values()].map((h) => `<span>${h}</span>`).join('');
}

export function fab(on, text = '') {
  fabDot.classList.toggle('on', on);
  document.getElementById('stt-fab-t').textContent = text;
}

/** in-page confirm (native confirm() is ugly and blocking) */
/** collect(modalEl) runs before the modal is removed; its result is returned instead of `true` */
/** onOpen(modal): wire live behaviour into the dialog's own inputs (runs once it is on the page) */
export function ask(title, html, { ok = 'OK', cancel = 'Anuluj', danger = false, collect = null, wide = false, onOpen = null } = {}) {
  return new Promise((resolve) => {
    const m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = `<div style="${wide ? 'max-width:760px' : ''}"><h3>${esc(title)}</h3><div>${html}</div><div class="acts">
      ${cancel ? `<button class="b" data-r="0">${esc(cancel)}</button>` : ''}<button class="b ${danger ? 'red' : 'go'}" data-r="1">${esc(ok)}</button></div></div>`;
    m.addEventListener('click', (e) => {
      const r = e.target.dataset.r;
      if (r == null && e.target !== m) return;
      const val = r === '1' ? (collect ? collect(m) : true) : false;
      m.remove();
      resolve(val);
    });
    root.appendChild(m);
    m.querySelector('[data-r="1"]').focus();
    onOpen?.(m);
  });
}

// ---------------------------------------------------------------- helpers
/**
 * market page of exactly this item. Steam's new (2026) item pages group all wears / StatTrak of a skin, so the old
 * per-wear URL lands on the whole group → add the filters the new page understands (?category_Exterior=…&category_Quality=…).
 */
const WEAR_TAG = { 'Factory New': 0, 'Minimal Wear': 1, 'Field-Tested': 2, 'Well-Worn': 3, 'Battle-Scarred': 4 };
export function marketUrl(appid = 730, hash = '') {
  let url = `https://steamcommunity.com/market/listings/${appid}/${encodeURIComponent(hash)}`;
  if (String(appid) !== '730') return url;
  const q = [];
  const wear = hash.match(/\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/)?.[1];
  if (wear) q.push(`category_Exterior=WearCategory${WEAR_TAG[wear]}`);
  const star = hash.startsWith('★'), st = /StatTrak™/.test(hash), souv = /^Souvenir /.test(hash);
  if (wear || star) q.push(`category_Quality=${souv ? 'tournament' : star ? (st ? 'unusual_strange' : 'unusual') : st ? 'strange' : 'normal'}`);
  return q.length ? `${url}?${q.join('&')}` : url;
}

export function itemCell({ icon: ic, name, hash, color, appid = 730, sub = '' }) {
  const url = marketUrl(appid, hash || '');
  return `<div class="it">${ic ? `<img loading="lazy" src="https://community.cloudflare.steamstatic.com/economy/image/${esc(ic)}/62fx62f">` : ''}
    <div><a href="${esc(url)}" target="_blank" style="color:#${esc(color || 'c6d4df')}">${esc(displayName(hash, name))}</a>${sub ? `<div class="sub">${sub}</div>` : ''}</div></div>`;
}

/** simple sortable table state */
export function sorter(defaultKey, defaultDir = -1) {
  let key = defaultKey, dir = defaultDir;
  return {
    get key() { return key; },
    set(k, d = -1) { key = k; dir = d; },
    click(k) { if (k === key) dir = -dir; else { key = k; dir = -1; } },
    apply(rows, getters) {
      const g = getters[key];
      if (!g) return rows;
      return [...rows].sort((a, b) => {
        const x = g(a), y = g(b);
        if (x == null && y == null) return 0;
        if (x == null) return 1;
        if (y == null) return -1;
        return (typeof x === 'string' ? x.localeCompare(y) : x - y) * dir;
      });
    },
    arrow: (k) => (k === key ? (dir > 0 ? ' ▲' : ' ▼') : ''),
  };
}

/** SVG line chart. series: [{points:[[x,y]], color, label}] ; fmtY for labels */
export function lineChart(series, { fmtY = (v) => v, fmtX = (v) => new Date(v).toLocaleDateString(), height = 220, bars = null, zero = false } = {}) {
  const all = series.flatMap((s) => s.points);
  if (!all.length) return '<div class="empty">Brak danych</div>';
  const W = 1000, H = height, P = { l: 70, r: 12, t: 12, b: 26 };
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  let y0 = Math.min(...ys), y1 = Math.max(...ys);
  if (zero) { y0 = Math.min(y0, 0); y1 = Math.max(y1, 0); }
  if (y0 === y1) { y0 -= 1; y1 += 1; }
  const pad = (y1 - y0) * 0.08; y0 -= pad; y1 += pad;
  const X = (v) => P.l + ((v - x0) / (x1 - x0 || 1)) * (W - P.l - P.r);
  const Y = (v) => P.t + (1 - (v - y0) / (y1 - y0)) * (H - P.t - P.b);
  let g = '';
  for (let i = 0; i <= 4; i++) {
    const v = y0 + ((y1 - y0) * i) / 4;
    g += `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="#2a475e" stroke-width="1"/><text x="${P.l - 6}" y="${Y(v) + 4}" fill="#8f98a0" font-size="11" text-anchor="end">${esc(fmtY(v))}</text>`;
  }
  for (let i = 0; i <= 5; i++) {
    const v = x0 + ((x1 - x0) * i) / 5;
    g += `<text x="${X(v)}" y="${H - 6}" fill="#8f98a0" font-size="11" text-anchor="${i === 0 ? 'start' : i === 5 ? 'end' : 'middle'}">${esc(fmtX(v))}</text>`;
  }
  if (bars?.length) {
    const bm = Math.max(...bars.map((b) => b[1])) || 1;
    const bw = Math.max(1, (W - P.l - P.r) / bars.length - 1);
    g += bars.map(([x, v]) => `<rect x="${X(x) - bw / 2}" width="${bw}" y="${H - P.b - (v / bm) * 40}" height="${(v / bm) * 40}" fill="#2a475e"/>`).join('');
  }
  if (zero) g += `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(0)}" y2="${Y(0)}" stroke="#8f98a0" stroke-width="1" stroke-dasharray="4 4"/><text x="${W - P.r - 4}" y="${Y(0) - 4}" fill="#8f98a0" font-size="11" text-anchor="end">0 (wyjście na zero)</text>`;
  for (const s of series) {
    const d = s.points.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('');
    g += `<path d="${d}" fill="none" stroke="${s.color || '#66c0f4'}" stroke-width="${s.width || 1.8}" ${s.dash ? 'stroke-dasharray="5 4"' : ''}/>`;
  }
  const legend = series.filter((s) => s.label).map((s, i) => `<text x="${P.l + 8 + i * 160}" y="${P.t + 12}" fill="${s.color}" font-size="12">● ${esc(s.label)}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">${g}${legend}</svg>`;
}
