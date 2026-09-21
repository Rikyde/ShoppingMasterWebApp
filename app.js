let lists = JSON.parse(localStorage.getItem("lists") || "[]");

function save() {
    localStorage.setItem("lists", JSON.stringify(lists));
}

function renderLists() {
    const container = document.getElementById("listsContainer");
    container.innerHTML = "";

    lists.forEach((list, index) => {
        const card = document.createElement("div");
        card.className = "list-card";
        card.innerHTML = `
            <h2>${list.name}</h2>
            <button onclick="openList(${index})">Apri</button>
        `;
        container.appendChild(card);
    });
}

document.getElementById("addListBtn").onclick = () => {
    const name = prompt("Nome della lista:");
    if (!name) return;

    lists.push({ name, items: [] });
    save();
    renderLists();
};

function openList(i) {
    const list = lists[i];
    const itemsText = list.items.map(it => `${it.quantity}x ${it.name}`).join("\n");

    alert(`Lista: ${list.name}\n\n${itemsText || "Vuota"}`);
}

renderLists();
