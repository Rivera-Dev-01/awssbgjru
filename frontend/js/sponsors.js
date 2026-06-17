async function loadSponsorLinks() {
    try {
    const response = await fetch("http://localhost:8000/api/sponsors")
    const data = await response.json()

    const items = document.querySelectorAll(".partner-item")

    items.forEach(item => {
        const name = item.getAttribute("data-name")
        const match = data.find(s => s.name === name)

        if (match) {
            item.style.cursor = "pointer"
            item.addEventListener("click", () => {
                window.open(match.website, "_blank")
            })
        }
    })

    } catch (error) {
        console.error("Error:", error)
    }
}

loadSponsorLinks()