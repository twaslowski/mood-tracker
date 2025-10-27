import {CreateEntryValue, EntryValue} from "@/types/entryValue";

export interface Entry {
    id: number;
    user_id: string | null;
    recorded_at: string;
    creation_timestamp: string;
    updated_timestamp: string;
}

export interface EntryWithValues {
    id: number;
    user_id: string | null;
    recorded_at: string;
    creation_timestamp: string;
    updated_timestamp: string;
    values: EntryValue[];
}

export interface CreateEntryInput {
    recordedAt: Date | string;
    values: CreateEntryValue[];
}
