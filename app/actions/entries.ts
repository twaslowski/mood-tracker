'use server'

import { createEntry } from '@/lib/service/entryService'
import {CreateEntryInput} from "@/types/entry";
import {getErrorMessage} from "@/lib/utils";

export async function createEntryAction(input: CreateEntryInput) {
    try {
        const entry = await createEntry(input)
        return { success: true, data: entry }
    } catch (error) {
        return { success: false, error: getErrorMessage(error) }
    }
}