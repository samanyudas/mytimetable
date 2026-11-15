import { beforeEach, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

import { addAlgorithmsCourse, skipWelcome } from './timetable.ts';

describe('timetable', () => {
	beforeEach(async ({ app, browser }) => {
		// A returning visitor: skip the welcome screen and the help tour.
		await browser.addInitScript(skipWelcome);
		await app.open('/');
	});

	test('adds a course to the timetable', async ({ screen }) => {
		await addAlgorithmsCourse(screen);

		await expect(
			screen.getByText('2103 - Lecture', { visible: true }),
		).toHaveCount(3);
		await expect(
			screen.getByRole('button', 'Ready for Enrolment'),
		).toBeVisible();
	});

	test('removes an enrolled course', async ({ screen }) => {
		await addAlgorithmsCourse(screen);

		await screen.getByRole('button', 'Remove course').tap();

		await expect(screen.getByRole('button', '2103 Remove course')).toBeHidden();
		await expect(
			screen.getByText('2103 - Lecture', { visible: true }),
		).toHaveCount(0);
	});

	test('lists the class numbers to enrol in', async ({ screen }) => {
		await addAlgorithmsCourse(screen);

		await screen.getByRole('button', 'Ready for Enrolment').tap();

		const enrolment = screen.getByRole('dialog', 'Ready for Enrolment');
		await expect(enrolment.getByRole('heading', '2103')).toBeVisible();
		await expect(enrolment.getByText('21109')).toBeVisible(); // Lecture
		await expect(enrolment.getByText('25024')).toBeVisible(); // Practical
		await expect(enrolment.getByText('25030')).toBeVisible(); // Workshop
	});

	test('moves a workshop to another time by drag and drop', async ({
		screen,
		browser,
	}) => {
		await addAlgorithmsCourse(screen);
		// Workshops start in the second teaching week.
		// The tooltip trigger wraps the button and takes its name: tap the inner one.
		await screen.getByRole('button', 'Next week').last().tap();
		const workshop = screen.getByText('2103 - Workshop', { visible: true });
		await workshop.scrollIntoView();

		// The other workshop times appear as drop zones only while a drag is held,
		// so the test holds the pointer down itself instead of using dragTo.
		const from = await workshop.boundingBox();
		if (!from) throw new Error('the workshop card has no box');
		await browser.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
		await browser.mouse.down();
		await browser.mouse.move(
			from.x + from.width / 2,
			from.y + from.height / 2 - 10,
		);
		const slot = screen.getByText('Hughes, 323, Teaching Room', {
			visible: true,
		});
		await slot.waitFor();
		const to = await slot.boundingBox();
		if (!to) throw new Error('the drop zone has no box');
		await browser.mouse.move(to.x + to.width / 2, to.y + to.height / 2);
		await browser.mouse.up();
		await slot.waitFor({ state: 'hidden' });

		await screen.getByRole('button', 'Ready for Enrolment').tap();
		const enrolment = screen.getByRole('dialog', 'Ready for Enrolment');
		await expect(enrolment.getByText('25035')).toBeVisible();
		await expect(enrolment.getByText('25030')).toBeHidden();
	});
});
