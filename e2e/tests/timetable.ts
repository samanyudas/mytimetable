import type { Screen } from 'e2e';

/**
 * Adds COMP SCI 2103 from the mock course API through the search form, and
 * waits until the course shows as enrolled.
 */
export async function addAlgorithmsCourse(screen: Screen): Promise<void> {
	await screen.getByRole('combobox', 'Choose a subject area').fill('COMP SCI');
	await screen.getByRole('option', 'COMP SCI - Computer Science').tap();
	await screen.getByRole('combobox', 'Search a course').fill('Algorithm');
	await screen
		.getByRole('option', '2103 - Algorithm Design & Data Structures')
		.tap();
	await screen.getByRole('button', 'Add').tap();
	await screen.getByRole('button', '2103 Remove course').waitFor();
}

/**
 * An init script for a returning visitor: the app skips the welcome screen
 * and the help tour. Frames without storage (about:blank) are left alone.
 */
export function skipWelcome(): void {
	try {
		window.localStorage.setItem('MTT.first-time', 'false');
	} catch {
		// This document has no localStorage.
	}
}
