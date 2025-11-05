import { Entry } from "@/components/entry/entry";
import { getEntriesByUser } from "@/lib/service/entryService";

export default async function InsightsPage() {
  const entries = await getEntriesByUser();

  return (
    <div className="flex flex-col max-w-4xl p-4 h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Your Entry History</h1>
          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Entry key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">No entries found</div>
              <p className="text-sm text-muted-foreground">
                Start tracking your mood to see insights here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
