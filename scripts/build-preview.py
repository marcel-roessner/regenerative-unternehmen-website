# Baut aus _site eine Vorschau mit relativen Pfaden (für die Claude-Artifact-Vorschau).
import os,re,glob,base64,shutil,urllib.parse,sys
SRC='/home/claude/site/_site'; OUT='/home/claude/preview'
shutil.rmtree(OUT,ignore_errors=True); os.makedirs(OUT)
pages=[f for f in glob.glob(SRC+'/**/*.html',recursive=True) if 'http-equiv="refresh"' not in open(f).read()]
def rel(t,depth):
    t=urllib.parse.unquote(t); frag=''
    if '#' in t: t,frag=t.split('#',1); frag='#'+frag
    last=t.rsplit('/',1)[-1]
    if t.startswith('/assets/') or '.' in last: path=t.lstrip('/')
    else: path=(t.strip('/')+'/index.html') if t.strip('/') else 'index.html'
    return '../'*depth+path+frag
for f in pages:
    r=os.path.relpath(f,SRC); d=r.count('/')
    h=open(f).read()
    h=re.sub(r'(href|src)="(/[^"]*)"',lambda m:f'{m.group(1)}="{rel(m.group(2),d)}"',h)
    h=re.sub(r'<link rel="(canonical|alternate|preload)"[^>]*>\n?','',h)
    h=re.sub(r'<meta property="og:[^>]*>\n?','',h)
    h=re.sub(r'<li><a href="[./]*feed.xml">RSS-Feed</a></li>','',h)
    os.makedirs(os.path.dirname(OUT+'/'+r),exist_ok=True); open(OUT+'/'+r,'w').write(h)
shutil.copytree(SRC+'/assets',OUT+'/assets')
css=open(OUT+'/assets/css/main.css').read()
css=re.sub(r'url\("(/assets/fonts/[^"]+)"\)',lambda m:'url("data:font/woff2;base64,'+base64.b64encode(open(SRC+m.group(1),'rb').read()).decode()+'")',css)
open(OUT+'/assets/css/main.css','w').write(css); shutil.rmtree(OUT+'/assets/fonts')
h=open(OUT+'/index.html').read()
head=re.sub(r'<meta (charset|name="viewport")[^>]*>\n?','',re.search(r'<head>(.*?)</head>',h,re.S).group(1))
body=re.search(r'<body>(.*)</body>',h,re.S).group(1)
open(OUT+'/home.html','w').write(head.strip()+'\n'+body.strip()+'\n'); os.remove(OUT+'/index.html')
print(sum(len(f) for _,_,f in os.walk(OUT)))
