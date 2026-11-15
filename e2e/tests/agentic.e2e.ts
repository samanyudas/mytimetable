import { beforeEach, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

import { addAlgorithmsCourse, skipWelcome } from './timetable.ts';

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

	test('the agent finds the class numbers to enrol in', async ({
		agent,
		screen,
	}) => {
		await addAlgorithmsCourse(screen);

		await agent.act('show the class numbers I need to enrol in');

		const enrolment = screen.getByRole('dialog', 'Ready for Enrolment');
		await expect(enrolment.getByText('21109')).toBeVisible();
		await agent.assert(
			'the screen lists a class number for the lecture, the practical, and the workshop',
		);
	});
});
