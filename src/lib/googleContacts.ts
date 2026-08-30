// src/lib/googleContacts.ts
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';

export interface GoogleContact {
  id?: string;
  resourceName: string;
  etag?: string;
  name: string;
  givenName?: string;
  familyName?: string;
  displayName?: string;
  email?: string;
  emails?: string[];
  phoneNumber?: string;
  phoneNumbers?: string[];
  photoUrl?: string;
  organization?: string;
  jobTitle?: string;
  birthday?: string;
  addresses?: string[];
  notes?: string;
}

// Scopes configured for Google Contacts / People API
export const CONTACTS_SCOPES = [
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/contacts.other.readonly',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/directory.readonly',
  'https://www.googleapis.com/auth/user.addresses.read',
  'https://www.googleapis.com/auth/user.birthday.read',
  'https://www.googleapis.com/auth/user.emails.read',
  'https://www.googleapis.com/auth/user.gender.read',
  'https://www.googleapis.com/auth/user.organization.read',
  'https://www.googleapis.com/auth/user.phonenumbers.read',
];

const provider = new GoogleAuthProvider();
CONTACTS_SCOPES.forEach((scope) => {
  provider.addScope(scope);
});
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

// Flag to track sign-in state
let isSigningIn = false;
// Cached in-memory access token (NEVER stored in localStorage per security guidelines)
let cachedAccessToken: string | null = null;

// Initialize auth state listener to clear token on sign out
export const initGoogleContactsAuth = (
  onAuthSuccess?: (user: FirebaseUser, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

// Sign in with Google with Contacts scopes
export const signInWithGoogleForContacts = async (): Promise<{ user: FirebaseUser; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google OAuth access token');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Contacts sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setGoogleAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const signOutGoogleContacts = async () => {
  cachedAccessToken = null;
  await auth.signOut();
};

/**
 * Fetch contacts from Google People API
 */
export const fetchGoogleContacts = async (accessToken: string, pageSize = 100): Promise<GoogleContact[]> => {
  try {
    const personFields = 'names,emailAddresses,phoneNumbers,photos,organizations,birthdays,addresses,biographies,userDefined';
    const url = `https://people.googleapis.com/v1/people/me/connections?personFields=${personFields}&pageSize=${pageSize}&sortOrder=FIRST_NAME_ASCENDING`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Google People API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const connections = data.connections || [];

    return connections.map((person: any): GoogleContact => {
      const nameObj = person.names?.[0] || {};
      const name = nameObj.displayName || nameObj.givenName || 'Unnamed Contact';
      const emails = (person.emailAddresses || []).map((e: any) => e.value).filter(Boolean);
      const phoneNumbers = (person.phoneNumbers || []).map((p: any) => p.value).filter(Boolean);
      const photoUrl = person.photos?.[0]?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
      const orgObj = person.organizations?.[0] || {};
      const addresses = (person.addresses || []).map((a: any) => a.formattedValue || `${a.streetAddress || ''} ${a.city || ''}`).filter(Boolean);
      const notes = person.biographies?.[0]?.value || '';

      return {
        resourceName: person.resourceName || '',
        etag: person.etag,
        name,
        givenName: nameObj.givenName,
        familyName: nameObj.familyName,
        displayName: nameObj.displayName,
        email: emails[0] || '',
        emails,
        phoneNumber: phoneNumbers[0] || '',
        phoneNumbers,
        photoUrl,
        organization: orgObj.name || '',
        jobTitle: orgObj.title || '',
        addresses,
        notes,
      };
    });
  } catch (error) {
    console.error('Error fetching Google contacts:', error);
    throw error;
  }
};

/**
 * Search contacts from Google People API
 */
export const searchGoogleContacts = async (accessToken: string, query: string): Promise<GoogleContact[]> => {
  if (!query.trim()) {
    return fetchGoogleContacts(accessToken);
  }

  try {
    const readMask = 'names,emailAddresses,phoneNumbers,photos,organizations';
    const url = `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(query)}&readMask=${readMask}&pageSize=30`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      // Fallback to client-side filtering if search endpoint fails or lacks directory permission
      const all = await fetchGoogleContacts(accessToken);
      const q = query.toLowerCase();
      return all.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phoneNumber?.includes(q) ||
        c.organization?.toLowerCase().includes(q)
      );
    }

    const data = await res.json();
    const results = data.results || [];

    return results.map((item: any): GoogleContact => {
      const person = item.person;
      const nameObj = person.names?.[0] || {};
      const name = nameObj.displayName || 'Unnamed Contact';
      const emails = (person.emailAddresses || []).map((e: any) => e.value).filter(Boolean);
      const phoneNumbers = (person.phoneNumbers || []).map((p: any) => p.value).filter(Boolean);
      const photoUrl = person.photos?.[0]?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
      const orgObj = person.organizations?.[0] || {};

      return {
        resourceName: person.resourceName || '',
        etag: person.etag,
        name,
        email: emails[0] || '',
        emails,
        phoneNumber: phoneNumbers[0] || '',
        phoneNumbers,
        photoUrl,
        organization: orgObj.name || '',
        jobTitle: orgObj.title || '',
      };
    });
  } catch (error) {
    console.error('Error searching Google Contacts:', error);
    throw error;
  }
};

/**
 * Create a new Contact in Google People API (Mandatory user confirmation pattern)
 */
export const createGoogleContact = async (
  accessToken: string,
  contactData: {
    givenName: string;
    familyName?: string;
    email?: string;
    phoneNumber?: string;
    organization?: string;
    jobTitle?: string;
  }
): Promise<GoogleContact> => {
  const url = 'https://people.googleapis.com/v1/people:createContact';

  const body: any = {
    names: [
      {
        givenName: contactData.givenName,
        familyName: contactData.familyName || '',
      },
    ],
  };

  if (contactData.email) {
    body.emailAddresses = [{ value: contactData.email, type: 'work' }];
  }

  if (contactData.phoneNumber) {
    body.phoneNumbers = [{ value: contactData.phoneNumber, type: 'mobile' }];
  }

  if (contactData.organization || contactData.jobTitle) {
    body.organizations = [
      {
        name: contactData.organization || '',
        title: contactData.jobTitle || '',
      },
    ];
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || 'Failed to create contact in Google Contacts');
  }

  const created = await res.json();
  const nameObj = created.names?.[0] || {};
  return {
    resourceName: created.resourceName,
    name: nameObj.displayName || contactData.givenName,
    email: contactData.email || '',
    phoneNumber: contactData.phoneNumber || '',
    organization: contactData.organization || '',
    jobTitle: contactData.jobTitle || '',
    photoUrl: created.photos?.[0]?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(contactData.givenName)}`,
  };
};

/**
 * Delete a Contact from Google People API (Mandatory confirmation pattern)
 */
export const deleteGoogleContact = async (accessToken: string, resourceName: string): Promise<boolean> => {
  const url = `https://people.googleapis.com/v1/${resourceName}:deleteContact`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || 'Failed to delete contact from Google Contacts');
  }

  return true;
};
