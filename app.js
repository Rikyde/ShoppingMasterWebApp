let lists = JSON.parse(localStorage.getItem("shoppingLists")) || [];

let currentList = null;
let supermarketMode = false;

function saveData() {
    localStorage.setItem(
        "shoppingLists",
        JSON.stringify(lists)
    );
}

function renderLists() {

    const container =
        document.getElementById("listsContainer");

    container.innerHTML = "";

    lists.forEach((list, index) => {

        const total = list.items.length;

        const completed =
            list.items.filter(
                item => item.done
            ).length;

        const card =
            document.createElement("div");

        card.className = "list-card";

        card.innerHTML = `
            <h2>${list.name}</h2>

            <p>
                ${completed}/${total}
                acquistati
            </p>

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

    if (!confirm("Eliminare lista?"))
        return;

    lists.splice(index, 1);

    saveData();
    renderLists();
}

function openList(index) {

    currentList = index;

    const totalItems =
        lists[index].items.length;

    const completedItems =
        lists[index].items.filter(
            i => i.done
        ).length;

    const percentage =
        totalItems === 0
        ? 0
        : Math.round(
            completedItems /
            totalItems * 100
        );

    let html = `
        <h2>${lists[index].name}</h2>

        <p>
            ✅ ${completedItems}/${totalItems}
            (${percentage}%)
        </p>

        <button onclick="toggleSupermarketMode()">
            🏪 Modalità Supermercato
        </button>

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

        let visibleItems =
            grouped[category];

        if (supermarketMode) {
            visibleItems =
                visibleItems.filter(
                    item => !item.done
                );
        }

        if (visibleItems.length === 0)
            return;

        html += `<h3>${category}</h3>`;

        visibleItems.forEach(item => {

            const realIndex =
                lists[currentList]
                .items
                .findIndex(
                    i => i === item
                );

            html += `
                <div class="list-card">

                    <input
                        type="checkbox"
                        ${item.done ? "checked" : ""}
                        onchange="toggleItem(${realIndex})"
                    >

                    <strong>
                        ${item.name}
                    </strong>

                    <div>
                        Quantità:
                        ${item.quantity}
                    </div>

                </div>
            `;
        });
    });

    document.getElementById(
        "listsContainer"
    ).innerHTML = html;
}

function addItem() {

    const name =
        prompt("Prodotto");

    if (!name) return;

    const quantity =
        prompt(
            "Quantità",
            "1"
        );

    const category =
        prompt(
`Categoria:

Frutta
Carne
Bevande
Pane
Latticini
Casa`,
            "Frutta"
        );

    lists[currentList].items.push({
        name,
        quantity,
        category,
        done: false
    });

    saveData();
    openList(currentList);
}

function toggleItem(index) {

    lists[currentList]
        .items[index]
        .done =
    !lists[currentList]
        .items[index]
        .done;

    saveData();

    openList(currentList);
}

function toggleSupermarketMode() {

    supermarketMode =
        !supermarketMode;

    openList(currentList);
}

renderLists();
