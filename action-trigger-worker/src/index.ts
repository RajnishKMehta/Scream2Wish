export interface Env {
	GITHUB_TOKEN: string;
	API_KEY: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response(null, {
				status: 405,
				headers: { Allow: 'POST' }
			});
		}

		const apiKey = request.headers.get('x-api-key');
		if (!apiKey || apiKey !== env.API_KEY) {
			return new Response(
				JSON.stringify({ error: 'Unauthorized' }),
				{ status: 401, headers: { 'Content-Type': 'application/json' } }
			);
		}

		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return new Response(null, { status: 400 });
		}

		const githubResponse = await fetch('https://api.github.com/repos/RajnishKMehta/Scream2Wish-wishes/dispatches', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
				'Accept': 'application/vnd.github.v3+json',
				'Content-Type': 'application/json',
				'User-Agent': 'action-trigger-worker',
			},
			body: JSON.stringify(body),
		});

		if (!githubResponse.ok) {
			const errorText = await githubResponse.text();
			return new Response(
				JSON.stringify({
					error: 'GitHub Action failed',
					github_status: githubResponse.status,
					github_response: errorText,
				}),
				{ status: 502, headers: { 'Content-Type': 'application/json' } }
			);
		}

		return new Response(
			JSON.stringify({ success: true, message: 'Triggered successfully' }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	},
} satisfies ExportedHandler<Env>;
