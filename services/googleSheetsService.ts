
import { UserData } from '../types';
import { APPS_SCRIPT_URL } from '../constants';

export const saveToGoogleSheet = async (user: UserData): Promise<boolean> => {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR-ID-HERE')) {
    console.warn("Google Sheets APPS_SCRIPT_URL is not configured.");
    return false;
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors for simple redirects
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    
    // Note: with no-cors, we can't read the response, but the data usually arrives
    return true;
  } catch (error) {
    console.error("Failed to save to Google Sheets:", error);
    return false;
  }
};
