import { ImageResponse } from "next/og";
import { getOpportunity } from "@/lib/api/endpoints/opportunities";
import { OPPORTUNITY_TYPE_LABELS } from "@/lib/utils/opportunity";

export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 } as const;

type RouteContext = {
    params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
    const { slug } = await params;

    let opportunity;
    try {
        const result = await getOpportunity(slug);
        opportunity = result.data;
    } catch {
        return new ImageResponse(<FallbackOG />, { ...SIZE });
    }

    const deadlineLabel = opportunity.deadline
        ? `Closes ${new Date(opportunity.deadline).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })}`
        : null;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#fdf9f3",
                    padding: "60px 80px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    fontFamily: "serif",
                    color: "#1a1a1a",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#73262e",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        GradConnect
                    </div>
                    <div
                        style={{
                            fontSize: 16,
                            color: "#8a7a6a",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            paddingLeft: 16,
                            borderLeft: "1px solid #d4c8b8",
                        }}
                    >
                        {OPPORTUNITY_TYPE_LABELS[opportunity.type] ?? "Opportunity"}
                    </div>
                </div>

                {/* Main content */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            fontSize: 24,
                            color: "#5a4a3a",
                            fontStyle: "italic",
                        }}
                    >
                        {opportunity.employer.name}
                    </div>
                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 700,
                            color: "#1a1a1a",
                            lineHeight: 1.05,
                            letterSpacing: "-0.02em",
                            display: "block",
                        }}
                    >
                        {opportunity.title}
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 24,
                        fontSize: 20,
                        color: "#5a4a3a",
                    }}
                >
                    <span>{opportunity.location}</span>
                    {deadlineLabel && (
                        <>
                            <span style={{ color: "#d4c8b8" }}>·</span>
                            <span>{deadlineLabel}</span>
                        </>
                    )}
                </div>
            </div>
        ),
        { ...SIZE },
    );
}

function FallbackOG() {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: "#fdf9f3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "serif",
                fontSize: 64,
                color: "#73262e",
            }}
        >
            GradConnect
        </div>
    );
}