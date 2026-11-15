import { beforeEach, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

import { skipWelcome } from './timetable.ts';

// Agent steps call the model in e2e.config.ts. Without a key these tests are skipped.
const skip = process.env.AI_GATEWAY_API_KEY
	? false
	: 'set AI_GATEWAY_API_KEY to run agent tests';

describe('timetable with the agent', { skip }, () => {
	beforeEach(async ({ app, browser }) => {
		await browser.addInitScript(skipWelcome);
		await app.open('/');
	});

	test('the agent enrols in a course by name', async ({ agent, screen }) => {
		await agent.act('add the course {title} to the timetable', {
			params: { title: 'Algorithm Design & Data Structures' },
		});

		// Pair each agent step with a check that does not depend on the model.
		await expect(
			screen.getByRole('button', '2103 Remove course'),
		).toBeVisible();
		await agent.assert(
			'the timetable shows lectures for Algorithm Design & Data Structures',
		);
	});

	test('the agent drags a workshop to an earlier time', async ({
		agent,
		screen,
	}) => {
		await agent.act('add the course {title} to the timetable', {
			params: { title: 'Algorithm Design & Data Structures' },
		});
		await screen.getByRole('button', '2103 Remove course').waitFor();

		await agent.act(
			'find the week with the first workshop, then drag that workshop to the 16:00 class in Hughes 323',
		);

		await screen.getByRole('button', 'Ready for Enrolment').tap();
		await expect(
			screen.getByRole('dialog', 'Ready for Enrolment').getByText('25035'),
		).toBeVisible();
	});
});
