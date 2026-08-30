// src/lib/googleForms.ts
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';

export interface GoogleFormQuestion {
  title: string;
  type: 'CHOICE' | 'TEXT' | 'PARAGRAPH' | 'SCALE' | 'CHECKBOX';
  required?: boolean;
  options?: string[]; // for CHOICE and CHECKBOX
  low?: number; // for SCALE
  high?: number;
  lowLabel?: string;
  highLabel?: string;
}

export interface GoogleFormItem {
  itemId: string;
  title: string;
  description?: string;
  questionItem?: {
    question: {
      questionId: string;
      required?: boolean;
      choiceQuestion?: {
        type: 'RADIO' | 'CHECKBOX' | 'DROP_DOWN';
        options: Array<{ value: string }>;
        shuffle?: boolean;
      };
      textQuestion?: {
        paragraph?: boolean;
      };
      scaleQuestion?: {
        low: number;
        high: number;
        lowLabel?: string;
        highLabel?: string;
      };
    };
  };
}

export interface GoogleForm {
  formId: string;
  info: {
    title: string;
    documentTitle?: string;
    description?: string;
  };
  responderUri?: string;
  revisionId?: string;
  items?: GoogleFormItem[];
  createdTime?: string;
  modifiedTime?: string;
  responsesCount?: number;
  webViewLink?: string;
}

export interface GoogleFormResponseAnswer {
  questionId: string;
  textAnswers?: {
    answers: Array<{ value: string }>;
  };
}

export interface GoogleFormResponse {
  responseId: string;
  createTime: string;
  lastSubmittedTime: string;
  answers?: Record<string, GoogleFormResponseAnswer>;
}

export const FORMS_SCOPES = [
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
];

const provider = new GoogleAuthProvider();
FORMS_SCOPES.forEach((scope) => {
  provider.addScope(scope);
});
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initGoogleFormsAuth = (
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

export const signInWithGoogleForForms = async (): Promise<{ user: FirebaseUser; accessToken: string } | null> => {
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
    console.error('Google Forms sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleFormsAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setGoogleFormsAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * List Google Forms by querying the Google Drive API
 */
export const listGoogleForms = async (accessToken: string): Promise<GoogleForm[]> => {
  try {
    const q = encodeURIComponent("mimeType = 'application/vnd.google-apps.form' and trashed = false");
    const fields = encodeURIComponent('files(id, name, description, createdTime, modifiedTime, webViewLink)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=modifiedTime desc&pageSize=50`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Google Drive API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const files = data.files || [];

    return files.map((f: any): GoogleForm => ({
      formId: f.id,
      info: {
        title: f.name || 'Untitled Form',
        documentTitle: f.name,
        description: f.description || '',
      },
      responderUri: `https://docs.google.com/forms/d/e/${f.id}/viewform`,
      webViewLink: f.webViewLink || `https://docs.google.com/forms/d/${f.id}/edit`,
      createdTime: f.createdTime,
      modifiedTime: f.modifiedTime,
    }));
  } catch (error) {
    console.error('Error listing Google Forms:', error);
    throw error;
  }
};

/**
 * Get detailed Google Form structure and questions
 */
export const getGoogleForm = async (accessToken: string, formId: string): Promise<GoogleForm> => {
  try {
    const url = `https://forms.googleapis.com/v1/forms/${formId}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Google Forms API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      ...data,
      webViewLink: `https://docs.google.com/forms/d/${formId}/edit`,
    };
  } catch (error) {
    console.error('Error fetching Google Form:', error);
    throw error;
  }
};

/**
 * Get form responses
 */
export const getGoogleFormResponses = async (
  accessToken: string,
  formId: string
): Promise<{ responses: GoogleFormResponse[]; total: number }> => {
  try {
    const url = `https://forms.googleapis.com/v1/forms/${formId}/responses`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Google Forms Responses API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const responses: GoogleFormResponse[] = data.responses || [];
    return {
      responses,
      total: responses.length,
    };
  } catch (error) {
    console.error('Error fetching Google Form responses:', error);
    throw error;
  }
};

/**
 * Create a new Google Form with Title, Description, and initial Questions
 */
export const createGoogleFormWithQuestions = async (
  accessToken: string,
  params: {
    title: string;
    documentTitle?: string;
    description?: string;
    questions?: GoogleFormQuestion[];
  }
): Promise<GoogleForm> => {
  try {
    // 1. Create the base form
    const createUrl = 'https://forms.googleapis.com/v1/forms';
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        info: {
          title: params.title,
          documentTitle: params.documentTitle || params.title,
          description: params.description || '',
        },
      }),
    });

    if (!createRes.ok) {
      const errJson = await createRes.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to create Google Form');
    }

    const form: GoogleForm = await createRes.json();
    const formId = form.formId;

    // 2. Add question items if provided
    if (params.questions && params.questions.length > 0) {
      const requests = params.questions.map((q, index) => {
        const item: any = {
          title: q.title,
          questionItem: {
            question: {
              required: !!q.required,
            },
          },
        };

        if (q.type === 'CHOICE' || q.type === 'CHECKBOX') {
          item.questionItem.question.choiceQuestion = {
            type: q.type === 'CHECKBOX' ? 'CHECKBOX' : 'RADIO',
            options: (q.options || ['Option 1', 'Option 2']).map((opt) => ({ value: opt })),
          };
        } else if (q.type === 'TEXT') {
          item.questionItem.question.textQuestion = {
            paragraph: false,
          };
        } else if (q.type === 'PARAGRAPH') {
          item.questionItem.question.textQuestion = {
            paragraph: true,
          };
        } else if (q.type === 'SCALE') {
          item.questionItem.question.scaleQuestion = {
            low: q.low ?? 1,
            high: q.high ?? 5,
            lowLabel: q.lowLabel || 'Poor',
            highLabel: q.highLabel || 'Excellent',
          };
        }

        return {
          createItem: {
            item,
            location: {
              index,
            },
          },
        };
      });

      const batchUrl = `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`;
      const batchRes = await fetch(batchUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      });

      if (!batchRes.ok) {
        console.warn('Batch question creation warning:', await batchRes.text());
      }
    }

    // Return the updated full form
    return await getGoogleForm(accessToken, formId);
  } catch (error) {
    console.error('Error creating Google Form:', error);
    throw error;
  }
};
