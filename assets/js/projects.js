const DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

const MOCK_REPOS = [
	{
		name: 'clara',
		description: 'Clara is a personal finance platform designed to help individuals understand their spending, visualize financial patterns, and make better decisions about their money.',
		html_url: 'https://github.com/oaugusto256/clara',
		homepage: 'https://clara-stg.duckdns.org/',
		stargazers_count: 2,
		open_issues_count: 5,
		pushed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
		language: 'TypeScript',
		fork: false,
	},
	{
		name: 'brev.ly',
		description: 'Fullstack app to shortcut URLs.',
		html_url: 'https://github.com/oaugusto256/brev.ly',
		homepage: null,
		stargazers_count: 1,
		open_issues_count: 2,
		pushed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
		language: 'TypeScript',
		fork: false,
	},
];

const MOCK_TAGS = {
	'clara':   ['React', 'TypeScript', 'Vite', 'React Query', 'Tailwind', 'Fastify', 'Drizzle', 'Zod'],
	'brev.ly': ['React', 'TypeScript', 'Vite', 'React Query', 'Tailwind', 'Fastify', 'Drizzle', 'Zod'],
};

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

// Per-repo description overrides for when the GitHub description is too brief.
const DESCRIPTION_OVERRIDES = {
	'brev.ly': 'Full-stack URL shortener built as a monorepo. React + Vite frontend with React Query and Tailwind; Fastify REST API with Drizzle ORM, PostgreSQL, and AWS S3. Typed end-to-end with TypeScript and Zod.',
	'clara': 'Full-stack personal finance platform built as a monorepo. React 19 + Vite frontend with TanStack Query, Recharts, and DaisyUI; Fastify API with Drizzle ORM and PostgreSQL. Features a custom rules engine for transaction categorization.',
};

// Subdirectory names that typically hold workspace packages in a monorepo.
const WORKSPACE_DIRS = ['web', 'server', 'api', 'client', 'frontend', 'backend', 'app', 'packages', 'apps'];

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

// Activity (issues/PRs) is the primary signal; recency (1-year window) rewards
// maintained work; stars are a weak tiebreaker.
function scoreRepo(repo) {
	const daysSincePush = (Date.now() - new Date(repo.pushed_at)) / (1000 * 60 * 60 * 24);
	const recency = Math.max(0, 1 - daysSincePush / 365);
	const activity = repo.open_issues_count || 0;
	return activity * 4 + recency * 6 + repo.stargazers_count * 2;
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

async function fetchPackageJson(repoName, path) {
	try {
		const res = await fetch(`https://api.github.com/repos/oaugusto256/${repoName}/contents/${path}`);
		if (!res.ok) return null;
		const data = await res.json();
		if (!data.content) return null;
		return JSON.parse(atob(data.content.replace(/\s/g, '')));
	} catch (e) {
		return null;
	}
}

async function fetchTechTags(repoName) {
	if (DEV) return MOCK_TAGS[repoName] || [];
	try {
		const [dirRes, rootPkg] = await Promise.all([
			fetch(`https://api.github.com/repos/oaugusto256/${repoName}/contents/`),
			fetchPackageJson(repoName, 'package.json'),
		]);

		const pkgs = rootPkg ? [rootPkg] : [];

		if (dirRes.ok) {
			const entries = await dirRes.json();
			if (!Array.isArray(entries)) return extractTags(pkgs);

			const workspaceDirs = entries
				.filter(e => e.type === 'dir' && WORKSPACE_DIRS.includes(e.name))
				.map(e => e.name);

			// Fetch package.json at each workspace dir (level 1) and their subdirs (level 2) in parallel.
			const level1Pkgs = workspaceDirs.map(dir => fetchPackageJson(repoName, `${dir}/package.json`));
			const level2Listings = workspaceDirs.map(dir =>
				fetch(`https://api.github.com/repos/oaugusto256/${repoName}/contents/${dir}`)
					.then(r => r.ok ? r.json() : [])
					.catch(() => [])
			);

			const [l1Results, l2Results] = await Promise.all([
				Promise.all(level1Pkgs),
				Promise.all(level2Listings),
			]);

			pkgs.push(...l1Results.filter(Boolean));

			// Collect package.json paths for all subdirs found at level 2.
			const level2PkgPaths = l2Results.flatMap((listing, i) =>
				Array.isArray(listing)
					? listing
						.filter(e => e.type === 'dir')
						.map(e => `${workspaceDirs[i]}/${e.name}/package.json`)
					: []
			);

			const l2Pkgs = await Promise.all(level2PkgPaths.map(p => fetchPackageJson(repoName, p)));
			pkgs.push(...l2Pkgs.filter(Boolean));
		}

		return extractTags(pkgs);
	} catch (e) {
		return [];
	}
}

function extractTags(pkgs) {
	const seen = new Set();
	const tags = [];
	for (const pkg of pkgs) {
		const allDeps = Object.keys({
			...(pkg.dependencies || {}),
			...(pkg.devDependencies || {}),
			...(pkg.peerDependencies || {}),
		});
		for (const dep of allDeps) {
			const label = TECH_MAP[dep];
			if (label && !seen.has(label)) {
				seen.add(label);
				tags.push(label);
			}
		}
	}
	return tags;
}

async function loadRepos() {
	const grid = document.getElementById('repo-grid');
	grid.innerHTML = renderSkeletons(6);

	try {
		const repos = DEV
			? MOCK_REPOS
			: await fetch('https://api.github.com/users/oaugusto256/repos?sort=pushed&per_page=100')
				.then(r => { if (!r.ok) throw new Error('GitHub API error'); return r.json(); });
		const now = Date.now();
		const filtered = repos
			.filter(r => {
				if (r.fork || !r.description || EXCLUDED.includes(r.name)) return false;
				const daysSincePush = (now - new Date(r.pushed_at)) / (1000 * 60 * 60 * 24);
				if (daysSincePush > 1095) return false; // drop repos older than 3 years
				const recentEnough = daysSincePush <= 365;
				const hasSignal = r.stargazers_count >= 1 || r.open_issues_count >= 1;
				return recentEnough || hasSignal;
			})
			.sort((a, b) => scoreRepo(b) - scoreRepo(a))
			.slice(0, 6);

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
					<p>${escapeHtml(DESCRIPTION_OVERRIDES[repo.name] || repo.description)}</p>
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
