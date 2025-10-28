import { Entry } from "@/components/entry/entry";
import { getEntriesByUser } from "@/lib/service/entryService";

export default async function InsightsPage() {
  const entries = await getEntriesByUser();
  console.log("received entries", entries);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Insights</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Entry History</h2>
          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Entry key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No entries found</div>
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
