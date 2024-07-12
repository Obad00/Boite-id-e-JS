document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ideaForm");
    const message = document.getElementById("message");
    const prenom = document.getElementById("prenom");
    const nom = document.getElementById("nom");
    const title = document.getElementById("title");
    const category = document.getElementById("category");
    const description = document.getElementById("description");
    const ideasContainer = document.getElementById("ideasContainer");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        clearErrors();
        
        const prenomValue = sanitizeInput(prenom.value.trim());
        const nomValue = sanitizeInput(nom.value.trim());
        const titleValue = sanitizeInput(title.value.trim());
        const categoryValue = sanitizeInput(category.value.trim());
        const descriptionValue = sanitizeInput(description.value.trim());

        if (validateForm(prenomValue, nomValue, titleValue, categoryValue, descriptionValue)) {
            addIdea(prenomValue, nomValue, titleValue, categoryValue, descriptionValue, "En attente"); // Ajout avec statut initial "En attente"
            form.reset();

            // Cacher le formulaire et le tableau et afficher le message de succès temporairement
            form.style.display = "none";
            ideasContainer.style.display = "none";
            message.textContent = "Idée ajoutée avec succès!";
            setTimeout(() => {
                form.style.display = "block";
                ideasContainer.style.display = "block";
                message.textContent = "";
            }, 2000);

            // Stocker les données dans les cookies
            storeIdeasInCookies();
        }
    });

    function validateForm(prenom, nom, title, category, description) {
        let isValid = true;

        if (prenom === "") {
            showError("prenomError", "Le prénom est requis.");
            isValid = false;
        }

        if (nom === "") {
            showError("nomError", "Le nom est requis.");
            isValid = false;
        }

        if (title === "") {
            showError("titleError", "Le libellé est requis.");
            isValid = false;
        }

        if (category === "") {
            showError("categoryError", "La catégorie est requise.");
            isValid = false;
        }

        if (description === "") {
            showError("descriptionError", "Le message descriptif est requis.");
            isValid = false;
        }

        return isValid;
    }

    function sanitizeInput(input) {
        const tempDiv = document.createElement("div");
        tempDiv.textContent = input;
        return tempDiv.innerHTML;
    }

    function clearErrors() {
        document.querySelectorAll(".error").forEach(error => error.textContent = "");
    }

    function showError(id, message) {
        document.getElementById(id).textContent = message;
    }

    function addIdea(prenom, nom, title, category, description, status = "En attente") {
        const tableBody = document.querySelector("#ideasContainer tbody");
        const row = document.createElement("tr");
    
        row.innerHTML = `
            <td>${prenom}</td>
            <td>${nom}</td>
            <td>${title}</td>
            <td>${category}</td>
            <td>${description}</td>
            <td>${status}</td> 
            <td>
                <button class="approve-btn">Approuver</button>
                <button class="disapprove-btn">Désapprouver</button>
                <button class="delete-btn">Supprimer</button>
            </td>
        `;
    
        row.querySelector(".approve-btn").addEventListener("click", () => {
            updateStatus(row, "Approuvée");
            storeIdeasInCookies(); // Mettre à jour les cookies après approbation
        });
        row.querySelector(".disapprove-btn").addEventListener("click", () => {
            updateStatus(row, "Désapprouvée");
            storeIdeasInCookies(); // Mettre à jour les cookies après désapprobation
        });
        row.querySelector(".delete-btn").addEventListener("click", () => {
            row.remove();
            storeIdeasInCookies(); // Mettre à jour les cookies après suppression
        });
    
        tableBody.appendChild(row);
    }
    

    function updateStatus(row, status) {
        row.cells[5].textContent = status;
    }

    function storeIdeasInCookies() {
        const ideas = [];
        document.querySelectorAll("#ideasContainer tbody tr").forEach(row => {
            const prenom = row.cells[0].textContent;
            const nom = row.cells[1].textContent;
            const title = row.cells[2].textContent;
            const category = row.cells[3].textContent;
            const description = row.cells[4].textContent;
            const status = row.cells[5].textContent;
            ideas.push({ prenom, nom, title, category, description, status });
        });
        setCookie("ideas", JSON.stringify(ideas), 30); // Exemple: 30 jours d'expiration
    }

    // Charger les idées depuis les cookies au chargement de la page
    function loadIdeasFromCookies() {
        const ideas = JSON.parse(getCookie("ideas")) || [];
        ideas.forEach(idea => addIdea(idea.prenom, idea.nom, idea.title, idea.category, idea.description, idea.status));
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value}${expires}; path=/`;
    }

    loadIdeasFromCookies();
});
