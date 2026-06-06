function loadComponent(elementId, filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch component: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const container = document.getElementById(elementId);
            if (container) {
                container.innerHTML = data;
            }
            return data;
        })
        .catch(error => console.error(`Error loading component [${elementId}] from ${filePath}:`,
            error));
}