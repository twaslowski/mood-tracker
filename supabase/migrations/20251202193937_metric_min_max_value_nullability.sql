-- Before applying this, I manually ensured that there are no NULL values in the min_value and max_value columns
ALTER TABLE metric ALTER COLUMN min_value SET NOT NULL;
ALTER TABLE metric ALTER COLUMN max_value SET NOT NULL;