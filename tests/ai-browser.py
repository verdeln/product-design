"""Workspace AI v0.3 UI regression over synthetic fixtures; no network calls."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import json, os, shutil
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'artifacts';OUT.mkdir(exist_ok=True)
HTML=(ROOT/'dist/standalone.html').read_text();results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),headless=True)
 version=b.version
 def run(name,fn,width=1440,height=1024):
  ctx=b.new_context(viewport={'width':width,'height':height});page=ctx.new_page();page.set_default_timeout(4000);errors=[];requests=[]
  page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda req:requests.append(req.url))
  try:
   page.set_content(HTML,wait_until='load');fn(page);assert not errors,errors;assert not requests,requests
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'horizontal overflow'
   results.append({'name':name,'status':'PASS'});print('PASS',name,flush=True)
  except Exception as e:
   results.append({'name':name,'status':'FAIL','error':str(e)});print('FAIL',name,str(e)[:600],flush=True);page.screenshot(path=str(OUT/f'FAIL-{name}.png'),full_page=True)
  finally:ctx.close()
 def goto(page,url):page.evaluate('(url)=>location.hash=url',url);page.wait_for_timeout(70)
 def shot(page,name):
  if not page.locator('dialog[open]').count() and page.locator('[data-action="dismiss-notice"]').count():page.locator('[data-action="dismiss-notice"]').click()
  page.screenshot(path=str(OUT/name),full_page=True)
 def nav(page):
  for hub in ['assistants','skills','packages','connections','tasks','automations','coordination','context','conversations']:
   goto(page,'/chat?hub='+hub);expect(page.locator('h1')).to_have_text('Workspace AI');expect(page.locator('.sidebar .workspace-tree')).to_be_visible();assert page.locator('.ai-workbench-body').inner_text()
  goto(page,'/chat?hub=assistants');shot(page,'ai-assistants-v03.png')
 run('ai-all-nine-views-stable-workspace',nav)
 def create(page,hub,button_name,name,body,label):
  goto(page,'/chat?hub='+hub);page.get_by_role('button',name=button_name,exact=True).click();page.get_by_label('Name',exact=True).fill(name);page.get_by_label(label,exact=True).fill(body);page.get_by_role('button',name='Save draft',exact=True).click()
  expect(page.locator('.ai-builder-grid')).to_contain_text('Not activated')
  page.get_by_role('button',name='Check current draft',exact=True).click();page.get_by_role('button',name='Publish revision',exact=True).click()
  expect(page.locator('.release-row')).to_have_count(1);page.get_by_role('button',name='Activate latest sample',exact=True).click();expect(page.locator('.ai-builder-grid')).to_contain_text('Activation v1')
 def assistant(page):
  goto(page,'/chat?hub=assistants');opener=page.get_by_role('button',name='Create assistant',exact=True);opener_id=opener.get_attribute('id');opener.click();page.keyboard.press('Escape');assert page.evaluate('document.activeElement.id')==opener_id
  create(page,'assistants','Create assistant','Writing helper','Read current workspace evidence. Ask before formal publication.','Purpose, instructions and what not to do')
  page.get_by_role('button',name='Bind for future work',exact=True).click();goto(page,'/projects/editor/overview');expect(page.locator('.ai-entry-bar')).to_contain_text('Writing helper')
 run('assistant-draft-release-activation-project-binding',assistant)
 def skill(page):
  create(page,'skills','Create skill','Verification steps','Use for comparing evidence. Read sources and identify unsupported claims.','When to use, steps, expected input/output and limits');shot(page,'skill-builder-v03.png')
 run('skill-authoring-release-and-activation',skill)
 def package(page):create(page,'packages','Create package','Writing essentials','A package combining approved methods and reference resources.','Package purpose and component composition')
 run('capability-package-authoring',package)
 def mcp(page):
  create(page,'connections','Create MCP descriptor','Sample remote tool','https://example.invalid/mcp','HTTPS endpoint · no keys, no local process')
  expect(page.locator('.ai-builder-grid')).to_contain_text('makes no network connection')
 run('mcp-descriptor-no-network-no-credentials',mcp)
 def discover(page):
  goto(page,'/chat?hub=context');expect(page.locator('.context-results')).to_contain_text('My working notes');expect(page.locator('.context-results')).to_contain_text('Release readiness')
  page.get_by_label('Include my accessible conversation / activity history').check();page.get_by_role('button',name='Inspect discovery & read receipt').click()
  expect(page.locator('.context-results')).not_to_contain_text('Your device conversation');page.get_by_role('combobox',name='Execution route',exact=True).select_option('direct-provider');page.get_by_role('button',name='Inspect discovery & read receipt').click();expect(page.locator('.context-results')).to_contain_text('Your device conversation')
  page.get_by_role('combobox',name='Project / shared audience',exact=True).select_option('editor');page.get_by_role('button',name='Inspect discovery & read receipt').click();expect(page.locator('.context-results')).not_to_contain_text('My working notes');shot(page,'workspace-context-v03.png')
 run('workspace-discovery-page-collection-history-and-audience',discover)

 def handoff(page):
  goto(page,'/resources?kind=source&item=rfc');page.get_by_role('button',name='Use this source in AI',exact=True).click()
  expect(page.locator('.priority-context')).to_be_visible();expect(page.locator('.priority-context')).to_contain_text('Shared editing')
  expect(page.locator('.ai-chat-grid .message.user')).to_have_count(0)
  page.get_by_text('Context & execution · workspace',exact=True).click();expect(page.get_by_role('combobox',name='Discovery scope')).to_have_value('workspace')
 run('library-to-ai-visible-priority-context-without-send',handoff)

 def sidebar(page):
  goto(page,'/pages/source-personal-notes');original=page.locator('.paper-document').inner_text();page.get_by_role('button',name='Ask AI beside this Page').click()
  page.get_by_role('textbox',name='Ask about this Page',exact=True).fill('What does this note say?');page.get_by_role('button',name='Ask · simulated',exact=True).click()
  expect(page.locator('.page-ai-panel')).to_contain_text('Scripted workspace-aware preview');assert page.locator('.paper-document').inner_text()==original
  page.get_by_role('button',name='Draft a continuation').click();expect(page.get_by_role('button',name='Approve this append')).to_be_visible();assert page.locator('.paper-document').inner_text()==original
  shot(page,'page-ai-sidebar-v03.png');page.get_by_role('button',name='Approve this append').click();expect(page.locator('.paper-document')).to_contain_text('Suggested next step')
  page.get_by_role('link',name='Open full conversation').click();expect(page.locator('.ai-chat-grid')).to_contain_text('What does this note say?')
 run('page-sidebar-same-session-draft-and-approved-append',sidebar)
 def draft(page):
  goto(page,'/pages/source-personal-notes');page.get_by_role('button',name='Edit demo page').click();page.get_by_label('Demo page content').fill('Uncommitted human draft')
  page.get_by_role('button',name='Ask AI beside this Page').click();expect(page.get_by_label('Demo page content')).to_have_value('Uncommitted human draft')
  page.get_by_role('textbox',name='Ask about this Page',exact=True).fill('Help without overwriting my draft');page.get_by_role('button',name='Ask · simulated',exact=True).click();page.get_by_role('button',name='Draft a continuation').click();expect(page.get_by_role('button',name='Approve this append')).to_be_disabled();expect(page.get_by_label('Demo page content')).to_have_value('Uncommitted human draft')
 run('page-local-draft-survives-ai-and-blocks-commit',draft)
 def plan(page):
  goto(page,'/chat?hub=coordination');page.get_by_role('button',name='Coordinate a goal',exact=True).click();page.get_by_role('button',name='Accept coordinated goal',exact=True).click()
  expect(page.locator('.assignment')).to_have_count(3);page.get_by_role('button',name='Simulate next cycle',exact=True).click();expect(page.locator('.assignment .badge').filter(has_text='Completed')).to_have_count(1)
  page.get_by_label('Question',exact=True).fill('Check the exact revision before continuing.');page.get_by_role('button',name='Record question').click();expect(page.locator('.agent-messages')).to_contain_text('Check the exact revision')
  for _ in range(2):page.get_by_role('button',name='Simulate next cycle',exact=True).click()
  expect(page.locator('.assignment .badge').filter(has_text='Completed')).to_have_count(3);shot(page,'coordination-v03.png')
  page.get_by_role('link',name='Review coordinated output',exact=True).click();page.get_by_role('button',name='Review & publish',exact=True).click();page.get_by_role('button',name='Approve & publish',exact=True).click();expect(page.get_by_role('dialog')).to_contain_text('PUBLICATION RECEIPT')
 run('coordinator-three-workers-messages-evidence-publication',plan)
 def automation(page):
  goto(page,'/chat?hub=automations');page.get_by_role('button',name='Create automation',exact=True).click();page.get_by_role('button',name='Save automation draft').click()
  page.get_by_role('button',name='Preview',exact=True).click();expect(page.locator('.occurrences a')).to_have_count(0)
  page.get_by_role('button',name='Enable sample rule').click();page.get_by_role('button',name='Simulate occurrence').click();expect(page.locator('.occurrences a')).to_have_count(1)
  page.get_by_role('button',name='Replay same occurrence').click();expect(page.locator('.occurrences a')).to_have_count(1);page.get_by_role('button',name='Pause future triggers').click();expect(page.get_by_role('button',name='Simulate occurrence')).to_be_disabled();shot(page,'automations-v03.png')
 run('automation-preview-enable-occurrence-dedupe-pause',automation)
 def boundary(page):
  goto(page,'/chat?hub=tasks');page.locator('.sidebar [data-action="scenarios"]').click();page.locator('#mode-select').select_option('signed-out');page.get_by_role('button',name='Close dialog').click();expect(page.locator('.ai-workbench-body')).to_have_count(0);expect(page.locator('body')).not_to_contain_text('Project coordinator')
 run('signed-out-hides-ai-workspace-data',boundary)
 def mobile(page):
  for hub in ['assistants','context','automations','coordination','conversations']:
   goto(page,'/chat?hub='+hub);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),hub
  goto(page,'/pages/source-personal-notes');page.get_by_role('button',name='Ask AI beside this Page').click();expect(page.locator('.page-ai-panel')).to_be_visible();shot(page,'mobile-page-ai-v03.png')
 run('mobile-workbench-and-page-ai-reflow',mobile,390,844)
 b.close()
report={'browser':version,'method':'set_content on built standalone, no network requests; synthetic fixture tests only','passed':sum(x['status']=='PASS' for x in results),'failed':sum(x['status']=='FAIL' for x in results),'cases':results}
(OUT/'ai-browser-results.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));raise SystemExit(1 if report['failed'] else 0)
