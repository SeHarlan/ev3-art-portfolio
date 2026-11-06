// B1 repro: window chrome geometry against Sk3tch's paint.css. Run in the
// browser console on the dev server with at least one window open (and a
// MenuDropdown open to cover the dropdown). Returns the failures; [] passes.
(() => {
  const fails = [];
  const expect = (what, got, want) => {
    if (Math.abs(got - want) > 0.01) fails.push(`${what}: ${got} != ${want}`);
  };
  document.querySelectorAll('[class*="h-[22px]"]').forEach((bar) => {
    const title = bar.querySelector('p');
    const name = title.textContent;
    // paint.css:234-251: title bar 22u; the title text inherits line-height 1.2.
    // W95FA's descenders reach past a 1.2 line box, so a title that clips
    // vertically cuts them off.
    expect(`${name} title bar height`, bar.getBoundingClientRect().height, 22);
    expect(`${name} title line-height`, parseFloat(getComputedStyle(title).lineHeight), 13.2);
    if (getComputedStyle(title).overflowY !== 'visible' && title.scrollHeight > title.clientHeight) {
      fails.push(`${name} title text clipped: ${title.clientHeight} < ${title.scrollHeight}`);
    }
    // paint.css:278-297: menu bar 18u items + 3u above + 2u below = 23u.
    const menu = bar.nextElementSibling;
    expect(`${name} menu bar height`, menu.getBoundingClientRect().height, 23);
    [...menu.children].forEach((item) => {
      expect(`${name} menu item "${item.textContent}" height`, item.getBoundingClientRect().height, 18);
    });
  });
  // paint.css:350-363: dropdown items 18u.
  document.querySelectorAll('.p95-chrome.classic-border .p95-menu-item').forEach((item) => {
    const h = item.getBoundingClientRect().height;
    if (h) expect(`dropdown item "${item.textContent}" height`, h, 18);
  });
  return fails;
})();
