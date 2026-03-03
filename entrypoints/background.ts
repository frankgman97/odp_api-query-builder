export default defineBackground(() => {
  // Open the side panel when the extension icon is clicked
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
