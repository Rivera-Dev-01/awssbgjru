// Future cards from the About Us

(function () {

  function createCard({ title, description }) {
    let extraClass = "";
    if (title.includes("Membership")) {
      extraClass = "card-membership";
    } else if (title.includes("Training and Skill")) {
      extraClass = "card-training";
    } else if (title.includes("Incentives")) {
      extraClass = "card-incentives";
    } else if (title.includes("Professional")) {
      extraClass = "card-professional";
    } else if (title.includes("Representation")) {
      extraClass = "card-representation";
    }

    return `
      <div class="future-card ${extraClass}">
        <div class="future-card-header">
          <img
            src="../assets/clouds/aws-pixel-cloud.svg"
            alt="Cloud Icon"
            class="future-card-cloud-icon"
          />
          <h2 class="future-card-title">${title}</h2>
        </div>
        <div class="future-card-body">
          <p class="future-card-desc">${description}</p>
        </div>
        <div class="future-card-accent-bar"></div>
      </div>
    `;
  }


  function getCardsData() {
    return new Promise((resolve, reject) => {
      const el = document.getElementById("future-cards-data");
      if (!el) return reject(new Error("future-cards-data element not found"));
      try {
        resolve(JSON.parse(el.textContent));
      } catch (e) {
        reject(e);
      }
    });
  }

  const stack = document.getElementById("future-cards-stack");
  if (!stack) return;

  getCardsData()
    .then((cards) => {
      stack.innerHTML = cards.map(createCard).join("");
    })
    .catch((err) => {
      console.error("[future-cards]", err);
    });
})();
