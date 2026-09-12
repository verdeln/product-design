"""Render the standalone artifact without network navigation; synthetic-state UI tests.
Install Playwright separately and set CHROMIUM_EXECUTABLE if needed.
This does not test live services, native desktop, or real account authorization.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import json, os, shutil
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts'
OUT.mkdir(exist_ok=True)
HTML = (ROOT / 'dist/standalone.html').read_text()
results = []
with sync_playwright() as p:
    executable = os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium')
    browser = p.chromium.launch(executable_path=executable, headless=True)
    version = browser.version
    def run(name, fn, width=1440, height=1000):
        wanted = os.environ.get('CASE_FILTER', '').split(',')
        if wanted != [''] and not any(part in name for part in wanted): return
        page = browser.new_page(viewport={'width':width,'height':height})
        page.set_default_timeout(4000)
        errors=[]; requests=[]
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('request', lambda req: requests.append(req.url))
        try:
            page.set_content(HTML, wait_until='load')
            if page.locator('[data-action="dismiss-notice"]').count(): page.locator('[data-action="dismiss-notice"]').click()
            fn(page)
            assert not errors, errors
            assert not requests, requests
            results.append({'name':name,'status':'PASS'}); print('PASS', name, flush=True)
        except Exception as e:
            results.append({'name':name,'status':'FAIL','error':str(e)}); print('FAIL', name, str(e)[:400], flush=True)
            page.screenshot(path=str(OUT / f'FAIL-{name}.png'), full_page=True)
        finally: page.close()
    def path(page, target):
        page.evaluate('(value)=>{location.hash=value}',target)
        page.wait_for_timeout(60)
    def shot(page, name):
        if not page.locator('dialog[open]').count() and page.locator('[data-action="dismiss-notice"]').count(): page.locator('[data-action="dismiss-notice"]').click()
        page.screenshot(path=str(OUT/name),full_page=True)
    def overflow(page): assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Horizontal document overflow'
    def layouts(page):
        for key in ['studio','focus','console']:
            page.locator(f'.topbar [data-action="direction:{key}"]').click()
            assert page.locator('html').get_attribute('data-direction')==key
            overflow(page); shot(page,f'{key}-overview.png')
        page.locator('.topbar [data-action="theme"]').click()
        assert page.locator('html').get_attribute('data-theme')=='dark'
        shot(page,'console-dark.png')
    run('three-layouts-and-dark',layouts)
    def navigation(page):
        for section in ['overview','chat','sources','highlights','work','outputs','activity']:
            page.locator('nav[aria-label="Project sections"]').get_by_role('link',name=section.capitalize(),exact=True).click()
            assert page.evaluate('location.hash').split('?')[0].endswith(section)
            assert page.locator('h1').inner_text()
            overflow(page)
        for url in ['/','/resources','/projects','/chat']:
            page.locator('nav[aria-label="Primary"]').locator(f'a[href="#{url}"]').click()
            assert not page.locator('.context-nav').count()
    run('all-navigation-destinations',navigation)
    def sources(page):
        path(page,'/projects/editor/sources')
        page.locator('a[data-drag-source="rfc"]').click()
        page.get_by_label('Your annotation',exact=True).fill('A note from the UI test')
        page.get_by_role('button',name='Save highlight',exact=True).click()
        page.keyboard.press('Escape')
        path(page,'/projects/editor/highlights')
        expect(page.get_by_text('A note from the UI test',exact=True)).to_be_visible()
        shot(page,'highlights.png')
    run('source-to-highlight',sources)
    def attach(page):
        path(page,'/projects/editor/sources')
        page.locator('a[data-drag-source="rfc"]').click()
        page.get_by_role('button',name='Attach to project chat',exact=True).click()
        expect(page.locator('#composer .context-chip')).to_have_count(1)
        page.get_by_label('Message to the coordinator').fill('What should I review next?')
        page.get_by_role('button',name='Send',exact=True).click()
        expect(page.locator('.messages .message.user')).to_have_count(1)
        expect(page.locator('.messages')).to_contain_text('Scripted prototype response')
        shot(page,'project-chat.png')
    run('attach-chat-without-implicit-task',attach)
    def drag(page):
        path(page,'/projects/editor/sources')
        page.locator('[data-drag-source="rfc"]').drag_to(page.locator('nav[aria-label="Project sections"] [data-drop-context]'))
        expect(page.locator('#composer .context-chip')).to_have_count(1)
        expect(page.locator('.messages .message.user')).to_have_count(0)
    run('drag-context-without-send',drag)
    def multi(page):
        path(page,'/projects/editor/sources')
        page.locator('[data-select="rfc"]').click()
        page.locator('[data-select="repo"]').click(modifiers=['Shift'])
        expect(page.locator('[data-select]:checked')).to_have_count(3)
        page.get_by_role('button',name='Remove references',exact=True).click()
        page.get_by_role('dialog').get_by_role('button',name='Remove references',exact=True).click()
        expect(page.locator('[data-select]')).to_have_count(1)
        path(page,'/resources')
        expect(page.locator('.selectable-row')).to_have_count(9)
    run('range-selection-removes-links-only',multi)
    def publish(page):
        page.locator('.attention-row').first.click()
        page.get_by_role('button',name='Review & publish',exact=True).click()
        page.get_by_role('button',name='Simulate a concurrent edit',exact=True).click()
        expect(page.get_by_role('button',name='Approve & publish',exact=True)).to_be_disabled()
        expect(page.get_by_text('Destination changed since preview.',exact=True)).to_be_visible()
        shot(page,'stale-publication-review.png')
        page.get_by_role('button',name='Refresh review',exact=True).click()
        page.get_by_role('button',name='Approve & publish',exact=True).click()
        expect(page.get_by_text('PUBLICATION RECEIPT · SIMULATED',exact=True)).to_be_visible()
        page.keyboard.press('Escape')
        path(page,'/projects/editor/work')
        page.get_by_role('button',name='Completed',exact=True).click()
        expect(page.locator('.table-card .object-row')).to_have_count(1)
        expect(page.locator('.table-card')).to_contain_text('Prepare the collaboration brief')
        path(page,'/projects/editor/activity')
        expect(page.locator('.activity-list')).to_contain_text('Published to the demo workspace')
    run('stale-review-then-exact-publication',publish)
    def create(page):
        page.locator('.sidebar [data-action="new-project"]').click()
        page.get_by_label('Project name',exact=True).fill('UI Test Project')
        page.get_by_label('What are you trying to achieve?',exact=True).fill('Test one coherent flow')
        page.get_by_role('button',name='Create project',exact=True).click()
        expect(page.locator('h1')).to_have_text('UI Test Project')
        page.get_by_role('button',name='Add work',exact=True).click()
        page.get_by_label('Goal',exact=True).fill('Inspect a real requirement')
        page.get_by_label('Completion criteria · one per line',exact=True).fill('Evidence must be reviewed')
        page.get_by_role('button',name='Accept work',exact=True).click()
        expect(page.locator('.table-card')).to_contain_text('Inspect a real requirement')
        page.locator('.table-card .object-row').click()
        page.get_by_role('button',name='Simulate execution checkpoint',exact=True).click()
        expect(page.get_by_role('dialog')).to_contain_text('Not yet proven')
        expect(page.get_by_role('dialog')).to_contain_text('Review output')
    run('create-project-and-explicit-task',create)
    def unknown(page):
        page.locator('.sidebar [data-action="scenarios"]').click()
        page.get_by_role('button',name='Create an unknown delivery',exact=True).click()
        page.locator('.attention-row').filter(has_text='Delivery needs verification').click()
        expect(page.get_by_role('dialog')).to_contain_text('The outcome is unknown')
        expect(page.get_by_role('dialog').get_by_role('button',name='Resend',exact=True)).to_have_count(0)
        shot(page,'unknown-delivery.png')
        page.get_by_role('button',name='Simulate provider receipt lookup',exact=True).click()
        expect(page.get_by_role('dialog')).to_contain_text('Existing delivery verified')
    run('unknown-outcome-never-resends',unknown)
    def permission(page):
        page.locator('.sidebar [data-action="scenarios"]').click()
        page.locator('#mode-select').select_option('viewer')
        page.get_by_role('button',name='Close dialog',exact=True).click()
        page.locator('.attention-row').first.click()
        expect(page.get_by_role('button',name='Review & publish',exact=True)).to_be_disabled()
        page.keyboard.press('Escape')
        page.locator('.sidebar [data-action="scenarios"]').click()
        page.locator('#mode-select').select_option('signed-out')
        page.get_by_role('button',name='Close dialog',exact=True).click()
        expect(page.locator('body')).not_to_contain_text('Editor collaboration')
        expect(page.locator('nav[aria-label="Primary"] a')).to_have_count(2)
    run('viewer-and-signed-out',permission)
    def revoked(page):
        page.locator('.sidebar [data-action="scenarios"]').click()
        page.get_by_role('button',name='Revoke a linked source',exact=True).click()
        path(page,'/projects/editor/sources?kind=source&item=rfc')
        expect(page.get_by_role('dialog')).to_contain_text('Access removed')
        expect(page.get_by_role('dialog')).not_to_contain_text('Shared editing · design RFC')
        expect(page.get_by_role('dialog').get_by_role('button',name='Attach to project chat',exact=True)).to_have_count(0)
    run('revoked-source-detail',revoked)
    def focus(page):
        path(page,'/projects/editor/sources')
        row=page.locator('a[data-drag-source="rfc"]'); opener=row.get_attribute('id');row.click();expect(page.get_by_role('dialog')).to_be_visible()
        for _ in range(14):
            page.keyboard.press('Tab')
            assert page.evaluate('document.getElementById("overlay").contains(document.activeElement)')
        page.keyboard.press('Escape')
        expect(page.get_by_role('dialog')).to_have_count(0)
        assert page.evaluate('document.activeElement.id')==opener
        row=page.locator('a[data-drag-source="rfc"]');row.click()
        page.get_by_role('link',name='Open full page',exact=True).click()
        expect(page.get_by_role('dialog')).to_have_count(0)
        expect(page.locator('.full-detail')).to_contain_text('Shared editing · design RFC')
    run('dialog-focus-and-full-detail',focus)
    def search(page):
        page.keyboard.press('Control+k')
        page.get_by_label('Search projects and material').fill('Agent')
        expect(page.locator('.search-results')).to_contain_text('Agent field notes')
        page.keyboard.press('Escape')
        path(page,'/projects/editor/sources')
        page.get_by_label('Search sources',exact=True).fill('zzzz-no-match')
        expect(page.get_by_text('No matching sources',exact=True)).to_be_visible()
    run('search-and-empty-filter',search)
    def mobile(page):
        overflow(page)
        expect(page.locator('.mobile-bottom')).to_be_visible()
        shot(page,'mobile-overview.png')
        page.get_by_role('button',name='Open sections',exact=True).click()
        page.get_by_role('dialog').get_by_role('link',name='Work',exact=True).click()
        expect(page.locator('h1')).to_have_text('Work')
        overflow(page)
        page.locator('.table-card .object-row').first.click()
        assert abs(page.get_by_role('dialog').bounding_box()['width']-390)<2
        overflow(page)
        shot(page,'mobile-task-detail.png')
    run('mobile-navigation-and-fullscreen-detail',mobile,390,844)
    def responsive(page):
        for section in ['overview','sources','highlights','work','outputs','chat','activity']:
            path(page,f'/projects/editor/{section}')
            overflow(page)
        path(page,'/projects/editor/overview')
        page.emulate_media(reduced_motion='reduce')
        assert page.locator('.btn').first.evaluate('el=>getComputedStyle(el).transitionDuration')=='0s'
    run('narrow-reflow-and-reduced-motion',responsive,720,1000)
    def deep(page):
        path(page,'/projects/research/outputs?kind=artifact&item=brief-output')
        expect(page.get_by_role('dialog')).to_contain_text('Output unavailable')
        path(page,'/projects/editor/not-a-section')
        expect(page.get_by_text('This view does not exist',exact=True)).to_be_visible()
    run('cross-project-and-invalid-deeplink',deep)
    browser.close()
report={'browser':f'Chromium {version}','method':'Standalone HTML via set_content; no network navigation. Storage-unavailable path is exercised. No real-origin persistence or live services tested.','passed':sum(r['status']=='PASS' for r in results),'failed':sum(r['status']=='FAIL' for r in results),'cases':results}
(OUT/'browser-results.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
raise SystemExit(1 if report['failed'] else 0)
