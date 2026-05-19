const USERNAME  = 'dutra-felipe';
const PER_PAGE  = 6;
let currentPage = 1;
let allRepos    = [];

const repoList   = document.getElementById('repo-list');
const pagination = document.getElementById('pagination');
const loading    = document.getElementById('repo-loading');

// ── GraphQL: pinned repos ─────────────────────────────────
async function fetchPinnedRepos() {
    const query = `{
      user(login: "${USERNAME}") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              stargazerCount
              forkCount
              url
            }
          }
        }
      }
    }`;

    try {
        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        const data = await res.json();
        return (data?.data?.user?.pinnedItems?.nodes) || [];
    } catch (error) {
        console.warn("GraphQL error (Pinned repos):", error);
        return [];
    }
}

// ── REST: all public repos ────────────────────────────────
async function fetchAllRepos() {
    const res = await fetch(
        `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
    );
    if (!res.ok) throw new Error("Erro ao buscar repositórios na API REST.");
    return await res.json();
}

// ── Bootstrap ─────────────────────────────────────────────
async function loadRepositories() {
    try {
        const [pinned, all] = await Promise.all([
            fetchPinnedRepos(),
            fetchAllRepos()
        ]);

        const pinnedNames = new Set(pinned.map(r => r.name));
        const rest = all.filter(r => !pinnedNames.has(r.name));

        allRepos = [
            ...pinned.map(r => ({ ...r, pinned: true  })),
            ...rest.map(r =>   ({ ...r, pinned: false }))
        ];

        if (loading) loading.style.display = 'none';
        renderPage();
        renderPagination();
    } catch (err) {
        if (loading) {
            loading.classList.remove('dots-anim');
            loading.innerHTML = '<span class="t-red">// erro ao carregar repositórios :(</span>';
        }
        console.error('GitHub fetch error:', err);
    }
}

// ── Render current page ───────────────────────────────────
function renderPage() {
    if (!repoList) return;
    repoList.innerHTML = '';
    
    const start = (currentPage - 1) * PER_PAGE;
    const slice = allRepos.slice(start, start + PER_PAGE);

    slice.forEach(repo => {
        const url  = repo.html_url || repo.url || `https://github.com/${USERNAME}/${repo.name}`;
        const desc = repo.description || '<span style="opacity:.5">// sem descrição</span>';
        const stars = (repo.stargazerCount ?? repo.stargazers_count) || 0;
        const forks = (repo.forkCount      ?? repo.forks_count)      || 0;

        const card = document.createElement('div');
        card.className = 'repo-card';
        card.innerHTML = `
            <div class="repo-card-header">
                <span class="repo-icon">⬡</span>
                <h5 title="${repo.name}">${repo.name}</h5>
                ${repo.pinned ? '<span class="pinned-badge">pinned</span>' : ''}
            </div>
            <p class="repo-desc">${desc}</p>
            <div class="repo-meta">
                ${stars > 0 ? `<span class="stars">${stars}</span>` : ''}
                ${forks > 0 ? `<span class="forks">${forks}</span>` : ''}
            </div>
            <a href="${url}" target="_blank" rel="noreferrer noopener" class="btn-terminal">
                ./view_repo
            </a>`;
        repoList.appendChild(card);
    });
}

// ── Pagination buttons ────────────────────────────────────
function renderPagination() {
    if (!pagination) return;
    pagination.innerHTML = '';
    
    const total = Math.ceil(allRepos.length / PER_PAGE);
    if (total <= 1) return;

    for (let i = 1; i <= total; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn${i === currentPage ? ' active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderPage();
            renderPagination();
            document.getElementById('repos').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        pagination.appendChild(btn);
    }
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadRepositories);