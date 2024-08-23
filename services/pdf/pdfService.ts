// pdfService.ts

import supabase from "../db/supabase";

export interface PdfDocument {
    id: number;
    content: string;
    highlightAreas: {
        height: number;
        left: number;
        pageIndex: number;
        top: number;
        width: number;
    }[];
    quote: string;
    color: string;
    newComment: string;
    comments: {
        user: string;
        comment: string;
    }[];
    isCommentDialogOpen: boolean;
}

export default class PdfService {
    private readonly bucketName: string;

    constructor(bucketName: string = 'ai-pdf-bucket') {
        this.bucketName = bucketName;
    }

    private getStorageClient() {
        return supabase.getClient().storage;
    }

    async addCommentToPdfDocument(documentId: number, comment: { user: string; comment: string }): Promise<void> {
    
        throw new Error('Method not implemented');
    }
}
