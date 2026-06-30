import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../../services/chat.service';

interface ChatMessage {
  text: string;
  fromUser: boolean;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.scss'
})
export class ChatWidgetComponent {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  open = false;
  messages: ChatMessage[] = [
    { text: 'Bonjour ! Je suis l\'assistant. Posez-moi une question sur l\'établissement.', fromUser: false }
  ];
  input = '';
  loading = false;
  conversationId?: string;

  constructor(private chatService: ChatService) {}

  toggle() {
    this.open = !this.open;
  }

  send() {
    const text = this.input.trim();
    if (!text || this.loading) return;

    this.messages.push({ text, fromUser: true });
    this.input = '';
    this.loading = true;

    this.chatService.sendMessage({ message: text, conversationId: this.conversationId }).subscribe({
      next: (res) => {
        this.conversationId = res.conversationId;
        this.messages.push({ text: res.reply, fromUser: false });
        this.loading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({ text: 'Erreur de connexion. Veuillez réessayer.', fromUser: false });
        this.loading = false;
      }
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
