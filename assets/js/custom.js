/**
 * Custom JavaScript for FixIt blog site.
 * @author @LiuTxxx https://liutxxx.github.io/
 */

document.addEventListener('scroll', function() {
  const asideCollection = document.querySelector('.aside-collection');

  // Get the root font size (usually of the <html> element)
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

  // Convert 7rem to pixels
  const stickyPosition = 7 * rootFontSize;

  if (window.scrollY >= stickyPosition) {
    asideCollection.classList.add('sticky');
  } else {
    asideCollection.classList.remove('sticky');
  }
});
