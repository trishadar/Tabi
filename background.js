// Initialize default stats if not set
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ health: 50, happiness: 50 });
});

// Increase health when user closes a tab
chrome.tabs.onRemoved.addListener(() => {
  chrome.storage.sync.get(["health"], (data) => {
    let newHealth = Math.min((data.health || 50) + 5, 100);
    chrome.storage.sync.set({ health: newHealth });
  });
});
