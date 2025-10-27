import {createClient} from "@/lib/supabase/server";
import {CreateEntryInput} from "@/types/entry";

// todo this needs some cleaning up
export const createEntry = async (
    createEntryInput: CreateEntryInput,
): Promise<string> => {
    const supabase = await createClient();
    const {
        data: {user},
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("Authentication failed. Please log in again.");
    }

    const { data: entryData, error: entryError } = await supabase
        .from("entry")
        .insert({
            user_id: user.id,
            recorded_at: createEntryInput.recordedAt,
            creation_timestamp: new Date().toISOString(),
            updated_timestamp: new Date().toISOString(),
        })
        .select('id')
        .single(); // Use .single() for cleaner access

    if (entryError || !entryData) {
        throw new Error("Failed to create entry: " + entryError?.message);
    }

    const entryId = entryData.id;

    const valuesToInsert = createEntryInput.values.map((value) => ({
        entry_id: entryId,
        metric_id: value.metric_id,
        value: value.value,
    }));

    // todo this is currently broken, but really this should be re-thought at a larger scale
    const { error: valuesError } = await supabase
        .from("entry_value")
        .insert(valuesToInsert);

    if (valuesError) {
        // Optionally: clean up the entry if values fail
        // await supabase.from("entry").delete().eq('id', entryId);
        throw new Error("Failed to create entry values: " + valuesError.message);
    }

    return entryId;
};
