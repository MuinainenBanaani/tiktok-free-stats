let intervalId;
let countdownInterval;
let usernameToTrack;

const counters = {
  followers: new countUp.CountUp("followers", 0),
  likes: new countUp.CountUp("likes", 0),
  videos: new countUp.CountUp("videos", 0),
  views: new countUp.CountUp("views", 0),
  shares: new countUp.CountUp("shares", 0),
  saves: new countUp.CountUp("saves", 0),
};

function animateStat(id, value) {
  if (counters[id]) counters[id].update(value);
}

function updateCountdown(seconds) {
  let rem = seconds;
  document.getElementById("countdown").innerText = rem;
  countdownInterval = setInterval(() => {
    rem--;
    document.getElementById("countdown").innerText = rem;
    if (rem <= 0) {
      clearInterval(countdownInterval);
      updateCountdown(5);
    }
  }, 1000);
}

async function fetchStats() {
  clearInterval(intervalId);
  clearInterval(countdownInterval);
  const raw = document.getElementById("usernameInput").value.trim();
  if (!raw) return alert("Enter username or URL.");

  // Extract username
  const username = raw.includes("tiktok.com") 
    ? raw.split("/").filter(Boolean).pop().replace("@", "") 
    : raw.replace("@", "");

  usernameToTrack = username;

  try {
    const res = await fetch(`/api/stats?username=${usernameToTrack}`);
    if (!res.ok) throw new Error("User not found");

    const data = await res.json();

    document.getElementById("statsContainer").classList.remove("hidden");
    document.getElementById("refreshTime").classList.remove("hidden");

    animateStat("followers", data.followers);
    animateStat("likes", data.likes);
    animateStat("videos", data.videos);
    animateStat("views", data.views);
    animateStat("shares", data.shares);
    animateStat("saves", data.saves);

    updateCountdown(5);

    intervalId = setInterval(async () => {
      const res = await fetch(`/api/stats?username=${usernameToTrack}`);
      if (!res.ok) return;
      const d = await res.json();
      animateStat("followers", d.followers);
      animateStat("likes", d.likes);
      animateStat("videos", d.videos);
      animateStat("views", d.views);
      animateStat("shares", d.shares);
      animateStat("saves", d.saves);
      updateCountdown(5);
    }, 5000);
  } catch (e) {
    alert("User not found or error fetching stats.");
    console.error(e);
  }
}
