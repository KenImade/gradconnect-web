import Link from "next/link";
import Image from "next/image";
import { EmployerLogo } from "@/components/employer/employer-logo";
import type { EmployerSummary } from "@/lib/api/endpoints/employers.types";

type FeaturedEmployersProps = {
    employers: EmployerSummary[];
};

export function FeaturedEmployers({ employers }: FeaturedEmployersProps) {
    if (employers.length === 0) return null;

    return (
        <div className="grid gap-10 lg:grid-cols-[1fr_240px] lg:gap-12">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {employers.map((employer) => (
                    <li key={employer.id}>
                        <Link
                            href={`/employers/${employer.slug}`}
                            className="group flex items-center gap-3 rounded-md border border-border bg-background px-4 py-4 transition-colors hover:border-border-strong hover:bg-surface-subtle"
                        >
                            <EmployerLogo
                                name={employer.name}
                                logoUrl={employer.logo_url}
                                size="sm"
                            />
                            <div className="min-w-0">
                                <p className="truncate text-body-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {employer.name}
                                </p>
                                <p className="truncate text-caption text-text-faint italic">
                                    {employer.industry}
                                </p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            <div
                className="hidden text-primary lg:flex items-center justify-center"
                aria-hidden
            >
                <Image
                    src="/images/building.webp"
                    alt="Building"
                    width={581}
                    height={693}
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="w-full h-auto"
                />
                {/* <BuildingFacade className="w-full max-w-55" /> */}
            </div>
        </div>
    );
}