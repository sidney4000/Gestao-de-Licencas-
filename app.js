
// Função para carregar os dados do JSON
function loadLicenses() {
    fetch('licenses.json')
        .then(response => response.json())
        .then(licenses => {
            const table = document.getElementById('license-table');
            table.innerHTML = ''; // Limpa a tabela antes de carregar novos dados
            licenses.forEach(license => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${license.id}</td>
                    <td>${license.name}</td>
                    <td>${license.status}</td>
                    <td><button onclick="notifyOwner(${license.id})">Notificar</button></td>
                `;
                table.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao carregar licenças:', error));
}

// Função para notificar o proprietário (simulada)
function notifyOwner(id) {
    alert(`Notificação enviada para o ID: ${id}`);
    const button = document.querySelector(`button[onclick="notifyOwner(${id})"]`);
    button.innerText = 'Notificado';
    button.disabled = true;
}

// Carregar as licenças ao carregar a página
window.onload = () => loadLicenses();
