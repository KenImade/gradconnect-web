"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFilterURL } from "@/lib/hooks/use-filter-url";

export function ReviewsSortSelector() {
    const { searchParams, updateFilters } = useFilterURL();
    const sort = searchParams.get("sort") ?? "created_at";
    const order = searchParams.get("order") ?? "desc";
    const value = `${sort}:${order}`;

    function onChange(next: string) {
        const [nextSort, nextOrder] = next.split(":");
        const defaults = nextSort === "created_at" && nextOrder === "desc";
        updateFilters({
            sort: defaults ? null : nextSort ?? null,
            order: defaults ? null : nextOrder ?? null,
        });
    }

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-55">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="created_at:desc">Most recent</SelectItem>
                <SelectItem value="created_at:asc">Oldest first</SelectItem>
                <SelectItem value="difficulty_rating:desc">Hardest first</SelectItem>
                <SelectItem value="difficulty_rating:asc">Easiest first</SelectItem>
                <SelectItem value="experience_rating:desc">Best experiences</SelectItem>
                <SelectItem value="experience_rating:asc">Worst experiences</SelectItem>
            </SelectContent>
        </Select>
    );
}