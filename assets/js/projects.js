const EXCLUDED = [
	'oaugusto256.github.io',
	'oaugusto256',
	// Course / bootcamp exercises
	'freecodecamp-projects',
	'js30-projects',
	'css30-projects',
	'fullstack-open',
	'nextlevelweek2.0',
	'omnistack7.0',
	// University coursework
	'engcomp-ufpa',
	'computerscience-psu',
	// Misc low-signal repos
	'foo.bar',
	'happiness',
	'gatsby-portfolio',
	'alpha-blog',
	'photo-app',
	'lighting-talks',
	'hephaestus',
];

const TECH_MAP = {
	'react': 'React',
	'react-dom': 'React',
	'next': 'Next.js',
	'vue': 'Vue',
	'nuxt': 'Nuxt',
	'@angular/core': 'Angular',
	'svelte': 'Svelte',
	'typescript': 'TypeScript',
	'vite': 'Vite',
	'react-query': 'React Query',
	'@tanstack/react-query': 'React Query',
	'zustand': 'Zustand',
	'redux': 'Redux',
	'@reduxjs/toolkit': 'Redux',
	'tailwindcss': 'Tailwind',
	'styled-components': 'Styled Components',
	'@emotion/react': 'Emotion',
	'fastify': 'Fastify',
	'express': 'Express',
	'hono': 'Hono',
	'prisma': 'Prisma',
	'@prisma/client': 'Prisma',
	'drizzle-orm': 'Drizzle',
	'graphql': 'GraphQL',
	'@apollo/client': 'Apollo',
	'zod': 'Zod',
	'jest': 'Jest',
	'vitest': 'Vitest',
	'playwright': 'Playwright',
	'cypress': 'Cypress',
	'gatsby': 'Gatsby',
	'remix': 'Remix',
	'@remix-run/react': 'Remix',
};

// Stars are the primary quality signal; recency (6-month window) and
// open issues (proxy for PRs/comments/activity) break ties.
function scoreRepo(repo) {
	const daysSincePush = (Date.now() - new Date(repo.pushed_at)) / (1000 * 60 * 60 * 24);
	const recency = Math.max(0, 1 - daysSincePush / 180);
	const activity = repo.open_issues_count || 0;
	return repo.stargazers_count * 5 + recency * 4 + activity * 0.5;
}

function renderSkeletons(count) {
	return Array.from({ length: count }, () => `
		<div class="skeleton-card">
			<div class="skeleton-line" style="width:55%;height:0.85em;"></div>
			<div class="skeleton-line" style="width:100%;height:0.7em;margin-top:0.25em;"></div>
			<div class="skeleton-line" style="width:80%;height:0.7em;"></div>
			<div class="skeleton-tags">
				<div class="skeleton-tag"></div>
				<div class="skeleton-tag"></div>
				<div class="skeleton-tag"></div>
			</div>
			<div class="skeleton-line" style="width:28%;height:0.7em;margin-top:0.1em;"></div>
		</div>
	`).join('');
}

function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

async function fetchTechTags(repoName) {
	try {
		const res = await fetch(`https://api.github.com/repos/oaugusto256/${repoName}/contents/package.json`);
		if (!res.ok) return [];

		const data = await res.json();
		if (!data.content) return [];

		const pkg = JSON.parse(atob(data.content.replace(/\s/g, '')));
		if (!pkg || typeof pkg !== 'object') return [];

		const allDeps = Object.keys({
			...(pkg.dependencies || {}),
			...(pkg.devDependencies || {}),
			...(pkg.peerDependencies || {}),
		});

		const seen = new Set();
		const tags = [];
		for (const dep of allDeps) {
			const label = TECH_MAP[dep];
			if (label && !seen.has(label)) {
				seen.add(label);
				tags.push(label);
			}
		}
		return tags;
	} catch (e) {
		return [];
	}
}

async function loadRepos() {
	const grid = document.getElementById('repo-grid');
	grid.innerHTML = renderSkeletons(4);

	try {
		const res = await fetch('https://api.github.com/users/oaugusto256/repos?sort=pushed&per_page=100');
		if (!res.ok) throw new Error('GitHub API error');

		const repos = await res.json();
		const filtered = repos
			.filter(r => !r.fork && !EXCLUDED.includes(r.name) && r.description)
			.sort((a, b) => scoreRepo(b) - scoreRepo(a))
			.slice(0, 10);

		if (filtered.length === 0) {
			grid.innerHTML = '<p class="repo-error">No repositories found.</p>';
			return;
		}

		const techResults = await Promise.allSettled(
			filtered.map(r => fetchTechTags(r.name))
		);

		grid.innerHTML = filtered.map((repo, i) => {
			const tags = techResults[i].status === 'fulfilled' ? techResults[i].value : [];
			const tagsHtml = tags.length > 0
				? `<div class="project-tags">${tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>`
				: (repo.language ? `<div class="project-tags"><span>${escapeHtml(repo.language)}</span></div>` : '');

			return `
				<div class="repo-card" style="animation-delay:${i * 0.06}s">
					<div class="repo-card-header">
						<h3>${escapeHtml(repo.name)}</h3>
						${repo.stargazers_count > 0
							? `<span class="star-count"><span class="icon solid fa-star"></span> ${repo.stargazers_count}</span>`
							: ''}
					</div>
					<p>${escapeHtml(repo.description)}</p>
					${tagsHtml}
					<div class="repo-card-footer">
						<div class="repo-links">
							<a class="project-link" href="${repo.html_url}" target="_blank" rel="noreferrer">Github &rarr;</a>
							${repo.homepage ? `<a class="project-link" href="${repo.homepage}" target="_blank" rel="noreferrer">Live &rarr;</a>` : ''}
						</div>
					</div>
				</div>
			`;
		}).join('');

	} catch (e) {
		grid.innerHTML = `
			<p class="repo-error">
				Could not load repositories.
				<a href="https://github.com/oaugusto256" target="_blank" rel="noreferrer">View on Github &rarr;</a>
			</p>`;
	}
}

async function loadProfessional() {
	const grid = document.getElementById('professional-grid');

	try {
		const res = await fetch('assets/data/professional-projects.json');
		if (!res.ok) throw new Error('Failed to load projects');

		const projects = await res.json();

		grid.innerHTML = projects.map(project => `
			<div class="featured-card">
				<h3>${escapeHtml(project.title)}</h3>
				<p>${escapeHtml(project.description)}</p>
				<div class="project-tags">
					${project.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}
				</div>
				${project.url
					? `<a class="project-link" href="${project.url}" target="_blank" rel="noreferrer">Live &rarr;</a>`
					: project.note
						? `<span class="project-note">${escapeHtml(project.note)}</span>`
						: ''}
			</div>
		`).join('');

	} catch (e) {
		grid.innerHTML = '<p class="repo-error">Could not load projects.</p>';
	}
}

loadProfessional();
loadRepos();
