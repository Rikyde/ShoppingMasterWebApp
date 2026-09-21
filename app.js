let supermarketMode = false;
let lists = JSON.parse(localStorage.getItem("shoppingLists")) || [];
let currentList = null;

function saveData() {
    localStorage.setItem("shoppingLists", JSON.stringify(lists));
}

function renderLists() {
    const container = document.getElementById("listsContainer");
    container.innerHTML = "";

    lists.forEach((list, index) => {

        const total = list.items.length;
        const completed = list.items.filter(i => i.done).length;

        const card = document.createElement("div");
        card.className = "list-card";

        card.innerHTML = `
            <h2>${list.name}</h2>
            <p>${completed}/${total} acquistati</p>

            <button onclick="openList(${index})">
                Apri Lista
            </button>

            <button onclick="deleteList(${index})">
                Elimina
            </button>
        `;

        container.appendChild(card);
    });
}

document.getElementById("addListBtn").onclick = () => {

    const name = prompt("Nome lista");

    if (!name) return;

    lists.push({
        name: name,
        items: []
    });

    saveData();
    renderLists();
};

function deleteList(index) {

    if (!confirm("Eliminare la lista?")) return;

    lists.splice(index, 1);

    saveData();
    renderLists();
}

function openList(index) {

    currentList = index;

    let html = "";

    html += `
        <h2>${lists[index].name}</h2>

        <button onclick="addItem()">
            ➕ Aggiungi prodotto
        </button>

        <button onclick="renderLists()">
            ← Torna alle liste
        </button>

        <hr>
    `;

    const grouped = {};

    lists[index].items.forEach(item => {

        if (!grouped[item.category]) {
            grouped[item.category] = [];
        }

        grouped[item.category].push(item);
    });

    Object.keys(grouped).forEach(category => {

        html += `<h3>${category}</h3>`;

        grouped[category].forEach((item,itemIndex) => {

            html += `
                <div class="list-card">

                    <input
                        type="checkbox"
                        ${item.done ? "checked" : ""}
                        onchange="toggleItem(${itemIndex})"
                    >

                    <strong>${item.name}</strong>

                    <div>
                        Quantità: ${item.quantity}
                    </div>

                </div>
            `;
        });
    });

    document.getElementById("listsContainer").innerHTML = html;
}

function addItem() {

    const name = prompt("Prodotto");

    if (!name) return;

    const quantity = prompt("Quantità", "1");

    const category = prompt(
        "Categoria:\nFrutta\nCarne\nBevande\nPane\nCasa",
        "Frutta"
    );

    lists[currentList].items.push({
        name,
        quantity,
        category,
        done:false
    });

    saveData();
    openList(currentList);
}

function toggleItem(index) {

    const item = lists[currentList].items[index];

    item.done = !item.done;

    saveData();
    openList(currentList);
}

renderLists();
