import { web } from '@e2e-dev/web';
import { gateway } from 'ai';
import type { E2EConfig } from 'e2e';

export default {
	// The Vercel AI Gateway serves the model and reads AI_GATEWAY_API_KEY.
	// Only tests/agentic.e2e.ts needs it; the other tests run without one.
	agents: {
		default: {
			model: gateway('openai/gpt-6-luna-fast'),
			system:
				'You are a thorough QA agent testing a university timetable planner. Verify every outcome.',
		},
	},
	targets: [
		{
			engine: web({ viewport: { width: 1440, height: 900 } }),
			app: {
				url: 'http://localhost:5173',
				// The runner starts the app's Vite dev server from the repository root
				// with the mock course API, and waits for the URL to answer.
				// Outside CI, a server you already started on that port is reused.
				command: {
					executable: 'pnpm',
					args: ['run', 'dev'],
					cwd: '..',
					env: { VITE_API_BASE_URL: '/mock' },
					reuseExisting: true,
				},
			},
		},
	],
} satisfies E2EConfig;
