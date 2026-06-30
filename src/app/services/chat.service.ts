import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  reply: string;
  conversationId: string;
  messageId?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private url = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.url, request);
  }

  health(): Observable<string> {
    return this.http.get(`${this.url}/health`, { responseType: 'text' });
  }
}
