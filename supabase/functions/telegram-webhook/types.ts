export interface TelegramUpdate {
  message?: {
    from: {
      id: number;
      username?: string;
      first_name: string;
    };
    text: string;
    chat: { id: number };
  };
}
