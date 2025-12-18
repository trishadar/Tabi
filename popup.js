const healthEl = document.getElementById("health");
const happinessEl = document.getElementById("happiness");
const petEl = document.getElementById("pet");

// Load stats when popup opens
function loadStats() {
  chrome.storage.sync.get(["health", "happiness"], (data) => {
    healthEl.textContent = data.health || 50;
    happinessEl.textContent = data.happiness || 50;
    updatePetFace(data.health, data.happiness);
  });
}

function updatePetFace(health, happiness) {
  const petImg = document.getElementById("petImg");

  // Remove all previous classes
  petImg.className = "";

  // Set the image source based on state
  if (health > 70 && happiness > 70) {
    petImg.src = "tabiHappy.png";
    petImg.classList.add("happy");
  } else if (health < 30 || happiness < 30) {
    petImg.src = "tabiSad.png";
    petImg.classList.add("sad");
  } else {
    petImg.src = "tabiNeutral.png";
    petImg.classList.add("neutral");
  }
}

// Action buttons
document.getElementById("feed").addEventListener("click", () => {
  chrome.storage.sync.get(["health"], (data) => {
    let newHealth = Math.min((data.health || 50) + 10, 100);
    chrome.storage.sync.set({ health: newHealth }, loadStats);
  });
});

document.getElementById("play").addEventListener("click", () => {
  chrome.storage.sync.get(["happiness"], (data) => {
    let newHappiness = Math.min((data.happiness || 50) + 10, 100);
    chrome.storage.sync.set({ happiness: newHappiness }, loadStats);
  });
});

document.getElementById("clean").addEventListener("click", () => {
  chrome.storage.sync.set({ health: 50, happiness: 50 }, loadStats);
});

// Decrease stats over time
function decayStats() {
  chrome.storage.sync.get(["health", "happiness"], (data) => {
    let health = data.health || 50;
    let happiness = data.happiness || 50;

    // Reduce stats gradually
    health = Math.max(health - 5, 0);
    happiness = Math.max(happiness - 5, 0);

    chrome.storage.sync.set({ health, happiness }, () => {
      updatePetFace(health, happiness);
      // Update displayed numbers
      document.getElementById("health").textContent = health;
      document.getElementById("happiness").textContent = happiness;
    });
  });
}

// Call decayStats every 30 seconds (30000 ms)
setInterval(decayStats, 20000);

// Initial load
loadStats();