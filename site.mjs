const repo='jashd9528/ATSPM';
const $=id=>document.getElementById(id);
let loading=false;
const media=matchMedia('(prefers-color-scheme: dark)');
let choice;try{choice=localStorage.getItem('atspm-theme')}catch{}
function theme(value){document.documentElement.dataset.theme=value;$('theme').setAttribute('aria-label',value==='dark'?'切换浅色主题':'切换深色主题');$('theme').setAttribute('aria-pressed',String(value==='dark'))}
theme(choice||(media.matches?'dark':'light'));
$('theme').onclick=()=>{choice=document.documentElement.dataset.theme==='dark'?'light':'dark';theme(choice);try{localStorage.setItem('atspm-theme',choice)}catch{}};
media.addEventListener('change',event=>{if(!choice)theme(event.matches?'dark':'light')});
async function refresh(live=false){
  if(loading)return;loading=true;$('refresh').disabled=true;$('release-status').textContent='正在读取发布信息…';
  try{
    const response=await fetch(live?`https://api.github.com/repos/${repo}/releases/latest`:'./release.json',{headers:{Accept:'application/json'},signal:AbortSignal.timeout(15000),cache:'no-store'});
    if(!response.ok)throw Error(response.status===404?'尚未发布正式安装包':response.status===403||response.status===429?'GitHub 请求暂时受限':`版本服务返回 HTTP ${response.status}`);
    const data=await response.json();
    const asset=data.assets?.find(a=>/^ATSPM-\d+\.\d+\.\d+-x64\.msi$/.test(a.name));
    const prefix=`https://github.com/${repo}/releases/`;
    if(!asset||!asset.browser_download_url?.startsWith(prefix+'download/')||!data.html_url?.startsWith(prefix+'tag/'))throw Error('此版本尚无 Windows x64 安装包');
    $('version').textContent=`版本 ${data.tag_name} · 发布于 ${new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai'}).format(new Date(data.published_at))}`;
    $('filename').textContent=asset.name;$('size').textContent=`${(asset.size/1024/1024).toFixed(1)} MB`;
    $('download').href=asset.browser_download_url;$('download').classList.remove('disabled');$('download').removeAttribute('aria-disabled');
    $('release-notes').textContent=data.body||'此版本暂无发布说明。';$('release-link').href=data.html_url;
    $('release-status').textContent=live?'已从 GitHub Releases 刷新。':'版本信息与 GitHub Release 同步发布。';
  }catch(error){
    $('release-status').textContent=`${error.name==='TimeoutError'?'版本检查超时':error.message}。${$('download').hasAttribute('href')?'已保留最近发布的下载链接。':'请稍后刷新，或访问 GitHub 版本页面。'}`;
    if(!$('download').hasAttribute('href')){$('version').textContent='版本信息暂未就绪';$('release-notes').textContent='请访问 GitHub Releases 查看已发布的版本。'}
  }finally{loading=false;$('refresh').disabled=false}
}
$('refresh').onclick=()=>refresh(true);
refresh();
