import { describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

describe('welcome screen', () => {
	test('opens the planner from the welcome screen', async ({ app, screen }) => {
		await app.open('/');
		await expect(
			screen.getByRole('heading', 'Powerful Features'),
		).toBeVisible();

		// The button pulses forever, so it never holds still for a locator tap.
		// Tap the point at its center instead, as a person would.
		const start = await screen
			.getByRole('button', 'Start scheduling!')
			.boundingBox();
		if (!start) throw new Error('the start button has no box');
		await screen.tapAt({
			x: start.x + start.width / 2,
			y: start.y + start.height / 2,
		});

		await expect(
			screen.getByRole('combobox', 'Choose a subject area'),
		).toBeVisible();
		await expect(screen.getByRole('heading', 'Powerful Features')).toBeHidden();
	});
});
