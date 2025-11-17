# Baseline Entry Scheduling

This feature allows users to automatically create "baseline" entries using their metric tracking baseline values.

## Architecture Philosophy

This implementation follows a **database-driven approach** with application-layer business logic:

- **Simple SQL function** (`create_baseline_entry`) - Only handles the core baseline entry creation
- **Database triggers** - Automatically sync schedule changes to pg_cron
- **Row Level Security (RLS)** - Users can only manage their own schedules
- **Application layer** - All scheduling logic uses simple CRUD operations

This makes the code easier to test, understand, and maintain compared to complex stored procedures.

## Overview

The system provides:

1. **Manual baseline entry creation** - Create a baseline entry on-demand
2. **Scheduled baseline entries** - Set up recurring cron jobs via simple INSERT/UPDATE operations
3. **Automatic cron synchronization** - Database triggers handle pg_cron scheduling/cleanup
4. **Webhook notifications** - Optional webhooks (placeholder for future implementation)

## Database Schema

### Tables

#### `auto_baseline_schedule`

Stores user cron job configurations:

- `id` - UUID primary key
- `user_id` - User identifier (unique)
- `cron_schedule` - Cron expression (e.g., '0 9 \* \* \*')
- `webhook_url` - Optional webhook URL to call after entry creation
- `enabled` - Whether the schedule is active
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `last_run_at` - Last execution timestamp (updated by create_baseline_entry)
- `cron_job_id` - Internal pg_cron job ID (managed by triggers)

**RLS**: Users can only view and modify their own schedules via `own_baseline_schedule` policy.

### Functions

#### `create_baseline_entry(p_user_id VARCHAR(255))`

Creates a baseline entry for a user using their latest metric tracking baselines.

**Returns:** The created entry ID (BIGINT)

**Process:**

1. Creates a new entry with current timestamp
2. Inserts entry_values for all tracked metrics using their baseline values
3. Updates the schedule's `last_run_at` timestamp
4. Returns the created entry ID

#### Trigger Functions (Internal)

These run automatically and don't need to be called from application code:

**`sync_baseline_schedule_to_cron()`** - Runs on INSERT/UPDATE

- Unschedules old cron job if exists
- Creates new pg_cron job if schedule is enabled
- Stores cron_job_id in the record

**`cleanup_baseline_schedule_cron()`** - Runs on DELETE

- Unschedules the cron job from pg_cron
- Ensures no orphaned cron jobs

## Application Usage

### TypeScript Actions

All server actions are located in `src/app/actions/baselineSchedule.ts`. They use simple CRUD operations - triggers handle the complexity.

#### `createBaselineEntry()`

Creates a baseline entry immediately for the current user.

```typescript
const result = await createBaselineEntry();
if (result.error) {
  console.error(result.error);
} else {
  console.log(`Entry created: ${result.entryId}`);
}
```

#### `scheduleBaselineEntryCron(cronSchedule, webhookUrl?)`

Schedules a recurring baseline entry job. Simply upserts a record - triggers handle pg_cron.

```typescript
const result = await scheduleBaselineEntryCron(
  "0 9 * * *", // Daily at 9am
  "https://example.com/webhook",
);

// Triggers automatically:
// 1. Unschedule old cron job (if exists)
// 2. Schedule new cron job
// 3. Store cron_job_id
```

#### `unscheduleBaselineEntryCron()`

Removes the scheduled job. Simply deletes the record - triggers handle cleanup.

```typescript
const result = await unscheduleBaselineEntryCron();

// Trigger automatically:
// 1. Unschedules the cron job from pg_cron
// 2. Deletes the record
```

#### `getBaselineEntrySchedule()`

Retrieves the current schedule configuration (RLS-protected).

```typescript
const result = await getBaselineEntrySchedule();
if (result.schedule) {
  console.log(result.schedule);
}
```

## UI Component

Use the `BaselineScheduleManager` component to provide a user interface:

```tsx
import { BaselineScheduleManager } from "@/components/baseline-schedule-manager";

export default function SettingsPage() {
  return (
    <div>
      <h1>Baseline Entry Settings</h1>
      <BaselineScheduleManager />
    </div>
  );
}
```

The component provides:

- Button to create baseline entries immediately
- Form to configure cron schedules with examples
- Optional webhook URL input
- Display of current schedule status and last run time

## Cron Expression Examples

- `0 9 * * *` - Every day at 9:00 AM
- `0 12 * * 1` - Every Monday at 12:00 PM
- `0 0 1 * *` - First day of every month at midnight
- `0 */6 * * *` - Every 6 hours
- `0 20 * * 5` - Every Friday at 8:00 PM

## Webhook Integration (Future)

The `webhook_url` field is stored and available for future implementation. When ready:

1. Add webhook call logic to `create_baseline_entry()` function, or
2. Create an application-layer webhook service that monitors entry creation

Suggested webhook payload:

```json
{
  "user_id": "auth-user-id",
  "entry_id": 12345,
  "timestamp": "2025-11-17T15:30:00Z",
  "event": "baseline_entry_created"
}
```

## Testing

To manually test the baseline entry creation:

```sql
-- Create a baseline entry for a specific user
SELECT create_baseline_entry('user-id-here');

-- Check the schedule configuration
SELECT * FROM auto_baseline_schedule;

-- View scheduled cron jobs
SELECT * FROM cron.job WHERE jobname LIKE 'baseline_entry_%';
```

To test the scheduling via application:

```typescript
// Schedule a job
await scheduleBaselineEntryCron("0 9 * * *");

// Verify it was created in the database
const { schedule } = await getBaselineEntrySchedule();
console.log(schedule.cron_job_id); // Should have a value

// Unschedule
await unscheduleBaselineEntryCron();

// Verify cleanup
const result = await getBaselineEntrySchedule();
console.log(result.schedule); // Should be null
```

## Security

- **RLS enabled** on `auto_baseline_schedule` - users can only access their own schedules
- **Application layer** handles authentication via Supabase auth
- **Triggers run as SECURITY DEFINER** to manage pg_cron (requires elevated privileges)
- **Simple SQL function** for baseline entry creation reduces attack surface

## Migration Files

1. **20251117145148_fn_create_baseline_entry.sql** - Creates the base function for creating baseline entries
2. **20251117150000_baseline_entry_cron.sql** - Creates the table with RLS, and trigger-based cron synchronization

## Why This Architecture?

✅ **Simple application code** - Just INSERT/UPDATE/DELETE operations
✅ **Testable** - Standard CRUD operations are easy to test
✅ **RLS protection** - Built-in security at database level
✅ **Automatic sync** - Triggers ensure cron jobs stay in sync
✅ **Maintainable** - Less complex SQL, more transparent logic
✅ **No race conditions** - Triggers run atomically with the data change
