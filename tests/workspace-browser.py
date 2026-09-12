"""PW-UI-1.1: synthetic Workspace integration; not production permission proof."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import json, os, shutil
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts';OUT.mkdir(exist_ok=True)
HTML=(ROOT/'dist/standalone.html').read_text()
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),headless=True)
    def run(name,fn,width=1440,height=1000,realfile=False):
        filters=os.environ.get('CASE_FILTER','').split(',')
        if filters!=[''] and not any(x in name for x in filters):return
        context=browser.new_context(viewport={'width':width,'height':height});page=context.new_page();page.set_default_timeout(5000);errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        try:
            if realfile:page.goto((ROOT/'dist/standalone.html').as_uri())
            else:page.set_content(HTML)
            if page.locator('[data-action="dismiss-notice"]').count():page.locator('[data-action="dismiss-notice"]').click()
            fn(page)
            assert not errors,errors
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'Horizontal overflow'
            results.append({'name':name,'status':'PASS','mode':'file:// persistence' if realfile else 'set_content memory'});print('PASS',name,flush=True)
        except Exception as e:
            status='BLOCKED' if realfile and 'ERR_BLOCKED_BY_ADMINISTRATOR' in str(e) else 'FAIL'
            results.append({'name':name,'status':status,'error':str(e)});print(status,name,str(e)[:500],flush=True)
            page.screenshot(path=str(OUT/f'FAIL-{name}.png'),full_page=True)
        finally:context.close()
    def goto(page,path):
        page.evaluate('(p)=>location.hash=p',path);page.wait_for_timeout(80)
    def shot(page,name):
        if not page.locator('dialog').count() and page.locator('[data-action="dismiss-notice"]').count():page.locator('[data-action="dismiss-notice"]').click()
        page.screenshot(path=str(OUT/name),full_page=True)
    def stable(page):
        baseline=page.locator('.sidebar .workspace-tree').inner_text()
        for path in ['/projects/editor/chat','/resources','/projects','/chat','/','/pages/source-personal-notes','/teamspaces/engineering']:
            goto(page,path);assert page.locator('.sidebar .workspace-tree').inner_text()==baseline
            expect(page.locator('.sidebar nav[aria-label="Project sections"]')).to_have_count(0)
        goto(page,'/projects/editor/overview');expect(page.locator('main nav[aria-label="Project sections"]')).to_be_visible();shot(page,'workspace-overview-v02.png')
    run('stable-sidebar-across-seven-destinations',stable)
    def canonical(page):
        goto(page,'/projects/editor/sources?kind=source&item=rfc');expect(page.get_by_role('dialog')).to_be_visible()
        page.get_by_role('link',name='Open original page →').click()
        expect(page.locator('h1')).to_have_text('Shared editing · design RFC');expect(page.locator('.location-bar')).to_contain_text('Product & Engineering')
        expect(page.get_by_role('link',name='← Return to Editor collaboration')).to_be_visible()
        expect(page.locator('main nav[aria-label="Project sections"]')).to_have_count(0)
        page.get_by_role('button',name='Edit demo page',exact=True).click()
        page.get_by_label('Demo page content').fill('## Canonical page\n\nOne body, wherever the page is opened.')
        page.get_by_role('button',name='Save page',exact=True).click()
        goto(page,'/projects/editor/sources?kind=source&item=rfc')
        expect(page.get_by_role('dialog')).to_contain_text('One body, wherever the page is opened.')
        page.keyboard.press('Escape');goto(page,'/pages/source-rfc');shot(page,'canonical-page-v02.png')
    run('project-source-to-canonical-page-and-back',canonical)
    def favorite(page):
        goto(page,'/pages/source-personal-notes');page.get_by_role('button',name='Add to Favorites',exact=True).click()
        expect(page.locator('#group-favorites')).to_contain_text('My working notes')
        goto(page,'/projects/launch/overview');page.get_by_role('button',name='Add to Favorites',exact=True).click()
        expect(page.locator('#group-favorites')).to_contain_text('A quieter launch')
        page.get_by_role('button',name='Remove from Favorites',exact=True).click();expect(page.locator('#group-favorites')).not_to_contain_text('A quieter launch')
        expect(page.locator('h1')).to_have_text('A quieter launch')
    run('typed-favorites-do-not-own-content',favorite)
    def move(page):
        goto(page,'/pages/source-personal-notes');page.get_by_role('button',name='Move to…',exact=True).click()
        page.get_by_role('combobox',name='Destination',exact=True).select_option('engineering');page.get_by_role('button',name='Preview move',exact=True).click()
        expect(page.get_by_role('dialog')).to_contain_text('Complete page subtree · 2')
        shot(page,'move-visibility-review-v02.png')
        page.get_by_role('button',name='Simulate intervening edit',exact=True).click()
        expect(page.get_by_role('button',name='Confirm move',exact=True)).to_be_disabled()
        page.get_by_role('button',name='Preview move',exact=True).click();page.get_by_role('button',name='Confirm move',exact=True).click()
        expect(page.locator('.location-bar')).to_contain_text('Product & Engineering')
        expect(page.locator('#group-private')).not_to_contain_text('My working notes')
        goto(page,'/pages/source-product-ideas');expect(page.locator('.location-bar')).to_contain_text('Product & Engineering')
    run('subtree-visibility-preview-and-stale-revalidation',move)
    def private_link(page):
        goto(page,'/pages/source-personal-notes');page.get_by_role('button',name='Link to project',exact=True).click()
        row=page.locator('.link-choice').filter(has_text='Editor collaboration');expect(row.get_by_role('button',name='Link',exact=True)).to_be_disabled()
        expect(row).to_contain_text('Audience mismatch')
        page.locator('.link-choice').filter(has_text='Agent field notes').get_by_role('button',name='Link',exact=True).click()
        expect(page.locator('.related-projects')).to_contain_text('Agent field notes');expect(page.locator('.location-bar')).to_contain_text('Private')
    run('private-to-shared-link-is-not-sharing',private_link)
    def sharing(page):
        goto(page,'/pages/source-personal-notes');page.get_by_role('button',name='Share read-only',exact=True).click();page.get_by_role('button',name='Grant read-only access',exact=True).click()
        expect(page.locator('.location-bar')).to_contain_text('Owner + explicitly shared readers');expect(page.locator('#group-private')).to_contain_text('My working notes')
        expect(page.locator('#group-private [aria-label="Explicitly shared read-only"]')).to_have_count(2)
        goto(page,'/pages/source-shared-research');expect(page.get_by_role('button',name='Edit demo page',exact=True)).to_be_disabled();expect(page.get_by_role('button',name='Move to…',exact=True)).to_be_disabled()
    run('private-sharing-and-shared-read-only',sharing)
    def create(page):
        page.get_by_role('button',name='Create private page',exact=True).click();page.get_by_label('Page title',exact=True).fill('A private first draft');page.get_by_role('button',name='Create page',exact=True).click()
        expect(page.locator('h1')).to_have_text('A private first draft');expect(page.locator('.location-bar')).to_contain_text('Only you')
        goto(page,'/projects/editor/sources');page.get_by_role('button',name='Add source',exact=True).click();page.get_by_role('button',name='Create a page and choose its location',exact=True).click()
        expect(page.get_by_role('combobox',name='Save to',exact=True)).to_have_value('engineering');page.get_by_label('Page title',exact=True).fill('A linked team note');page.get_by_role('button',name='Create page',exact=True).click()
        expect(page.locator('.related-projects')).to_contain_text('Editor collaboration');expect(page.locator('.location-bar')).to_contain_text('Product & Engineering')
    run('creation-destination-and-optional-link',create)
    def teamspace(page):
        goto(page,'/teamspaces/engineering');expect(page.locator('h1')).to_have_text('Product & Engineering');shot(page,'teamspace-overview-v02.png')
        page.locator('.teamspace-grid').get_by_role('link').filter(has_text='Editor collaboration').click();expect(page.locator('h1')).to_have_text('Editor collaboration')
        page.get_by_role('button',name='Project location',exact=True).click();page.get_by_role('combobox',name='Project location',exact=True).select_option('design');page.get_by_role('button',name='Review and change project location',exact=True).click()
        expect(page.locator('.location-bar')).to_contain_text('Design');goto(page,'/pages/source-rfc');expect(page.locator('.location-bar')).to_contain_text('Product & Engineering')
    run('teamspace-project-lens-does-not-move-sources',teamspace)
    def discovery(page):
        expect(page.locator('.sidebar')).not_to_contain_text('Restricted planning');goto(page,'/teamspaces/hidden');expect(page.locator('h1')).to_have_text('Teamspace unavailable');expect(page.locator('body')).not_to_contain_text('Restricted planning')
        goto(page,'/teamspaces/operations');expect(page.get_by_role('heading',name='Members only',exact=True)).to_be_visible();expect(page.locator('.teamspace-grid')).to_have_count(0)
    run('private-hidden-versus-closed-discoverable',discovery)
    def drawer(page):
        page.get_by_role('button',name='Open sections',exact=True).click();expect(page.get_by_role('dialog')).to_contain_text('Favorites');expect(page.get_by_role('dialog')).to_contain_text('Private');expect(page.get_by_role('dialog')).to_contain_text('Teamspaces');shot(page,'mobile-workspace-navigation-v02.png')
        page.get_by_role('dialog').get_by_role('link',name='My working notes',exact=True).click();expect(page.locator('h1')).to_have_text('My working notes');expect(page.locator('dialog')).to_have_count(0)
        goto(page,'/projects/editor/overview');expect(page.get_by_role('button',name='Project sections',exact=True)).to_be_visible();shot(page,'mobile-project-v02.png')
    run('mobile-stable-drawer-and-project-sections',drawer,390,844)
    def storage(page):
        goto(page,'/pages/source-personal-notes');page.get_by_role('button',name='Add to Favorites',exact=True).click();page.reload();expect(page.locator('#group-favorites')).to_contain_text('My working notes');expect(page.get_by_role('button',name='Remove from Favorites',exact=True)).to_be_visible()
        page.get_by_role('button',name='Edit demo page',exact=True).click();page.get_by_role('textbox',name='Demo page content',exact=True).fill('Persisted synthetic content.');page.get_by_role('button',name='Save page',exact=True).click();page.reload();expect(page.locator('.paper-document')).to_contain_text('Persisted synthetic content.')
    run('actual-file-opening-and-reload-persistence',storage,realfile=True)
    def continuity(page):
        goto(page,'/pages/source-personal-notes');page.get_by_role('button',name='Edit demo page',exact=True).click();page.get_by_role('textbox',name='Demo page content',exact=True).fill('An unsaved local draft.');goto(page,'/projects/editor/overview');goto(page,'/pages/source-personal-notes');expect(page.get_by_role('textbox',name='Demo page content',exact=True)).to_have_value('An unsaved local draft.')
    run('unsaved-page-draft-survives-route-switch',continuity)
    version=browser.version;browser.close()
report={'browser':version,'passed':sum(x['status']=='PASS' for x in results),'failed':sum(x['status']=='FAIL' for x in results),'blocked':sum(x['status']=='BLOCKED' for x in results),'cases':results}
(OUT/'workspace-browser-results.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));raise SystemExit(1 if report['failed'] else 0)
