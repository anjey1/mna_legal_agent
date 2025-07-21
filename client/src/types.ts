export interface DocumentData {
    [key: string]: string | number | boolean | null | undefined;
}

export interface ProcessedDocument {
    filename: string;
    data: DocumentData;
}

export interface ProcessingResult {
    message: string;
    documents: ProcessedDocument[];
} 