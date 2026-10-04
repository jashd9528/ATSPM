const repo='jashd9528/ATSPM';
const $=id=>document.getElementById(id);
let loading=false,englishMode=false;
const media=matchMedia('(prefers-color-scheme: dark)');
let choice;try{choice=localStorage.getItem('atspm-theme')}catch{}
function theme(value){document.documentElement.dataset.theme=value;$('theme').firstElementChild.textContent=value==='dark'?'☾':'☀';$('theme').setAttribute('aria-pressed',String(value==='dark'))}
theme(choice||(media.matches?'dark':'light'));
$('theme').onclick=()=>{choice=document.documentElement.dataset.theme==='dark'?'light':'dark';theme(choice);try{localStorage.setItem('atspm-theme',choice)}catch{}};
media.addEventListener('change',event=>{if(!choice)theme(event.matches?'dark':'light')});
async function refresh(live=false){
  if(loading)return;loading=true;$('refresh').disabled=true;$('release-status').textContent='正在读取发布信息…';
  try{
    const response=await fetch(live?`https://api.github.com/repos/${repo}/releases/latest`:new URL('release.json',document.baseURI),{headers:{Accept:'application/json'},signal:AbortSignal.timeout(15000),cache:'no-store'});
    if(!response.ok)throw Error(response.status===404?'尚未发布正式安装包':response.status===403||response.status===429?'GitHub 请求暂时受限':`版本服务返回 HTTP ${response.status}`);
    const data=await response.json();
    const asset=data.assets?.find(a=>/^ATSPM-\d+\.\d+\.\d+-x64\.msi$/.test(a.name));
    const prefix=`https://github.com/${repo}/releases/`;
    if(!asset||!asset.browser_download_url?.startsWith(prefix+'download/')||!data.html_url?.startsWith(prefix+'tag/'))throw Error('此版本尚无 Windows x64 安装包');
    $('version').textContent=`${englishMode?'Version':'版本'} ${data.tag_name.replace(/^v/,'')}`;
    $('filename').textContent=asset.name;$('size').textContent=`${(asset.size/1024/1024).toFixed(1)} MB`;
    $('download').href=asset.browser_download_url;$('download').classList.remove('disabled');$('download').removeAttribute('aria-disabled');
    $('release-notes').textContent=data.body||'此版本暂未发布说明。';
    $('release-status').textContent='';
  }catch(error){
    $('release-status').textContent=`${error.name==='TimeoutError'?'版本检查超时':error.message}。${$('download').hasAttribute('href')?'已保留最近发布的下载链接。':'请稍后刷新，或访问 GitHub 版本页面。'}`;
    if(!$('download').hasAttribute('href')){$('version').textContent='版本信息暂未就绪';$('release-notes').textContent='请访问 GitHub Releases 查看已发布的版本。'}
  }finally{loading=false;$('refresh').disabled=false}
}
$('refresh').onclick=()=>refresh(true);
refresh();

// Native links remain usable without JS; history navigation switches the two
// documents without resetting the current theme or download metadata.
const chapters=[...document.querySelectorAll('[data-chapter]')];
for(const a of chapters){const option=document.createElement('option');option.value=a.dataset.chapter;option.textContent=a.textContent;$('chapter-picker').append(option)}
function renderRoute(scroll=false){
  const isDocs=/\/docs\/?$/.test(location.pathname);
  const selected=isDocs?(chapters.some(a=>a.dataset.chapter===location.hash.slice(1))?location.hash.slice(1):'quick-start'):'downloads';
  const downloads=selected==='downloads';
  $('quick-start').hidden=downloads;$('downloads').hidden=!downloads;
  $('intro').classList.toggle('docs-intro--downloads',downloads);
  $('page-title').textContent=downloads?(englishMode?'Downloads':'下载'):(englishMode?'Connect ATSPM to ChatGPT':'把 ATSPM 接入 ChatGPT');
  document.title=downloads?(englishMode?'ATSPM Downloads':'ATSPM 下载'):(englishMode?'ATSPM Docs':'ATSPM 文档');
  for(const a of chapters){if(a.dataset.chapter===selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}
  $('chapter-picker').value=selected;
  if(scroll){if(!downloads&&selected!=='quick-start')$(selected).scrollIntoView();else window.scrollTo(0,0)}
}
function navigate(url){history.pushState(null,'',url);renderRoute(true)}
$('chapter-nav').addEventListener('click',event=>{
  const link=event.target.closest('a[data-chapter]');if(!link||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();navigate(link.href);
});
$('chapter-picker').onchange=()=>navigate(chapters.find(a=>a.dataset.chapter===$('chapter-picker').value).href);
addEventListener('popstate',()=>renderRoute(true));addEventListener('hashchange',()=>renderRoute(true));
renderRoute(true);

const translationPairs=[
 ['快速上手','Quick start'],
 ['Tunnel 使用方案一 · Cloudflare Tunnel','Tunnel option 1 · Cloudflare Tunnel'],
 ['Tunnel 使用方案二 · OpenAI Secure MCP Tunnel','Tunnel option 2 · OpenAI Secure MCP Tunnel'],
 ['开启开发者模式（Developer mode）','Enable Developer mode'],
 ['添加 ATSPM MCP 插件','Add the ATSPM MCP plugin'],
 ['安装并测试插件','Install and test the plugin'],
 ['按下方官方指南创建 Cloudflare Tunnel。','Create a Cloudflare Tunnel following the official guide below.'],
 ['将隧道连接到 ATSPM 的 MCP 地址，设置 HTTPS 域名。','Connect the tunnel to the ATSPM MCP address and configure an HTTPS domain.'],
 ['在 ATSPM“设置 → 隧道”点击“配置”保存 Cloudflare Token，再启动服务。','In ATSPM Settings → Tunnel, click Configure to save the Cloudflare Token, then start the service.'],
 ['在 OpenAI Platform 创建隧道并关联 ChatGPT 工作区。','Create a tunnel in OpenAI Platform and link it to your ChatGPT workspace.'],
 ['在 ATSPM“设置 → Tunnel”安装客户端，填入 Tunnel ID 和运行密钥。','Install the client in ATSPM Settings → Tunnel and enter the Tunnel ID and runtime key.'],
 ['启动隧道，详细步骤参考下方官方指南。','Start the tunnel. See the official guide below for detailed instructions.'],
 ['在 ChatGPT 打开「设置 → 安全与登录（Security and login）」，启用 Developer mode。','In ChatGPT, open Settings → Security and login and enable Developer mode.'],
 ['在 ChatGPT 开发者模式中添加 MCP 连接。','Add an MCP connection in ChatGPT Developer mode.'],
 ['方案一填写 Cloudflare 的 HTTPS MCP 地址；方案二选择 Tunnel 及对应隧道。','For option 1, enter the Cloudflare HTTPS MCP address; for option 2, select Tunnel and the corresponding tunnel.'],
 ['完成 ATSPM 授权。','Complete ATSPM authorization.'],
 ['在新 ChatGPT 对话中选择 ATSPM。','Select ATSPM in a new ChatGPT conversation.'],
 ['请它读取指定文件或文件夹，核对结果及 ATSPM 历史。','Ask it to read a specified file or folder, then verify the result and ATSPM history.'],
 ['官方接入指南','Official integration guide'],['OpenAI Plugins 官方快速入门','OpenAI Plugins official quickstart'],
 ['下载','Download'],['文档','Docs'],['刷新版本信息','Refresh version information'],['文件','File'],['大小','Size'],['发布说明','Release notes'],['App 隐私权政策','App Privacy Policy'],['更新于 2026 年 9 月 30 日','Updated September 30, 2026']
];
const translations=new Map(translationPairs),translatedNodes=[];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
for(let node=walker.nextNode();node;node=walker.nextNode()){
  if(node.parentElement.closest('script,style,#page-title'))continue;
  const original=node.textContent,key=original.trim().replace(/^•\s*/,''),translated=translations.get(key);
  if(translated)translatedNodes.push({node,original,translated:original.replace(key,translated)});
}
$('language').onclick=()=>{
  englishMode=!englishMode;
  for(const item of translatedNodes)item.node.textContent=englishMode?item.translated:item.original;
  document.documentElement.lang=englishMode?'en':'zh-CN';
  $('language').setAttribute('aria-pressed',String(englishMode));
  $('version').textContent=$('version').textContent.replace(englishMode?'版本 ':'Version ',englishMode?'Version ':'版本 ');
  renderRoute();
};
