import { Entry as EntryType } from "@/types/entry";
import { Entry } from "./entry";
import React from "react";

export default function EntriesList({ entries }: { entries: EntryType[] }) {
  return (
    <div className="grid grid-cols-2 max-w-2xl mx-auto justify-center gap-4">
      {entries.map((entry) => (
        <Entry key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
