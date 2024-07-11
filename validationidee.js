document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ideaForm');
    const messageDiv = document.getElementById('message');
    const ideasContainer = document.querySelector('#ideasContainer tbody');
    let ideas = getCookie('ideas') || [];

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Validation des champs prénom, nom, libellé, catégorie et message descriptif
        if (!validatePrenom() || !validateNom() || !validateRequired('title') || !validateRequired('category') || !validateRequired('description')) {
            showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        const prenom = document.getElementById('prenom').value.trim();
        const nom = document.getElementById('nom').value.trim();
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value.trim();

        const idea = { prenom, nom, title, category, description, approved: false };
        ideas.push(idea);
        setCookie('ideas', ideas, 30); // Stocker les idées dans un cookie pendant 30 jours
        form.reset();
        showMessage('Idée ajoutée avec succès!', 'success');
        displayIdeas();
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type;
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 2000);
    }

    function validatePrenom() {
        const prenom = document.getElementById('prenom').value.trim();
        const prenomError = document.getElementById('prenomError');
        const noDigitsPattern = /^[^\d]*$/;

        prenomError.textContent = '';
        if (prenom.length < 3 || prenom.length > 15) {
            prenomError.textContent = 'Le prénom doit contenir entre 3 et 15 caractères.';
            document.getElementById('prenom').classList.add('error');
            return false;
        } else if (!noDigitsPattern.test(prenom)) {
            prenomError.textContent = 'Le prénom ne doit pas contenir de chiffres.';
            document.getElementById('prenom').classList.add('error');
            return false;
        } else {
            document.getElementById('prenom').classList.remove('error');
        }
        return true;
    }

    function validateNom() {
        const nom = document.getElementById('nom').value.trim();
        const nomError = document.getElementById('nomError');
        const noDigitsPattern = /^[^\d]*$/;

        nomError.textContent = '';
        if (nom.length < 3 || nom.length > 15) {
            nomError.textContent = 'Le nom doit contenir entre 3 et 15 caractères.';
            document.getElementById('nom').classList.add('error');
            return false;
        } else if (!noDigitsPattern.test(nom)) {
            nomError.textContent = 'Le nom ne doit pas contenir de chiffres.';
            document.getElementById('nom').classList.add('error');
            return false;
        } else {
            document.getElementById('nom').classList.remove('error');
        }
        return true;
    }

    function validateRequired(fieldId) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldId}Error`);

        errorElement.textContent = '';
        if (value === '') {
            errorElement.textContent = `Le champ ${field.getAttribute('name')} est obligatoire.`;
            field.classList.add('error');
            return false;
        } else {
            field.classList.remove('error');
        }
        return true;
    }

    function displayIdeas() {
        ideasContainer.innerHTML = '';
        ideas.forEach((idea, index) => {
            const ideaRow = document.createElement('tr');
            ideaRow.innerHTML = `
                <td>${idea.prenom}</td>
                <td>${idea.nom}</td>
                <td>${idea.title}</td>
                <td>${idea.category}</td>
                <td>${idea.description}</td>
                <td>${idea.approved ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-clock"></i>'}</td>
                <td>
                    <button onclick="approveIdea(${index})"><i class="fas fa-thumbs-${idea.approved ? 'down' : 'up'}"></i></button>
                    <br>
                    <button onclick="deleteIdea(${index})"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            ideasContainer.appendChild(ideaRow);
        });
    }
    
    

    window.approveIdea = (index) => {
        ideas[index].approved = !ideas[index].approved;
        setCookie('ideas', ideas, 30);
        displayIdeas();
    };

    window.deleteIdea = (index) => {
        ideas.splice(index, 1);
        setCookie('ideas', ideas, 30);
        displayIdeas();
    };

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }
    
    function getCookie(name) {
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        const nameEQ = name + "=";
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(nameEQ) == 0) {
                return JSON.parse(c.substring(nameEQ.length, c.length));
            }
        }
        return [];
    }
    
    function deleteCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }
    

    displayIdeas();
});
