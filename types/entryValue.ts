export interface CreateEntryValue {
  metric_id: string;
  value: number;
}

export interface EntryValue extends CreateEntryValue {
  entry_id: number;
}
