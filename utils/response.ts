import { NextResponse } from 'next/server';

export const Success = (data: any, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

export const ErrorResponse = (message: string, status = 500, details?: any) =>
  NextResponse.json({ success: false, error: message, details }, { status });

export const BadRequest = (message: string, details?: any) =>
  ErrorResponse(message, 400, details);

export const Unauthorized = (message = 'Não autorizado') =>
  ErrorResponse(message, 401);

export const Forbidden = (message = 'Acesso negado') =>
  ErrorResponse(message, 403);

export const NotFound = (message = 'Não encontrado') =>
  ErrorResponse(message, 404);