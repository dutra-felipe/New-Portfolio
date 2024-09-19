const username = 'dutra-felipe';
const repoList = document.getElementById('repo-list');

async function fetchRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar os repositórios');
        }
        const repositories = await response.json();
        displayRepositories(repositories);
    } catch (error) {
        console.error(error.message);
    }
}

function displayRepositories(repositories) {
    repoList.innerHTML = '';
    repositories.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');

        const repoName = document.createElement('h3');
        repoName.textContent = repo.name;

        const repoDescription = document.createElement('p');
        repoDescription.textContent = repo.description || 'Sem descrição';

        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.target = '_blank';
        repoLink.textContent = 'Ver no GitHub';

        repoCard.appendChild(repoName);
        repoCard.appendChild(repoDescription);
        repoCard.appendChild(repoLink);

        repoList.appendChild(repoCard);
    });
}

fetchRepositories();
