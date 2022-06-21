export interface CannedResponse {
    label: string;
    text: string;
}

export interface CannedResponseCategory {
    section: string;
    questions: CannedResponse[];
}

export interface UpdateNLPActionPayload {
    taskSid: string;
    message: string;
}

export interface TaskNLPEntries {
    [key: string]: TaskNLPEntry;
}

export interface TaskNLPEntry {
    intentInfo: any;
    lastMessage: string | null;
}