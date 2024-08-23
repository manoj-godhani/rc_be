import {
    ErrorDetails, ErrorStorageMoveResponse,
    ErrorStorageUploadResponse,
    StorageApiMoveResponse,
    StorageApiUploadResponse, SuccessStorageMoveResponse,
    SuccessStorageUploadResponse
} from "../types/types";

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleError = (error: unknown) : ErrorDetails => {
    let errorMessage = 'An unknown error occurred';
    let statusCode = 500;

    if (error instanceof AppError) {
        errorMessage = error.message;
        statusCode = error.statusCode;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    return { statusCode, message: errorMessage };
}

export function isSuccessUploadResponse(response: StorageApiUploadResponse): response is SuccessStorageUploadResponse {
    return response.error === null;
}

export function isErrorUploadResponse(response: StorageApiUploadResponse): response is ErrorStorageUploadResponse {
    return (response as ErrorStorageUploadResponse).statusCode !== undefined;
}

export function isSuccessMoveResponse(response: StorageApiMoveResponse): response is SuccessStorageMoveResponse {
    return response.error === null;
}

export function isErrorMoveResponse(response: StorageApiMoveResponse): response is ErrorStorageMoveResponse {
    return (response as ErrorStorageUploadResponse).statusCode !== undefined;
}

export function isSuccessStorageResponse<T extends { error: null }>(response: T | StorageApiMoveResponse): response is T {
    return response.error === null;
}

export function isErrorStorageResponse<T extends { statusCode: number }>(response: T | StorageApiMoveResponse): response is T {
    return (response as ErrorStorageMoveResponse).statusCode !== undefined;
}

export function isErrorResponse<T>(response: T): response is T {
    return (response as ErrorStorageUploadResponse).statusCode !== undefined;
}